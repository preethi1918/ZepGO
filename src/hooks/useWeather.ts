import { useState, useEffect, useCallback } from 'react';
import type { GeoLocation } from '../types/charging';
import { fetchRealtimeWeather, type RealtimeWeatherData } from '../services/api/weatherService';

export function useWeather(location: GeoLocation) {
  const [weather, setWeather] = useState<RealtimeWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const refreshWeather = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchRealtimeWeather(location);
    setWeather(data);
    setIsLoading(false);
    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [location.latitude, location.longitude]);

  useEffect(() => {
    refreshWeather();

    // Auto-refresh weather every 5 minutes
    const interval = setInterval(() => {
      refreshWeather();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshWeather]);

  return {
    weather,
    isLoading,
    lastUpdated,
    refreshWeather,
  };
}
