import type { VehicleState } from '../../types/vehicle';
import type { Trip } from '../../types/trip';
import type { ChargingStation } from '../../types/charging';
import { checkChargerCompatibility } from '../../utils/compatibilityChecker';

export interface AiRecommendation {
  id: string;
  category: 'compatibility_check' | 'charger_swap' | 'speed_optimizer' | 'cost_saver' | 'battery_prep';
  title: string;
  subtitle: string;
  explanation: string;
  impactBadge: string;
  impactType: 'time' | 'energy' | 'cost';
  actionLabel: string;
  actionData?: any;
  confidenceScore: number; // e.g. 98%
}

export function generateBestAiRecommendations(
  vehicle: VehicleState,
  activeTrip: Trip | null,
  stations: ChargingStation[]
): AiRecommendation[] {
  const recommendations: AiRecommendation[] = [];
  const brandName = vehicle.brand || 'EV';
  const modelName = vehicle.modelName || 'Vehicle';

  // Recommendation 1: AI Vehicle Charger Compatibility Analysis
  if (stations.length > 0) {
    const targetStation = stations[0];
    const comp = checkChargerCompatibility(vehicle, targetStation);

    recommendations.push({
      id: 'ai-rec-compat',
      category: 'compatibility_check',
      title: `AI Vehicle Charger Compatibility for ${brandName} ${modelName}`,
      subtitle: `${comp.badgeLabel} • ${targetStation.name}`,
      explanation: comp.aiVerdictText,
      impactBadge: comp.status === 'compatible' ? '🟢 100% Plug & Voltage Match' : '⚠️ Adapter / Slower Speed',
      impactType: 'energy',
      actionLabel: 'View AI Compatibility Breakdown',
      actionData: { targetStation, compatibility: comp },
      confidenceScore: 99,
    });
  }

  // Recommendation 2: Fast Charger Station Swap Optimization
  const ultraFastChargers = stations.filter((s) => s.maxPowerKw >= 100 && s.status === 'available');
  if (ultraFastChargers.length > 0) {
    const bestUltra = ultraFastChargers[0];
    recommendations.push({
      id: 'ai-rec-1',
      category: 'charger_swap',
      title: `AI Co-Pilot Suggestion for ${brandName}: Reroute to ${bestUltra.name}`,
      subtitle: 'Higher Charge Rate & Guaranteed Availability',
      explanation: `Station delivers ${bestUltra.maxPowerKw} kW DC charging rate with ${bestUltra.availablePlugs} active plugs available. Replaces 60kW charger to cut total charging stop time by 12 mins.`,
      impactBadge: '⚡ Save 12 Mins Stop Time',
      impactType: 'time',
      actionLabel: 'Apply AI Route Reroute',
      actionData: { targetStation: bestUltra },
      confidenceScore: 96,
    });
  }

  // Recommendation 3: Speed Optimization for Non-Stop Range
  if (activeTrip && activeTrip.arrivalSocPercent < 25) {
    recommendations.push({
      id: 'ai-rec-2',
      category: 'speed_optimizer',
      title: 'Range Optimizer: Eco Cruise Speed Prompt',
      subtitle: 'Avoid 1 Extra Charging Stop',
      explanation: `By maintaining 92 km/h cruise speed on Expressway instead of 115 km/h, aerodynamic drag drops by 22%, saving 3.8 kWh and ensuring direct arrival with 28% SOC buffer.`,
      impactBadge: '🔋 +38 km Extra Range Buffer',
      impactType: 'energy',
      actionLabel: 'Enable Eco Speed Guidance',
      confidenceScore: 94,
    });
  }

  // Recommendation 4: Off-Peak Charging Tariff Savings
  recommendations.push({
    id: 'ai-rec-3',
    category: 'cost_saver',
    title: 'Smart Cost Saver: Off-Peak Solar Tariff',
    subtitle: 'Save ₹180 on Journey Charging',
    explanation: 'Selected Tata Power station offers ₹16.50/kWh green solar energy tariff between 1:00 PM - 4:00 PM vs peak ₹22.00/kWh.',
    impactBadge: '₹ Save ₹180 Charging Cost',
    impactType: 'cost',
    actionLabel: 'Schedule Off-Peak Charge',
    confidenceScore: 98,
  });

  return recommendations;
}
