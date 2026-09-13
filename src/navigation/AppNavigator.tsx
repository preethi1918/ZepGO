import React, { useState, useEffect, useCallback } from 'react';
import { useNavigationState } from '../hooks/useNavigationState';
import { useBattery } from '../hooks/useBattery';
import { useLocation } from '../hooks/useLocation';
import { useRealtimeChargers } from '../hooks/useRealtimeChargers';
import { AppHeader } from '../components/layout/AppHeader';
import { DesktopSidebar } from '../components/layout/DesktopSidebar';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { BottomSheet } from '../components/common/BottomSheet';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { ToastContainer, type ToastMessage } from '../components/common/ToastContainer';
import { MobileStatusBar } from '../components/common/MobileStatusBar';
import { SmartAlertsDrawer } from '../components/domain/SmartAlertsDrawer';
import { ChargingStationCard } from '../components/domain/ChargingStationCard';
import { AiVehicleCompatibilityCard } from '../components/domain/AiVehicleCompatibilityCard';
import { ChargingSessionModal } from '../components/domain/ChargingSessionModal';
import { QrScannerModal } from '../components/domain/QrScannerModal';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { HomeScreen } from '../screens/HomeScreen';
import { TripsScreen } from '../screens/TripsScreen';
import { MapScreen } from '../screens/MapScreen';
import { ChargingScreen } from '../screens/ChargingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { AiAssistantScreen } from '../screens/AiAssistantScreen';
import { VehicleScreen } from '../screens/VehicleScreen';
import { LiveTripScreen } from '../screens/LiveTripScreen';
import { MOCK_TRIPS } from '../data/mockTrips';
import { localStorageService } from '../services/storage/localStorage';
import type { ChargingStation } from '../types/charging';
import type { Trip } from '../types/trip';
import type { VehicleState } from '../types/vehicle';
import type { SmartAlert } from '../types/alert';
import { NavigationIcon } from '../components/common/Icons';

