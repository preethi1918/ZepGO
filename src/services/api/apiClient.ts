import type { ChargingStation } from '../../types/charging';
import type { Trip } from '../../types/trip';
import type { VehicleState } from '../../types/vehicle';
import { MOCK_CHARGERS } from '../../data/mockChargers';
import { MOCK_TRIPS } from '../../data/mockTrips';
import { MOCK_VEHICLE } from '../../data/mockVehicle';

export interface ApiClient {
  fetchNearbyChargers(): Promise<ChargingStation[]>;
  fetchChargerById(id: string): Promise<ChargingStation | null>;
  fetchTrips(): Promise<Trip[]>;
  fetchVehicleState(): Promise<VehicleState>;
}

class MockApiClient implements ApiClient {
  async fetchNearbyChargers(): Promise<ChargingStation[]> {
    // Simulate short network delay
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_CHARGERS;
  }

  async fetchChargerById(id: string): Promise<ChargingStation | null> {
    await new Promise((res) => setTimeout(res, 150));
    return MOCK_CHARGERS.find((c) => c.id === id) || null;
  }

  async fetchTrips(): Promise<Trip[]> {
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_TRIPS;
  }

  async fetchVehicleState(): Promise<VehicleState> {
    await new Promise((res) => setTimeout(res, 100));
    return MOCK_VEHICLE;
  }
}

export const apiClient: ApiClient = new MockApiClient();
