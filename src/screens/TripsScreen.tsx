import React, { useState, useEffect } from 'react';
import type { Trip, RouteStop } from '../types/trip';
import type { ChargingStation, GeoLocation } from '../types/charging';
import type { VehicleState } from '../types/vehicle';
import { MapContainerComponent } from '../components/map/MapContainer';
import { evaluateJourneyChargingRecommendation } from '../services/recommendation/recommendationEngine';
import { fetchRealChargersForTrip } from '../services/api/realChargersService';
import {
  searchPlaces,
  fetchRealDrivingRoute,
  reverseGeocode,
  type LocationSearchResult,
} from '../services/geo/geoService';
import {
  SparklesIcon,
  NavigationIcon,
  CheckCircleIcon,
  InfoIcon,
  PlusIcon,
  ZapIcon,
  MapPinIcon,
  CrosshairIcon,
} from '../components/common/Icons';

export interface TripsScreenProps {
  trips: Trip[];
  onStartTrip: (trip: Trip) => void;
  isMobileView?: boolean;
  onSelectStation?: (stationId: string) => void;
  availableStations?: ChargingStation[];
  vehicleSocPercent?: number;
  onAddTrip?: (newTrip: Trip) => void;
  onUpdateTrip?: (updatedTrip: Trip) => void;
  batteryCapacityKwh?: number;
  vehicle?: VehicleState;
  currentLocation?: GeoLocation;
}

