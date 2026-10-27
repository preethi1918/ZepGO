/**
 * ZepGO EV Physics and Calculation Utilities
 */

export function calculateAvailableEnergy(batteryCapacityKwh: number, currentSoc: number): number {
  if (batteryCapacityKwh <= 0 || currentSoc < 0) return 0;
  const clampedSoc = Math.min(Math.max(currentSoc, 0), 100);
  return Number(((batteryCapacityKwh * clampedSoc) / 100).toFixed(1));
}

export function calculateBaseRange(availableEnergyKwh: number, efficiencyKmKwh: number): number {
  if (availableEnergyKwh <= 0 || efficiencyKmKwh <= 0) return 0;
  return Math.round(availableEnergyKwh * efficiencyKmKwh);
}

export function calculateEnvironmentalMultiplier(
  trafficFactor = 1.0,
  weatherFactor = 1.0,
  elevationFactor = 1.0,
  speedFactor = 1.0,
  acFactor = 1.0
): number {
  const drain = trafficFactor * weatherFactor * elevationFactor * speedFactor * acFactor;
  const retention = 1.0 / Math.max(drain, 0.7);
  return Number(Math.max(Math.min(retention, 1.15), 0.55).toFixed(3));
}

export function calculateAdjustedRange(baseRangeKm: number, envMultiplier: number): number {
  return Math.round(baseRangeKm * envMultiplier);
}

export function getBatteryStatus(soc: number, safetyReserve = 18): 'Comfortable' | 'Normal' | 'Low' | 'Critical' {
  if (soc >= 50) return 'Comfortable';
  if (soc >= 30) return 'Normal';
  if (soc >= safetyReserve) return 'Low';
  return 'Critical';
}

export function determineChargingStatus(
  arrivalSoc: number,
  safetyReserve = 18
): { status: 'NO_CHARGING_NEEDED' | 'CHARGING_RECOMMENDED' | 'CHARGING_REQUIRED'; required: boolean; reason: string } {
  const buffer = 8;
  if (arrivalSoc > safetyReserve + buffer) {
    return {
      status: 'NO_CHARGING_NEEDED',
      required: false,
      reason: `Predicted arrival battery is ${Math.round(arrivalSoc)}%, safely above your ${safetyReserve}% reserve.`
    };
  }
  if (arrivalSoc >= safetyReserve) {
    return {
      status: 'CHARGING_RECOMMENDED',
      required: true,
      reason: `Arrival battery is ${Math.round(arrivalSoc)}%, approaching your ${safetyReserve}% threshold. Charging is recommended.`
    };
  }
  return {
    status: 'CHARGING_REQUIRED',
    required: true,
    reason: `Predicted arrival battery is ${Math.round(arrivalSoc)}%, falling below your ${safetyReserve}% reserve. Charging is required.`
  };
}
