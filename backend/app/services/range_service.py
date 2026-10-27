from typing import Dict, Any
from ..utils.calculations import (
    calculate_available_energy,
    calculate_base_range,
    calculate_environmental_multiplier,
    calculate_adjusted_range,
    determine_battery_status
)

class RangeService:
    @staticmethod
    def estimate_range(
        battery_capacity_kwh: float,
        current_soc_percent: float,
        vehicle_efficiency_km_kwh: float,
        traffic_factor: float = 1.0,
        weather_factor: float = 1.0,
        elevation_factor: float = 1.0,
        speed_factor: float = 1.0,
        ac_factor: float = 1.0,
        safety_reserve_percent: float = 18.0
    ) -> Dict[str, Any]:
        """
        Step 1: Available energy = Battery capacity * SOC / 100
        Step 2: Base range = Available energy * Vehicle efficiency
        Step 3: Environmental factor adjustments (traffic, weather, elevation, speed, ac)
        Step 4: Estimated realistic range = Base range * Environmental multiplier
        Clearly labeled as an estimate.
        """
        available_energy = calculate_available_energy(battery_capacity_kwh, current_soc_percent)
        base_range = calculate_base_range(available_energy, vehicle_efficiency_km_kwh)
        
        env_multiplier = calculate_environmental_multiplier(
            traffic_factor=traffic_factor,
            weather_factor=weather_factor,
            elevation_factor=elevation_factor,
            speed_factor=speed_factor,
            ac_factor=ac_factor
        )
        
        realistic_range = calculate_adjusted_range(base_range, env_multiplier)
        battery_status = determine_battery_status(current_soc_percent, safety_reserve_percent)
        
        return {
            "battery_capacity_kwh": battery_capacity_kwh,
            "current_soc_percent": current_soc_percent,
            "available_energy_kwh": available_energy,
            "base_range_km": base_range,
            "environmental_multiplier": env_multiplier,
            "estimated_realistic_range_km": realistic_range,
            "battery_status": battery_status,
            "safety_reserve_percent": safety_reserve_percent,
            "is_estimate": True,
            "environmental_breakdown": {
                "traffic_factor": traffic_factor,
                "weather_factor": weather_factor,
                "elevation_factor": elevation_factor,
                "speed_factor": speed_factor,
                "ac_factor": ac_factor
            }
        }
