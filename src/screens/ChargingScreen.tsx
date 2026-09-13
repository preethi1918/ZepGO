import React, { useState } from 'react';
import type { ChargingStation, GeoLocation } from '../types/charging';
import type { VehicleState } from '../types/vehicle';
import { SearchIcon, NavigationIcon, StarIcon, QrCodeIcon, ZapIcon } from '../components/common/Icons';
import { MapContainerComponent } from '../components/map/MapContainer';

export interface ChargingScreenProps {
  stations: ChargingStation[];
  favoriteIds: string[];
  isMobileView?: boolean;
  onSelectStation: (station: ChargingStation) => void;
  onToggleFavorite: (stationId: string, e: React.MouseEvent) => void;
  vehicle?: VehicleState;
  onNavigateToMap?: () => void;
  currentLocation?: GeoLocation;
  onOpenQrScanner?: () => void;
  onStartSessionForStation?: (station: ChargingStation) => void;
}

export const ChargingScreen: React.FC<ChargingScreenProps> = ({
  stations,
  isMobileView = false,
  onSelectStation,
  currentLocation = { latitude: 10.7905, longitude: 78.7047 },
  onOpenQrScanner,
  onStartSessionForStation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'nearby' | 'fastest' | 'cheapest' | 'available'>('nearby');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sampleStations: ChargingStation[] = [
    {
      id: 'st-1',
      name: 'Zeon Charging Hub',
      operator: 'Zeon Network',
      address: 'NH-44 Bypass, Salem',
      location: { latitude: 11.6643, longitude: 78.146 },
      distanceKm: 2.4,
      maxPowerKw: 150,
      availablePlugs: 4,
      totalPlugs: 6,
      connectorTypes: ['CCS2'],
      pricePerKwh: 22.0,
      rating: 4.8,
      status: 'available',
      speedCategory: 'ultra_fast',
      amenities: ['Cafe', 'Restroom', 'WiFi'],
    },
    {
      id: 'st-2',
      name: 'Tata Power EZ Charge',
      operator: 'Tata Power',
      address: 'Hosur Main Road',
      location: { latitude: 12.7409, longitude: 77.8253 },
      distanceKm: 5.8,
      maxPowerKw: 120,
      availablePlugs: 3,
      totalPlugs: 4,
      connectorTypes: ['CCS2', 'Type 2'],
      pricePerKwh: 18.5,
      rating: 4.6,
      status: 'available',
      speedCategory: 'fast',
      amenities: ['Mall', 'Food Court'],
    },
    {
      id: 'st-3',
      name: 'Jio-BP Pulse',
      operator: 'Jio-BP',
      address: 'Dharmapuri Toll Plaza',
      location: { latitude: 12.1211, longitude: 78.1582 },
      distanceKm: 12.1,
      maxPowerKw: 60,
      availablePlugs: 2,
      totalPlugs: 4,
      connectorTypes: ['CCS2'],
      pricePerKwh: 16.0,
      rating: 4.5,
      status: 'available',
      speedCategory: 'fast',
      amenities: ['Restroom'],
    },
    {
      id: 'st-4',
      name: 'ChargePoint Supercharger',
      operator: 'ChargePoint',
      address: 'Indiranagar 100ft Road',
      location: { latitude: 12.9784, longitude: 77.6408 },
      distanceKm: 14.5,
      maxPowerKw: 180,
      availablePlugs: 5,
      totalPlugs: 8,
      connectorTypes: ['CCS2'],
      pricePerKwh: 24.0,
      rating: 4.9,
      status: 'available',
      speedCategory: 'ultra_fast',
      amenities: ['Lounge', 'WiFi'],
    },
  ];

  const displayList = stations.length > 0 ? stations : sampleStations;

  const filtered = displayList.filter((st) => {
    const matches = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    st.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    st.address.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matches) return false;

    if (activeFilter === 'available') return st.availablePlugs > 0;
    if (activeFilter === 'fastest') return st.maxPowerKw >= 100;
    return true;
  }).sort((a, b) => {
    if (activeFilter === 'nearby') return a.distanceKm - b.distanceKm;
    if (activeFilter === 'fastest') return b.maxPowerKw - a.maxPowerKw;
    if (activeFilter === 'cheapest') return a.pricePerKwh - b.pricePerKwh;
    return 0;
  });

  const directoryListContent = (
    <div className="space-y-4 font-[Inter,sans-serif]">
      {/* Header & QR Scan Action Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Nearby Charging Stations</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time availability & fast chargers</p>
        </div>

        {onOpenQrScanner && (
          <button
            onClick={onOpenQrScanner}
            className="py-2 px-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <QrCodeIcon size={16} />
            <span>Scan QR</span>
          </button>
        )}
      </div>

      {/* ZepGO Key Differentiator Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0">
            ✓
          </div>
          <div>
            <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider">✓ NO CHARGING NEEDED</h3>
            <p className="text-xs text-emerald-800 font-medium">You can reach your destination with 24% battery remaining.</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
          Safe Buffer
        </span>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-xs border border-slate-200/80">
        <SearchIcon size={18} className="text-slate-400 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location, Zeon, Tata Power, Jio-BP..."
          className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'nearby', label: 'Nearby' },
          { id: 'fastest', label: 'Fastest (100kW+)' },
          { id: 'cheapest', label: 'Cheapest' },
          { id: 'available', label: 'Available Now' },
        ].map((chip) => {
          const isSelected = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id as any)}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 border cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Charger Cards List */}
      <div className="space-y-3">
        {filtered.map((station) => {
          const isAvailable = station.availablePlugs > 0;
          const isBusy = station.availablePlugs === 0 && station.status !== 'offline';
          const statusDot = isAvailable ? '🟢 Available' : isBusy ? '🟡 Busy' : '🔴 Unavailable';
          const statusBg = isAvailable
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isBusy
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-rose-50 text-rose-800 border-rose-200';

          const connectorLabel = station.connectorTypes ? station.connectorTypes.join(' / ') : 'CCS2 DC';
          const estTime = Math.round(30 * (120 / (station.maxPowerKw || 120)));

          return (
            <div
              key={station.id}
              onClick={() => {
                setSelectedId(station.id);
                onSelectStation(station);
              }}
              className={`bg-white rounded-3xl p-4 sm:p-5 border shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 ${
                selectedId === station.id ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{station.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{station.distanceKm} km away • {station.address}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
                  <StarIcon size={12} className="text-amber-500 fill-amber-500" />
                  <span>{station.rating || 4.8}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-bold px-2.5 py-0.5 rounded-full border ${statusBg}`}>
                    {statusDot} ({station.availablePlugs}/{station.totalPlugs})
                  </span>

                  <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    ⚡ {station.maxPowerKw} kW DC
                  </span>

                  <span className="font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60 text-[11px]">
                    🔌 {connectorLabel}
                  </span>
                </div>

                <span className="font-black text-slate-900">₹{station.pricePerKwh}/kWh</span>
              </div>

              <div className="text-[11px] text-slate-500 font-medium">
                ⏱ Est. charge time: <span className="font-bold text-slate-800">~{estTime} mins to 80%</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStation(station);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <NavigationIcon size={14} />
                  <span>Navigate</span>
                </button>

                {onStartSessionForStation && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartSessionForStation(station);
                    }}
                    className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all active:scale-98 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ZapIcon size={14} className="fill-white" />
                    <span>Start Charge</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // If rendering inside Mobile Frame View: Clean linear stack
  if (isMobileView) {
    return (
      <div className="w-full space-y-4 pb-20 pt-2 px-3 font-[Inter,sans-serif] overflow-x-hidden">
        {directoryListContent}
      </div>
    );
  }

  // Otherwise Desktop Split View
  return (
    <div className="w-full space-y-6 pb-24 pt-2 px-2 sm:px-4 font-[Inter,sans-serif]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-4">
          {directoryListContent}
        </div>

        {/* Right Column: Full Height Interactive Charger Map (7 Cols) */}
        <div className="lg:col-span-7 h-[500px] lg:h-[720px] rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 sticky top-4">
          <MapContainerComponent
            center={currentLocation}
            stations={filtered}
            selectedStationId={selectedId}
            onSelectStation={(st) => {
              setSelectedId(st.id);
              onSelectStation(st);
            }}
          />
        </div>
      </div>
    </div>
  );
};

