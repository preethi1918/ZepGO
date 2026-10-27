import json
import os
from typing import List, Optional
from ..models.facility import Facility

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
FACILITIES_FILE = os.path.join(DATA_DIR, "facilities.json")

class FacilityService:
    @staticmethod
    def get_all_facilities() -> List[Facility]:
        if not os.path.exists(FACILITIES_FILE):
            return []
        with open(FACILITIES_FILE, "r", encoding="utf-8") as f:
            raw = json.load(f)
            return [Facility(**f) for f in raw]

    @staticmethod
    def get_facilities_for_station(station_id: str, category: Optional[str] = None) -> List[Facility]:
        all_facs = FacilityService.get_all_facilities()
        filtered = [f for f in all_facs if f.station_id == station_id]
        if not filtered:
            # Fallback mock facilities around any selected charger
            filtered = all_facs[:4]
        if category:
            filtered = [f for f in filtered if f.category.lower() == category.lower()]
        return filtered
