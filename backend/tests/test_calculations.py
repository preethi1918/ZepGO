import pytest
from backend.app.utils.calculations import (
    calculate_available_energy,
    calculate_base_range,
    calculate_environmental_multiplier,
    calculate_adjusted_range,
    calculate_expected_energy,
    calculate_arrival_soc,
    determine_battery_status,
    determine_charging_requirement,
    calculate_charging_time,
    calculate_charging_cost
)

def test_prompt_example_base_range():
    """
    Validation test explicitly required in specification:
    Battery = 50%, Capacity = 40 kWh, Efficiency = 6 km/kWh -> Expected base range = 120 km
    """
    avail = calculate_available_energy(battery_capacity=40.0, soc=50.0)
    assert avail == 20.0
    base_range = calculate_base_range(available_energy=avail, efficiency=6.0)
    assert base_range == 120.0

def test_environmental_multiplier_and_adjusted_range():
    # Tailwinds / smooth cruising
    normal_mult = calculate_environmental_multiplier(1.0, 1.0, 1.0, 1.0, 1.0)
    assert 0.95 <= normal_mult <= 1.05

    # Heavy traffic, rain, elevation climb
    headwind_mult = calculate_environmental_multiplier(
        traffic_factor=1.3,
        weather_factor=1.15,
        elevation_factor=1.1,
        speed_factor=1.1,
        ac_factor=1.08
    )
    assert headwind_mult < normal_mult
    adj_range = calculate_adjusted_range(120.0, headwind_mult)
    assert adj_range < 120.0

def test_arrival_soc_and_battery_status():
    # 40.5 kWh battery, 62% initial, consumes 20.8 kWh
    arrival_soc = calculate_arrival_soc(
        current_soc=62.0,
        energy_consumed_kwh=20.8,
        battery_capacity_kwh=40.5
    )
    # 20.8 / 40.5 * 100 = 51.35% drop -> 62 - 51.35 = ~10.6%
    assert 9.0 <= arrival_soc <= 12.0

    # Categorization
    assert determine_battery_status(62.0, 18.0) == "Comfortable"
    assert determine_battery_status(42.0, 18.0) == "Normal"
    assert determine_battery_status(24.0, 18.0) == "Low"
    assert determine_battery_status(12.0, 18.0) == "Critical"

def test_charging_required_logic():
    # Arrival SOC comfortably above reserve
    code1, req1, _ = determine_charging_requirement(arrival_soc=32.0, safety_reserve=18.0)
    assert code1 == "NO_CHARGING_NEEDED"
    assert not req1

    # Arrival SOC close to reserve
    code2, req2, _ = determine_charging_requirement(arrival_soc=22.0, safety_reserve=18.0)
    assert code2 == "CHARGING_RECOMMENDED"
    assert req2

    # Arrival SOC below reserve
    code3, req3, _ = determine_charging_requirement(arrival_soc=14.0, safety_reserve=18.0)
    assert code3 == "CHARGING_REQUIRED"
    assert req3

def test_charging_time_and_cost():
    # Charge from 20% to 80% on 40.5 kWh battery at 120 kW (capped by vehicle 50 kW)
    time_mins = calculate_charging_time(
        current_soc=20.0,
        target_soc=80.0,
        battery_capacity_kwh=40.5,
        charger_speed_kw=120.0,
        vehicle_max_speed_kw=50.0
    )
    assert 20 <= time_mins <= 40

    cost = calculate_charging_cost(energy_kwh=24.3, price_per_kwh=21.0)
    assert cost == pytest.approx(510.3, rel=1e-2)
