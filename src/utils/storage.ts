import type { Vehicle, Charger } from '../types';
import { MOCK_CHARGERS } from '../data/chargers';

const AUTH_KEY = 'zepgo_authenticated';
const USER_KEY = 'zepgo_user_data';
const VEHICLE_KEY = 'zepgo_vehicle_data';
const PRIMARY_CHARGER_KEY = 'zepgo_primary_charger';
const BACKUP_CHARGER_KEY = 'zepgo_backup_charger';

export const CANONICAL_GARAGE: Vehicle[] = [
  {
    id: 'veh_nexon_max',
    brand: 'Tata',
    model: 'Nexon EV Max',
    soc: 62,
    batteryCapacity: 40.5,
    efficiency: 147, // 6.8 km/kWh
    connectorType: 'CCS2',
    maxChargingSpeed: 120,
    status: 'Active',
    currentLocation: 'Salem',
    vehicleStatus: 'Normal'
  },
  {
    id: 'veh_mg_zs',
    brand: 'MG',
    model: 'ZS EV Exclusive',
    soc: 75,
    batteryCapacity: 50.3,
    efficiency: 156, // 6.4 km/kWh
    connectorType: 'CCS2',
    maxChargingSpeed: 80,
    status: 'Connected',
    currentLocation: 'Coimbatore',
    vehicleStatus: 'Normal'
  },
  {
    id: 'veh_xuv400',
    brand: 'Mahindra',
    model: 'XUV400 EL',
    soc: 55,
    batteryCapacity: 39.4,
    efficiency: 154, // 6.5 km/kWh
    connectorType: 'CCS2',
    maxChargingSpeed: 50,
    status: 'Idle',
    currentLocation: 'Chennai',
    vehicleStatus: 'Normal'
  },
  {
    id: 'veh_ioniq5',
    brand: 'Hyundai',
    model: 'Ioniq 5 AWD',
    soc: 88,
    batteryCapacity: 72.6,
    efficiency: 169, // 5.9 km/kWh
    connectorType: 'CCS2',
    maxChargingSpeed: 350,
    status: 'Idle',
    currentLocation: 'Bangalore',
    vehicleStatus: 'Normal'
  }
];

export const DEFAULT_VEHICLE: Vehicle = CANONICAL_GARAGE[0];

export const calculateEstimatedRange = (batteryCapacity: number, soc: number, efficiency: number): number => {
  if (!efficiency || efficiency <= 0) return 0;
  const usableKwh = batteryCapacity * (soc / 100);
  const rangeKm = (usableKwh / (efficiency / 1000));
  return Math.round(rangeKm);
};

export const storage = {
  isAuthenticated: (): boolean => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  },

  setAuthenticated: (status: boolean, user?: Record<string, unknown>): void => {
    try {
      localStorage.setItem(AUTH_KEY, status ? 'true' : 'false');
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      if (status && !localStorage.getItem(VEHICLE_KEY)) {
        localStorage.setItem(VEHICLE_KEY, JSON.stringify(DEFAULT_VEHICLE));
      }
    } catch (e) {
      console.error('Failed to update localStorage', e);
    }
  },

  getUserData: () => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  getVehicleData: (): Vehicle => {
    try {
      const data = localStorage.getItem(VEHICLE_KEY);
      if (data) {
        return { ...DEFAULT_VEHICLE, ...JSON.parse(data) };
      }
      localStorage.setItem(VEHICLE_KEY, JSON.stringify(DEFAULT_VEHICLE));
      return DEFAULT_VEHICLE;
    } catch {
      return DEFAULT_VEHICLE;
    }
  },

  setVehicleData: (vehicle: Partial<Vehicle>): Vehicle => {
    try {
      const current = storage.getVehicleData();
      const updated = { ...current, ...vehicle };
      localStorage.setItem(VEHICLE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save vehicle data to localStorage', e);
      return DEFAULT_VEHICLE;
    }
  },

  getPrimaryCharger: (): Charger => {
    try {
      const data = localStorage.getItem(PRIMARY_CHARGER_KEY);
      if (data) return JSON.parse(data);
      // Default to Tata Power Salem
      const defaultPrimary = MOCK_CHARGERS[0];
      localStorage.setItem(PRIMARY_CHARGER_KEY, JSON.stringify(defaultPrimary));
      return defaultPrimary;
    } catch {
      return MOCK_CHARGERS[0];
    }
  },

  setPrimaryCharger: (charger: Charger): void => {
    try {
      localStorage.setItem(PRIMARY_CHARGER_KEY, JSON.stringify(charger));
    } catch (e) {
      console.error('Failed to save primary charger', e);
    }
  },

  getBackupCharger: (): Charger => {
    try {
      const data = localStorage.getItem(BACKUP_CHARGER_KEY);
      if (data) return JSON.parse(data);
      // Default to Zeon Charging Salem Bypass
      const defaultBackup = MOCK_CHARGERS[1];
      localStorage.setItem(BACKUP_CHARGER_KEY, JSON.stringify(defaultBackup));
      return defaultBackup;
    } catch {
      return MOCK_CHARGERS[1];
    }
  },

  setBackupCharger: (charger: Charger): void => {
    try {
      localStorage.setItem(BACKUP_CHARGER_KEY, JSON.stringify(charger));
    } catch (e) {
      console.error('Failed to save backup charger', e);
    }
  },

  getGarageVehicles: (): Vehicle[] => {
    try {
      const data = localStorage.getItem('zepgo_garage_fleet');
      if (data) return JSON.parse(data);
      localStorage.setItem('zepgo_garage_fleet', JSON.stringify(CANONICAL_GARAGE));
      return CANONICAL_GARAGE;
    } catch {
      return CANONICAL_GARAGE;
    }
  },

  setGarageVehicles: (vehicles: Vehicle[]): void => {
    try {
      localStorage.setItem('zepgo_garage_fleet', JSON.stringify(vehicles));
    } catch (e) {
      console.error('Failed to save garage fleet', e);
    }
  },

  setActiveVehicle: (vehicleId: string): Vehicle => {
    const list = storage.getGarageVehicles();
    const updated = list.map(v => ({
      ...v,
      status: (v.id === vehicleId ? 'Active' : 'Idle') as 'Active' | 'Connected' | 'Idle'
    }));
    storage.setGarageVehicles(updated);
    const selected = updated.find(v => v.id === vehicleId) || updated[0];
    storage.setVehicleData(selected);
    return selected;
  },

  getSafetyReserve: (): number => {
    try {
      const val = localStorage.getItem('zepgo_safety_reserve');
      return val ? Number(val) : 18; // default 18%
    } catch {
      return 18;
    }
  },

  setSafetyReserve: (reserve: number): void => {
    try {
      localStorage.setItem('zepgo_safety_reserve', String(reserve));
    } catch (e) {
      console.error('Failed to save safety reserve', e);
    }
  },

  clearAuth: (): void => {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  }
};
