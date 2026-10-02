import type {
  Vehicle,
  EnvironmentalConditions,
  TripPreference,
  RouteData,
  RangeUncertainty,
  ChargingDecision,
  TripCalculationResult
} from '../types';

export const DEFAULT_SAFETY_RESERVE_PERCENT = 15;

/**
 * Calculates dynamic safety reserve % based on traffic, weather & road hazard risk
 * Normal: 15% reserve
 * Heavy traffic or rain: 18% reserve
 * High-risk (congested / extreme / poor road): 20% reserve
 */
export function calculateDynamicSafetyReserve(
  traffic: string,
  weather: string,
  road: string
): { reservePercent: number; reserveReason: string } {
  if (traffic === 'congested' || weather === 'extreme' || road === 'poor') {
    return {
      reservePercent: 20,
      reserveReason: 'High-risk conditions detected (severe traffic, extreme weather, or rough terrain) — safety reserve increased to 20%.'
    };
  } else if (traffic === 'heavy' || weather === 'rain') {
    return {
      reservePercent: 18,
      reserveReason: 'Heavy traffic or rain detected — safety reserve increased from 15% to 18%.'
    };
  } else {
    return {
      reservePercent: 15,
      reserveReason: 'Normal driving conditions — standard 15% safety buffer applied.'
    };
  }
}

/**
 * Calculates base & adjusted energy consumption based on distance, efficiency & environmental penalties
 */
export function calculateEnergyConsumption(
  distanceKm: number,
  vehicle: Vehicle,
  conditions: EnvironmentalConditions
): {
  baseEnergyRequiredKwh: number;
  adjustedEnergyRequiredKwh: number;
  trafficImpactPercent: number;
  weatherImpactPercent: number;
  roadImpactPercent: number;
  totalPenaltyPercent: number;
} {
  const efficiencyKwhPerKm = (vehicle.efficiency || 155) / 1000;
  const baseEnergyRequiredKwh = distanceKm * efficiencyKwhPerKm;

  // Impact percentages specified by ZepGO spec
  const trafficImpactPercent =
    conditions.traffic === 'congested' ? 15 : conditions.traffic === 'heavy' ? 10 : conditions.traffic === 'moderate' ? 5 : 0;

  const weatherImpactPercent =
    conditions.weather === 'extreme' ? 15 : conditions.weather === 'rain' ? 8 : 0;

  const roadImpactPercent =
    conditions.road === 'poor' ? 6 : conditions.road === 'congested' ? 3 : 0;

  const totalPenaltyPercent = trafficImpactPercent + weatherImpactPercent + roadImpactPercent;
  const adjustedEnergyRequiredKwh = baseEnergyRequiredKwh * (1 + totalPenaltyPercent / 100);

  return {
    baseEnergyRequiredKwh: Number(baseEnergyRequiredKwh.toFixed(2)),
    adjustedEnergyRequiredKwh: Number(adjustedEnergyRequiredKwh.toFixed(2)),
    trafficImpactPercent,
    weatherImpactPercent,
    roadImpactPercent,
    totalPenaltyPercent
  };
}

/**
 * Calculates arrival State of Charge percentage (clamped between 0% and 100%)
 */
export function calculateArrivalSOC(
  availableEnergyKwh: number,
  adjustedEnergyRequiredKwh: number,
  batteryCapacityKwh: number
): number {
  if (!batteryCapacityKwh || batteryCapacityKwh <= 0) return 0;
  const remainingEnergy = availableEnergyKwh - adjustedEnergyRequiredKwh;
  const rawSOC = (remainingEnergy / batteryCapacityKwh) * 100;
  return Math.max(0, Math.min(100, Math.round(rawSOC * 10) / 10));
}

/**
 * Calculates range uncertainty values (Best Case, Expected, Conservative) in km
 */
