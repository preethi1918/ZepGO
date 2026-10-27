from typing import Optional

def validate_battery_soc(soc: float) -> bool:
    return 0.0 <= soc <= 100.0

def validate_positive_number(val: float) -> bool:
    return val > 0.0

def validate_coordinates(lat: float, lon: float) -> bool:
    return -90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0

def sanitize_trip_inputs(
    current_soc: float,
    battery_capacity: float,
    vehicle_efficiency: float,
    safety_reserve: float
) -> dict:
    return {
        "current_soc": max(0.0, min(100.0, current_soc)),
        "battery_capacity": max(10.0, battery_capacity),
        "vehicle_efficiency": max(1.0, vehicle_efficiency),
        "safety_reserve": max(5.0, min(50.0, safety_reserve))
    }
