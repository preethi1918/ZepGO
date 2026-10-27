import json
import os
import uuid
from typing import List
from fastapi import APIRouter, HTTPException
from ..models.vehicle import Vehicle, VehicleCreate

router = APIRouter(prefix="/api/vehicles", tags=["Vehicles"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
VEHICLES_FILE = os.path.join(DATA_DIR, "vehicles.json")

def load_vehicles_from_file() -> List[dict]:
    if not os.path.exists(VEHICLES_FILE):
        return []
    with open(VEHICLES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_vehicles_to_file(vehicles: List[dict]):
    with open(VEHICLES_FILE, "w", encoding="utf-8") as f:
        json.dump(vehicles, f, indent=2)

@router.get("", response_model=List[Vehicle])
def get_vehicles():
    return load_vehicles_from_file()

@router.get("/{vehicle_id}", response_model=Vehicle)
def get_vehicle_by_id(vehicle_id: str):
    vehicles = load_vehicles_from_file()
    for v in vehicles:
        if v["id"] == vehicle_id:
            return v
    raise HTTPException(status_code=404, detail="Vehicle not found")

@router.post("", response_model=Vehicle, status_code=201)
def add_vehicle(payload: VehicleCreate):
    vehicles = load_vehicles_from_file()
    new_id = f"v-{uuid.uuid4().hex[:6]}"
    new_vehicle = payload.model_dump()
    new_vehicle["id"] = new_id
    new_vehicle["is_default"] = False
    vehicles.append(new_vehicle)
    save_vehicles_to_file(vehicles)
    return new_vehicle
