import type {
  EnvironmentalConditions,
  Vehicle,
  JourneyAlert,
  ActionRecommendation,
  LiveJourneyState
} from '../types';
import { calculateEnergyConsumption, calculateArrivalSOC, calculateSafetyMargin } from './batteryEngine';

/**
 * Generates contextual live journey alert notifications based on real-time conditions & battery buffer
 */
export function generateJourneyAlerts(
  conditions: EnvironmentalConditions,
  arrivalSOC: number,
  safetyMarginPercent: number
): JourneyAlert[] {
  const alerts: JourneyAlert[] = [];
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Traffic Alert
  if (conditions.traffic === 'heavy') {
    alerts.push({
      id: `alt_trf_${Date.now()}`,
      title: 'Heavy Traffic Detected Ahead',
      message: 'Stop-and-go traffic increased consumption by +10%. ETA updated.',
      severity: 'warning',
      timestamp: now
    });
  } else if (conditions.traffic === 'moderate') {
    alerts.push({
      id: `alt_trf_${Date.now()}`,
      title: 'Moderate Traffic Impact',
      message: 'Slight congestion ahead (+5% energy consumption).',
      severity: 'info',
      timestamp: now
    });
  }

  // Weather Alert
  if (conditions.weather === 'extreme') {
    alerts.push({
      id: `alt_wtr_${Date.now()}`,
      title: 'Extreme Temperature Active',
      message: 'HVAC thermal load increased battery drain by +8%.',
      severity: 'warning',
      timestamp: now
    });
  } else if (conditions.weather === 'rain') {
    alerts.push({
      id: `alt_wtr_${Date.now()}`,
      title: 'Rain / Wet Surface Warning',
      message: 'Wet road friction increased consumption by +4%. Drive carefully.',
      severity: 'info',
      timestamp: now
    });
  }

  // Road Alert
  if (conditions.road === 'poor') {
    alerts.push({
      id: `alt_rd_${Date.now()}`,
      title: 'Poor Road Surface Detected',
      message: 'Rough terrain drag increased consumption by +6%.',
      severity: 'info',
      timestamp: now
    });
  }

  // Low Safety Margin Alert
  if (safetyMarginPercent < 5 || arrivalSOC < 5) {
    alerts.push({
      id: `alt_buf_${Date.now()}`,
      title: '⚠️ LOW SAFETY MARGIN DETECTED',
      message: `Arrival SOC predicted at ${arrivalSOC}%. Battery buffer below 5% safety limit!`,
      severity: 'critical',
      timestamp: now
    });
  } else if (safetyMarginPercent < 15) {
    alerts.push({
      id: `alt_buf_${Date.now()}`,
      title: 'Arrival Battery Prediction Updated',
      message: `Arrival SOC updated to ${arrivalSOC}%. Safety buffer is under the 15% recommended reserve.`,
      severity: 'warning',
      timestamp: now
    });
  } else {
    alerts.push({
      id: `alt_ok_${Date.now()}`,
      title: 'Optimal Consumption Stream',
      message: 'Vehicle energy consumption matches optimal range prediction.',
      severity: 'info',
      timestamp: now
    });
  }

  return alerts;
}

/**
 * Determines driver action recommendation based on live safety margin & arrival SOC
 */
export function determineActionRecommendation(
  arrivalSOC: number,
  safetyMarginPercent: number
): ActionRecommendation {
  if (arrivalSOC <= 0 || safetyMarginPercent < 0) {
    return {
      type: 'EMERGENCY_ASSISTANCE',
      title: 'Immediate Stop & Emergency Support Recommended',
      description: 'Current battery level is insufficient to reach destination. Pull over safely or trigger Emergency Assistance.',
      badgeVariant: 'warning'
    };
  }

  if (safetyMarginPercent < 5) {
    return {
      type: 'FIND_SAFER_ROUTE',
      title: 'Find Safer Route or Reroute to Charger',
      description: 'Extremely low arrival reserve. Reduce speed or reroute to nearest charger immediately.',
      badgeVariant: 'warning'
    };
  }

  if (safetyMarginPercent < 15) {
    return {
      type: 'VIEW_BACKUP_CHARGER',
      title: 'View Backup Charger Options',
      description: 'Arrival buffer is below 15% reserve limit. Check failover backup charger status ahead.',
      badgeVariant: 'warning'
    };
  }

  return {
    type: 'NO_ACTION_REQUIRED',
    title: 'No Action Required — Route Optimal',
    description: 'Battery state of charge is optimal. Continue along current route with confidence.',
    badgeVariant: 'success'
  };
}

/**
 * Reusable master recalculation function: recalculateJourneyState()
 * Updates React state instantaneously without reloading the page!
 */
export function recalculateJourneyState(
  previousState: LiveJourneyState,
  newConditions: EnvironmentalConditions,
  vehicle: Vehicle
): LiveJourneyState {
  const distanceKm = previousState.distanceRemainingKm;
  const batteryCapacity = vehicle.batteryCapacity || 75;
  const currentSOC = previousState.currentSOC;
  const availableEnergyKwh = batteryCapacity * (currentSOC / 100);

  // Recalculate energy consumption with new conditions
  const energyDetails = calculateEnergyConsumption(distanceKm, vehicle, newConditions);
  const adjustedEnergyRequired = energyDetails.adjustedEnergyRequiredKwh;

  // Recalculate arrival SOC & safety margin
  const arrivalSOC = calculateArrivalSOC(availableEnergyKwh, adjustedEnergyRequired, batteryCapacity);
  const safetyMarginPercent = calculateSafetyMargin(availableEnergyKwh, adjustedEnergyRequired, batteryCapacity);

  // Remaining range in km based on active efficiency
  const effectiveEffKwh = ((vehicle.efficiency || 155) * (1 + energyDetails.totalPenaltyPercent / 100)) / 1000;
  const remainingRangeKm = Math.round(availableEnergyKwh / effectiveEffKwh);

  // Generate alerts and recommendation
  const alerts = generateJourneyAlerts(newConditions, arrivalSOC, safetyMarginPercent);
  const recommendation = determineActionRecommendation(arrivalSOC, safetyMarginPercent);

  return {
    ...previousState,
    conditions: newConditions,
    arrivalSOC,
    safetyMarginPercent,
    remainingRangeKm,
    alerts,
    recommendation
  };
}
