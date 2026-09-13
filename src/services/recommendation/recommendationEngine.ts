import type { ChargingStation, GeoLocation } from '../../types/charging';
import type { Trip } from '../../types/trip';
import type { VehicleState } from '../../types/vehicle';
import { calculateHaversineDistance } from '../../utils/geoUtils';

export interface SegmentChargingNeed {
  chargingRequired: boolean;
  predictedArrivalBattery: number;
  remainingRangeKm: number;
  usableRangeKm: number;
  batteryRequiredPercent: number;
  reason: string;
}

export interface SegmentEvaluation {
  segmentIndex: number;
  fromName: string;
  toName: string;
  distanceKm: number;
  startBatteryPercent: number;
  predictedArrivalBatteryPercent: number;
  batteryRequiredPercent: number;
  chargingRequired: boolean;
  reason: string;
}

export interface RecommendedStopDetail {
  station: ChargingStation;
  segmentIndex: number;
  segmentName: string;
  arrivalSocPercent: number;
  targetSocPercent: number;
  chargingTimeMinutes: number;
  addedSocPercent: number;
  detourDistanceKm: number;
  detourTimeMinutes: number;
  score: number;
  whyExplanation: string;
}

export interface RecommendationResult {
  needsCharging: boolean;
  predictedArrivalSocPercent: number;
  minBufferPercent: number;
  usableRangeKm: number;
  recommendedStop: RecommendedStopDetail | null;
  statusMessage: string;
  summaryText: string;
  segmentBreakdown: SegmentEvaluation[];
  debugInfo: {
    currentBattery: number;
    totalDistance: number;
    usableRange: number;
    minimumThreshold: number;
    chargingRequired: boolean;
    failedSegment: string | null;
  };
}

/**
 * 7. SEGMENT CHARGING NEED CHECKER
 * Checks whether a single segment (Start -> Stop or Stop -> Next) can be completed safely.
 */
export function checkChargingNeed(
  currentBatteryPercent: number,
  currentRangeKm: number,
  segmentDistanceKm: number,
  averageConsumptionWhPerKm: number = 135,
  batteryCapacityKwh: number = 40.5,
  minimumArrivalBatteryPercent: number = 15
): SegmentChargingNeed {
  // 4. USABLE RANGE WITH 15% SAFETY FACTOR PENALTY (usableRange = estimatedRange * 0.85)
  const usableRangeKm = Math.round(currentRangeKm * 0.85);

  // Calculate battery percentage required for segment
  const maxTotalRangeKm = (batteryCapacityKwh * 1000) / averageConsumptionWhPerKm;
  const kmPerSocPercent = maxTotalRangeKm / 100;
  const batteryRequiredPercent = Math.round(segmentDistanceKm / kmPerSocPercent);

  // Predicted battery on arrival at segment destination
  const predictedArrivalBattery = Math.round(currentBatteryPercent - batteryRequiredPercent);

  // 5 & 6. BATTERY & RANGE TRIGGERS:
  // Battery Trigger: predictedArrivalBattery < minimumArrivalBatteryPercent
  // Range Trigger: segmentDistanceKm >= usableRangeKm
  const batteryFailure = predictedArrivalBattery < minimumArrivalBatteryPercent;
  const rangeFailure = segmentDistanceKm >= usableRangeKm;

  const chargingRequired = batteryFailure || rangeFailure;

  let reason = '';
  if (batteryFailure && rangeFailure) {
    reason = `Arrival battery (${predictedArrivalBattery}%) falls below your ${minimumArrivalBatteryPercent}% reserve threshold and distance (${segmentDistanceKm} km) exceeds usable range (${usableRangeKm} km).`;
  } else if (batteryFailure) {
    reason = `Predicted arrival battery (${predictedArrivalBattery}%) falls below your safe ${minimumArrivalBatteryPercent}% reserve threshold.`;
  } else if (rangeFailure) {
    reason = `Segment distance (${segmentDistanceKm} km) exceeds usable battery range (${usableRangeKm} km with 15% safety factor).`;
  } else {
    reason = `Battery is sufficient (${predictedArrivalBattery}% predicted on arrival).`;
  }

  return {
    chargingRequired,
    predictedArrivalBattery,
    remainingRangeKm: currentRangeKm,
    usableRangeKm,
    batteryRequiredPercent,
    reason,
  };
}

