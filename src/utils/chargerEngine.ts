import type {
  Charger,
  RiskLevel,
  ArrivalPredictionStatus,
  BackupAnalysisResult,
  Vehicle
} from '../types';

/**
 * Calculates composite risk level for a charger (Low, Medium, High)
 */
export function calculateChargerRisk(charger: Charger): RiskLevel {
  if (charger.maintenance) return 'High';
  if (charger.faultRisk === 'High') return 'High';
  if (charger.freePorts === 0 && charger.queueLevel === 'High') return 'High';
  if (charger.reliabilityScore < 80) return 'High';

  let riskPoints = 0;

  if (charger.freePorts === 0) riskPoints += 2;
  else if (charger.freePorts === 1) riskPoints += 1;

  if (charger.queueLevel === 'High') riskPoints += 2;
  else if (charger.queueLevel === 'Medium') riskPoints += 1;

  if (charger.faultRisk === 'Medium') riskPoints += 1;
  if (charger.reliabilityScore < 90) riskPoints += 1;

  if (riskPoints >= 3) return 'High';
  if (riskPoints >= 1) return 'Medium';
  return 'Low';
}

/**
 * Predicts arrival status based on current telematics & estimated travel time
 */
export function predictArrivalStatus(
  charger: Charger,
  _etaMinutes: number = 90
): ArrivalPredictionStatus {
  if (charger.maintenance) return 'Likely Unavailable';

  if (charger.freePorts === 0 && charger.queueLevel === 'High') {
    return 'Likely Unavailable';
  }

  if (charger.freePorts === 0 || charger.queueLevel === 'Medium' || charger.faultRisk === 'High') {
    return 'May Be Busy';
  }

  if (charger.reliabilityScore < 85 || charger.faultRisk === 'Medium') {
    return 'Availability Uncertain';
  }

  return 'Likely Available';
}

/**
 * Analyzes backup charger reachability & safety buffer if primary charger fails
 */
export function checkBackupReachability(
  primaryCharger: Charger,
  backupCharger: Charger,
  vehicle: Vehicle,
  currentSOC: number = 82
): BackupAnalysisResult {
  const batteryCapacity = vehicle.batteryCapacity || 75;
  const efficiency = vehicle.efficiency || 155;
  const effKwhPerKm = efficiency / 1000;

  const totalAvailableEnergy = batteryCapacity * (currentSOC / 100);

  // Energy & Arrival SOC at Primary
  const primaryDistanceKm = primaryCharger.distanceKm;
  const energyToPrimary = primaryDistanceKm * effKwhPerKm;
  const primaryArrivalSOC = Math.max(
    0,
    Math.round(((totalAvailableEnergy - energyToPrimary) / batteryCapacity) * 100 * 10) / 10
  );

  // Extra distance to Backup beyond Primary
  const extraBackupDistanceKm = Math.max(12, Math.abs(backupCharger.distanceKm - primaryCharger.distanceKm));
  const totalDistanceToBackup = primaryDistanceKm + extraBackupDistanceKm;
  const energyToBackup = totalDistanceToBackup * effKwhPerKm;

  // Arrival SOC at Backup if Primary fails
  const backupArrivalSOCIfPrimaryFails = Math.max(
    0,
    Math.round(((totalAvailableEnergy - energyToBackup) / batteryCapacity) * 100 * 10) / 10
  );

  const requiredReserveSOC = 15;
  const isBackupReachable = backupArrivalSOCIfPrimaryFails >= requiredReserveSOC;

  const statusText = isBackupReachable ? 'BACKUP REACHABLE' : 'BACKUP NOT SAFE';

  return {
    primaryCharger,
    backupCharger,
    primaryDistanceKm,
    primaryArrivalSOC,
    extraBackupDistanceKm,
    backupArrivalSOCIfPrimaryFails,
    requiredReserveSOC,
    isBackupReachable,
    statusText
  };
}

/**
 * Finds a safe alternative backup charger if candidate backup is unsafe
 */
export function findAlternativeBackup(
  primaryCharger: Charger,
  allChargers: Charger[],
  vehicle: Vehicle,
  currentSOC: number
): Charger | undefined {
  return allChargers.find((c) => {
    if (c.id === primaryCharger.id) return false;
    const analysis = checkBackupReachability(primaryCharger, c, vehicle, currentSOC);
    return analysis.isBackupReachable && c.availability === 'Available';
  });
}