export const AppNavigator: React.FC = () => {
  const { navState, setActiveTab, openStationDetail, closeBottomSheet } = useNavigationState();
  const { vehicle: initialVehicle } = useBattery();
  const { currentLocation, setCurrentLocation, requestDeviceLocation } = useLocation();

  const [vehicle, setVehicle] = useState<VehicleState>(initialVehicle);

  // Mode: 'web' (Desktop Application with sidebar) or 'mobile' (Native Mobile App View)
  const [viewMode, setViewMode] = useState<'web' | 'mobile'>('web');

  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(trips[0] || null);

  // Live Navigation State
  const [isNavigatingLive, setIsNavigatingLive] = useState(false);

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleTriggerToast = useCallback(
    (title: string, description?: string, type: 'success' | 'warning' | 'info' | 'charging' = 'info') => {
      const newToast: ToastMessage = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title,
        description,
        type,
      };
      setToasts((prev) => [newToast, ...prev].slice(0, 4));
    },
    []
  );

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Charger QR Scanner & Session Simulation Modals
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [activeSessionStation, setActiveSessionStation] = useState<ChargingStation | null>(null);
  const [isChargingModalOpen, setIsChargingModalOpen] = useState(false);

  const handleStartSessionForStation = (station: ChargingStation) => {
    setActiveSessionStation(station);
    setIsChargingModalOpen(true);
    setIsQrScannerOpen(false);
    handleTriggerToast(
      '⚡ Plug Connected',
      `Initiating handshake with ${station.name} (${station.maxPowerKw} kW DC)...`,
      'charging'
    );
  };

  // Smart Alerts State
  const [alerts, setAlerts] = useState<SmartAlert[]>([
    {
      id: 'alert-1',
      type: 'warning',
      title: 'Battery SOC Safety Buffer Alert',
      message: 'Mumbai-Pune Expressway segment has elevation gain (+560m). Planned arrival SOC is 32%.',
      timestamp: '2 mins ago',
      read: false,
      actionLabel: 'View Stop-Aware Profile',
      actionType: 'view_trips',
    },
    {
      id: 'alert-2',
      type: 'info',
      title: 'Live Fast Charger Update',
      message: 'Zeon Salem 150kW Fast Charger now has 4 plugs available.',
      timestamp: '10 mins ago',
      read: false,
      actionLabel: 'View Charger',
      actionType: 'navigate_map',
    },
  ]);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);

  const handleNewAlert = useCallback((newAlert: SmartAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
  }, []);

  // Real-time EV Chargers Hook
  const { stations: chargers } = useRealtimeChargers(currentLocation, handleNewAlert);

  useEffect(() => {
    setFavoriteIds(localStorageService.getFavoriteStationIds());

    // Auto-detect screen width on mount
    if (window.innerWidth < 768) {
      setViewMode('mobile');
    }
  }, []);

  const handleAddTrip = (newTrip: Trip) => {
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTrip(newTrip);
    handleTriggerToast('🗺️ Journey Planned', `Route to ${newTrip.destinationName} created.`, 'success');
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
    if (activeTrip && activeTrip.id === updatedTrip.id) {
      setActiveTrip(updatedTrip);
    }
  };

  const handleToggleFavorite = (stationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = localStorageService.toggleFavoriteStation(stationId);
    setFavoriteIds(updated);
    handleTriggerToast('⭐ Favorites Updated', 'Saved charging station preference.', 'info');
  };

  const handleSelectStation = (station: ChargingStation) => {
    setSelectedStation(station);
    openStationDetail(station.id);
  };

  const handleSearchDestination = async (query: string) => {
    try {
      const { searchPlaces, fetchRealDrivingRoute } = await import('../services/geo/geoService');
      const results = await searchPlaces(query);
      if (results && results.length > 0) {
        const dest = results[0];
        const destLoc = { latitude: dest.lat, longitude: dest.lon };
        const route = await fetchRealDrivingRoute(currentLocation, destLoc);

        const newTrip: Trip = {
          id: `trip-real-${Date.now()}`,
          title: `Current Location → ${dest.name}`,
          originName: 'Current Location',
          originLocation: currentLocation,
          destinationName: dest.name,
          destinationLocation: destLoc,
          totalDistanceKm: route ? Math.round(route.distanceKm) : 240,
          totalDurationMinutes: route ? Math.round(route.durationMinutes) : 210,
          estimatedEnergyKwh: 38,
          startSocPercent: vehicle.currentSocPercent,
          arrivalSocPercent: 24,
          status: 'planned',
          createdAt: 'Just now',
          stops: [],
        };

        setTrips((prev) => [newTrip, ...prev]);
        setActiveTrip(newTrip);
        setActiveTab('trips');
        handleTriggerToast('📍 Destination Found', `Route calculated for ${dest.name}.`, 'success');
      }
    } catch (err) {
      console.warn('Search destination error:', err);
    }
  };

  const handleStartTrip = (trip: Trip) => {
    setActiveTrip(trip);
    setIsNavigatingLive(true);
    handleTriggerToast('🚀 Live Navigation Started', `Navigating to ${trip.destinationName}.`, 'success');
  };

  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAllAlerts = () => {
    setAlerts([]);
  };

  const handleTriggerAlertAction = (alert: SmartAlert) => {
    if (alert.actionType === 'view_trips') {
      setActiveTab('trips');
    } else if (alert.actionType === 'navigate_map') {
      setActiveTab('map');
    }
    setIsAlertDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-[Inter,sans-serif] flex flex-col justify-start relative">
      {/* Offline Status Banner */}
      <OfflineBanner />

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        stations={chargers}
        onStartSessionForStation={handleStartSessionForStation}
      />

      {/* Live Charging Session Modal */}
      <ChargingSessionModal
        isOpen={isChargingModalOpen}
        station={activeSessionStation}
        vehicle={vehicle}
        onClose={() => setIsChargingModalOpen(false)}
        onFinishSession={(addedSoc, cost, kwh) => {
          setVehicle((prev) => ({
            ...prev,
            currentSocPercent: Math.min(100, prev.currentSocPercent + addedSoc),
          }));
          handleTriggerToast('⚡ Session Summary', `Added ${kwh} kWh (+${addedSoc}%) for ₹${cost}.`, 'success');
        }}
      />

      {/* Smart Alerts Drawer */}
      <SmartAlertsDrawer
        alerts={alerts}
        isOpen={isAlertDrawerOpen}
        onClose={() => setIsAlertDrawerOpen(false)}
        onDismiss={handleDismissAlert}
        onClearAll={handleClearAllAlerts}
        onTriggerAction={handleTriggerAlertAction}
      />

      {/* ---------------------------------------------------
          DESKTOP WEB APPLICATION VIEW (With Compact Sidebar)
         --------------------------------------------------- */}
      {viewMode === 'web' ? (
        <div className="flex min-h-screen bg-slate-50">
          {/* Compact Desktop Left Sidebar */}
          <DesktopSidebar
            activeTab={navState.currentTab}
            onTabChange={setActiveTab}
            vehicle={vehicle}
            onToggleViewMode={() => setViewMode('mobile')}
            unreadCount={alerts.length}
            onNotificationsClick={() => setIsAlertDrawerOpen(true)}
          />

          {/* Web Main Body Content Area */}
          <main className="flex-1 overflow-y-auto">
            {isNavigatingLive && activeTrip ? (
              <LiveTripScreen
                trip={activeTrip}
                currentLocation={currentLocation}
                onEndTrip={() => setIsNavigatingLive(false)}
              />
            ) : (
              <div className="p-4 lg:p-6 w-full max-w-[1600px] mx-auto">
                {navState.currentTab === 'home' && (
                  <HomeScreen
                    vehicle={vehicle}
                    nearbyChargers={chargers}
                    featuredTrip={trips[0]}
                    onNavigateToMap={() => setActiveTab('map')}
                    onNavigateToTrips={() => setActiveTab('trips')}
                    onNavigateToChargers={() => setActiveTab('charging')}
                    onNavigateToAi={() => setActiveTab('ai')}
                    onNavigateToActivity={() => setActiveTab('activity')}
                    onSelectStation={handleSelectStation}
                    onStartTrip={handleStartTrip}
                    onSearchDestination={handleSearchDestination}
                    onUpdateVehicle={setVehicle}
                    onOpenQrScanner={() => setIsQrScannerOpen(true)}
                    onTriggerToast={handleTriggerToast}
                  />
                )}

                {navState.currentTab === 'trips' && (
                  <TripsScreen
                    trips={trips}
                    onStartTrip={handleStartTrip}
                    onSelectStation={(stId) => {
                      const found = chargers.find((c) => c.id === stId);
                      if (found) handleSelectStation(found);
                    }}
                    availableStations={chargers}
                    vehicleSocPercent={vehicle.currentSocPercent}
                    onAddTrip={handleAddTrip}
                    onUpdateTrip={handleUpdateTrip}
                    batteryCapacityKwh={vehicle.batteryCapacityKwh}
                    vehicle={vehicle}
                  />
                )}

                {navState.currentTab === 'map' && (
                  <div className="h-[calc(100vh-100px)] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
                    <MapScreen
                      currentLocation={currentLocation}
                      stations={chargers}
                      selectedStationId={navState.selectedStationId}
                      activeTrip={activeTrip}
                      onSelectStation={handleSelectStation}
                      onSelectLocation={setCurrentLocation}
                      onRequestGps={requestDeviceLocation}
                    />
                  </div>
                )}

                {navState.currentTab === 'charging' && (
                  <ChargingScreen
                    stations={chargers}
                    favoriteIds={favoriteIds}
                    onSelectStation={handleSelectStation}
                    onToggleFavorite={handleToggleFavorite}
                    vehicle={vehicle}
                    onOpenQrScanner={() => setIsQrScannerOpen(true)}
                    onStartSessionForStation={handleStartSessionForStation}
                  />
                )}

                {navState.currentTab === 'ai' && (
                  <AiAssistantScreen
                    vehicle={vehicle}
                    onNavigateToTrips={() => setActiveTab('trips')}
                    onNavigateToChargers={() => setActiveTab('charging')}
                  />
                )}

                {navState.currentTab === 'activity' && <ActivityScreen />}

                {navState.currentTab === 'vehicle' && (
                  <VehicleScreen vehicle={vehicle} onUpdateVehicle={setVehicle} />
                )}

                {navState.currentTab === 'profile' && (
                  <ProfileScreen vehicle={vehicle} onUpdateVehicle={setVehicle} />
                )}
              </div>
            )}
          </main>

          {/* Station Details Bottom Sheet */}
          <BottomSheet
            isOpen={navState.bottomSheetOpen}
            onClose={closeBottomSheet}
            title={selectedStation?.name || 'Station Details'}
            subtitle={selectedStation?.operator}
          >
            {selectedStation && (
              <div className="space-y-4 font-[Inter,sans-serif]">
                <AiVehicleCompatibilityCard vehicle={vehicle} station={selectedStation} />
                <ChargingStationCard
                  station={selectedStation}
                  vehicle={vehicle}
                  isFavorite={favoriteIds.includes(selectedStation.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
                <div className="flex items-center gap-2 pt-2">
                  <PrimaryButton
                    label="Navigate to Charger"
                    icon={<NavigationIcon size={18} />}
                    onClick={() => {
                      closeBottomSheet();
                      setActiveTab('map');
                    }}
                  />
                  <button
                    onClick={() => {
                      closeBottomSheet();
                      handleStartSessionForStation(selectedStation);
                    }}
                    className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
                  >
                    ⚡ Start Charge
                  </button>
                </div>
              </div>
            )}
          </BottomSheet>
        </div>
      ) : (
        /* ---------------------------------------------------
            NATIVE MOBILE APP VIEW (Mobile Frame)
           --------------------------------------------------- */
        <div className="w-full flex flex-col items-center">
          {/* View Switcher Header Banner */}
          <div className="hidden sm:flex items-center justify-between w-full max-w-md px-4 py-2">
            <span className="text-xs font-semibold text-slate-500">ZepGO Mobile App View</span>
            <button
              onClick={() => setViewMode('web')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
            >
              Switch to Web Desktop View 💻
            </button>
          </div>

          <div className="relative w-full max-w-md h-screen sm:h-[880px] bg-slate-50 flex flex-col overflow-hidden sm:rounded-[40px] sm:border-[8px] sm:border-slate-800 shadow-2xl">
            {/* Real App Mobile Phone Status Bar */}
            <MobileStatusBar batterySoc={vehicle.currentSocPercent} />

            {/* Top Header */}
            <AppHeader
              vehicle={vehicle}
              unreadCount={alerts.length}
              onNotificationsClick={() => setIsAlertDrawerOpen(true)}
              title="ZepGO"
            />

            {/* Screen Body */}
            <main className="flex-1 overflow-y-auto relative">
              {isNavigatingLive && activeTrip ? (
                <LiveTripScreen
                  trip={activeTrip}
                  currentLocation={currentLocation}
                  availableStations={chargers}
                  onEndTrip={() => setIsNavigatingLive(false)}
                />
              ) : (
                <>
                  {navState.currentTab === 'home' && (
                    <HomeScreen
                      vehicle={vehicle}
                      nearbyChargers={chargers}
                      featuredTrip={trips[0]}
                      isMobileView={true}
                      onNavigateToMap={() => setActiveTab('map')}
                      onNavigateToTrips={() => setActiveTab('trips')}
                      onNavigateToChargers={() => setActiveTab('charging')}
                      onNavigateToAi={() => setActiveTab('ai')}
                      onNavigateToActivity={() => setActiveTab('activity')}
                      onSelectStation={handleSelectStation}
                      onStartTrip={handleStartTrip}
                      onUpdateVehicle={setVehicle}
                      onOpenQrScanner={() => setIsQrScannerOpen(true)}
                      onTriggerToast={handleTriggerToast}
                    />
                  )}

                  {navState.currentTab === 'trips' && (
                    <TripsScreen
                      trips={trips}
                      onStartTrip={handleStartTrip}
                      isMobileView={true}
                      onSelectStation={(stId) => {
                        const found = chargers.find((c) => c.id === stId);
                        if (found) handleSelectStation(found);
                      }}
                      availableStations={chargers}
                      vehicleSocPercent={vehicle.currentSocPercent}
                      onAddTrip={handleAddTrip}
                      onUpdateTrip={handleUpdateTrip}
                      batteryCapacityKwh={vehicle.batteryCapacityKwh}
                      vehicle={vehicle}
                    />
                  )}

                  {navState.currentTab === 'map' && (
                    <MapScreen
                      currentLocation={currentLocation}
                      stations={chargers}
                      selectedStationId={navState.selectedStationId}
                      activeTrip={activeTrip}
                      onSelectStation={handleSelectStation}
                      onSelectLocation={setCurrentLocation}
                      onRequestGps={requestDeviceLocation}
                    />
                  )}

                  {navState.currentTab === 'charging' && (
                    <ChargingScreen
                      stations={chargers}
                      favoriteIds={favoriteIds}
                      isMobileView={true}
                      onSelectStation={handleSelectStation}
                      onToggleFavorite={handleToggleFavorite}
                      vehicle={vehicle}
                      onOpenQrScanner={() => setIsQrScannerOpen(true)}
                      onStartSessionForStation={handleStartSessionForStation}
                    />
                  )}

                  {navState.currentTab === 'ai' && (
                    <AiAssistantScreen
                      vehicle={vehicle}
                      onNavigateToTrips={() => setActiveTab('trips')}
                      onNavigateToChargers={() => setActiveTab('charging')}
                    />
                  )}

                  {navState.currentTab === 'activity' && <ActivityScreen />}

                  {navState.currentTab === 'vehicle' && (
                    <VehicleScreen vehicle={vehicle} onUpdateVehicle={setVehicle} />
                  )}

                  {navState.currentTab === 'profile' && (
                    <ProfileScreen vehicle={vehicle} onUpdateVehicle={setVehicle} />
                  )}
                </>
              )}
            </main>

            {/* Bottom Station Details Sheet */}
            <BottomSheet
              isOpen={navState.bottomSheetOpen}
              onClose={closeBottomSheet}
              title={selectedStation?.name || 'Station Details'}
              subtitle={selectedStation?.operator}
            >
              {selectedStation && (
                <div className="space-y-4 font-[Inter,sans-serif]">
                  <AiVehicleCompatibilityCard vehicle={vehicle} station={selectedStation} />
                  <ChargingStationCard
                    station={selectedStation}
                    vehicle={vehicle}
                    isFavorite={favoriteIds.includes(selectedStation.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                  <div className="flex items-center gap-2 pt-2">
                    <PrimaryButton
                      label="Navigate to Charger"
                      icon={<NavigationIcon size={18} />}
                      onClick={() => {
                        closeBottomSheet();
                        setActiveTab('map');
                      }}
                    />
                    <button
                      onClick={() => {
                        closeBottomSheet();
                        handleStartSessionForStation(selectedStation);
                      }}
                      className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
                    >
                      ⚡ Start Charge
                    </button>
                  </div>
                </div>
              )}
            </BottomSheet>

            {/* Bottom Navigation */}
            <BottomNavigation activeTab={navState.currentTab} onTabChange={setActiveTab} />
          </div>
        </div>
      )}
    </div>
  );
};

