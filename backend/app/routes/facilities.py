from typing import List, Optional
from fastapi import APIRouter, Query
from ..models.facility import Facility
from ..services.facility_service import FacilityService

router = APIRouter(prefix="/api/facilities", tags=["Facilities"])

@router.get("/nearby", response_model=List[Facility])
def get_nearby_facilities(
    station_id: Optional[str] = Query("cs-zeon-salem"),
    category: Optional[str] = Query(None)
):
    return FacilityService.get_facilities_for_station(station_id, category)
