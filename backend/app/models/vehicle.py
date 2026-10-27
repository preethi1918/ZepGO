from typing import Optional, List
from pydantic import BaseModel, Field

class VehicleBase(BaseModel):
    brand: str
    model: str
    variant: Optional[str] = None
    battery_capacity: float = Field(..., gt=0, description="Battery capacity in kWh")
    vehicle_efficiency: float = Field(..., gt=0, description="Rated efficiency in km/kWh")
    charging_connector: str = "CCS2"
    max_charging_speed: float = Field(..., gt=0, description="Max DC charging speed in kW")
    ac_charging_speed: Optional[float] = 7.2
    nominal_voltage: Optional[int] = 320
    curb_weight_kg: Optional[int] = 1400
    aerodynamic_drag_cd: Optional[float] = 0.33
    default_soc: Optional[float] = Field(62.0, ge=0, le=100)

class VehicleCreate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    id: str
    is_default: bool = False

class BatteryStatus(BaseModel):
    soc_percent: float = Field(..., ge=0, le=100)
    battery_capacity_kwh: float = Field(..., gt=0)
    available_energy_kwh: float
    estimated_range_km: float
    safety_reserve_percent: float = 18.0
    status_label: str  # "Comfortable" | "Normal" | "Low" | "Critical"
    health_percent: float = 98.0