/**
 * Calculates perpendicular distance (in km) from station P to route line A -> B
 */
function getDistanceToRouteSegment(
  p: GeoLocation,
  a: GeoLocation,
  b: GeoLocation
): { detourKm: number; totalSegmentKm: number } {
  const segKm = calculateHaversineDistance(a, b);
  const distA = calculateHaversineDistance(a, p);
  const distB = calculateHaversineDistance(p, b);

  if (segKm < 0.1) return { detourKm: distA, totalSegmentKm: segKm };

  const s = (segKm + distA + distB) / 2;
  const areaSq = s * (s - segKm) * (s - distA) * (s - distB);
  const area = areaSq > 0 ? Math.sqrt(areaSq) : 0;
  const detourKm = segKm > 0 ? (2 * area) / segKm : distA;

  return {
    detourKm: Math.round(detourKm * 10) / 10,
    totalSegmentKm: segKm,
  };
}

import { MOCK_CHARGERS } from '../../data/mockChargers';

/**
 * SINGLE SOURCE OF TRUTH FOR CHARGING DECISION ENGINE
 */
export function evaluateJourneyChargingRecommendation(
  trip: Trip,
  vehicle: VehicleState,
  currentLocation: GeoLocation,
  availableStations: ChargingStation[],
  userSocOverride?: number,
  maxAllowedDetourKm: number = 20
): RecommendationResult {
  // 1. Inputs & Vehicle Parameters (SOC priority: override -> trip.startSoc -> vehicle.currentSoc -> 24)
  const currentSoc = userSocOverride !== undefined
    ? userSocOverride
    : (trip.startSocPercent !== undefined ? trip.startSocPercent : (vehicle.currentSocPercent || 24));
  const minBuffer = vehicle.minArrivalSocBufferPercent || 15;
  const capacityKwh = vehicle.batteryCapacityKwh || 40.5;
  const consumptionWhPerKm = vehicle.averageConsumptionWhPerKm || 135;

  // Current theoretical remaining range
  const maxTotalRangeKm = (capacityKwh * 1000) / consumptionWhPerKm;
  const kmPerSocPercent = maxTotalRangeKm / 100;
  const currentTheoreticalRangeKm = currentSoc * kmPerSocPercent;

  // 2. Build Journey Waypoints: Start -> Stop 1 -> Stop 2 -> Destination
  const waypoints: { name: string; location: GeoLocation }[] = [
    { name: trip.originName || 'Start Location', location: trip.originLocation || currentLocation },
  ];

  if (trip.stops && trip.stops.length > 0) {
    trip.stops.forEach((s) => {
      waypoints.push({ name: s.stationName || 'Intermediate Stop', location: s.location });
    });
  }

  waypoints.push({
    name: trip.destinationName || 'Destination',
    location: trip.destinationLocation || { latitude: 12.9716, longitude: 77.5946 },
  });

  // 2 & 7. Evaluate Every Journey Segment Independently
  const segmentBreakdown: SegmentEvaluation[] = [];
  let runningSoc = currentSoc;
  let runningRangeKm = currentTheoreticalRangeKm;
  let failedSegmentIndex = -1;
  let overallChargingRequired = false;
  let failedSegmentName: string | null = null;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const fromWp = waypoints[i];
    const toWp = waypoints[i + 1];
    const segDist = calculateHaversineDistance(fromWp.location, toWp.location);

    const segCheck = checkChargingNeed(
      runningSoc,
      runningRangeKm,
      segDist,
      consumptionWhPerKm,
      capacityKwh,
      minBuffer
    );

    segmentBreakdown.push({
      segmentIndex: i,
      fromName: fromWp.name,
      toName: toWp.name,
      distanceKm: Math.round(segDist),
      startBatteryPercent: Math.round(runningSoc),
      predictedArrivalBatteryPercent: segCheck.predictedArrivalBattery,
      batteryRequiredPercent: segCheck.batteryRequiredPercent,
      chargingRequired: segCheck.chargingRequired,
      reason: segCheck.reason,
    });

    if (segCheck.chargingRequired && !overallChargingRequired) {
      overallChargingRequired = true;
      failedSegmentIndex = i;
      failedSegmentName = `${fromWp.name} → ${toWp.name}`;
    }

    runningSoc = segCheck.predictedArrivalBattery;
    runningRangeKm = Math.max(0, runningRangeKm - segDist);
  }

  const finalArrivalBattery = segmentBreakdown.length > 0
    ? segmentBreakdown[segmentBreakdown.length - 1].predictedArrivalBatteryPercent
    : Math.round(currentSoc);

  const overallUsableRangeKm = Math.round(currentTheoreticalRangeKm * 0.85);

  // 12. IF NO CHARGING REQUIRED ACROSS ALL SEGMENTS:
  if (!overallChargingRequired && finalArrivalBattery >= minBuffer) {
    return {
      needsCharging: false,
      predictedArrivalSocPercent: finalArrivalBattery,
      minBufferPercent: minBuffer,
      usableRangeKm: overallUsableRangeKm,
      recommendedStop: null,
      statusMessage: '✓ Trip looks good',
      summaryText: `Estimated arrival battery: ${finalArrivalBattery}% (Above your ${minBuffer}% safety buffer). No charging recommendation needed.`,
      segmentBreakdown,
      debugInfo: {
        currentBattery: currentSoc,
        totalDistance: Math.round(trip.totalDistanceKm || 0),
        usableRange: overallUsableRangeKm,
        minimumThreshold: minBuffer,
        chargingRequired: false,
        failedSegment: null,
      },
    };
  }

  // 8 & 9. CHARGING REQUIRED: FIND AND RANK CHARGERS ALONG THAT SPECIFIC SEGMENT ONLY
  const targetSegIndex = failedSegmentIndex >= 0 ? failedSegmentIndex : 0;
  const segFrom = waypoints[targetSegIndex];
  const segTo = waypoints[targetSegIndex + 1];

  // Combine availableStations and MOCK_CHARGERS to ensure complete corridor coverage across India
  const stationMap = new Map<string, ChargingStation>();
  (availableStations || []).forEach((st) => stationMap.set(st.id, st));
  MOCK_CHARGERS.forEach((st) => {
    if (!stationMap.has(st.id)) stationMap.set(st.id, st);
  });
  const allCandidateStations = Array.from(stationMap.values());

  // Maximum reachable distance before battery hits 5% emergency level
  const maxReachableKm = Math.max(10, (currentSoc - 5) * kmPerSocPercent);

  const scoredCandidates: RecommendedStopDetail[] = [];

  allCandidateStations.forEach((station) => {
    const distFromSegmentStart = calculateHaversineDistance(segFrom.location, station.location);
    const routeGeometry = getDistanceToRouteSegment(station.location, segFrom.location, segTo.location);

    // Rule 1: Reachable with current battery
    if (distFromSegmentStart > maxReachableKm) return;

    // Rule 2: Near current route segment (detour <= maxAllowedDetourKm)
    if (routeGeometry.detourKm > maxAllowedDetourKm) return;

    // Arrival SOC at charger
    const socToCharger = Math.round(distFromSegmentStart / kmPerSocPercent);
    const arrivalSocAtCharger = Math.max(5, currentSoc - socToCharger);

    // Target SOC needed to reach next stop safely + safety buffer
    const distChargerToNextStop = calculateHaversineDistance(station.location, segTo.location);
    const socNeededToNextStop = (distChargerToNextStop / kmPerSocPercent) + minBuffer;
    const targetSoc = Math.min(85, Math.max(arrivalSocAtCharger + 35, Math.round(socNeededToNextStop)));
    const addedSoc = Math.max(20, targetSoc - arrivalSocAtCharger);

    // Estimate charging time
    const kwhToCharge = (addedSoc / 100) * capacityKwh;
    const chargePowerKw = Math.min(station.maxPowerKw || 60, 180);
    const chargingTimeMins = Math.round((kwhToCharge / chargePowerKw) * 60 + 4);
    const detourTimeMins = Math.round((routeGeometry.detourKm * 2 / 50) * 60);

    // Ranking Scoring Function:
    // score = routeRelevance + reachability + availability + chargerSpeed + userPreference - detourDistance - detourTime
    let score = 100;
    score -= routeGeometry.detourKm * 6; // detour penalty
    if (station.availablePlugs > 0) score += station.availablePlugs * 12; // availability bonus
    else score -= 50;

    if (station.maxPowerKw >= 120) score += 35;
    else if (station.maxPowerKw >= 60) score += 20;

    if (vehicle.preferredNetworks?.some((net) => station.operator.toLowerCase().includes(net.toLowerCase()))) {
      score += 20;
    }

    score -= detourTimeMins * 2;

    const whyExplanation = `"Your current battery (${currentSoc}%) is insufficient to safely reach ${segTo.name} (Predicted arrival: ${segmentBreakdown[targetSegIndex]?.predictedArrivalBatteryPercent}% vs ${minBuffer}% buffer). Recommended **${station.name}** along your ${segFrom.name} → ${segTo.name} route (${routeGeometry.detourKm} km detour, ${station.maxPowerKw} kW DC, +${addedSoc}% in ${chargingTimeMins} mins)."`;

    scoredCandidates.push({
      station,
      segmentIndex: targetSegIndex,
      segmentName: `${segFrom.name} → ${segTo.name}`,
      arrivalSocPercent: arrivalSocAtCharger,
      targetSocPercent: targetSoc,
      chargingTimeMinutes: chargingTimeMins,
      addedSocPercent: addedSoc,
      detourDistanceKm: routeGeometry.detourKm,
      detourTimeMinutes: detourTimeMins,
      score: Math.round(score),
      whyExplanation,
    });
  });

  scoredCandidates.sort((a, b) => b.score - a.score);
  const bestOption = scoredCandidates[0] || null;

  if (!bestOption) {
    return {
      needsCharging: true,
      predictedArrivalSocPercent: finalArrivalBattery,
      minBufferPercent: minBuffer,
      usableRangeKm: overallUsableRangeKm,
      recommendedStop: null,
      statusMessage: '⚡ Charging recommended',
      summaryText: `Your battery (${currentSoc}%) is insufficient to reach ${failedSegmentName || 'next stop'} safely. Please search for the nearest charger along your route.`,
      segmentBreakdown,
      debugInfo: {
        currentBattery: currentSoc,
        totalDistance: Math.round(trip.totalDistanceKm || 0),
        usableRange: overallUsableRangeKm,
        minimumThreshold: minBuffer,
        chargingRequired: true,
        failedSegment: failedSegmentName,
      },
    };
  }

  return {
    needsCharging: true,
    predictedArrivalSocPercent: finalArrivalBattery,
    minBufferPercent: minBuffer,
    usableRangeKm: overallUsableRangeKm,
    recommendedStop: bestOption,
    statusMessage: '⚡ Charging recommended',
    summaryText: `Your current battery (${currentSoc}%) may not be enough to safely reach ${segTo.name}. Fast charger ${bestOption.station.name} (${bestOption.detourDistanceKm} km detour) recommended.`,
    segmentBreakdown,
    debugInfo: {
      currentBattery: currentSoc,
      totalDistance: Math.round(trip.totalDistanceKm || 0),
      usableRange: overallUsableRangeKm,
      minimumThreshold: minBuffer,
      chargingRequired: true,
      failedSegment: failedSegmentName,
    },
  };
}
