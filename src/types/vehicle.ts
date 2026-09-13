export type PlugType = 'CCS2' | 'Type 2' | 'LEV AC (IS 17017)' | 'Bharat DC-001' | 'CHAdeMO';

export type ChargingStatus = 'discharging' | 'charging' | 'plugged_in' | 'fully_charged';

export interface VehicleState {
  modelName: string;
  brand: string;
  trim: string;
  batteryCapacityKwh: number;
  currentSocPercent: number; // State of Charge (0-100)
  estimatedRangeKm: number;
  healthPercent: number;
  chargingStatus: ChargingStatus;
  currentChargePowerKw: number;
  supportedPlugs: PlugType[];
  averageConsumptionWhPerKm: number;
  licensePlate: string;
  minArrivalSocBufferPercent: number; // Minimum safe SOC buffer (e.g., 15%)
  preferredNetworks: string[];
  ecoScore: number; // Eco Driving Score out of 100
  totalKmDriven: number;
  totalCo2OffsetKg: number;
  totalChargingCostSavedRs: number;
}

