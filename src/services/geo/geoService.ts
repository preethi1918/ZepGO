import type { GeoLocation } from '../../types/charging';

export interface LocationSearchResult {
  display_name: string;
  lat: number;
  lon: number;
  name: string;
}

export interface RealRouteResult {
  coordinates: [number, number][]; // [lat, lng] array
  distanceKm: number;
  durationMinutes: number;
}

/**
 * Get device current GPS location via HTML5 Geolocation API
 */
export function getCurrentGpsLocation(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation not supported by device browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );
  });
}

/**
 * Reverse geocode latitude/longitude to a real street address using OpenStreetMap Nominatim
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      { headers: { 'User-Agent': 'ZepGO-EV-Navigation/1.0' } }
    );
    if (!res.ok) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    const data = await res.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (err) {
    console.warn('Reverse geocoding offline:', err);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

/**
 * Search real locations / addresses using OpenStreetMap Nominatim API
 */
export async function searchPlaces(query: string): Promise<LocationSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&countrycodes=in&limit=5`,
      { headers: { 'User-Agent': 'ZepGO-EV-Navigation/1.0' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item: any) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      name: item.name || item.display_name.split(',')[0],
    }));
  } catch (err) {
    console.warn('Place search offline:', err);
    return [];
  }
}

/**
 * Fetch real driving route & turn-by-turn geometry using OSRM Routing Engine
 */
export async function fetchRealDrivingRoute(
  start: GeoLocation,
  end: GeoLocation
): Promise<RealRouteResult | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.routes || data.routes.length === 0) return null;

    const route = data.routes[0];
    // OSRM returns GeoJSON coordinates as [lon, lat], convert to Leaflet [lat, lon]
    const coordinates: [number, number][] = route.geometry.coordinates.map(
      (pt: [number, number]) => [pt[1], pt[0]] as [number, number]
    );

    return {
      coordinates,
      distanceKm: route.distance / 1000,
      durationMinutes: route.duration / 60,
    };
  } catch (err) {
    console.warn('Real OSRM routing offline:', err);
    return null;
  }
}
