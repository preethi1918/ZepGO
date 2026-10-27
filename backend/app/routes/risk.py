from fastapi import APIRouter
from pydantic import BaseModel, Field
from ..services.risk_service import RiskService

router = APIRouter(prefix="/api/risk", tags=["Risk Engine"])

class RiskAnalyzeRequest(BaseModel):
    arrival_soc_percent: float = Field(..., ge=0, le=100)
    safety_reserve_percent: float = Field(18.0, ge=5, le=40)
    available_plugs: int = Field(3, ge=0)
    distance_to_next_charger_km: float = Field(25.0, ge=0)
    is_compatible: bool = True
    waiting_time_minutes: int = Field(0, ge=0)
    weather_factor: float = Field(1.0, ge=0.8, le=2.0)

@router.post("/analyze")
def analyze_risk(payload: RiskAnalyzeRequest):
    cat, msg, details = RiskService.evaluate_charging_risk(
        arrival_soc=payload.arrival_soc_percent,
        safety_reserve=payload.safety_reserve_percent,
        charger_available_plugs=payload.available_plugs,
        distance_to_next_charger_km=payload.distance_to_next_charger_km,
        is_compatible=payload.is_compatible,
        waiting_time_minutes=payload.waiting_time_minutes,
        weather_factor=payload.weather_factor
    )
    return {
        "risk_category": cat,
        "risk_explanation": msg,
        "details": details
    }
