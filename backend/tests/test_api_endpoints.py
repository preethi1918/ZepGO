import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert "ZepGO" in data["platform"]
    assert data["status"] == "operational"

def test_get_vehicles():
    res = client.get("/api/vehicles")
    assert res.status_code == 200
    vehicles = res.json()
    assert len(vehicles) >= 4
    brands = [v["brand"] for v in vehicles]
    assert "Tata" in brands
    assert "MG" in brands

def test_plan_trip_demo_scenario():
    """
    Demo scenario: Preethi, Tata Nexon EV, 62% battery, Coimbatore destination (142 km)
    """
    payload = {
        "origin": "Salem",
        "destination": "Coimbatore",
        "vehicle_id": "v-nexon-ev-max",
        "current_soc_percent": 62.0,
        "safety_reserve_percent": 18.0,
        "traffic_factor": 1.0,
        "weather_factor": 1.0,
        "ac_enabled": True
    }
    res = client.post("/api/trip/plan", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["origin"] == "Salem"
    assert data["destination"] == "Coimbatore"
    assert "primary_route" in data
    assert data["primary_route"]["distance_km"] == 142.0
    assert data["primary_route"]["recommended_charger"] is not None
    # Why this charger explanations
    why = data["primary_route"]["recommended_charger"]["why_this_charger"]
    assert len(why["bullet_points"]) >= 5
    assert why["charging_time_minutes"] > 0

def test_charging_recommendation():
    payload = {
        "vehicle_model": "Tata Nexon EV Max",
        "vehicle_connector": "CCS2",
        "vehicle_max_speed": 50.0,
        "battery_capacity": 40.5,
        "current_soc": 62.0,
        "expected_arrival_soc": 27.0,
        "safety_reserve": 18.0
    }
    res = client.post("/api/charging/recommend", json=payload)
    assert res.status_code == 200
    chargers = res.json()
    assert len(chargers) > 0
    # First charger must be recommended with rank 1
    assert chargers[0]["is_recommended"] is True
    assert chargers[0]["rank"] == 1
    assert chargers[0]["risk_level"] in ["LOW", "MEDIUM", "HIGH"]

def test_risk_analysis():
    payload = {
        "arrival_soc_percent": 31.0,
        "safety_reserve_percent": 18.0,
        "available_plugs": 3,
        "distance_to_next_charger_km": 25.0,
        "is_compatible": True,
        "waiting_time_minutes": 0,
        "weather_factor": 1.0
    }
    res = client.post("/api/risk/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_category"] == "LOW"

def test_dynamic_recalculation():
    payload = {
        "trip_id": "demo-trip",
        "current_distance_traveled_km": 45.0,
        "current_soc_percent": 42.0,
        "traffic_spike": True,
        "weather_worsened": False,
        "additional_drain_rate": 1.25
    }
    res = client.post("/api/trip/recalculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["recalculated"] is True
    assert data["updated_recommended_charger"] is not None

def test_sos_endpoint():
    payload = {
        "issue_type": "low_battery",
        "latitude": 11.6643,
        "longitude": 78.1460,
        "vehicle_id": "v-nexon-ev-max",
        "current_soc_percent": 11.0
    }
    res = client.post("/api/sos", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "ticket_id" in data
    assert len(data["emergency_contacts"]) > 0
    assert len(data["instructions"]) > 0
