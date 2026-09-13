import React, { useEffect, useState, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { ChargingStation, GeoLocation } from '../../types/charging';
import type { Trip } from '../../types/trip';
import { getActiveTileProvider, MAP_CONFIG } from '../../services/map/mapConfig';
import { fetchRealDrivingRoute } from '../../services/geo/geoService';
import { MapControls } from './MapControls';

export interface MapContainerProps {
  center?: GeoLocation;
  zoom?: number;
  stations?: ChargingStation[];
  selectedStationId?: string | null;
  activeTrip?: Trip | null;
  onSelectStation?: (station: ChargingStation) => void;
  className?: string;
}

// Controller component to smoothly fit map bounds to trip route points or recenter
const MapBoundsController: React.FC<{
  points: [number, number][];
  center?: GeoLocation;
  zoom?: number;
}> = ({ points, center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (points && points.length >= 2) {
      try {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 14,
          animate: true,
          duration: 1.2,
        });
      } catch (err) {
        console.warn('Map fitBounds error:', err);
      }
    } else if (center) {
      map.flyTo([center.latitude, center.longitude], zoom || map.getZoom() || 10, {
        duration: 1.2,
      });
    }
  }, [points, center, zoom, map]);

  return null;
};

// Create custom HTML Leaflet Marker icons using L.divIcon
function createStationDivIcon(station: ChargingStation, isSelected: boolean): L.DivIcon {
  const isAvailable = station.status === 'available' && station.availablePlugs > 0;
  const statusBg = isAvailable ? 'bg-emerald-500' : 'bg-amber-500';
  const borderStyle = isSelected ? 'ring-4 ring-blue-500 scale-110 z-30' : 'hover:scale-105';

  const html = `
    <div class="relative flex items-center justify-center transition-transform duration-200 ${borderStyle}">
      <div class="flex items-center gap-1 bg-white text-slate-900 px-2 py-1 rounded-full shadow-lg border border-slate-200 font-bold text-[11px]">
        <span class="w-2 h-2 rounded-full ${statusBg}"></span>
        <span>${station.maxPowerKw}kW</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-station-marker',
    iconSize: [60, 30],
    iconAnchor: [30, 15],
  });
}

function createWaypointDivIcon(label: string, type: 'origin' | 'destination' | 'stop'): L.DivIcon {
  const bgClass =
    type === 'origin'
      ? 'bg-emerald-600 border-emerald-400 text-white'
      : type === 'destination'
      ? 'bg-indigo-600 border-indigo-400 text-white'
      : 'bg-amber-500 border-amber-300 text-slate-950';

  const iconEmoji = type === 'origin' ? '🚀' : type === 'destination' ? '🏁' : '⚡';

  const html = `
    <div class="relative flex items-center justify-center">
      <div class="flex items-center gap-1 ${bgClass} px-2.5 py-1 rounded-full shadow-xl border-2 font-black text-[11px] uppercase tracking-wider shrink-0">
        <span>${iconEmoji}</span>
        <span class="line-clamp-1">${label}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-waypoint-marker',
    iconSize: [120, 32],
    iconAnchor: [60, 16],
  });
}

