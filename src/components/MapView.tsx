import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Info } from 'lucide-react';

interface MapViewProps {
  routePoints?: [number, number][];
  stations?: any[];
  recommendedStationId?: string;
  onSelectStation?: (station: any) => void;
  onOpenWhyThisCharger?: (station: any) => void;
  height?: string;
}

// Controller to auto-zoom to route or chargers
const BoundsFitter: React.FC<{ points: [number, number][] }> = ({ points }) => {
  const map = useMap();
  React.useEffect(() => {
    if (points && points.length >= 2) {
      try {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13, animate: true });
      } catch (e) {}
    }
  }, [points, map]);
  return null;
};

// Create custom DOM markers
function createMarkerIcon(isRecommended: boolean, isAvailable: boolean, speed: number) {
  const bg = isRecommended ? '#10B981' : isAvailable ? '#059669' : '#F59E0B';
  const pulse = isRecommended
    ? `<div class="absolute -inset-1 rounded-full bg-emerald-400 animate-ping opacity-60"></div>`
    : '';

  return L.divIcon({
    className: 'custom-ev-marker',
    html: `
      <div class="relative flex flex-col items-center cursor-pointer">
        ${pulse}
        <div style="background-color: ${bg};" class="relative z-10 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 border-2 border-white">
          <span>⚡ ${speed} kW</span>
        </div>
        <div style="border-top-color: ${bg};" class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px]"></div>
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 28]
  });
}

function createLocationIcon(label: string, color: string) {
  return L.divIcon({
    className: 'custom-loc-marker',
    html: `
      <div class="flex flex-col items-center">
        <div style="background-color: ${color};" class="text-white font-black text-[9px] px-2 py-0.5 rounded-md shadow-sm border border-white uppercase tracking-wider">
          ${label}
        </div>
        <div class="w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-white shadow-sm mt-0.5"></div>
      </div>
    `,
    iconSize: [70, 30],
    iconAnchor: [35, 26]
  });
}

export const MapView: React.FC<MapViewProps> = ({
  routePoints = [
    [11.6643, 78.1460],
    [11.5120, 77.9250],
    [11.3410, 77.7172],
    [11.2778, 77.5833],
    [11.1085, 77.3411],
    [11.0168, 76.9558]
  ],
  stations = [],
  recommendedStationId = 'cs-zeon-salem',
  onSelectStation,
  onOpenWhyThisCharger,
  height = '480px'
}) => {
  const startPoint = routePoints[0] || [11.6643, 78.1460];
  const endPoint = routePoints[routePoints.length - 1] || [11.0168, 76.9558];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100" style={{ height }}>
      <MapContainer
        center={[11.35, 77.55]}
        zoom={9}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <BoundsFitter points={routePoints} />

        {/* Primary Route Line */}
        <Polyline
          positions={routePoints}
          pathOptions={{
            color: '#10B981',
            weight: 5,
            opacity: 0.85,
            lineJoin: 'round'
          }}
        />

        {/* Start and Destination Markers */}
        <Marker position={startPoint} icon={createLocationIcon('Origin', '#3B82F6')} />
        <Marker position={endPoint} icon={createLocationIcon('Destination', '#0F172A')} />

        {/* Charging Station Markers */}
        {stations.map((st) => {
          const lat = st.latitude || st.location?.latitude;
          const lon = st.longitude || st.location?.longitude;
          if (!lat || !lon) return null;

          const isRec = st.id === recommendedStationId;
          const isAvail = st.availability === 'Available' || (st.availablePlugs && st.availablePlugs > 0);
          const speed = st.charging_speed || st.powerKw || 120;

          return (
            <Marker
              key={st.id}
              position={[lat, lon]}
              icon={createMarkerIcon(isRec, isAvail, speed)}
              eventHandlers={{
                click: () => {
                  if (onSelectStation) onSelectStation(st);
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 space-y-2 max-w-xs text-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {isRec ? 'RECOMMENDED' : 'ALTERNATIVE'}
                    </span>
                    <span className="text-xs font-bold text-amber-500">⭐ {st.rating || 4.7}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{st.name}</h4>
                    <p className="text-[11px] text-slate-500">{st.address || `${st.distance_from_route_km || 0.2} km from route`}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-xl text-[11px] border border-slate-100">
                    <div>
                      <span className="text-slate-400 block">Speed</span>
                      <span className="font-bold text-slate-800">{speed} kW DC</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Available</span>
                      <span className="font-bold text-emerald-600">{st.available_chargers || st.availablePlugs || 3} Plugs</span>
                    </div>
                  </div>

                  {onOpenWhyThisCharger && (
                    <button
                      onClick={() => onOpenWhyThisCharger(st)}
                      className="w-full mt-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Info size={13} />
                      <span>Why This Charger?</span>
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs px-3 py-2 rounded-xl border border-slate-200/80 shadow-md text-[11px] font-medium text-slate-700 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span>
          <span>Recommended Charger</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Verified Route Corridor</span>
        </div>
      </div>
    </div>
  );
};
