from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from ..models.charging_station import ChargingStation, ChargerRecommendation
from ..services.charging_service import ChargingService

router = APIRouter(prefix="/api", tags=["Charging Stations"])

class RecommendChargerRequest(BaseModel):
    vehicle_model: str = "Tata Nexon EV Max"
    vehicle_connector: str = "CCS2"
    vehicle_max_speed: float = 50.0
    battery_capacity: float = 40.5
    current_soc: float = 62.0
    expected_arrival_soc: float = 27.0
    safety_reserve: float = 18.0

@router.get("/charging-stations", response_model=List[ChargingStation])
def get_charging_stations(
    network: Optional[str] = Query(None),
    status: Optional[str] = Query(None)
):
    stations = ChargingService.load_stations()
    if network:
        stations = [s for s in stations if network.lower() in s.network.lower()]
    if status:
        stations = [s for s in stations if status.lower() == s.availability.lower()]
    return stations

@router.get("/charging-stations/{station_id}", response_model=ChargingStation)
def get_charging_station(station_id: str):
    station = ChargingService.get_station_by_id(station_id)
    if not station:
        raise HTTPException(status_code=404, detail="Charging station not found")
    return station

@router.post("/charging/recommend", response_model=List[ChargerRecommendation])
def recommend_charging_stations(payload: RecommendChargerRequest):
    stations = ChargingService.load_stations()
    return ChargingService.rank_chargers(
        stations=stations,
        vehicle_model=payload.vehicle_model,
        vehicle_connector=payload.vehicle_connector,
        vehicle_max_speed=payload.vehicle_max_speed,
        battery_capacity=payload.battery_capacity,
        current_soc=payload.current_soc,
        expected_arrival_soc=payload.expected_arrival_soc,
        safety_reserve=payload.safety_reserve
    )
