import { apiRequest } from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  active_vehicle_id: string;
  preferences: {
    route_preference: string;
    charging_preference: string;
    safety_reserve_percent: number;
    preferred_networks: string[];
    ac_usage_level: string;
    payload_passengers: number;
  };
}

const STORAGE_KEY = 'zepgo_active_user';

export const DEFAULT_USER: UserProfile = {
  id: 'usr-preethi',
  name: 'Preethi',
  email: 'preethi@zepgo.in',
  phone: '+91 98401 23456',
  role: 'driver',
  active_vehicle_id: 'v-nexon-ev-max',
  preferences: {
    route_preference: 'fastest',
    charging_preference: 'fast_charging',
    safety_reserve_percent: 18,
    preferred_networks: ['Zeon Charging', 'Tata Power', 'Relux', 'ChargeZone'],
    ac_usage_level: 'medium',
    payload_passengers: 2
  }
};

export class AuthService {
  static getCurrentUser(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return DEFAULT_USER;
  }

  static saveUser(user: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      // ignore
    }
  }

  static async login(email: string, password?: string): Promise<{ success: boolean; user: UserProfile; isLive: boolean }> {
    const res = await apiRequest<{ status: string; user: UserProfile }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: password || 'password' })
    });

    if (res.isLive && res.data?.user) {
      AuthService.saveUser(res.data.user);
      return { success: true, user: res.data.user, isLive: true };
    }

    // Offline mock login
    const user = { ...DEFAULT_USER, email, name: email.split('@')[0].toUpperCase() || 'Preethi' };
    AuthService.saveUser(user);
    return { success: true, user, isLive: false };
  }

  static async register(name: string, email: string): Promise<{ success: boolean; user: UserProfile; isLive: boolean }> {
    const res = await apiRequest<{ status: string; user: UserProfile }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password: 'password123' })
    });

    if (res.isLive && res.data?.user) {
      AuthService.saveUser(res.data.user);
      return { success: true, user: res.data.user, isLive: true };
    }

    const user: UserProfile = { ...DEFAULT_USER, name, email, id: `usr-${Date.now()}` };
    AuthService.saveUser(user);
    return { success: true, user, isLive: false };
  }

  static logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }
}
