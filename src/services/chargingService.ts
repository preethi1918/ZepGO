import { apiRequest } from './api';
import { MOCK_CHARGERS } from '../data/mockChargers';

export interface NearbyFacility {
  id: string;
  name: string;
  category: 'cafe' | 'restaurant' | 'restroom' | 'store' | 'parking';
  distance_m: number;
  rating: number;
  is_open: boolean;
  timings?: string;
  speciality?: string;
  avg_spend_inr?: number;
}

export class ChargingService {
  static async getStations() {
    const res = await apiRequest<any[]>('/api/charging-stations');
    if (res.isLive && res.data) return res.data;
    return MOCK_CHARGERS;
  }

  static async getNearbyFacilities(stationId: string): Promise<NearbyFacility[]> {
    const res = await apiRequest<NearbyFacility[]>(`/api/facilities/nearby?station_id=${stationId}`);
    if (res.isLive && res.data) return res.data;

    return [
      {
        id: 'f-1',
        name: 'Saravana Bhavan Pure Veg',
        category: 'restaurant',
        distance_m: 80,
        rating: 4.6,
        is_open: true,
        timings: '06:30 AM - 11:00 PM',
        speciality: 'South Indian Filter Coffee, Ghee Roast Dosa',
        avg_spend_inr: 180
      },
      {
        id: 'f-2',
        name: 'Highway Sanitized Restrooms',
        category: 'restroom',
        distance_m: 40,
        rating: 4.7,
        is_open: true,
        timings: '24 Hours',
        speciality: 'Wheelchair Accessible, Baby Care Station',
        avg_spend_inr: 0
      },
      {
        id: 'f-3',
        name: 'Cafe Coffee Day Express',
        category: 'cafe',
        distance_m: 120,
        rating: 4.3,
        is_open: true,
        timings: '24 Hours',
        speciality: 'Cold Brew, Cappuccino, Sandwiches',
        avg_spend_inr: 220
      },
      {
        id: 'f-4',
        name: '24/7 Highway Convenience Store',
        category: 'store',
        distance_m: 90,
        rating: 4.5,
        is_open: true,
        timings: '24 Hours',
        speciality: 'Beverages, travel snacks, emergency cables',
        avg_spend_inr: 150
      }
    ];
  }
}