function createUserDivIcon(): L.DivIcon {
  const html = `
    <div class="relative flex items-center justify-center">
      <div class="w-7 h-7 rounded-full bg-blue-600 border-3 border-white shadow-xl flex items-center justify-center animate-pulse">
        <div class="w-2.5 h-2.5 rounded-full bg-white"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-user-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export const MapContainerComponent: React.FC<MapContainerProps> = ({
  center = MAP_CONFIG.defaultCenter,
  zoom = MAP_CONFIG.defaultZoom,
  stations = [],
  selectedStationId,
  activeTrip,
  onSelectStation,
  className = 'w-full h-full',
}) => {
  const activeTileProvider = getActiveTileProvider();
  const mapRef = useRef<L.Map | null>(null);

  const [realRoadGeometry, setRealRoadGeometry] = useState<[number, number][]>([]);

  // Fetch real OpenStreetMap OSRM driving geometry whenever activeTrip changes
  useEffect(() => {
    if (!activeTrip) {
      setRealRoadGeometry([]);
      return;
    }

    let isMounted = true;
    fetchRealDrivingRoute(activeTrip.originLocation, activeTrip.destinationLocation).then((res) => {
      if (isMounted && res && res.coordinates.length > 0) {
        setRealRoadGeometry(res.coordinates);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [
    activeTrip?.originLocation?.latitude,
    activeTrip?.originLocation?.longitude,
    activeTrip?.destinationLocation?.latitude,
    activeTrip?.destinationLocation?.longitude,
  ]);

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  const handleRecenter = () => {
    if (mapRef.current) {
      if (allRoutePoints.length >= 2) {
        mapRef.current.fitBounds(L.latLngBounds(allRoutePoints), { padding: [50, 50] });
      } else {
        mapRef.current.flyTo([center.latitude, center.longitude], MAP_CONFIG.defaultZoom);
      }
    }
  };

  // Basic waypoints array [Origin -> Stops -> Destination]
  const basicWaypoints: [number, number][] = activeTrip
    ? [
        [activeTrip.originLocation.latitude, activeTrip.originLocation.longitude],
        ...activeTrip.stops.map((stop) => [stop.location.latitude, stop.location.longitude] as [number, number]),
        [activeTrip.destinationLocation.latitude, activeTrip.destinationLocation.longitude],
      ]
    : [];

  // Combine OSRM road geometry with basic waypoints for map bounds fitting
  const allRoutePoints: [number, number][] = realRoadGeometry.length > 0 ? realRoadGeometry : basicWaypoints;

  // Effective map center: Origin of active trip if set, otherwise passed center
  const effectiveCenter = activeTrip ? activeTrip.originLocation : center;

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {/* Floating Map Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRecenter={handleRecenter}
      />

      <LeafletMap
        center={[effectiveCenter.latitude, effectiveCenter.longitude]}
        zoom={zoom}
        zoomControl={false}
        className="w-full h-full z-0"
        ref={(ref) => {
          if (ref) mapRef.current = ref;
        }}
      >
        {/* Dynamic Map Bounds Controller */}
        <MapBoundsController points={allRoutePoints} center={effectiveCenter} zoom={zoom} />

        {/* Real Tile Provider Layer (OpenStreetMap / CartoDB) */}
        <TileLayer
          url={activeTileProvider.urlTemplate}
          attribution={activeTileProvider.attribution}
          maxZoom={activeTileProvider.maxZoom}
        />

        {/* Vehicle Location Marker */}
        <Marker position={[center.latitude, center.longitude]} icon={createUserDivIcon()}>
          <Popup className="custom-popup">
            <div className="p-1 font-sans text-xs">
              <p className="font-bold text-slate-900">Your Vehicle</p>
              <p className="text-[10px] text-slate-500">Current Position</p>
            </div>
          </Popup>
        </Marker>

        {/* Real Driving Route Geometry Polyline */}
        {allRoutePoints.length > 1 && (
          <>
            {/* Outer polyline shadow glow */}
            <Polyline
              positions={allRoutePoints}
              pathOptions={{
                color: '#1E40AF',
                weight: 8,
                opacity: 0.4,
              }}
            />
            {/* Inner primary route line */}
            <Polyline
              positions={allRoutePoints}
              pathOptions={{
                color: '#2563EB',
                weight: 5,
                opacity: 0.95,
              }}
            />
          </>
        )}

        {/* Active Trip Origin Marker */}
        {activeTrip && (
          <Marker
            position={[activeTrip.originLocation.latitude, activeTrip.originLocation.longitude]}
            icon={createWaypointDivIcon(activeTrip.originName || 'Start', 'origin')}
          >
            <Popup className="custom-popup">
              <div className="p-1 font-sans text-xs">
                <p className="font-black text-emerald-700">Origin Location</p>
                <p className="text-[11px] font-bold text-slate-900">{activeTrip.originName}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Active Trip Destination Marker */}
        {activeTrip && (
          <Marker
            position={[activeTrip.destinationLocation.latitude, activeTrip.destinationLocation.longitude]}
            icon={createWaypointDivIcon(activeTrip.destinationName || 'Destination', 'destination')}
          >
            <Popup className="custom-popup">
              <div className="p-1 font-sans text-xs">
                <p className="font-black text-indigo-700">Destination</p>
                <p className="text-[11px] font-bold text-slate-900">{activeTrip.destinationName}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Active Trip Configured Stops Markers */}
        {activeTrip &&
          activeTrip.stops.map((stop, idx) => (
            <Marker
              key={stop.id || idx}
              position={[stop.location.latitude, stop.location.longitude]}
              icon={createWaypointDivIcon(stop.stationName, 'stop')}
            >
              <Popup className="custom-popup">
                <div className="p-1 font-sans text-xs">
                  <p className="font-black text-amber-600">Charging Stop #{idx + 1}</p>
                  <p className="font-bold text-slate-900">{stop.stationName}</p>
                  <p className="text-[10px] text-slate-500">{stop.durationMinutes} min charge • {stop.chargingPowerKw} kW DC</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Charging Stations Markers */}
        {stations.map((station) => {
          const isSelected = station.id === selectedStationId;

          return (
            <Marker
              key={station.id}
              position={[station.location.latitude, station.location.longitude]}
              icon={createStationDivIcon(station, isSelected)}
              eventHandlers={{
                click: () => onSelectStation && onSelectStation(station),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1 font-sans">
                  <h4 className="text-xs font-bold text-slate-900">{station.name}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">{station.operator} • {station.maxPowerKw} kW</p>
                  <p className="text-[10px] font-semibold text-emerald-600 mt-1">
                    {station.availablePlugs}/{station.totalPlugs} Plugs Available
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </LeafletMap>
    </div>
  );
};
