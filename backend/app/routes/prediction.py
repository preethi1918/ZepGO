from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional
from ..services.range_service import RangeService
from ..services.energy_service import EnergyService

router = APIRouter(prefix="/api", tags=["Predictions"])

class RangePredictRequest(BaseModel):
    battery_capacity_kwh: float = Field(40.5, gt=0)
    current_soc_percent: float = Field(62.0, ge=0, le=100)
    vehicle_efficiency_km_kwh: float = Field(6.8, gt=0)
    traffic_factor: float = Field(1.0, ge=0.5, le=2.5)
    weather_factor: float = Field(1.0, ge=0.5, le=2.0)
    elevation_factor: float = Field(1.0, ge=0.8, le=2.0)
    speed_factor: float = Field(1.0, ge=0.8, le=1.8)
    ac_factor: float = Field(1.08, ge=1.0, le=1.4)
    safety_reserve_percent: float = Field(18.0, ge=5.0, le=40.0)

class EnergyPredictRequest(BaseModel):
    distance_km: float = Field(142.0, gt=0)
    current_soc_percent: float = Field(62.0, ge=0, le=100)
    battery_capacity_kwh: float = Field(40.5, gt=0)
    vehicle_efficiency_km_kwh: float = Field(6.8, gt=0)
    avg_speed_kmh: float = Field(75.0, gt=0)
    traffic_factor: float = Field(1.0, ge=0.8, le=2.5)
    weather_factor: float = Field(1.0, ge=0.8, le=2.0)
    elevation_gain_m: float = Field(120.0, ge=0)
    rain_level_mm: float = Field(0.0, ge=0)
    temperature_c: float = Field(29.0)
    ac_enabled: bool = True

@router.post("/range/predict")
def predict_range(payload: RangePredictRequest):
    return RangeService.estimate_range(
        battery_capacity_kwh=payload.battery_capacity_kwh,
        current_soc_percent=payload.current_soc_percent,
        vehicle_efficiency_km_kwh=payload.vehicle_efficiency_km_kwh,
        traffic_factor=payload.traffic_factor,
        weather_factor=payload.weather_factor,
        elevation_factor=payload.elevation_factor,
        speed_factor=payload.speed_factor,
        ac_factor=payload.ac_factor,
        safety_reserve_percent=payload.safety_reserve_percent
    )

@router.post("/energy/predict")
def predict_energy(payload: EnergyPredictRequest):
    return EnergyService.predict_energy(
        distance_km=payload.distance_km,
        current_soc_percent=payload.current_soc_percent,
        battery_capacity_kwh=payload.battery_capacity_kwh,
        vehicle_efficiency_km_kwh=payload.vehicle_efficiency_km_kwh,
        avg_speed_kmh=payload.avg_speed_kmh,
        traffic_factor=payload.traffic_factor,
        weather_factor=payload.weather_factor,
        elevation_gain_m=payload.elevation_gain_m,
        rain_level_mm=payload.rain_level_mm,
        temperature_c=payload.temperature_c,
        ac_enabled=payload.ac_enabled
    )
