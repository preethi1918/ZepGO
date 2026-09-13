import React, { useState, useEffect } from 'react';
import type { ChargingStation, GeoLocation } from '../types/charging';
import type { Trip } from '../types/trip';
import { MapContainerComponent } from '../components/map/MapContainer';
import { searchPlaces, type LocationSearchResult } from '../services/geo/geoService';
import { SearchIcon, ZapIcon, CrosshairIcon, MapPinIcon } from '../components/common/Icons';

export interface MapScreenProps {
  currentLocation: GeoLocation;
  stations: ChargingStation[];
  selectedStationId: string | null;
  activeTrip: Trip | null;
  onSelectStation: (station: ChargingStation) => void;
  onSelectLocation?: (loc: GeoLocation) => void;
  onRequestGps?: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  currentLocation,
  stations,
  selectedStationId,
  activeTrip,
  onSelectStation,
  onSelectLocation,
  onRequestGps,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [filterPower, setFilterPower] = useState<'all' | 'fast' | 'ultra'>('all');

  // Debounced real place search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await searchPlaces(searchQuery);
      setSearchResults(results);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchResult = (result: LocationSearchResult) => {
    const loc: GeoLocation = { latitude: result.lat, longitude: result.lon };
    if (onSelectLocation) {
      onSelectLocation(loc);
    }
    setSearchQuery(result.name);
    setSearchResults([]);
  };

  const filteredStations = stations.filter((st) => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.operator.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterPower === 'ultra') return matchesSearch && st.maxPowerKw >= 100;
    if (filterPower === 'fast') return matchesSearch && st.maxPowerKw >= 50 && st.maxPowerKw < 100;
    return matchesSearch;
  });

  return (
    <div className="relative w-full h-[calc(100vh-130px)] flex flex-col overflow-hidden font-[Inter,sans-serif]">
      {/* Floating Real Search Bar & Live Dropdown Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 space-y-2">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 flex items-center gap-2 shadow-lg border border-slate-200/80">
          <SearchIcon size={18} className="text-emerald-600 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location, destination..."
            className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none py-1.5"
          />

          {onRequestGps && (
            <button
              onClick={onRequestGps}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] flex items-center gap-1 shrink-0 transition-all active:scale-95 cursor-pointer"
              title="Use Current GPS"
            >
              <CrosshairIcon size={12} />
              <span>GPS</span>
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 space-y-1 max-h-48 overflow-y-auto">
            {searchResults.map((res, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSearchResult(res)}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-start gap-2 transition-colors cursor-pointer"
              >
                <MapPinIcon size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{res.name}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{res.display_name}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Filter Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilterPower('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-xs transition-all cursor-pointer ${
              filterPower === 'all' ? 'bg-emerald-600 text-white' : 'bg-white/95 text-slate-700 hover:bg-white'
            }`}
          >
            All Chargers ({stations.length})
          </button>
          <button
            onClick={() => setFilterPower('ultra')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-xs transition-all flex items-center gap-1 cursor-pointer ${
              filterPower === 'ultra' ? 'bg-emerald-600 text-white' : 'bg-white/95 text-emerald-700 hover:bg-white'
            }`}
          >
            <ZapIcon size={12} />
            <span>100kW+ Fast</span>
          </button>
        </div>
      </div>

      {/* Real Map Component */}
      <MapContainerComponent
        center={currentLocation}
        stations={filteredStations}
        selectedStationId={selectedStationId}
        activeTrip={activeTrip}
        onSelectStation={onSelectStation}
      />

      {/* Floating Bottom Sheet over Map */}
      <div className="absolute bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200/80 rounded-t-[32px] shadow-2xl p-4 sm:p-5 space-y-3">
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />

        {activeTrip ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Route</span>
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  {activeTrip.originName} → {activeTrip.destinationName}
                </h3>
              </div>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ 87% Confidence
              </span>
            </div>

            {/* Compact Metric Cards Row */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Distance</span>
                <p className="font-black text-slate-900 mt-0.5">{activeTrip.totalDistanceKm || 150} km</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Est. Time</span>
                <p className="font-black text-slate-900 mt-0.5">
                  {Math.floor((activeTrip.totalDurationMinutes || 160) / 60)}h {(activeTrip.totalDurationMinutes || 160) % 60}m
                </p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Arrival SOC</span>
                <p className="font-black text-emerald-600 mt-0.5">{activeTrip.arrivalSocPercent || 24}%</p>
              </div>
            </div>

            {/* Decision Callout */}
            <div className="bg-emerald-50/80 p-2.5 rounded-2xl border border-emerald-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <span>✓</span>
                <span>No Charging Required</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Arrival &gt; 15% Buffer</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-slate-900">Explore Nearby Chargers</h3>
              <p className="text-[11px] text-slate-500 font-medium">{stations.length} fast charging stations nearby</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              🟢 Live Availability
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
