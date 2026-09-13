import type { GeoLocation } from './charging';

export interface RouteStop {
  id: string;
  stationId: string;
  stationName: string;
  location: GeoLocation;
  arrivalSocPercent: number;
  targetSocPercent: number;
  durationMinutes: number;
  distanceFromOriginKm: number;
  chargingPowerKw: number;
  amenities: string[];
}

export type TripStatus = 'planned' | 'active' | 'completed';

export interface RoadTypeBreakdown {
  highwayPercent: number; // e.g. 65%
  urbanPercent: number;   // e.g. 25%
  hillyPercent: number;   // e.g. 10%
}

export interface Trip {
  id: string;
  title: string;
  originName: string;
  originLocation: GeoLocation;
  destinationName: string;
  destinationLocation: GeoLocation;
  totalDistanceKm: number;
  totalDurationMinutes: number;
  estimatedEnergyKwh: number;
  startSocPercent: number;
  arrivalSocPercent: number;
  stops: RouteStop[];
  status: TripStatus;
  createdAt: string;
  roadTypes?: RoadTypeBreakdown;
  elevationGainMeters?: number;
  completedDate?: string;
  actualEnergyUsedKwh?: number;
  co2SavedKg?: number;
  moneySavedRs?: number;
  avgSpeedKmvh?: number;
}
