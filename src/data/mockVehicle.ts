import type { VehicleState } from '../types/vehicle';

export const MOCK_VEHICLE: VehicleState = {
  brand: 'Tata',
  modelName: 'Nexon.ev',
  trim: 'Empowered+ LR',
  batteryCapacityKwh: 40.5,
  currentSocPercent: 24,
  estimatedRangeKm: 96,
  healthPercent: 99,
  chargingStatus: 'discharging',
  currentChargePowerKw: 0,
  supportedPlugs: ['CCS2', 'Type 2'],
  averageConsumptionWhPerKm: 130,
  licensePlate: 'MH 12 EV 4092',
  minArrivalSocBufferPercent: 15,
  preferredNetworks: ['Tata Power EZ Charge', 'Zeon Charging', 'Jio-bp pulse'],
  ecoScore: 92,
  totalKmDriven: 14280,
  totalCo2OffsetKg: 2850,
  totalChargingCostSavedRs: 48200,
};
