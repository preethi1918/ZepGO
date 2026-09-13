import type { PlugType } from './vehicle';

export type StationStatus = 'available' | 'busy' | 'offline';
export type SpeedCategory = 'ultra_fast' | 'fast' | 'standard';

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface ChargingStation {
  id: string;
  name: string;
  operator: string;
  address: string;
  location: GeoLocation;
  distanceKm: number;
  maxPowerKw: number;
  availablePlugs: number;
  totalPlugs: number;
  connectorTypes: PlugType[];
  pricePerKwh: number;
  rating: number; // e.g. 4.8
  status: StationStatus;
  speedCategory: SpeedCategory;
  amenities: string[]; // e.g. ['Restroom', 'Coffee', 'WiFi', 'Shopping']
}
