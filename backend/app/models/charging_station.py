from typing import Optional, List
from pydantic import BaseModel, Field
from .facility import Facility

class ChargingStationBase(BaseModel):
    name: str
    network: str
    latitude: float
    longitude: float
    address: str
    connector_type: str = "CCS2"
    charging_speed: float = Field(..., gt=0, description="Speed in kW")
    price_per_kwh: float = Field(..., gt=0, description="Price in INR/kWh")
    availability: str = "Available"  # "Available" | "Busy" | "Offline"
    total_chargers: int = 4
    available_chargers: int = 3
    operating_status: str = "Operational"
    estimated_waiting_time: int = 0  # minutes
    reliability_score: float = 0.95
    supported_vehicles: List[str] = []
    distance_from_route_km: float = 0.5
    rating: float = 4.5
    reviews_count: int = 150
    nearby_facilities: List[Facility] = []

class ChargingStation(ChargingStationBase):
    id: str

class WhyThisCharger(BaseModel):
    bullet_points: List[str]
    arrival_soc_percent: float
    charging_time_minutes: int
    estimated_cost_inr: float
    safety_margin_percent: float
    summary: str

class ChargerRecommendation(BaseModel):
    station: ChargingStation
    recommendation_score: float
    is_recommended: bool = False
    why_this_charger: WhyThisCharger
    risk_level: str  # "LOW" | "MEDIUM" | "HIGH"
    risk_explanation: str
    arrival_soc_percent: float
    time_to_charge_minutes: int
    target_soc_percent: float = 80.0
    estimated_charging_cost_inr: float
    rank: int
