/**
 * Map provider configuration isolated for simple switching between providers
 * (e.g. OpenStreetMap, Mapbox, Google Maps API, CartoDB, etc.)
 */

export interface MapTileProvider {
  name: string;
  urlTemplate: string;
  attribution: string;
  maxZoom: number;
}

export const MAP_CONFIG = {
  // Default map center: Mumbai-Pune Expressway Corridor (Lonavala EV Hub)
  defaultCenter: {
    latitude: 18.7557,
    longitude: 73.4091,
  },
  defaultZoom: 10,
  minZoom: 4,
  maxZoom: 19,
  
  // Isolated Tile Provider Config
  providers: {
    openStreetMap: {
      name: 'OpenStreetMap Light',
      urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    },
    cartoLight: {
      name: 'CartoDB Positron (Clean Light)',
      urlTemplate: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    },
  } as Record<string, MapTileProvider>,

  activeProviderKey: 'cartoLight',

  // Placeholder for future Mapbox / Google Maps API keys
  apiKeys: {
    mapbox: import.meta.env.VITE_MAPBOX_TOKEN || '',
    googleMaps: import.meta.env.VITE_GOOGLE_MAPS_KEY || '',
  },
};

export function getActiveTileProvider(): MapTileProvider {
  return MAP_CONFIG.providers[MAP_CONFIG.activeProviderKey] || MAP_CONFIG.providers.openStreetMap;
}
