import uuid
from fastapi import APIRouter
from ..models.trip import SOSRequest, SOSResponse

router = APIRouter(prefix="/api", tags=["Emergency SOS"])

@router.post("/sos", response_model=SOSResponse)
def trigger_sos(payload: SOSRequest):
    ticket_id = f"SOS-{uuid.uuid4().hex[:6].upper()}"
    
    # Context-aware dispatch guidance
    instructions = [
        "Turn on vehicle hazard warning lights immediately.",
        "Park safely on highway shoulder behind metal crash barriers.",
        "Remain inside or stand safely away from passing expressway traffic.",
        "An authorized RSA roadside dispatch unit is on standby with mobile DC charger."
    ]
    
    if payload.issue_type == "low_battery":
        instructions.append("ZepGO Mobile EV Recovery Van with 25 kW DC rapid-boost is en route.")
    elif payload.issue_type == "flat_tyre":
        instructions.append("Emergency tyre repair vehicle dispatched from Salem Bypass hub.")
        
    return SOSResponse(
        ticket_id=ticket_id,
        status="DISPATCH_PREPARED",
        issue_type=payload.issue_type,
        current_location_label="NH544 Expressway, km 214 Marker (Near Salem Bypass)",
        nearest_service_center={
            "name": "Tata Motors EV Authorized Service Hub",
            "distance_km": 6.4,
            "address": "NH544 Bypass Road, Salem East, Tamil Nadu",
            "phone": "+91 427 244 8899",
            "operating_hours": "24/7 Highway Emergency Response"
        },
        nearest_emergency_charger={
            "name": "Zeon Fast Charging Hub - Salem Bypass (150 kW)",
            "distance_km": 2.1,
            "available_plugs": 3,
            "phone": "+91 80 4718 1000"
        },
        emergency_contacts=[
            {"name": "Tata EV 24x7 Roadside Assistance (RSA)", "phone": "1800 209 8282"},
            {"name": "National Highway Authority Emergency (NH544)", "phone": "1033"},
            {"name": "ZepGO Dedicated Driver Emergency Support", "phone": "+91 800 937 4600"},
            {"name": "Tamil Nadu Highway Police Patrol", "phone": "112"}
        ],
        instructions=instructions,
        eta_support_minutes=18
    )
