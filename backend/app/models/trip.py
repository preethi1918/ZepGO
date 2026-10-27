from typing import Optional, List
from pydantic import BaseModel, Field
from .charging_station import ChargerRecommendation

class TripPlanRequest(BaseModel):
    origin: str = "Salem"
    destination: str = "Coimbatore"
    vehicle_id: str = "v-nexon-ev-max"
    current_soc_percent: float = Field(62.0, ge=0.0, le=100.0)
    safety_reserve_percent: float = Field(18.0, ge=5.0, le=40.0)
    traffic_factor: float = Field(1.0, ge=0.8, le=2.0)  # 1.0 = normal, 1.3 = heavy
    weather_factor: float = Field(1.0, ge=0.8, le=1.8)  # 1.0 = clear, 1.15 = rain/AC
    elevation_factor: float = Field(1.0, ge=0.9, le=1.5)
    speed_factor: float = Field(1.0, ge=0.8, le=1.6)
    ac_enabled: bool = True

class RouteOption(BaseModel):
    id: str
    name: str
    type: str  # "fastest" | "energy_efficient" | "charging_safe"
    distance_km: float
    duration_minutes: int
    duration_formatted: str
    elevation_gain_m: int
    toll_cost: float
    energy_consumption_kwh: float
    arrival_soc_percent: float
    charging_required: bool
    charging_status: str  # "NO_CHARGING_NEEDED" | "CHARGING_RECOMMENDED" | "CHARGING_REQUIRED"
    charging_status_reason: str
    risk_level: str  # "LOW" | "MEDIUM" | "HIGH"
    risk_message: str
    recommended_charger: Optional[ChargerRecommendation] = None
    alternative_chargers: List[ChargerRecommendation] = []
    waypoints: List[List[float]] = []
    description: str

class TripPlanResponse(BaseModel):
    trip_id: str
    origin: str
    destination: str
    vehicle_name: str
    initial_soc_percent: float
    available_energy_kwh: float
    base_range_km: float
    estimated_realistic_range_km: float
    safety_reserve_percent: float
    primary_route: RouteOption
    alternative_routes: List[RouteOption] = []
    environmental_adjustments: dict
    ml_energy_prediction: dict
    warnings: List[str] = []

class RecalculateRequest(BaseModel):
    trip_id: str
    current_distance_traveled_km: float
    current_soc_percent: float
    traffic_spike: bool = True
    weather_worsened: bool = False
    additional_drain_rate: float = 1.25

class RecalculateResponse(BaseModel):
    recalculated: bool
    alert_title: str
    alert_message: str
    previous_arrival_soc: float
    updated_arrival_soc: float
    charging_status: str
    updated_recommended_charger: Optional[ChargerRecommendation] = None
    explanation: str

class SOSRequest(BaseModel):
    issue_type: str  # "breakdown" | "flat_tyre" | "low_battery" | "accident" | "general"
    latitude: float
    longitude: float
    vehicle_id: Optional[str] = "v-nexon-ev-max"
    current_soc_percent: Optional[float] = 12.0
    notes: Optional[str] = None

class SOSResponse(BaseModel):
    ticket_id: str
    status: str
    issue_type: str
    current_location_label: str
    nearest_service_center: dict
    nearest_emergency_charger: dict
    emergency_contacts: List[dict]
    instructions: List[str]
    eta_support_minutes: int
