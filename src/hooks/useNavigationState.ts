import { useState } from 'react';
import type { ActiveTab, NavigationState } from '../types/navigation';

export function useNavigationState() {
  const [navState, setNavState] = useState<NavigationState>({
    currentTab: 'home',
    selectedStationId: null,
    selectedTripId: null,
    isNavigating: false,
    bottomSheetOpen: false,
    bottomSheetView: null,
  });

  const setActiveTab = (tab: ActiveTab) => {
    setNavState((prev) => ({
      ...prev,
      currentTab: tab,
      bottomSheetOpen: false,
    }));
  };

  const openStationDetail = (stationId: string) => {
    setNavState((prev) => ({
      ...prev,
      selectedStationId: stationId,
      bottomSheetOpen: true,
      bottomSheetView: 'station_detail',
    }));
  };

  const openTripDetail = (tripId: string) => {
    setNavState((prev) => ({
      ...prev,
      selectedTripId: tripId,
      bottomSheetOpen: true,
      bottomSheetView: 'trip_detail',
    }));
  };

  const closeBottomSheet = () => {
    setNavState((prev) => ({
      ...prev,
      bottomSheetOpen: false,
      bottomSheetView: null,
    }));
  };

  return {
    navState,
    setActiveTab,
    openStationDetail,
    openTripDetail,
    closeBottomSheet,
    setNavState,
  };
}
