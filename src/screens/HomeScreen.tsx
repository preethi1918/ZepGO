import React, { useState } from 'react';
import type { VehicleState } from '../types/vehicle';
import type { ChargingStation } from '../types/charging';
import type { Trip } from '../types/trip';
import { evaluateJourneyChargingRecommendation } from '../services/recommendation/recommendationEngine';
import { BatterySimulationControls } from '../components/common/BatterySimulationControls';
import { VehicleControlBar } from '../components/domain/VehicleControlBar';
import {
  SearchIcon,
  SlidersIcon,
  NavigationIcon,
  ZapIcon,
  MapPinIcon,
  ReceiptIcon,
  ChevronRightIcon,
  QrCodeIcon,
  CarFrontIcon,
} from '../components/common/Icons';
import { ShieldCheck, Info } from 'lucide-react';

export interface HomeScreenProps {
  vehicle: VehicleState;
  nearbyChargers: ChargingStation[];
  featuredTrip: Trip;
  isMobileView?: boolean;
  onNavigateToMap: () => void;
  onNavigateToTrips: () => void;
  onNavigateToChargers: () => void;
  onNavigateToAi: () => void;
  onNavigateToActivity: () => void;
  onSelectStation: (station: ChargingStation) => void;
  onStartTrip: (trip: Trip) => void;
  onSearchDestination?: (query: string) => void;
  onUpdateVehicle?: (updated: VehicleState) => void;
  onOpenQrScanner?: () => void;
  onTriggerToast?: (title: string, description?: string, type?: 'success' | 'warning' | 'info' | 'charging') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  vehicle,
  nearbyChargers,
  featuredTrip,
  isMobileView = false,
  onNavigateToMap,
  onNavigateToTrips,
  onNavigateToChargers,
  onNavigateToActivity,
  onSelectStation,
  onStartTrip,
  onSearchDestination,
  onUpdateVehicle,
  onOpenQrScanner,
  onTriggerToast,
}) => {
  const [destinationQuery, setDestinationQuery] = useState('');
  const [simulatedSoc, setSimulatedSoc] = useState(vehicle.currentSocPercent || 72);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const POPULAR_DESTINATIONS = [
    'Coimbatore Junction (NH544)',
    'Pondicherry Beach Road (ECR)',
    'Bengaluru Electronic City (NH44)',
    'Salem Zeon Fast Charger',
    'Pune Expressway Lonavala',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destinationQuery.trim()) {
      if (onSearchDestination) onSearchDestination(destinationQuery);
      onNavigateToTrips();
    }
  };

  const handleSelectSuggestion = (city: string) => {
    setDestinationQuery(city);
    setShowSuggestions(false);
    if (onSearchDestination) onSearchDestination(city);
    onNavigateToTrips();
  };

  const handleSocChange = (newSoc: number) => {
    setSimulatedSoc(newSoc);
    if (onUpdateVehicle) {
      onUpdateVehicle({
        ...vehicle,
        currentSocPercent: newSoc,
        estimatedRangeKm: Math.round(((vehicle.batteryCapacityKwh || 40.5) * 1000 / (vehicle.averageConsumptionWhPerKm || 130)) * (newSoc / 100)),
      });
    }
  };

  const recommendation = evaluateJourneyChargingRecommendation(
    featuredTrip,
    vehicle,
    featuredTrip.originLocation,
    nearbyChargers,
    simulatedSoc
  );

  const estimatedRangeKm = Math.round(
    ((vehicle.batteryCapacityKwh || 40.5) * 1000 / (vehicle.averageConsumptionWhPerKm || 130)) * (simulatedSoc / 100)
  );

  const headerSection = (
    <div className="space-y-3 font-[Inter,sans-serif] relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B0F0D] tracking-tight">Good morning, Vijay 👋</h1>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium">Where are you driving today in India?</p>
        </div>
        <div className="bg-[#EAF8EF] text-[#22C55E] text-xs font-bold px-3 py-1 rounded-full border border-[#22C55E]/30 flex items-center gap-1.5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
          <span>ZepGO AI Active</span>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="bg-white rounded-[20px] p-3.5 flex items-center gap-3 shadow-xs border border-[#E5E7EB] focus-within:border-[#22C55E] transition-all">
          <SearchIcon size={18} className="text-[#6B7280] shrink-0 ml-1" />
          <input
            type="text"
            value={destinationQuery}
            onChange={(e) => {
              setDestinationQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search destination (e.g. Coimbatore, Bengaluru, Salem)..."
            className="w-full text-xs sm:text-sm font-semibold text-[#0B0F0D] placeholder-[#6B7280] bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            className="p-2 rounded-[14px] bg-[#0B0F0D] hover:bg-[#1A221E] text-[#22C55E] transition-all shrink-0 cursor-pointer shadow-md"
            title="Search Destination"
          >
            <SearchIcon size={16} />
          </button>
          <button
            type="button"
            onClick={onNavigateToTrips}
            className="p-2 rounded-[14px] bg-[#F3F4F6] text-[#0B0F0D] hover:bg-slate-200 transition-all shrink-0 cursor-pointer"
            title="Preferences"
          >
            <SlidersIcon size={16} />
          </button>
        </div>

        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-[20px] shadow-2xl z-30 overflow-hidden p-2 space-y-1 animate-fadeIn">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-wider">Popular Indian EV Highways</span>
              <button
                type="button"
                onClick={() => setShowSuggestions(false)}
                className="text-[10px] text-[#6B7280] hover:text-[#0B0F0D]"
              >
                Close ✕
              </button>
            </div>
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => handleSelectSuggestion(dest)}
                className="w-full text-left px-3 py-2.5 rounded-[14px] text-xs font-bold text-[#0B0F0D] hover:bg-[#EAF8EF] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <MapPinIcon size={14} className="text-[#22C55E]" />
                <span>{dest}</span>
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );

  const batteryCard = (
    <div className="bg-white rounded-[24px] p-5 shadow-xs border border-[#E5E7EB] space-y-4 relative overflow-hidden font-[Inter,sans-serif]">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#6B7280]">India EV Telemetry</span>
          <h2 className="text-lg font-black text-[#0B0F0D] mt-0.5">{vehicle.brand} {vehicle.modelName}</h2>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-5xl font-black text-[#0B0F0D] tracking-tighter">{simulatedSoc}%</span>
            <span className="text-xs font-bold text-[#6B7280]">State of Charge</span>
          </div>

          <p className="text-xs font-black text-[#22C55E] mt-1">
            ⚡ ~{estimatedRangeKm} km real highway range
          </p>
        </div>

        <div className="w-24 h-20 bg-[#EAF8EF] rounded-[18px] border border-[#22C55E]/30 flex items-center justify-center p-2 shrink-0 shadow-xs text-center">
          <div>
            <CarFrontIcon size={32} className="text-[#0B0F0D] mx-auto" />
            <p className="text-[9px] font-black text-[#0B0F0D] uppercase tracking-wider mt-1">{vehicle.modelName}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="h-3.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden p-0.5 border border-[#E5E7EB]">
          <div
            className="h-full rounded-full transition-all duration-500 bg-[#22C55E]"
            style={{ width: `${simulatedSoc}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-semibold text-[#6B7280] px-0.5">
          <span>0 km</span>
          <span className="font-extrabold text-[#0B0F0D]">{estimatedRangeKm} km remaining</span>
          <span>312 km max ARAI</span>
        </div>
      </div>
    </div>
  );

  const confidenceScore = 94;

  const confidenceGaugeCard = (
    <div className="bg-white rounded-[24px] p-5 shadow-xs border border-[#E5E7EB] font-[Inter,sans-serif] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">ZepGO Neural Engine</span>
          <h2 className="text-sm font-black text-[#0B0F0D]">ROUTE RANGE CONFIDENCE</h2>
        </div>

        <div className="bg-[#EAF8EF] border border-[#22C55E]/40 text-[#22C55E] px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
          <ShieldCheck size={16} className="text-[#22C55E]" />
          <span className="text-xs font-black tracking-wide uppercase">LOW RISK</span>
        </div>
      </div>

      <div className="flex items-center gap-5 pt-1">
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#F3F4F6]"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#22C55E]"
              strokeDasharray={`${confidenceScore}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-[#0B0F0D] tracking-tighter">{confidenceScore}%</span>
            <span className="text-[9px] font-extrabold text-[#22C55E] uppercase">LOW RISK</span>
          </div>
        </div>

        <div className="space-y-1.5 min-w-0 flex-1">
          <h3 className="text-sm font-black text-[#0B0F0D]">
            Chennai → Coimbatore (342 km)
          </h3>
          <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
            1 Fast Charger stop planned at <strong className="text-[#0B0F0D]">Zeon Salem (150kW)</strong>. Predicted arrival SOC is 22% with 3/4 plugs open.
          </p>
        </div>
      </div>
    </div>
  );

  const todaysJourneyCard = (
    <div className="space-y-2 font-[Inter,sans-serif]">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B0F0D]">Today's Featured Route</h2>
        <button
          onClick={onNavigateToTrips}
          className="text-xs font-bold text-[#22C55E] hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>View 3 Options</span>
          <ChevronRightIcon size={14} />
        </button>
      </div>

      <div className="bg-white rounded-[24px] p-5 border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-[#6B7280]">📍 NH544 Highway Corridor</span>
            <h3 className="text-base sm:text-lg font-black text-[#0B0F0D] tracking-tight mt-0.5">
              Chennai Central → Coimbatore Junction
            </h3>
            <p className="text-xs text-[#6B7280] font-medium mt-0.5">
              342 km • Est. 5h 42m • 1 Charger Stop (Salem)
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase">Target Dest SOC</p>
            <p className="text-base font-black text-[#22C55E]">38%</p>
          </div>
        </div>

        <div className="bg-[#EAF8EF] rounded-[18px] p-3.5 border border-[#22C55E]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#22C55E] text-white font-bold text-xs flex items-center justify-center">
              ✓
            </span>
            <span className="text-xs font-black text-[#0B0F0D]">
              Predictive Plug Guarantee: Active (Zeon Salem)
            </span>
          </div>
          <span className="text-[10px] text-[#22C55E] font-extrabold bg-white px-2 py-0.5 rounded-md">94% Score</span>
        </div>

        <div className="bg-[#F8FAFC] rounded-[18px] p-3 border border-[#E5E7EB] flex items-start gap-2 text-xs">
          <Info size={16} className="text-[#22C55E] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#6B7280] leading-relaxed font-medium">
            <span className="font-bold text-[#0B0F0D]">ZepGO Forecast Insight:</span> Predicted arrival SOC at Salem charger is 22%. Charger is predicted to have 3 of 4 plugs open at 1:30 PM.
          </p>
        </div>

        <button
          onClick={() => onStartTrip(featuredTrip)}
          className="w-full py-4 rounded-[16px] bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold text-sm sm:text-base shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <NavigationIcon size={18} className="text-[#22C55E] fill-[#22C55E]" />
          <span>START LIVE JOURNEY NAVIGATION</span>
        </button>
      </div>
    </div>
  );

  const quickActionsGrid = (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 font-[Inter,sans-serif]">
      <button
        onClick={() => {
          if (featuredTrip) onStartTrip(featuredTrip);
          else onNavigateToTrips();
        }}
        className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white hover:bg-[#EAF8EF] rounded-[20px] border border-[#E5E7EB] shadow-2xs transition-all active:scale-95 space-y-2 group cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-[#0B0F0D] text-[#22C55E] flex items-center justify-center">
          <NavigationIcon size={18} />
        </div>
        <span className="text-[11px] sm:text-xs font-extrabold text-[#0B0F0D]">Start Trip</span>
      </button>

      <button
        onClick={onNavigateToChargers}
        className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white hover:bg-[#EAF8EF] rounded-[20px] border border-[#E5E7EB] shadow-2xs transition-all active:scale-95 space-y-2 group cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center">
          <ZapIcon size={18} />
        </div>
        <span className="text-[11px] sm:text-xs font-extrabold text-[#0B0F0D]">Find Charger</span>
      </button>

      <button
        onClick={() => {
          if (onOpenQrScanner) onOpenQrScanner();
          else onNavigateToChargers();
        }}
        className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white hover:bg-[#EAF8EF] rounded-[20px] border border-[#E5E7EB] shadow-2xs transition-all active:scale-95 space-y-2 group cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-[#0B0F0D] text-white flex items-center justify-center">
          <QrCodeIcon size={18} />
        </div>
        <span className="text-[11px] sm:text-xs font-extrabold text-[#0B0F0D]">Scan & Charge</span>
      </button>

      <button
        onClick={onNavigateToMap}
        className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white hover:bg-[#EAF8EF] rounded-[20px] border border-[#E5E7EB] shadow-2xs transition-all active:scale-95 space-y-2 group cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-[#EAF8EF] text-[#22C55E] border border-[#22C55E]/30 flex items-center justify-center">
          <MapPinIcon size={18} />
        </div>
        <span className="text-[11px] sm:text-xs font-extrabold text-[#0B0F0D]">Map View</span>
      </button>
    </div>
  );

  const recentActivitySection = (
    <div className="space-y-2 font-[Inter,sans-serif]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ReceiptIcon size={14} className="text-[#6B7280]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B0F0D]">Recent Charging Sessions</h2>
        </div>
        <button
          onClick={onNavigateToActivity}
          className="text-xs font-semibold text-[#6B7280] hover:text-[#0B0F0D] cursor-pointer"
        >
          View Log
        </button>
      </div>

      <div
        onClick={onNavigateToActivity}
        className="bg-white rounded-[20px] p-3.5 border border-[#E5E7EB] shadow-2xs hover:border-[#22C55E] transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EAF8EF] text-[#22C55E] flex items-center justify-center font-bold text-sm">
            ⚡
          </div>
          <div>
            <p className="text-xs font-bold text-[#0B0F0D]">Zeon Fast Charger Salem Bypass</p>
            <p className="text-[11px] text-[#6B7280] font-medium">24 mins • +58% battery added (120kW DC)</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs font-black text-[#22C55E]">₹691.00</p>
          <p className="text-[10px] text-[#6B7280]">Today, 1:30 PM</p>
        </div>
      </div>
    </div>
  );

  if (isMobileView) {
    return (
      <div className="w-full space-y-4 pb-20 pt-2 px-3 font-[Inter,sans-serif] overflow-x-hidden">
        {headerSection}
        <BatterySimulationControls
          currentSoc={simulatedSoc}
          onSocChange={handleSocChange}
          recommendation={recommendation}
        />
        {batteryCard}
        {confidenceGaugeCard}
        <VehicleControlBar
          vehicle={vehicle}
          onUpdateVehicle={onUpdateVehicle}
          onTriggerToast={onTriggerToast}
        />
        {todaysJourneyCard}
        {quickActionsGrid}
        {recentActivitySection}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-24 pt-2 px-2 sm:px-4 font-[Inter,sans-serif]">
      <BatterySimulationControls
        currentSoc={simulatedSoc}
        onSocChange={handleSocChange}
        recommendation={recommendation}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-5">
          {headerSection}
          {batteryCard}
          {confidenceGaugeCard}
          <VehicleControlBar
            vehicle={vehicle}
            onUpdateVehicle={onUpdateVehicle}
            onTriggerToast={onTriggerToast}
          />
          {quickActionsGrid}
          {recentActivitySection}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-5">
          {todaysJourneyCard}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B0F0D]">Predictive Chargers Near You</h2>
              <button
                onClick={onNavigateToChargers}
                className="text-xs font-semibold text-[#22C55E] hover:underline cursor-pointer"
              >
                Directory ({nearbyChargers.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {nearbyChargers.slice(0, 3).map((station) => (
                <div
                  key={station.id}
                  onClick={() => onSelectStation(station)}
                  className="bg-white rounded-[20px] p-3.5 border border-[#E5E7EB] shadow-2xs hover:border-[#22C55E] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EAF8EF] text-[#22C55E] flex items-center justify-center font-bold text-xs">
                      ⚡
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#0B0F0D]">{station.name}</p>
                      <p className="text-[10px] text-[#6B7280] font-medium">{station.distanceKm} km • {station.maxPowerKw} kW DC</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-[#22C55E] bg-[#EAF8EF] px-2.5 py-1 rounded-full border border-[#22C55E]/30">
                    🟢 {station.availablePlugs}/{station.totalPlugs} Free
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