export function calculateRangeUncertainty(
  batteryCapacityKwh: number,
  currentSOC: number,
  efficiencyWhPerKm: number,
  conditions: EnvironmentalConditions
): RangeUncertainty {
  const availableEnergyKwh = batteryCapacityKwh * (currentSOC / 100);
  const baseEfficiencyKwh = (efficiencyWhPerKm || 155) / 1000;

  // Best case: Ideal weather/traffic (-5% efficiency penalty)
  const bestCaseEff = baseEfficiencyKwh * 0.95;
  const bestCaseKm = Math.round(availableEnergyKwh / bestCaseEff);

  // Expected case: Account for active conditions
  const penalties = calculateEnergyConsumption(100, { efficiency: efficiencyWhPerKm } as Vehicle, conditions);
  const expectedEff = baseEfficiencyKwh * (1 + penalties.totalPenaltyPercent / 100);
  const expectedKm = Math.round(availableEnergyKwh / expectedEff);

  // Conservative case: Severe headwinds/temperature penalty (+15% efficiency penalty)
  const conservativeEff = baseEfficiencyKwh * 1.15;
  const conservativeKm = Math.round(availableEnergyKwh / conservativeEff);

  return {
    bestCaseKm,
    expectedKm,
    conservativeKm
  };
}

/**
 * Calculates safety margin percentage above arrival
 */
export function calculateSafetyMargin(
  availableEnergyKwh: number,
  adjustedEnergyRequiredKwh: number,
  batteryCapacityKwh: number
): number {
  if (!batteryCapacityKwh || batteryCapacityKwh <= 0) return 0;
  const remainingEnergy = availableEnergyKwh - adjustedEnergyRequiredKwh;
  const marginPercent = (remainingEnergy / batteryCapacityKwh) * 100;
  return Math.round(marginPercent * 10) / 10;
}

/**
 * Core ZepGO Dynamic Charging Decision Engine
 */
export function shouldCharge(
  safeReachableRangeKm: number,
  destinationDistanceKm: number,
  currentSoc: number
): {
  decision: ChargingDecision;
  decisionTitle: string;
  decisionText: string;
  isChargingRequired: boolean;
} {
  const isChargingRequired = safeReachableRangeKm < destinationDistanceKm;

  if (!isChargingRequired) {
    let decisionText: string;
    if (currentSoc <= 35 && destinationDistanceKm <= 35) {
      decisionText = `Although the battery is low (${currentSoc}%), the destination is close enough (${destinationDistanceKm} km) to reach safely while maintaining the required reserve.`;
    } else {
      decisionText = `Your predicted safe range (${safeReachableRangeKm} km) is sufficient to reach the destination (${destinationDistanceKm} km).`;
    }
    return {
      decision: 'NO_CHARGING_REQUIRED',
      decisionTitle: '🟢 NO CHARGING REQUIRED',
      decisionText,
      isChargingRequired: false
    };
  }

  const shortfallKm = destinationDistanceKm - safeReachableRangeKm;
  if (shortfallKm > 40 || currentSoc < 30) {
    return {
      decision: 'UNSAFE_ACTION_REQUIRED',
      decisionTitle: '🔴 CHARGING REQUIRED',
      decisionText: `Current battery (${currentSoc}%) is insufficient to safely reach the destination (${destinationDistanceKm} km). Safe reachable range is ${safeReachableRangeKm} km (Shortfall: ${shortfallKm} km).`,
      isChargingRequired: true
    };
  } else {
    return {
      decision: 'CHARGING_RECOMMENDED',
      decisionTitle: '🟡 CHARGING REQUIRED',
      decisionText: `Your safe reachable range (${safeReachableRangeKm} km) is lower than the destination distance (${destinationDistanceKm} km). Charging is recommended before continuing.`,
      isChargingRequired: true
    };
  }
}

/**
 * Complete ZepGO Master Trip Calculation Processor
 */
