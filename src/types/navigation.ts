export type ActiveTab = 'home' | 'trips' | 'map' | 'charging' | 'activity' | 'ai' | 'vehicle' | 'profile';

export interface NavigationState {
  currentTab: ActiveTab;
  selectedStationId: string | null;
  selectedTripId: string | null;
  isNavigating: boolean;
  bottomSheetOpen: boolean;
  bottomSheetView: 'station_detail' | 'trip_detail' | 'filter' | null;
}
