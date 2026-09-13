import { useState, useEffect } from 'react';
import type { GeoLocation } from '../types/charging';
import { MAP_CONFIG } from '../services/map/mapConfig';
import { getCurrentGpsLocation, reverseGeocode } from '../services/geo/geoService';

export function useLocation() {
  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(MAP_CONFIG.defaultCenter);
  const [locationAddress, setLocationAddress] = useState<string>('Detecting live GPS location...');
  const [isLocating, setIsLocating] = useState(false);
  const [hasRealGps, setHasRealGps] = useState(false);

  useEffect(() => {
    // Initial GPS Request
    requestDeviceLocation();

    // Setup continuous GPS position watcher
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(coords);
          setHasRealGps(true);
        },
        (err) => {
          console.warn('GPS position watch warning:', err.message);
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Update reverse geocoded address when location changes
  useEffect(() => {
    let isMounted = true;
    reverseGeocode(currentLocation.latitude, currentLocation.longitude).then((addr) => {
      if (isMounted) setLocationAddress(addr);
    });
    return () => {
      isMounted = false;
    };
  }, [currentLocation.latitude, currentLocation.longitude]);

  const requestDeviceLocation = async () => {
    setIsLocating(true);
    try {
      const loc = await getCurrentGpsLocation();
      setCurrentLocation(loc);
      setHasRealGps(true);
    } catch (err) {
      console.warn('GPS location request fallback:', err);
    } finally {
      setIsLocating(false);
    }
  };

  return {
    currentLocation,
    setCurrentLocation,
    locationAddress,
    requestDeviceLocation,
    isLocating,
    hasRealGps,
  };
}
