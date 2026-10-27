from typing import Optional, List
from pydantic import BaseModel, Field

class UserPreferences(BaseModel):
    route_preference: str = "fastest"  # "fastest" | "cheapest" | "energy_efficient" | "safety_first"
    charging_preference: str = "fast_charging"  # "fast_charging" | "cheapest" | "min_wait"
    safety_reserve_percent: float = Field(18.0, ge=10.0, le=40.0)
    preferred_networks: List[str] = ["Zeon Charging", "Tata Power", "Relux", "ChargeZone"]
    ac_usage_level: str = "medium"  # "eco" | "medium" | "high"
    payload_passengers: int = 2

class UserBase(BaseModel):
    name: str
    email: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = "+91 98765 43210"
    vehicle_id: Optional[str] = "v-nexon-ev-max"

class User(UserBase):
    id: str
    phone: Optional[str] = None
    role: str = "driver"
    active_vehicle_id: str = "v-nexon-ev-max"
    preferences: UserPreferences = Field(default_factory=UserPreferences)
