from typing import Optional, List
from pydantic import BaseModel

class Facility(BaseModel):
    id: str
    station_id: Optional[str] = None
    name: str
    category: str  # "cafe" | "restaurant" | "restroom" | "store" | "parking" | "hotel"
    distance_m: int
    rating: float
    is_open: bool
    timings: Optional[str] = "24 Hours"
    speciality: Optional[str] = None
    avg_spend_inr: Optional[int] = 0
    features: List[str] = []
