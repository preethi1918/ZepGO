export interface EVModel {
  id: string;
  name: string;
  brand: string;
  batteryCapacityKwh: number;
  usableCapacityKwh: number;
  avgConsumptionKwhPer100Km: number;
  connectorTypes: string[];
  maxChargingPowerKw: number;
  rangeKm: number;
}

export interface ChargingStation {
  id: string;
  stationName: string;
  locationName: string;
  latitude: number;
  longitude: number;
  availablePorts: number;
  totalPorts: number;
  waitingTimeMins: number;
  chargerTypes: string[];
  maxSpeedKw: number;
  pricePerkWh: number;
  rating: number;
  fastCharging: boolean;
  amenities: string[];
  distanceKmFromSF: number;
  elevationMeters: number;
  aiScore?: number;
  scoreBreakdown?: {
    batterySafety: number;
    waitingTime: number;
    cost: number;
    distance: number;
    compatibility: number;
    rating: number;
    traffic: number;
  };
  reasons?: string[];
}

export interface TripPlanRequest {
  currentBattery: number;
  vehicleModelId: string;
  customVehicleName?: string;
  currentLocation: string;
  destination: string;
  distanceKm: number;
  weather: string;
  traffic: string;
  drivingStyle: string;
  acUsage: string;
  cargoWeightKg: number;
}

export interface RouteSegment {
  name: string;
  batteryPercent: number;
  distanceKm: number;
  isChargingStop?: boolean;
}

export interface TripAnalysisResult {
  canReachDestination: boolean;
  preTripChargingRequired: boolean;
  currentBatteryPercent: number;
  estimatedBatteryAtDestinationPercent: number;
  deficitKwh: string;
  requiredKwh: number;
  currentKwh: number;
  distanceKm: number;
  totalConsumptionRateKwhPer100Km: number;
  rangeConfidenceScore: number;
  recommendedStation: ChargingStation;
  allStationsRanked: ChargingStation[];
  aiAnalysisText: string;
  vehicleDetails: {
    name: string;
    usableCapacityKwh: number;
    connectors: string[];
  };
  routeSegments: RouteSegment[];
}

export interface ChargingHistoryRecord {
  id: string;
  stationName: string;
  location: string;
  unitsKwh: number;
  costDollar: number;
  durationMins: number;
  date: string;
  chargerType: string;
  co2SavedKg: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  vehicleModel: string;
  vehicleModelId: string;
  batteryCapacityKwh: number;
  preferredConnector: string;
  profileImage?: string;
  totalKmDriven: number;
  totalCo2SavedKg: number;
  totalMoneySavedDollar: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
