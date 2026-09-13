import { useState } from 'react';
import type { VehicleState } from '../types/vehicle';
import { MOCK_VEHICLE } from '../data/mockVehicle';

export function useBattery() {
  const [vehicle, setVehicle] = useState<VehicleState>(MOCK_VEHICLE);

  const setSoc = (newSoc: number) => {
    setVehicle((prev) => ({
      ...prev,
      currentSocPercent: Math.min(100, Math.max(0, newSoc)),
      estimatedRangeKm: Math.round((newSoc / 100) * 480), // 480km full pack range
    }));
  };

  const toggleCharging = () => {
    setVehicle((prev) => {
      const isCharging = prev.chargingStatus === 'charging';
      return {
        ...prev,
        chargingStatus: isCharging ? 'discharging' : 'charging',
        currentChargePowerKw: isCharging ? 0 : 150,
      };
    });
  };

  return {
    vehicle,
    setSoc,
    toggleCharging,
  };
}
