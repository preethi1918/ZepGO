import { useState, useEffect, useCallback } from 'react';
import type { ChargingStation, GeoLocation } from '../types/charging';
import { fetchRealNearbyChargers } from '../services/api/realChargersService';
import type { SmartAlert } from '../types/alert';

export function useRealtimeChargers(location: GeoLocation, onNewAlert?: (alert: SmartAlert) => void) {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  const loadRealChargers = useCallback(async () => {
    setIsLoading(true);
    setIsLiveSyncing(true);
    try {
      const data = await fetchRealNearbyChargers(location, 50);
      setStations(data);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn('Realtime charger sync error:', err);
    } finally {
      setIsLoading(false);
      setIsLiveSyncing(false);
    }
  }, [location.latitude, location.longitude]);

  // Initial load & when location updates
  useEffect(() => {
    loadRealChargers();
  }, [loadRealChargers]);

  // Real-time live status updates ticker (Simulates live socket feeds for plug occupancy)
  useEffect(() => {
    const interval = setInterval(() => {
      setStations((prevStations) => {
        if (prevStations.length === 0) return prevStations;

        // Pick a random station to update plug state
        const targetIndex = Math.floor(Math.random() * prevStations.length);
        const targetStation = prevStations[targetIndex];

        // Randomly adjust plug availability between 1 and totalPlugs
        const oldAvailable = targetStation.availablePlugs;
        const delta = Math.random() > 0.5 ? 1 : -1;
        const newAvailable = Math.max(1, Math.min(targetStation.totalPlugs, oldAvailable + delta));

        if (oldAvailable !== newAvailable) {
          // Trigger a live alert notification if a plug freed up
          if (newAvailable > oldAvailable && onNewAlert) {
            onNewAlert({
              id: `alert-realtime-${Date.now()}`,
              type: 'info',
              title: '⚡ Live Plug Available!',
              message: `${targetStation.name} now has ${newAvailable}/${targetStation.totalPlugs} fast charging plugs available!`,
              timestamp: 'Just now',
              read: false,
              actionLabel: 'View Station',
              actionType: 'navigate_map',
            });
          }

          const updatedList = [...prevStations];
          updatedList[targetIndex] = {
            ...targetStation,
            availablePlugs: newAvailable,
            status: newAvailable > 0 ? 'available' : 'busy',
          };
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          return updatedList;
        }

        return prevStations;
      });
    }, 15000); // Live update every 15 seconds

    return () => clearInterval(interval);
  }, [onNewAlert]);

  // Manually trigger a socket status change for testing
  const triggerManualPlugChange = useCallback(() => {
    setStations((prevStations) => {
      if (prevStations.length === 0) return prevStations;
      const targetIndex = Math.floor(Math.random() * prevStations.length);
      const target = prevStations[targetIndex];
      const newAvailable = target.availablePlugs >= target.totalPlugs ? 1 : target.availablePlugs + 1;

      if (onNewAlert) {
        onNewAlert({
          id: `alert-manual-${Date.now()}`,
          type: 'info',
          title: '⚡ Live Socket Simulation',
          message: `${target.name} plug #${newAvailable} state updated to AVAILABLE.`,
          timestamp: 'Just now',
          read: false,
          actionLabel: 'View Station',
          actionType: 'navigate_map',
        });
      }

      const updated = [...prevStations];
      updated[targetIndex] = {
        ...target,
        availablePlugs: newAvailable,
        status: 'available',
      };
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      return updated;
    });
  }, [onNewAlert]);

  return {
    stations,
    setStations,
    isLoading,
    isLiveSyncing,
    lastSyncTime,
    loadRealChargers,
    triggerManualPlugChange,
  };
}
