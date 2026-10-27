import React, { useState, useEffect } from 'react';
import { BatteryCard } from '../components/BatteryCard';
import { MapView } from '../components/MapView';
import { WhyThisCharger } from '../components/WhyThisCharger';
import { RiskBadge } from '../components/RiskBadge';
import { SOSPanel } from '../components/SOSPanel';
import { TripService, type TripPlanResult } from '../services/tripService';
import { ChargingService } from '../services/chargingService';
import {
  Navigation,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  PhoneCall,
  ChevronRight,
  MapPin,
  Car
} from 'lucide-react';

interface DashboardPageProps {
  onStartNavigation: () => void;
  onGoToPlanTrip: () => void;
  onGoToCharging?: () => void;
  onOpenSOS?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartNavigation,
  onGoToPlanTrip,
}) => {
  // State for vehicle and trip
  const [userName] = useState('Preethi');
  const [vehicleName] = useState('Tata Nexon EV Max');
  const [soc, setSoc] = useState(62);
  const [safetyReserve] = useState(18);
  const [destination] = useState('Coimbatore');
  const [origin] = useState('Salem');

  // Trip Data
  const [tripPlan, setTripPlan] = useState<TripPlanResult | null>(null);
  const [stations, setStations] = useState<any[]>([]);
  const [selectedStation, setSelectedStation] = useState<any | null>(null);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [, setIsLoading] = useState(false);

  // Dynamic conditions trigger simulation
  const [trafficSpike, setTrafficSpike] = useState(false);
  const [recalcBanner, setRecalcBanner] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const plan = await TripService.planTrip({
          origin,
          destination,
          vehicle_id: 'v-nexon-ev-max',
          current_soc_percent: soc,
          safety_reserve_percent: safetyReserve,
          traffic_factor: trafficSpike ? 1.4 : 1.0,
          ac_enabled: true
        });
        setTripPlan(plan);

        const stList = await ChargingService.getStations();
        setStations(stList);
        setSelectedStation(plan.primary_route?.recommended_charger?.station || stList[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [soc, safetyReserve, trafficSpike, origin, destination]);

  const handleSimulateTrafficSpike = async () => {
    setTrafficSpike(true);
    const recalc = await TripService.recalculateRoute({
      trip_id: tripPlan?.trip_id || 'demo-trip',
      current_distance_traveled_km: 30,
      current_soc_percent: soc - 10,
      traffic_spike: true
    });
    setRecalcBanner(recalc.alert_message);
  };

  const handleDismissRecalc = () => {
    setRecalcBanner(null);
    setTrafficSpike(false);
  };

  const primaryRoute = tripPlan?.primary_route;
  const recommendedCharger = primaryRoute?.recommended_charger;

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-800 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* TOP SECTION GREETING & CONTEXT (Prompt Section 10) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Good evening, {userName}
            </h1>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Connected
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-2">
            <Car size={14} className="text-emerald-600" />
            <span>Active EV: <strong className="text-slate-800">{vehicleName}</strong> (40.5 kWh Pack)</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">98% Battery Health</span>
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsSOSOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5 cursor-pointer transition shadow-xs"
          >
            <PhoneCall size={14} />
            <span>Emergency SOS</span>
          </button>
          <button
            onClick={onStartNavigation}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Navigation size={14} />
            <span>Start Navigation</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC RECALCULATION ALERT BANNER (Prompt Section 27) */}
      {recalcBanner && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Dynamic Recalculation Alert</h4>
              <p className="text-xs text-slate-700 mt-0.5">{recalcBanner}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setIsWhyModalOpen(true)}
              className="px-3 py-1.5 bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              View Safer Charger
            </button>
            <button
              onClick={handleDismissRecalc}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* TOP CARDS ROW: Battery, Destination & Trip Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Battery Card */}
        <BatteryCard
          socPercent={soc}
          batteryCapacityKwh={40.5}
          availableEnergyKwh={tripPlan?.available_energy_kwh || 25.1}
          estimatedRangeKm={tripPlan?.estimated_realistic_range_km || 184}
          safetyReservePercent={safetyReserve}
          interactive={true}
          onSocChange={setSoc}
        />

        {/* Destination Card (Prompt Section 10) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Trip Route</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Expressway NH544
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-400 font-bold">{origin}</span>
              <span className="text-slate-300">→</span>
              <span className="text-2xl font-black text-slate-900">{destination}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mt-3">
              <span>Trip Distance: <strong className="text-slate-800">{primaryRoute?.distance_km || 142} km</strong></span>
              <span>•</span>
              <span>ETA: <strong className="text-slate-800">{primaryRoute?.duration_formatted || '3h 20m'}</strong></span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Trip Status:</span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ✓ Safe to continue
            </span>
          </div>
        </div>

        {/* Quick Intelligence & Recalculate Simulation Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Intelligence Status</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Sparkles size={13} />
                XGBoost Hybrid
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time consumption models predict <strong>{primaryRoute?.energy_consumption_kwh || 20.8} kWh</strong> required.
              Arrival buffer exceeds safety margin by <strong>6%</strong>.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={handleSimulateTrafficSpike}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw size={13} className={trafficSpike ? 'animate-spin text-amber-600' : ''} />
              <span>Simulate Highway Traffic Spike</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN AREA: Interactive Map & Trip Overview Side Panel (Prompt Section 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INTERACTIVE MAP (2 Columns on large screens) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Interactive EV Navigation Map</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Click markers for details</span>
          </div>

          <MapView
            routePoints={primaryRoute?.waypoints}
            stations={stations}
            recommendedStationId={recommendedCharger?.station?.id || 'cs-zeon-salem'}
            onSelectStation={setSelectedStation}
            onOpenWhyThisCharger={(st) => {
              setSelectedStation(st);
              setIsWhyModalOpen(true);
            }}
            height="460px"
          />
        </div>

        {/* SIDE PANEL: TRIP OVERVIEW & RECOMMENDED CHARGER (Prompt Section 10 & 48) */}
        <div className="space-y-5">
          {/* Trip Overview Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Trip Overview</h3>
              <RiskBadge level={primaryRoute?.risk_level || 'LOW'} size="sm" />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100/60">
                <span className="text-slate-500">Distance:</span>
                <span className="font-bold text-slate-900">{primaryRoute?.distance_km || 142} km</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100/60">
                <span className="text-slate-500">Estimated Travel Time:</span>
                <span className="font-bold text-slate-900">{primaryRoute?.duration_formatted || '3h 20m'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100/60">
                <span className="text-slate-500">Expected Energy Consumption:</span>
                <span className="font-bold text-emerald-600">{primaryRoute?.energy_consumption_kwh || 20.8} kWh</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100/60">
                <span className="text-slate-500">Expected Arrival Battery:</span>
                <span className="font-extrabold text-slate-900">{primaryRoute?.arrival_soc_percent || 24}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100/60">
                <span className="text-slate-500">Safety Reserve:</span>
                <span className="font-bold text-rose-600">{safetyReserve}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Charging Required:</span>
                <span className={`font-black ${primaryRoute?.charging_required ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {primaryRoute?.charging_required ? 'Yes (En-route)' : 'No (Optional)'}
                </span>
              </div>
            </div>

            <button
              onClick={onGoToPlanTrip}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition"
            >
              <span>Explore 3 Route Options</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Recommended Charger Card (Prompt Section 48) */}
          {recommendedCharger && (
            <div className="bg-emerald-50/40 rounded-3xl p-5 border border-emerald-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  RECOMMENDED CHARGER
                </span>
                <RiskBadge level={recommendedCharger.risk_level || 'LOW'} size="sm" />
              </div>

              <div>
                <h4 className="font-black text-base text-slate-900">{recommendedCharger.station?.name || 'Zeon Salem Bypass Hub'}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {recommendedCharger.station?.distance_from_route_km || 0.2} km from route • {recommendedCharger.station?.charging_speed || 120} kW DC
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-xl border border-emerald-200/70">
                <div>
                  <span className="text-slate-400 block text-[11px]">Arrival Battery</span>
                  <span className="font-extrabold text-slate-900">{recommendedCharger.arrival_soc_percent || 27}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Charge Time</span>
                  <span className="font-extrabold text-emerald-700">{recommendedCharger.time_to_charge_minutes || 24} min</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Estimated Cost</span>
                  <span className="font-extrabold text-slate-900">₹{recommendedCharger.estimated_charging_cost_inr || 180}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Availability</span>
                  <span className="font-extrabold text-emerald-700">Available (3/4)</span>
                </div>
              </div>

              <button
                onClick={() => setIsWhyModalOpen(true)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition"
              >
                <Sparkles size={14} />
                <span>Why This Charger?</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* WHY THIS CHARGER MODAL */}
      {isWhyModalOpen && (
        <WhyThisCharger
          charger={recommendedCharger || selectedStation}
          onClose={() => setIsWhyModalOpen(false)}
          onNavigate={() => {
            setIsWhyModalOpen(false);
            onStartNavigation();
          }}
          isModal={true}
        />
      )}

      {/* SOS MODAL */}
      {isSOSOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <SOSPanel currentSoc={soc} onClose={() => setIsSOSOpen(false)} />
        </div>
      )}
    </div>
  );
};
