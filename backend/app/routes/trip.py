import json
import os
from typing import List
from fastapi import APIRouter, HTTPException
from ..models.trip import (
    TripPlanRequest,
    TripPlanResponse,
    RouteOption,
    RecalculateRequest,
    RecalculateResponse
)
from ..services.route_service import RouteService

router = APIRouter(prefix="/api", tags=["Trips & Routes"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
MOCK_TRIPS_FILE = os.path.join(DATA_DIR, "mock_trips.json")

def load_trips_history() -> List[dict]:
    if not os.path.exists(MOCK_TRIPS_FILE):
        return []
    with open(MOCK_TRIPS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

@router.post("/trip/plan", response_model=TripPlanResponse)
def plan_trip(payload: TripPlanRequest):
    return RouteService.plan_trip(payload)

@router.post("/route/compare")
def compare_routes(payload: TripPlanRequest):
    plan = RouteService.plan_trip(payload)
    all_routes = [plan.primary_route] + plan.alternative_routes
    comparisons = []
    for r in all_routes:
        comparisons.append({
            "id": r.id,
            "name": r.name,
            "type": r.type,
            "distance_km": r.distance_km,
            "duration": r.duration_formatted,
            "energy_consumption_kwh": r.energy_consumption_kwh,
            "expected_arrival_soc": r.arrival_soc_percent,
            "toll_cost_inr": r.toll_cost,
            "charging_stops_count": 1 if r.charging_required else 0,
            "risk_level": r.risk_level,
            "recommended_charger_name": r.recommended_charger.station.name if r.recommended_charger else "None needed",
            "tradeoff_explanation": (
                "Saves 20 mins with standard charging speed" if r.type == "fastest" else
                "Conserves 2.2 kWh battery with gentler cruising profile" if r.type == "energy_efficient" else
                "Ensures maximum buffer with redundant DC charging hubs every 45 km"
            )
        })
    return {
        "origin": payload.origin,
        "destination": payload.destination,
        "comparison_matrix": comparisons
    }

@router.post("/trip/recalculate", response_model=RecalculateResponse)
def recalculate_trip(payload: RecalculateRequest):
    return RouteService.recalculate_route(payload)

@router.get("/trips")
def get_trip_history():
    return load_trips_history()

@router.get("/trips/{trip_id}")
def get_trip_detail(trip_id: str):
    trips = load_trips_history()
    for t in trips:
        if t["id"] == trip_id:
            return t
    raise HTTPException(status_code=404, detail="Trip record not found")
