import React, { useState } from 'react';
import { BatteryCharging, Zap, MapPin, DollarSign, Clock, Star, Filter, Search, CheckCircle2, ArrowRight } from 'lucide-react';
import { ChargingStation, EVModel } from '../types';

interface StationFinderProps {
  stations: ChargingStation[];
  evModel: EVModel;
  onSelectStation: (station: ChargingStation) => void;
  onNavigateToMap: () => void;
}

export const StationFinder: React.FC<StationFinderProps> = ({
  stations,
  evModel,
  onSelectStation,
  onNavigateToMap
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedConnector, setSelectedConnector] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(0.50);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'speed' | 'price' | 'rating' | 'wait'>('speed');

  // Filter logic
  const filtered = stations.filter((s) => {
    const matchesSearch = s.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConnector = selectedConnector === 'All' || s.chargerTypes.includes(selectedConnector);
    const matchesPrice = s.pricePerkWh <= maxPrice;
    const matchesAvailability = !onlyAvailable || s.availablePorts > 0;
    return matchesSearch && matchesConnector && matchesPrice && matchesAvailability;
  }).sort((a, b) => {
    if (sortBy === 'speed') return b.maxSpeedKw - a.maxSpeedKw;
    if (sortBy === 'price') return a.pricePerkWh - b.pricePerkWh;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'wait') return a.waitingTimeMins - b.waitingTimeMins;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BatteryCharging className="w-6 h-6 text-sky-600" />
            Live EV Charger Availability & Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time port status, power output (kW), pricing per kWh, connector compatibility, and queue times.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-sky-50 text-sky-800 px-3 py-1.5 rounded-xl border border-sky-200 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-sky-600" />
          <span>Vehicle: {evModel.name} ({evModel.connectorTypes.join(', ')})</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search station or city..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          {/* Connector Selector */}
          <div>
            <select
              value={selectedConnector}
              onChange={(e) => setSelectedConnector(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            >
              <option value="All">All Connectors (CCS2, NACS, Type 2)</option>
              <option value="CCS2">CCS2 Fast Charger</option>
              <option value="NACS">NACS (Tesla Supercharger)</option>
              <option value="Type 2">Type 2 AC</option>
              <option value="CHAdeMO">CHAdeMO</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50">
            <span className="text-[11px] font-bold text-slate-600 shrink-0">Max Rate:</span>
            <input
              type="range"
              min="0.25"
              max="0.60"
              step="0.01"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <span className="text-xs font-bold text-sky-700 shrink-0">${maxPrice.toFixed(2)}</span>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            >
              <option value="speed">Sort by: Fastest Charger Speed (kW)</option>
              <option value="price">Sort by: Cheapest Rate ($/kWh)</option>
              <option value="rating">Sort by: Highest User Rating</option>
              <option value="wait">Sort by: Shortest Wait Time</option>
            </select>
          </div>
        </div>

        {/* Checkbox filters */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded-xs text-sky-600 focus:ring-sky-500"
            />
            <span>Show Only Stations With Open Ports Right Now</span>
          </label>

          <span className="text-slate-500 font-medium">
            Showing <strong>{filtered.length}</strong> of {stations.length} Charging Hubs
          </span>
        </div>
      </div>

      {/* Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((station) => {
          const isCompatible = evModel.connectorTypes.some(t => station.chargerTypes.includes(t) || t.includes(station.chargerTypes[0]));

          return (
            <div
              key={station.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{station.stationName}</h3>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {station.locationName}
                    </p>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {station.rating}
                  </span>
                </div>

                {/* Compatibility Badge */}
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    isCompatible
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {isCompatible ? '✓ Vehicle Compatible' : 'Adapter Recommended'}
                  </span>

                  <span className="text-xs text-slate-400">
                    {station.chargerTypes.join(', ')}
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">Max Speed</span>
                    <span className="font-extrabold text-sky-700 flex items-center gap-1 mt-0.5">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      {station.maxSpeedKw} kW
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">Live Ports</span>
                    <span className="font-extrabold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <BatteryCharging className="w-3.5 h-3.5" />
                      {station.availablePorts}/{station.totalPorts} Open
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">Pricing Rate</span>
                    <span className="font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      ${station.pricePerkWh}/kWh
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">Estimated Queue</span>
                    <span className="font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {station.waitingTimeMins === 0 ? '0 mins' : `${station.waitingTimeMins} mins`}
                    </span>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-1">
                  {station.amenities.slice(0, 3).map((am, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  onSelectStation(station);
                  onNavigateToMap();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select & View on Live Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
