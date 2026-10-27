from fastapi import APIRouter, HTTPException
from ..models.user import User, UserLogin, UserRegister, UserPreferences

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In-memory storage for demonstration prototype
USERS_DB = {
    "preethi@zepgo.in": {
        "id": "usr-preethi",
        "name": "Preethi",
        "email": "preethi@zepgo.in",
        "phone": "+91 98401 23456",
        "role": "driver",
        "active_vehicle_id": "v-nexon-ev-max",
        "preferences": {
            "route_preference": "fastest",
            "charging_preference": "fast_charging",
            "safety_reserve_percent": 18.0,
            "preferred_networks": ["Zeon Charging", "Tata Power", "Relux", "ChargeZone"],
            "ac_usage_level": "medium",
            "payload_passengers": 2
        }
    }
}

@router.post("/login")
def login(payload: UserLogin):
    email = payload.email.lower().strip()
    if email in USERS_DB:
        user_data = USERS_DB[email]
        return {
            "status": "success",
            "message": "Login successful",
            "token": f"bearer-mock-token-{user_data['id']}",
            "user": user_data
        }
    # Prototype automatic guest / flexible login
    mock_id = f"usr-{email.split('@')[0]}"
    name = email.split('@')[0].capitalize()
    new_user = {
        "id": mock_id,
        "name": name,
        "email": email,
        "phone": "+91 98765 43210",
        "role": "driver",
        "active_vehicle_id": "v-nexon-ev-max",
        "preferences": {
            "route_preference": "fastest",
            "charging_preference": "fast_charging",
            "safety_reserve_percent": 18.0,
            "preferred_networks": ["Zeon Charging", "Tata Power"],
            "ac_usage_level": "medium",
            "payload_passengers": 2
        }
    }
    USERS_DB[email] = new_user
    return {
        "status": "success",
        "message": "Login successful",
        "token": f"bearer-mock-token-{mock_id}",
        "user": new_user
    }

@router.post("/register")
def register(payload: UserRegister):
    email = payload.email.lower().strip()
    user_id = f"usr-{len(USERS_DB) + 1:03d}"
    user_data = {
        "id": user_id,
        "name": payload.name,
        "email": email,
        "phone": payload.phone or "+91 98765 43210",
        "role": "driver",
        "active_vehicle_id": payload.vehicle_id or "v-nexon-ev-max",
        "preferences": {
            "route_preference": "fastest",
            "charging_preference": "fast_charging",
            "safety_reserve_percent": 18.0,
            "preferred_networks": ["Zeon Charging", "Tata Power", "Relux"],
            "ac_usage_level": "medium",
            "payload_passengers": 2
        }
    }
    USERS_DB[email] = user_data
    return {
        "status": "success",
        "message": "Account created successfully",
        "token": f"bearer-mock-token-{user_id}",
        "user": user_data
    }

@router.get("/me")
def get_current_user():
    return list(USERS_DB.values())[0]
