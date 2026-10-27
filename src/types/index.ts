export interface User {
  [key: string]: unknown;
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  vehicleModel?: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  soc: number; // State of charge in percentage (e.g. 82)
  batteryCapacity: number; // Total usable battery capacity in kWh (e.g. 75)
  efficiency: number; // Consumption efficiency in Wh/km (e.g. 155)
  connectorType: string; // e.g. "CCS2"
  maxChargingSpeed: number; // Peak charging speed in kW (e.g. 250)
  status: 'Active' | 'Connected' | 'Idle';
  currentLocation: string; // e.g. "Chennai"
  vehicleStatus: 'Normal' | 'Warning' | 'Maintenance';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type BadgeVariant = 'success' | 'info' | 'warning' | 'neutral';

export type TripPreference = 'Fastest' | 'Energy Efficient' | 'Avoid Tolls' | 'Maximum Safety Margin';

export type TrafficCondition = 'normal' | 'moderate' | 'heavy' | 'congested';
export type WeatherCondition = 'normal' | 'clear' | 'rain' | 'extreme';
export type RoadCondition = 'good' | 'congested' | 'poor';

export interface EnvironmentalConditions {
  traffic: TrafficCondition;
  weather: WeatherCondition;
  road: RoadCondition;
}

export interface RouteData {
  origin: string;
  destination: string;
  distanceKm: number;
  travelTimeText: string;
  stops?: string[];
}

export interface RangeUncertainty {
  bestCaseKm: number;
  expectedKm: number;
  conservativeKm: number;
}

export type ChargingDecision = 'NO_CHARGING_REQUIRED' | 'CHARGING_RECOMMENDED' | 'UNSAFE_ACTION_REQUIRED';

export interface TripCalculationResult {
  route: RouteData;
  preference: TripPreference;
  conditions: EnvironmentalConditions;
  departureTime: string;
  baseEnergyRequiredKwh: number;
  adjustedEnergyRequiredKwh: number;
  trafficImpactPercent: number;
  weatherImpactPercent: number;
  roadImpactPercent: number;
  totalPenaltyPercent: number;
  adjustedEfficiencyWhPerKm: number;
  startingSOC: number;
  arrivalSOC: number;
  availableEnergyKwh: number;
  remainingEnergyKwh: number;
  reserveEnergyKwh: number;
  reservePercent: number;
  reserveReason: string;
  safetyMarginPercent: number;
  realisticRangeKm: number;
  safeReachableRangeKm: number;
  shortfallKm: number;
  kwhNeeded: number;
  decision: ChargingDecision;
  decisionTitle: string;
  decisionText: string;
  rangeUncertainty: RangeUncertainty;
  vehicleSnapshot: Vehicle;
}

// Phase 5 Charger Types
export type QueueLevel = 'Low' | 'Medium' | 'High';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type ArrivalPredictionStatus = 'Likely Available' | 'May Be Busy' | 'Availability Uncertain' | 'Likely Unavailable';

export interface Charger {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  ports: number;
  freePorts: number;
  availability: 'Available' | 'Busy' | 'Offline';
  queueLevel: QueueLevel;
  faultRisk: RiskLevel;
  maintenance: boolean;
  pricePerKwh: number;
  connector: 'CCS2' | 'Type 2' | 'GB/T' | 'CHAdeMO';
  chargingSpeed: number; // in kW
  reliabilityScore: number; // e.g. 94 out of 100
  locationName: string;
  address?: string;
}

export interface ChargerFilterState {
  availableOnly: boolean;
  fastChargingOnly: boolean;
  lowRiskOnly: boolean;
  ccs2Only: boolean;
  nearRouteOnly: boolean;
  searchQuery: string;
}

export interface BackupAnalysisResult {
  primaryCharger: Charger;
  backupCharger: Charger;
  primaryDistanceKm: number;
  primaryArrivalSOC: number;
  extraBackupDistanceKm: number;
  backupArrivalSOCIfPrimaryFails: number;
  requiredReserveSOC: number;
  isBackupReachable: boolean;
  statusText: string;
  alternativeCharger?: Charger;
}

// Phase 6 Live Journey Types
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface JourneyAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
}

export type ActionRecommendationType =
  | 'NO_ACTION_REQUIRED'
  | 'CHARGE_AT_RECOMMENDED_CHARGER'
  | 'VIEW_BACKUP_CHARGER'
  | 'FIND_SAFER_ROUTE'
  | 'CONTINUE_CAREFULLY'
  | 'EMERGENCY_ASSISTANCE';

export interface ActionRecommendation {
  type: ActionRecommendationType;
  title: string;
  description: string;
  badgeVariant: BadgeVariant;
}

export interface LiveJourneyState {
  origin: string;
  destination: string;
  currentLocation: string;
  etaText: string;
  distanceRemainingKm: number;
  startingSOC: number;
  currentSOC: number;
  arrivalSOC: number;
  remainingRangeKm: number;
  reservePercent: number;
  safetyMarginPercent: number;
  conditions: EnvironmentalConditions;
  isOnline: boolean;
  alerts: JourneyAlert[];
  recommendation: ActionRecommendation;
}
