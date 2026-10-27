import React, { useState, useEffect } from 'react';
import {
  Navigation,
  AlertTriangle,
  RefreshCw,
  X
} from 'lucide-react';
import { MapView } from '../components/MapView';
import { TripService } from '../services/tripService';

interface NavigationPageProps {
  onEndNavigation: () => void;
  onGoToCharging: () => void;
}

export const NavigationPage: React.FC<NavigationPageProps> = ({
  onEndNavigation,
  onGoToCharging
}) => {
  // Live trip simulation state
  const [speedKmh, setSpeedKmh] = useState(74);
  const [distanceRemainingKm, setDistanceRemainingKm] = useState(87.4);
  const [soc, setSoc] = useState(41);
  const [arrivalSoc, setArrivalSoc] = useState(23);
  const etaFormatted = '1h 14m';
  const estimatedRangeKm = Math.round(soc * 2.9);

  // Recalculation alert
  const [recalcAlert, setRecalcAlert] = useState<{
    show: boolean;
    title: string;
    message: string;
    newCharger: string;
  } | null>(null);

  // Automatic distance decrement interval for realistic live driving experience
  useEffect(() => {
    const timer = setInterval(() => {
      setDistanceRemainingKm((prev) => Math.max(0, Number((prev - 0.2).toFixed(1))));
      setSpeedKmh(Math.floor(70 + Math.random() * 8));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateConditionChange = async () => {
    const res = await TripService.recalculateRoute({
      trip_id: 'live-trip-salem-cbe',
      current_distance_traveled_km: 55,
      current_soc_percent: soc - 8,
      traffic_spike: true
    });

    setSoc((prev) => Math.max(12, prev - 8));
    setArrivalSoc(res.updated_arrival_soc);
    setRecalcAlert({
      show: true,
      title: res.alert_title,
      message: res.alert_message,
      newCharger: res.updated_recommended_charger?.station?.name || 'Zeon Fast Charging Hub - Salem Bypass'
    });
  };

  return (
    <div className="flex-1 bg-[#0F172A] text-white flex flex-col h-full relative font-[Inter,sans-serif]">
      {/* TOP TURN-BY-TURN GUIDANCE BANNER */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
            <Navigation size={26} className="fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white">In 800 meters</span>
              <span className="text-xs bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-md">NH544</span>
            </div>
            <p className="text-xs text-slate-400">Keep straight towards Coimbatore / Perundurai Toll Plaza</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateConditionChange}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 flex items-center gap-1.5 cursor-pointer"
            title="Simulate sudden traffic spike / increased consumption"
          >
            <RefreshCw size={13} />
            <span>Simulate Traffic Spike</span>
          </button>

          <button
            onClick={onEndNavigation}
            className="px-4 py-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 rounded-xl text-xs font-black cursor-pointer"
          >
            End Trip
          </button>
        </div>
      </div>

      {/* DYNAMIC RECALCULATION FLOATING MODAL */}
      {recalcAlert?.show && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border-2 border-amber-400 p-5 rounded-3xl shadow-2xl max-w-lg w-[90%] text-white animate-in zoom-in-95">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wider">
              <AlertTriangle size={18} />
              <span>{recalcAlert.title}</span>
            </div>
            <button onClick={() => setRecalcAlert(null)} className="text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">{recalcAlert.message}</p>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-1 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-400">New Safety Recommendation:</span>
              <span className="font-extrabold text-emerald-400">{recalcAlert.newCharger}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Updated Arrival SOC:</span>
              <span className="font-bold text-amber-400">{arrivalSoc}% (Safety Buffer Active)</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setRecalcAlert(null);
                onGoToCharging();
              }}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer"
            >
              Accept New Charger Route
            </button>
            <button
              onClick={() => setRecalcAlert(null)}
              className="px-4 py-2.5 bg-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Keep Current Route
            </button>
          </div>
        </div>
      )}

      {/* LIVE MAP LAYER */}
      <div className="flex-1 relative">
        <MapView height="100%" />

        {/* FLOATING TELEMETRY HUD (Prompt Section 26) */}
        <div className="absolute bottom-6 left-6 right-6 z-[1000] max-w-3xl mx-auto bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 border border-slate-800 shadow-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Vehicle Speed</span>
            <div className="flex items-baseline justify-center gap-1 mt-0.5">
              <span className="text-3xl font-black text-white">{speedKmh}</span>
              <span className="text-xs text-slate-400 font-bold">km/h</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Remaining / ETA</span>
            <div className="flex items-baseline justify-center gap-1 mt-0.5">
              <span className="text-3xl font-black text-white">{distanceRemainingKm}</span>
              <span className="text-xs text-slate-400 font-bold">km ({etaFormatted})</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Live Battery</span>
            <div className="flex items-baseline justify-center gap-1 mt-0.5">
              <span className={`text-3xl font-black ${soc < 20 ? 'text-rose-500' : 'text-emerald-400'}`}>{soc}%</span>
              <span className="text-xs text-slate-400 font-bold">({estimatedRangeKm} km)</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Arrival Estimate</span>
            <div className="flex items-baseline justify-center gap-1 mt-0.5">
              <span className="text-3xl font-black text-white">{arrivalSoc}%</span>
              <span className="text-xs text-emerald-400 font-bold">Safe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