export function calculateTripPlan(
  route: RouteData,
  preference: TripPreference,
  conditions: EnvironmentalConditions,
  departureTime: string,
  vehicle: Vehicle
): TripCalculationResult {
  const distanceKm = route.distanceKm;
  const batteryCapacity = vehicle.batteryCapacity || 40.5;
  const startingSOC = vehicle.soc ?? 72;
  const baseEfficiencyWhPerKm = vehicle.efficiency || 155;

  // 1. Available Energy
  const availableEnergyKwh = Number((batteryCapacity * (startingSOC / 100)).toFixed(1));

  // 2. Consumption Penalties & Adjusted Efficiency
  const energyDetails = calculateEnergyConsumption(distanceKm, vehicle, conditions);
  const adjustedEfficiencyWhPerKm = Math.round(baseEfficiencyWhPerKm * (1 + energyDetails.totalPenaltyPercent / 100));

  // 3. Realistic Driving Range
  const realisticRangeKm = Math.round((availableEnergyKwh * 1000) / adjustedEfficiencyWhPerKm);

  // 4. Dynamic Safety Reserve
  const { reservePercent, reserveReason } = calculateDynamicSafetyReserve(
    conditions.traffic,
    conditions.weather,
    conditions.road
  );
  const reserveEnergyKwh = Number((batteryCapacity * (reservePercent / 100)).toFixed(1));

  // 5. Safe Reachable Range
  const safeReachableRangeKm = Math.round(realisticRangeKm * (1 - reservePercent / 100));

  // 6. Charging Decision
  const assessment = shouldCharge(safeReachableRangeKm, distanceKm, startingSOC);

  // Shortfall & kWh Needed
  const isChargingRequired = assessment.isChargingRequired;
  const shortfallKm = isChargingRequired ? Math.max(0, distanceKm - safeReachableRangeKm) : 0;
  const kwhNeeded = isChargingRequired
    ? Number((((distanceKm - safeReachableRangeKm) * adjustedEfficiencyWhPerKm) / 1000).toFixed(1))
    : 0;

  // Arrival SOC & Remaining Energy
  const remainingEnergyKwh = Number((availableEnergyKwh - energyDetails.adjustedEnergyRequiredKwh).toFixed(2));
  const arrivalSOC = calculateArrivalSOC(availableEnergyKwh, energyDetails.adjustedEnergyRequiredKwh, batteryCapacity);
  const safetyMarginPercent = calculateSafetyMargin(availableEnergyKwh, energyDetails.adjustedEnergyRequiredKwh, batteryCapacity);

  // Range Uncertainty Model
  const rangeUncertainty = calculateRangeUncertainty(
    batteryCapacity,
    startingSOC,
    baseEfficiencyWhPerKm,
    conditions
  );

  return {
    route,
    preference,
    conditions,
    departureTime,
    baseEnergyRequiredKwh: energyDetails.baseEnergyRequiredKwh,
    adjustedEnergyRequiredKwh: energyDetails.adjustedEnergyRequiredKwh,
    trafficImpactPercent: energyDetails.trafficImpactPercent,
    weatherImpactPercent: energyDetails.weatherImpactPercent,
    roadImpactPercent: energyDetails.roadImpactPercent,
    totalPenaltyPercent: energyDetails.totalPenaltyPercent,
    adjustedEfficiencyWhPerKm,
    startingSOC,
    arrivalSOC,
    availableEnergyKwh,
    remainingEnergyKwh,
    reserveEnergyKwh,
    reservePercent,
    reserveReason,
    safetyMarginPercent,
    realisticRangeKm,
    safeReachableRangeKm,
    shortfallKm,
    kwhNeeded,
    decision: assessment.decision,
    decisionTitle: assessment.decisionTitle,
    decisionText: assessment.decisionText,
    rangeUncertainty,
    vehicleSnapshot: vehicle
  };
}

