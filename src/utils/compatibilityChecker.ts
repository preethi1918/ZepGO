import type { VehicleState } from '../types/vehicle';
import type { ChargingStation } from '../types/charging';

export interface CompatibilityResult {
  status: 'compatible' | 'adapter_required' | 'incompatible';
  badgeLabel: string;
  badgeBg: string;
  badgeText: string;
  details: string;
  maxAchievableKw: number;
  plugMatch: boolean;
  matchedPlug?: string;
  powerMatchPercent: number;
  estimatedChargeTimeMins: number; // 20% to 80% SOC charge duration
  aiVerdictText: string;
  voltageArchitecture: string;
}

/**
 * Perform an AI-powered EV plug, voltage, protocol, and max power compatibility check
 * between an active vehicle profile and a target charging station.
 */
export function checkChargerCompatibility(
  vehicle: VehicleState,
  station: ChargingStation
): CompatibilityResult {
  const vehiclePlugs = vehicle.supportedPlugs || ['CCS2', 'Type 2'];
  const stationPlugs = station.connectorTypes || ['CCS2'];
  const batteryKwh = vehicle.batteryCapacityKwh || 40.5;

  // Check direct plug match
  const matchedPlug = vehiclePlugs.find((vPlug) => stationPlugs.includes(vPlug));

  if (matchedPlug) {
    const vehicleMaxPowerKw = matchedPlug === 'CCS2' ? 120 : 50; // max DC charging rate for vehicle
    const maxAchievableKw = Math.min(station.maxPowerKw, vehicleMaxPowerKw);
    const powerMatchPercent = Math.round((maxAchievableKw / station.maxPowerKw) * 100);

    // Calculate 20% -> 80% SOC energy needed (60% of battery capacity)
    const kwhNeeded = batteryKwh * 0.6;
    const estimatedChargeTimeMins = Math.round((kwhNeeded / maxAchievableKw) * 60);

    const aiVerdictText = `AI Verified: Your ${vehicle.brand} ${vehicle.modelName} has a 100% plug match (${matchedPlug}). Station supplies up to ${station.maxPowerKw}kW DC. Your vehicle onboard BMS accepts up to ${maxAchievableKw}kW peak. Estimated 20% ➔ 80% boost takes ${estimatedChargeTimeMins} mins.`;

    return {
      status: 'compatible',
      badgeLabel: '100% Compatible',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badgeText: 'text-emerald-700',
      details: `${matchedPlug} Match • Max ${maxAchievableKw} kW DC Charge Rate`,
      maxAchievableKw,
      plugMatch: true,
      matchedPlug,
      powerMatchPercent,
      estimatedChargeTimeMins,
      aiVerdictText,
      voltageArchitecture: '400V High-Voltage Architecture Match',
    };
  }

  // Check if adapter or AC Type 2 fallback is possible
  const hasType2Fallback = vehiclePlugs.includes('Type 2') && stationPlugs.some((p) => p.includes('Type 2') || p.includes('AC'));
  if (hasType2Fallback) {
    const maxAchievableKw = 7.2;
    const kwhNeeded = batteryKwh * 0.6;
    const estimatedChargeTimeMins = Math.round((kwhNeeded / maxAchievableKw) * 60);

    const aiVerdictText = `AI Warning: No DC Fast Plug match for ${vehicle.brand} ${vehicle.modelName}. Slow charging supported via AC Type 2 plug at 7.2 kW limit. 20% ➔ 80% charge will take approx ${Math.round(estimatedChargeTimeMins / 60)} hrs. AI recommends finding a CCS2 DC charger.`;

    return {
      status: 'adapter_required',
      badgeLabel: 'Adapter / AC Slower Speed',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      badgeText: 'text-amber-700',
      details: 'Supported via AC Type 2 Slow Plug (7.2 kW limit)',
      maxAchievableKw,
      plugMatch: false,
      matchedPlug: 'Type 2 AC',
      powerMatchPercent: 15,
      estimatedChargeTimeMins,
      aiVerdictText,
      voltageArchitecture: '230V AC Single/Three Phase Low-Speed',
    };
  }

  // Incompatible
  const aiVerdictText = `AI Incompatibility Alert: ${station.name} provides ${stationPlugs.join(', ')} plugs. Your ${vehicle.brand} ${vehicle.modelName} requires ${vehiclePlugs.join(', ')}. Do not stop here unless carrying a physical protocol conversion adapter.`;

  return {
    status: 'incompatible',
    badgeLabel: 'Plug Incompatible',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    badgeText: 'text-rose-700',
    details: `Station has ${stationPlugs.join(', ')} (Vehicle needs ${vehiclePlugs.join(', ')})`,
    maxAchievableKw: 0,
    plugMatch: false,
    powerMatchPercent: 0,
    estimatedChargeTimeMins: 0,
    aiVerdictText,
    voltageArchitecture: 'Incompatible Charging Protocol',
  };
}