export const TripsScreen: React.FC<TripsScreenProps> = ({
  trips,
  onStartTrip,
  isMobileView: _isMobileView = false,
  availableStations = [],
  onAddTrip,
  onUpdateTrip,
  vehicle = {
    brand: 'Tata',
    modelName: 'Nexon.ev LR',
    trim: 'Empowered+ LR',
    batteryCapacityKwh: 40.5,
    currentSocPercent: 78,
    estimatedRangeKm: 312,
    averageConsumptionWhPerKm: 135,
    minArrivalSocBufferPercent: 15,
    preferredNetworks: ['Tata Power EZ Charge', 'Zeon Charging', 'Jio-bp pulse'],
    supportedPlugs: ['CCS2', 'Type 2'],
    healthPercent: 99,
    chargingStatus: 'discharging',
    currentChargePowerKw: 0,
    licensePlate: 'KA-01-EV-4092',
    ecoScore: 92,
    totalKmDriven: 14280,
    totalCo2OffsetKg: 2850,
    totalChargingCostSavedRs: 48200,
  },
  currentLocation = { latitude: 10.7905, longitude: 78.7047 },
}) => {
  const [localTrips, setLocalTrips] = useState<Trip[]>(trips);
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || 'trip-in-1');

  // Sync local trips with parent props
  useEffect(() => {
    setLocalTrips(trips);
    if (!trips.some((t) => t.id === selectedTripId) && trips.length > 0) {
      setSelectedTripId(trips[0].id);
    }
  }, [trips]);

  const currentTrip: Trip = localTrips.find((t) => t.id === selectedTripId) || localTrips[0] || {
    id: 'trip-1',
    title: 'Mumbai → Pune Expressway Corridor',
    originName: 'BKC, Mumbai',
    originLocation: { latitude: 19.0660, longitude: 72.8691 },
    destinationName: 'Koregaon Park, Pune',
    destinationLocation: { latitude: 18.5362, longitude: 73.8940 },
    totalDistanceKm: 148,
    totalDurationMinutes: 135,
    estimatedEnergyKwh: 19.2,
    startSocPercent: 24,
    arrivalSocPercent: 12,
    status: 'planned',
    createdAt: 'Today',
    stops: [],
  };

  const [selectedRouteOption, setSelectedRouteOption] = useState<'recommended' | 'fastest' | 'eco'>('recommended');
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [startSoc, setStartSoc] = useState<number>(currentTrip.startSocPercent || 24);
  const [corridorChargers, setCorridorChargers] = useState<ChargingStation[]>([]);

  // Interactive Origin & Destination Form States
  const [originInput, setOriginInput] = useState(currentTrip.originName || '');
  const [originLocation, setOriginLocation] = useState<GeoLocation>(currentTrip.originLocation || currentLocation);
  const [originSearchResults, setOriginSearchResults] = useState<LocationSearchResult[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);

  const [destinationInput, setDestinationInput] = useState(currentTrip.destinationName || '');
  const [destinationLocation, setDestinationLocation] = useState<GeoLocation>(
    currentTrip.destinationLocation || { latitude: 18.5362, longitude: 73.8940 }
  );
  const [destinationSearchResults, setDestinationSearchResults] = useState<LocationSearchResult[]>([]);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Sync search inputs when selected trip changes
  useEffect(() => {
    if (currentTrip) {
      setOriginInput(currentTrip.originName || '');
      setOriginLocation(currentTrip.originLocation || currentLocation);
      setDestinationInput(currentTrip.destinationName || '');
      setDestinationLocation(currentTrip.destinationLocation || { latitude: 18.5362, longitude: 73.8940 });
      if (currentTrip.startSocPercent !== undefined) {
        setStartSoc(currentTrip.startSocPercent);
      }
    }
  }, [selectedTripId]);

  // Debounced Origin Place Search
  useEffect(() => {
    if (!originInput || originInput.trim().length < 3 || !showOriginDropdown) {
      setOriginSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchPlaces(originInput);
      setOriginSearchResults(results);
    }, 350);
    return () => clearTimeout(timer);
  }, [originInput, showOriginDropdown]);

  // Debounced Destination Place Search
  useEffect(() => {
    if (!destinationInput || destinationInput.trim().length < 3 || !showDestinationDropdown) {
      setDestinationSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchPlaces(destinationInput);
      setDestinationSearchResults(results);
    }, 350);
    return () => clearTimeout(timer);
  }, [destinationInput, showDestinationDropdown]);

  // Fetch real OSM corridor chargers whenever route endpoints change
  useEffect(() => {
    let isMounted = true;
    if (currentTrip.originLocation && currentTrip.destinationLocation) {
      fetchRealChargersForTrip(currentTrip.originLocation, currentTrip.destinationLocation).then((st) => {
        if (isMounted && st && st.length > 0) {
          setCorridorChargers(st);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [
    currentTrip.originLocation?.latitude,
    currentTrip.originLocation?.longitude,
    currentTrip.destinationLocation?.latitude,
    currentTrip.destinationLocation?.longitude,
  ]);

  // Handle selecting Origin search result
  const handleSelectOrigin = (result: LocationSearchResult) => {
    setOriginInput(result.name);
    setOriginLocation({ latitude: result.lat, longitude: result.lon });
    setShowOriginDropdown(false);
  };

  // Handle selecting Destination search result
  const handleSelectDestination = (result: LocationSearchResult) => {
    setDestinationInput(result.name);
    setDestinationLocation({ latitude: result.lat, longitude: result.lon });
    setShowDestinationDropdown(false);
  };

  // Handle setting current GPS location as Origin
  const handleUseCurrentGpsAsOrigin = async () => {
    setOriginLocation(currentLocation);
    setShowOriginDropdown(false);
    const addr = await reverseGeocode(currentLocation.latitude, currentLocation.longitude);
    setOriginInput(addr.split(',')[0] || 'Current GPS Location');
  };

  // Handle Calculate & Plan Real Custom Journey
  const handleCalculateRouteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originInput.trim() || !destinationInput.trim()) return;

    setIsCalculatingRoute(true);

    let startLoc = originLocation;
    let endLoc = destinationLocation;

    // Resolve Origin coordinates if user didn't pick from dropdown
    if (originSearchResults.length > 0 && (startLoc.latitude === currentLocation.latitude && startLoc.longitude === currentLocation.longitude && originInput !== 'Current GPS Location')) {
      const topOrigin = originSearchResults[0];
      startLoc = { latitude: topOrigin.lat, longitude: topOrigin.lon };
      setOriginLocation(startLoc);
    }

    // Resolve Destination coordinates if user didn't pick from dropdown
    if (destinationSearchResults.length > 0 && endLoc.latitude === 18.5362 && endLoc.longitude === 73.8940) {
      const topDest = destinationSearchResults[0];
      endLoc = { latitude: topDest.lat, longitude: topDest.lon };
      setDestinationLocation(endLoc);
    }

    // Fetch real OSRM driving route geometry, distance & duration
    const realRoute = await fetchRealDrivingRoute(startLoc, endLoc);

    const distKm = realRoute ? Math.round(realRoute.distanceKm) : 160;
    const durMins = realRoute ? Math.round(realRoute.durationMinutes) : 140;
    const energyKwh = Math.round((distKm * (vehicle.averageConsumptionWhPerKm || 135)) / 1000);

    const newTripId = `trip-custom-${Date.now()}`;
    const newCustomTrip: Trip = {
      id: newTripId,
      title: `${originInput.split(',')[0]} → ${destinationInput.split(',')[0]}`,
      originName: originInput.split(',')[0],
      originLocation: startLoc,
      destinationName: destinationInput.split(',')[0],
      destinationLocation: endLoc,
      totalDistanceKm: distKm,
      totalDurationMinutes: durMins,
      estimatedEnergyKwh: energyKwh,
      startSocPercent: startSoc,
      arrivalSocPercent: 20,
      status: 'planned',
      createdAt: 'Just now',
      stops: [],
    };

    const updatedTrips = [newCustomTrip, ...localTrips];
    setLocalTrips(updatedTrips);
    setSelectedTripId(newTripId);

    if (onAddTrip) onAddTrip(newCustomTrip);
    else if (onUpdateTrip) onUpdateTrip(newCustomTrip);

    setIsCalculatingRoute(false);
  };

  // Combine availableStations and corridorChargers
  const stationMap = new Map<string, ChargingStation>();
  (availableStations || []).forEach((st) => stationMap.set(st.id, st));
  corridorChargers.forEach((st) => stationMap.set(st.id, st));
  const combinedTripStations = Array.from(stationMap.values());

  // Adjust consumption multiplier based on route option selection
  const routeConsumptionMultiplier = selectedRouteOption === 'eco' ? 0.88 : selectedRouteOption === 'fastest' ? 1.1 : 1.0;
  const effectiveVehicle: VehicleState = {
    ...vehicle,
    averageConsumptionWhPerKm: Math.round((vehicle.averageConsumptionWhPerKm || 135) * routeConsumptionMultiplier),
  };

  // Single source of truth for journey charging recommendation
  const recommendation = evaluateJourneyChargingRecommendation(
    currentTrip,
    effectiveVehicle,
    currentTrip.originLocation || currentLocation,
    combinedTripStations,
    startSoc
  );

  // Handle adding recommended charger station to current trip stops
  const handleAddRecommendedStop = () => {
    if (!recommendation.recommendedStop) return;
    const st = recommendation.recommendedStop.station;

    const newStop: RouteStop = {
      id: `stop-added-${Date.now()}`,
      stationId: st.id,
      stationName: st.name,
      location: st.location,
      arrivalSocPercent: recommendation.recommendedStop.arrivalSocPercent,
      targetSocPercent: recommendation.recommendedStop.targetSocPercent,
      durationMinutes: recommendation.recommendedStop.chargingTimeMinutes,
      distanceFromOriginKm: Math.round(recommendation.recommendedStop.detourDistanceKm + (recommendation.recommendedStop.segmentIndex * 70) + 40),
      chargingPowerKw: st.maxPowerKw,
      amenities: st.amenities || ['Restroom', 'Cafe'],
    };

    const updatedTrip: Trip = {
      ...currentTrip,
      stops: [...(currentTrip.stops || []), newStop],
    };

    const updatedTrips = localTrips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t));
    setLocalTrips(updatedTrips);

    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  // Remove a stop from current trip
  const handleRemoveStop = (stopId: string) => {
    const updatedTrip: Trip = {
      ...currentTrip,
      stops: currentTrip.stops.filter((s) => s.id !== stopId),
    };
    const updatedTrips = localTrips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t));
    setLocalTrips(updatedTrips);
    if (onUpdateTrip) onUpdateTrip(updatedTrip);
  };

  const leftPlannerContent = (
    <div className="space-y-4 font-[Inter,sans-serif]">
      {/* 1. Real Origin & Destination Route Planner Box */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <SparklesIcon size={12} /> Live Route & EV Charger Planner
          </span>
          {recommendation.needsCharging && recommendation.recommendedStop && (
            <button
              onClick={() => setShowWhyModal(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
            >
              <InfoIcon size={14} />
              <span>Why this charger?</span>
            </button>
          )}
        </div>

        {/* Origin & Destination Search Form */}
        <form onSubmit={handleCalculateRouteSubmit} className="space-y-3">
          {/* Origin Search Field */}
          <div className="relative">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Starting Location (Origin)
              </span>
              <button
                type="button"
                onClick={handleUseCurrentGpsAsOrigin}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-lg transition-all cursor-pointer"
              >
                <CrosshairIcon size={10} />
                <span>Use Live GPS</span>
              </button>
            </label>
            <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 flex items-center gap-2 transition-all">
              <MapPinIcon size={16} className="text-emerald-500 shrink-0 ml-1" />
              <input
                type="text"
                value={originInput}
                onChange={(e) => {
                  setOriginInput(e.target.value);
                  setShowOriginDropdown(true);
                }}
                onFocus={() => setShowOriginDropdown(true)}
                placeholder="Enter current city or origin (e.g. BKC Mumbai, Chennai)..."
                className="w-full text-xs font-bold text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />
            </div>

            {/* Origin Search Results Dropdown */}
            {showOriginDropdown && originSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 max-h-48 overflow-y-auto space-y-1">
                {originSearchResults.map((res, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOrigin(res)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-start gap-2 transition-colors cursor-pointer"
                  >
                    <MapPinIcon size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{res.name}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{res.display_name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Destination Search Field */}
          <div className="relative">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1 mb-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Destination Location
            </label>
            <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 flex items-center gap-2 transition-all">
              <MapPinIcon size={16} className="text-indigo-600 shrink-0 ml-1" />
              <input
                type="text"
                value={destinationInput}
                onChange={(e) => {
                  setDestinationInput(e.target.value);
                  setShowDestinationDropdown(true);
                }}
                onFocus={() => setShowDestinationDropdown(true)}
                placeholder="Enter destination city or place (e.g. Pune, Agra, Mysuru)..."
                className="w-full text-xs font-bold text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />
            </div>

            {/* Destination Search Results Dropdown */}
            {showDestinationDropdown && destinationSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 max-h-48 overflow-y-auto space-y-1">
                {destinationSearchResults.map((res, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectDestination(res)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-start gap-2 transition-colors cursor-pointer"
                  >
                    <MapPinIcon size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{res.name}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{res.display_name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Calculate & Plan Route Button */}
          <button
            type="submit"
            disabled={isCalculatingRoute}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isCalculatingRoute ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Calculating OSRM Driving Route...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <NavigationIcon size={16} />
                <span>Calculate & Plan EV Journey</span>
              </span>
            )}
          </button>
        </form>

        {/* Corridor Presets Quick Dropdown */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or Select Preset Corridor:</label>
          <select
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {localTrips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title || `${t.originName} → ${t.destinationName}`} ({t.totalDistanceKm} km)
              </option>
            ))}
          </select>
        </div>

        {/* Selected Journey Header Stats */}
        <div className="pt-1">
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {currentTrip.title || `${currentTrip.originName} → ${currentTrip.destinationName}`}
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1">
            <span className="font-bold text-emerald-600">{currentTrip.originName}</span>
            <span>→</span>
            <span className="font-bold text-indigo-600">{currentTrip.destinationName}</span>
          </p>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 sm:p-3 rounded-2xl text-center border border-slate-200/50">
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Road Distance</p>
            <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">{currentTrip.totalDistanceKm} km</p>
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Est. Drive Time</p>
            <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
              {Math.floor(currentTrip.totalDurationMinutes / 60)}h {currentTrip.totalDurationMinutes % 60}m
            </p>
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Arrival Battery</p>
            <p className={`text-xs sm:text-sm font-black mt-0.5 ${recommendation.predictedArrivalSocPercent < 15 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {recommendation.predictedArrivalSocPercent}%
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Journey Battery Simulation Slider */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🪫</span>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Journey Starting Battery</h3>
              <p className="text-[11px] text-slate-400 font-medium">Test charger recommendations at different SOCs</p>
            </div>
          </div>
          <span className="text-sm font-black text-emerald-400 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
            {startSoc}% SOC
          </span>
        </div>

        <input
          type="range"
          min="10"
          max="100"
          step="1"
          value={startSoc}
          onChange={(e) => setStartSoc(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />

        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {[
            { soc: 15, label: '🪫 15% Low' },
            { soc: 24, label: '⚠️ 24% Default' },
            { soc: 40, label: '⚡ 40% Mid' },
            { soc: 80, label: '🔋 80% Full' },
          ].map((preset) => (
            <button
              key={preset.soc}
              type="button"
              onClick={() => setStartSoc(preset.soc)}
              className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer border ${
                startSoc === preset.soc
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Real Charging Station Recommendation Banner / Action */}
      {recommendation.needsCharging && recommendation.recommendedStop ? (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-blue-900/60 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <ZapIcon size={14} /> Real Charger Recommendation
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
              +{recommendation.recommendedStop.addedSocPercent}% in {recommendation.recommendedStop.chargingTimeMinutes} mins
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-black text-white">{recommendation.recommendedStop.station.name}</h3>
            <p className="text-xs font-semibold text-blue-300 mt-0.5">
              Operator: <span className="text-white">{recommendation.recommendedStop.station.operator}</span> • Address: {recommendation.recommendedStop.station.address}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center text-xs">
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Charging Speed</p>
              <p className="font-bold text-amber-400 mt-0.5">{recommendation.recommendedStop.station.maxPowerKw} kW DC</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Route Detour</p>
              <p className="font-bold text-white mt-0.5">{recommendation.recommendedStop.detourDistanceKm} km (~{recommendation.recommendedStop.detourTimeMinutes}m)</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Live Availability</p>
              <p className="font-bold text-emerald-400 mt-0.5">🟢 {recommendation.recommendedStop.station.availablePlugs}/{recommendation.recommendedStop.station.totalPlugs} Free</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Price / kWh</p>
              <p className="font-bold text-white mt-0.5">₹{recommendation.recommendedStop.station.pricePerKwh || '18.50'}</p>
            </div>
          </div>

          {/* Add Charger Stop Button */}
          <button
            type="button"
            onClick={handleAddRecommendedStop}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusIcon size={16} />
            <span>[ Add {recommendation.recommendedStop.station.name} to Journey Stops ]</span>
          </button>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-3xl flex items-center gap-3 text-xs shadow-2xs">
          <span className="text-2xl">✓</span>
          <div>
            <p className="font-black text-emerald-900 text-sm">Trip looks good! No charging stops required.</p>
            <p className="text-xs text-emerald-700 font-medium mt-0.5">
              At {startSoc}% initial battery, predicted arrival SOC is {recommendation.predictedArrivalSocPercent}% (well above your {recommendation.minBufferPercent}% safety buffer).
            </p>
          </div>
        </div>
      )}

      {/* 4. Configured Journey Stops List (If any stops exist) */}
      {currentTrip.stops && currentTrip.stops.length > 0 && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Configured Charging Stops ({currentTrip.stops.length})</h2>
            <span className="text-xs text-emerald-600 font-bold">Stops Active</span>
          </div>

          <div className="space-y-2">
            {currentTrip.stops.map((stop, idx) => (
              <div key={stop.id || idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    ⚡
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{stop.stationName}</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Charge: {stop.arrivalSocPercent}% → {stop.targetSocPercent}% ({stop.durationMinutes}m) • {stop.chargingPowerKw} kW DC
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveStop(stop.id)}
                  className="text-xs font-bold text-rose-500 hover:text-rose-700 px-2 py-1 bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Dynamic AI Route Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">AI Evaluated Route Options</h2>
          <span className="text-xs text-slate-500 font-medium">3 Driving Profiles Evaluated</span>
        </div>

        <div className="space-y-3">
          {[
            {
              id: 'recommended',
              title: 'Recommended Route',
              isAi: true,
              tag: 'Optimal Energy & Charger Balance',
              multiplier: 1.0,
            },
            {
              id: 'fastest',
              title: 'Fastest Expressway',
              isAi: false,
              tag: 'Maximum Speed (+10% Drag)',
              multiplier: 1.1,
            },
            {
              id: 'eco',
              title: 'Eco-Friendly Route',
              isAi: false,
              tag: 'Minimum Drag (-12% Energy)',
              multiplier: 0.88,
            },
          ].map((opt) => {
            const isSelected = selectedRouteOption === opt.id;
            const optVehicle: VehicleState = {
              ...vehicle,
              averageConsumptionWhPerKm: Math.round((vehicle.averageConsumptionWhPerKm || 135) * opt.multiplier),
            };
            const optEval = evaluateJourneyChargingRecommendation(
              currentTrip,
              optVehicle,
              currentTrip.originLocation || currentLocation,
              combinedTripStations,
              startSoc
            );

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedRouteOption(opt.id as any)}
                className={`
                  rounded-3xl p-4 cursor-pointer transition-all duration-200 border relative
                  ${
                    isSelected
                      ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-100'
                      : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-2xs'
                  }
                `}
              >
                {opt.isAi && (
                  <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <SparklesIcon size={10} /> AI Choice
                  </span>
                )}

                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">{opt.title}</h3>
                      <span className="text-xs font-semibold text-slate-500">• {currentTrip.totalDistanceKm} km</span>
                    </div>

                    <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                      <span>{optEval.needsCharging ? '⚡ 1 Charging Stop Required' : '✓ 0 Charging Stops Needed'}</span>
                      <span>•</span>
                      <span className={`font-semibold ${optEval.predictedArrivalSocPercent < 15 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        Arrival {optEval.predictedArrivalSocPercent}% SOC
                      </span>
                    </p>

                    <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded-lg mt-1">
                      {opt.tag}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                      {isSelected && <CheckCircleIcon size={12} />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Analysis Breakdown */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 font-[Inter,sans-serif]">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">SMART ANALYSIS</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl">
            <span className="font-semibold text-slate-700">Road conditions</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">🟢 Good</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl">
            <span className="font-semibold text-slate-700">Traffic</span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">🟡 Moderate</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl">
            <span className="font-semibold text-slate-700">Weather impact</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">🟢 Low</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl">
            <span className="font-semibold text-slate-700">Energy consumption</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">🟢 Normal</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl">
            <span className="font-semibold text-slate-700">Charging required</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">✓ No</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60 text-xs">
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            <span className="font-bold text-slate-900">AI JOURNEY INSIGHT:</span> Your current battery is sufficient for the planned route.
          </p>
        </div>
      </div>

      {/* 6. Start Navigation Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => onStartTrip(currentTrip)}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-sm shadow-emerald-600/20 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <NavigationIcon size={18} />
          <span>START SMART NAVIGATION</span>
        </button>
      </div>
    </div>
  );

  // Render Mobile or Desktop Layout
  return (
    <div className="w-full space-y-6 pb-24 pt-2 px-2 sm:px-4 font-[Inter,sans-serif]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-5">
          {leftPlannerContent}
        </div>

        {/* Interactive Map */}
        <div className="lg:col-span-7 h-[450px] lg:h-[760px] rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 sticky top-4">
          <MapContainerComponent
            center={currentTrip.originLocation || currentLocation}
            stations={combinedTripStations}
            activeTrip={currentTrip}
          />
        </div>
      </div>

      {/* Why Charger Modal */}
      {showWhyModal && recommendation.recommendedStop && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-fadeIn">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                🤖
              </div>
              <h3 className="text-base font-bold text-slate-900">Why Was This Charger Recommended?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              {recommendation.recommendedStop.whyExplanation}
            </p>

            <button
              type="button"
              onClick={() => setShowWhyModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
