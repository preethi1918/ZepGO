import type { Vehicle, Charger } from '../types';
import { MOCK_CHARGERS } from '../data/chargers';

const AUTH_KEY = 'zepgo_authenticated';
const USER_KEY = 'zepgo_user_data';
const VEHICLE_KEY = 'zepgo_vehicle_data';
const PRIMARY_CHARGER_KEY = 'zepgo_primary_charger';
const BACKUP_CHARGER_KEY = 'zepgo_backup_charger';

export const DEFAULT_VEHICLE: Vehicle = {
  id: 'veh_default_01',
  brand: 'Tesla',
  model: 'Model Y Long Range',
  soc: 82,
  batteryCapacity: 75,
  efficiency: 155,
  connectorType: 'CCS2',
  maxChargingSpeed: 250,
  status: 'Active',
  currentLocation: 'Chennai',
  vehicleStatus: 'Normal'
};

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

  clearAuth: (): void => {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  }
};
