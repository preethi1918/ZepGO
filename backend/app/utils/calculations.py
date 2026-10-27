import math
from typing import Tuple, Dict

def calculate_available_energy(battery_capacity: float, soc: float) -> float:
    """
    Calculates remaining available energy in kWh from battery capacity and SOC percentage.
    Formula: batteryCapacity * (SOC / 100)
    """
    if battery_capacity <= 0 or soc < 0:
        return 0.0
    soc_clamped = min(max(soc, 0.0), 100.0)
    return round(battery_capacity * (soc_clamped / 100.0), 2)

def calculate_base_range(available_energy: float, efficiency: float) -> float:
    """
    Calculates base estimated range in km without environmental headwinds.
    Formula: availableEnergy * efficiency (km/kWh)
    """
    if available_energy <= 0 or efficiency <= 0:
        return 0.0
    return round(available_energy * efficiency, 1)

def calculate_environmental_multiplier(
    traffic_factor: float = 1.0,
    weather_factor: float = 1.0,
    elevation_factor: float = 1.0,
    speed_factor: float = 1.0,
    ac_factor: float = 1.0
) -> float:
    """
    Calculates composite environmental impact multiplier on range.
    Values < 1.0 reduce range (increased drag, rain, elevation climb, heavy traffic).
    """
    composite_drain = (
        traffic_factor *
        weather_factor *
        elevation_factor *
        speed_factor *
        ac_factor
    )
    # Clamp within realistic EV physics bounds: 0.55 (extreme cold/hill climb/storm) to 1.15 (tail wind/eco cruise)
    efficiency_retention = 1.0 / max(composite_drain, 0.7)
    return round(max(min(efficiency_retention, 1.15), 0.55), 3)

def calculate_adjusted_range(
    base_range: float,
    environmental_multiplier: float
) -> float:
    """
    Calculates estimated realistic range considering environmental factors.
    Formula: baseRange * environmentalMultiplier
    """
    return round(base_range * environmental_multiplier, 1)

def calculate_expected_energy(
    distance_km: float,
    vehicle_efficiency: float,
    traffic_factor: float = 1.0,
    weather_factor: float = 1.0,
    elevation_factor: float = 1.0,
    speed_factor: float = 1.0,
    ac_factor: float = 1.0
) -> float:
    """
    Calculates expected energy consumption in kWh for a route.
    """
    if distance_km <= 0 or vehicle_efficiency <= 0:
        return 0.0
    
    base_energy = distance_km / vehicle_efficiency
    drain_multiplier = traffic_factor * weather_factor * elevation_factor * speed_factor * ac_factor
    return round(base_energy * drain_multiplier, 2)

def calculate_arrival_soc(
    current_soc: float,
    energy_consumed_kwh: float,
    battery_capacity_kwh: float
) -> float:
    """
    Calculates expected arrival SOC percentage.
    Formula: currentSOC - (energyConsumed / batteryCapacity * 100)
    """
    if battery_capacity_kwh <= 0:
        return 0.0
    soc_drop = (energy_consumed_kwh / battery_capacity_kwh) * 100.0
    arrival_soc = current_soc - soc_drop
    return round(arrival_soc, 1)

def determine_battery_status(soc: float, safety_reserve: float = 18.0) -> str:
    """
    Categorizes battery status:
    - Above 50%: Comfortable
    - 30–50%: Normal
    - safety_reserve–30%: Low
    - Below safety_reserve: Critical
    """
    if soc >= 50.0:
        return "Comfortable"
    elif soc >= 30.0:
        return "Normal"
    elif soc >= safety_reserve:
        return "Low"
    else:
        return "Critical"

def determine_charging_requirement(
    arrival_soc: float,
    safety_reserve: float = 18.0
) -> Tuple[str, bool, str]:
    """
    Determines charging requirement based on expected arrival SOC and safety reserve:
    - NO CHARGING NEEDED: arrival_soc > safety_reserve + 8.0
    - CHARGING RECOMMENDED: safety_reserve <= arrival_soc <= safety_reserve + 8.0
    - CHARGING REQUIRED: arrival_soc < safety_reserve
    """
    buffer_zone = 8.0
    if arrival_soc > (safety_reserve + buffer_zone):
        return (
            "NO_CHARGING_NEEDED",
            False,
            f"Your predicted arrival battery is {arrival_soc:.0f}%, comfortably exceeding your {safety_reserve:.0f}% safety reserve."
        )
    elif arrival_soc >= safety_reserve:
        return (
            "CHARGING_RECOMMENDED",
            True,
            f"Expected arrival battery is {arrival_soc:.0f}%, which is close to your {safety_reserve:.0f}% safety threshold. Charging is recommended to maintain peace of mind."
        )
    else:
        return (
            "CHARGING_REQUIRED",
            True,
            f"Your predicted arrival battery is {arrival_soc:.0f}%, which falls below your {safety_reserve:.0f}% safety reserve. Charging is required along the route."
        )

def calculate_charging_time(
    current_soc: float,
    target_soc: float,
    battery_capacity_kwh: float,
    charger_speed_kw: float,
    vehicle_max_speed_kw: float
) -> int:
    """
    Estimates charging time in minutes from current_soc to target_soc.
    Considers charger power, vehicle max DC power, and a realistic 88% average charging efficiency curve.
    """
    if target_soc <= current_soc or battery_capacity_kwh <= 0:
        return 0
    
    effective_kw = min(charger_speed_kw, vehicle_max_speed_kw) * 0.88
    energy_needed_kwh = battery_capacity_kwh * ((target_soc - current_soc) / 100.0)
    
    hours = energy_needed_kwh / max(effective_kw, 5.0)
    return max(math.ceil(hours * 60.0), 5)

def calculate_charging_cost(energy_kwh: float, price_per_kwh: float) -> float:
    """
    Calculates estimated cost in INR.
    """
    return round(energy_kwh * price_per_kwh, 2)
