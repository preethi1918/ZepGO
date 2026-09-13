const STORAGE_KEYS = {
  FAVORITE_STATIONS: 'zepgo_favorite_stations',
  RECENT_TRIPS: 'zepgo_recent_trips',
  ACTIVE_TRIP: 'zepgo_active_trip',
  VEHICLE_SETTINGS: 'zepgo_vehicle_settings',
};

export const localStorageService = {
  getFavoriteStationIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITE_STATIONS);
      return data ? JSON.parse(data) : ['cs-1', 'cs-3'];
    } catch {
      return ['cs-1', 'cs-3'];
    }
  },

  saveFavoriteStationIds(ids: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITE_STATIONS, JSON.stringify(ids));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  },

  toggleFavoriteStation(id: string): string[] {
    const favorites = this.getFavoriteStationIds();
    const index = favorites.indexOf(id);
    let updated: string[];
    if (index >= 0) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    this.saveFavoriteStationIds(updated);
    return updated;
  },
};