export interface DynamicDecisionResult {
  batteryEnergyKwh: number;
  destinationDistanceKm: number;
  trafficImpactPercent: number;
  weatherImpactPercent: number;
  roadImpactPercent: number;
  adjustedEfficiencyWhPerKm: number;
  realisticRangeKm: number;
  reservePercent: number;
  safeReachableRangeKm: number;
  isChargingRequired: boolean;
  decisionStatus: 'NO_CHARGING_REQUIRED' | 'CHARGING_RECOMMENDED' | 'CRITICAL_CHARGING_REQUIRED';
  decisionTitle: string;
  decisionText: string;
  shortfallKm: number;
  kwhNeeded: number;
  reserveReason: string;
}

/**
 * Direct Dynamic Journey Decision calculator for quick UI inputs
 */
export function calculateDynamicJourneyDecision(
  batteryCapacityKwh: number = 40.5,
  currentSoc: number = 72,
  destinationDistanceKm: number = 180,
  baseEfficiencyWhPerKm: number = 155,
  trafficCondition: string = 'heavy',
  weatherCondition: string = 'clear',
  roadCondition: string = 'good'
): DynamicDecisionResult {
  const cap = batteryCapacityKwh || 40.5;
  const soc = Math.max(0, Math.min(100, currentSoc));
  const batteryEnergyKwh = Number((cap * (soc / 100)).toFixed(1));

  // Consumption Penalties
  const trafficImpactPercent =
    trafficCondition === 'congested' ? 15 : trafficCondition === 'heavy' ? 10 : trafficCondition === 'moderate' ? 5 : 0;
  const weatherImpactPercent =
    weatherCondition === 'extreme' ? 15 : weatherCondition === 'rain' ? 8 : 0;
  const roadImpactPercent =
    roadCondition === 'poor' ? 6 : roadCondition === 'congested' ? 3 : 0;

  const totalPenalty = trafficImpactPercent + weatherImpactPercent + roadImpactPercent;
  const adjustedEfficiencyWhPerKm = Math.round((baseEfficiencyWhPerKm || 155) * (1 + totalPenalty / 100));

  // Realistic Driving Range (km)
  const realisticRangeKm = Math.round((batteryEnergyKwh * 1000) / adjustedEfficiencyWhPerKm);

  // Dynamic Safety Reserve %
  const { reservePercent, reserveReason } = calculateDynamicSafetyReserve(trafficCondition, weatherCondition, roadCondition);

  // Safe Reachable Range = Realistic Range * (1 - Safety Reserve %)
  const safeReachableRangeKm = Math.round(realisticRangeKm * (1 - reservePercent / 100));

  const isChargingRequired = safeReachableRangeKm < destinationDistanceKm;
  const shortfallKm = isChargingRequired ? Math.max(0, destinationDistanceKm - safeReachableRangeKm) : 0;
  const kwhNeeded = isChargingRequired
    ? Number((((destinationDistanceKm - safeReachableRangeKm) * adjustedEfficiencyWhPerKm) / 1000).toFixed(1))
    : 0;

  const assessment = shouldCharge(safeReachableRangeKm, destinationDistanceKm, soc);

  let decisionStatus: 'NO_CHARGING_REQUIRED' | 'CHARGING_RECOMMENDED' | 'CRITICAL_CHARGING_REQUIRED';
  if (!isChargingRequired) {
    decisionStatus = 'NO_CHARGING_REQUIRED';
  } else if (shortfallKm > 40 || soc < 30) {
    decisionStatus = 'CRITICAL_CHARGING_REQUIRED';
  } else {
    decisionStatus = 'CHARGING_RECOMMENDED';
  }

  return {
    batteryEnergyKwh,
    destinationDistanceKm,
    trafficImpactPercent,
    weatherImpactPercent,
    roadImpactPercent,
    adjustedEfficiencyWhPerKm,
    realisticRangeKm,
    reservePercent,
    safeReachableRangeKm,
    isChargingRequired,
    decisionStatus,
    decisionTitle: assessment.decisionTitle,
    decisionText: assessment.decisionText,
    shortfallKm,
    kwhNeeded,
    reserveReason
  };
}
