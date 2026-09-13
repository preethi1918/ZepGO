import React, { useState, useEffect } from 'react';
import type { Trip } from '../../types/trip';
import { NavigationIcon, ZapIcon, AlertTriangleIcon, XIcon } from '../common/Icons';

export interface LiveJourneyOverlayProps {
  trip: Trip;
  onClose: () => void;
}

export const LiveJourneyOverlay: React.FC<LiveJourneyOverlayProps> = ({ trip, onClose }) => {
  const [currentSpeed, setCurrentSpeed] = useState(88); // km/h
  const [distanceRemaining, setDistanceRemaining] = useState(trip.totalDistanceKm);
  const [currentSoc, setCurrentSoc] = useState(trip.startSocPercent);
  const [isPlaying, setIsPlaying] = useState(true);
  const [maneuver, setManeuver] = useState('In 800m, continue straight on Highway');
  const [showRerouteAlert, setShowRerouteAlert] = useState(false);
  const [rerouted, setRerouted] = useState(false);

  // Turn-by-turn navigation simulation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDistanceRemaining((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          return 0;
        }
        return Math.max(0, prev - 1);
      });

      setCurrentSoc((prev) => {
        if (prev <= 10) return prev;
        return Math.max(10, Math.round((prev - 0.15) * 10) / 10);
      });

      // Fluctuate speed slightly
      setCurrentSpeed(Math.floor(82 + Math.random() * 12));
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Simulate dynamic traffic event after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRerouteAlert(true);
      setManeuver('⚠️ Traffic delay ahead (+14 mins). Alternative route available.');
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleAcceptReroute = () => {
    setRerouted(true);
    setShowRerouteAlert(false);
    setManeuver('✅ Route Updated: Saved 12 mins via Tata Power 120kW Fast Charger');
  };

  const nextStop = trip.stops[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-[Inter,sans-serif] animate-in fade-in duration-300">
      {/* Top Turn Instruction Banner */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/10 text-white backdrop-blur-xs">
            <NavigationIcon size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Phase 11 Live Navigation</span>
            <h2 className="text-sm font-bold leading-tight">{maneuver}</h2>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Exit Live Mode"
        >
          <XIcon size={20} />
        </button>
      </div>

      {/* Dynamic Re-Routing Event Banner (Phase 12) */}
      {showRerouteAlert && !rerouted && (
        <div className="m-3 p-3.5 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <AlertTriangleIcon size={20} className="shrink-0" />
            <div>
              <p className="text-xs font-bold">Phase 12: Dynamic Re-Routing Triggered</p>
              <p className="text-[11px] font-medium opacity-90">Heavy traffic delay on highway. Switch charger station?</p>
            </div>
          </div>
          <button
            onClick={handleAcceptReroute}
            className="px-3 py-1.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-900 shrink-0 transition-all active:scale-95"
          >
            Accept Reroute
          </button>
        </div>
      )}

      {/* Map Simulation Workspace */}
      <div className="flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center">
        {/* Animated GPS Navigation Cursor */}
        <div className="relative flex flex-col items-center justify-center text-center p-6">
          <div className="relative w-28 h-28 rounded-full border-4 border-blue-500/30 flex items-center justify-center bg-blue-950/40 backdrop-blur-md shadow-2xl animate-pulse">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg transform -rotate-45">
              <NavigationIcon size={32} />
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <span className="text-3xl font-black text-white">{currentSpeed} <span className="text-sm font-medium text-slate-400">km/h</span></span>
            <p className="text-xs font-semibold text-blue-400">Heading towards {trip.destinationName}</p>
          </div>
        </div>

        {/* Live HUD Floating Widget */}
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-white space-y-2 w-48 shadow-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Live Battery</span>
            <span className="font-bold text-emerald-400">{currentSoc}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div style={{ width: `${currentSoc}%` }} className="h-full bg-emerald-500 rounded-full" />
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
            <span className="text-slate-400">Distance Left</span>
            <span className="font-bold">{distanceRemaining} km</span>
          </div>
        </div>
      </div>

      {/* Bottom Live Controls Card */}
      <div className="bg-slate-900 p-4 border-t border-slate-800 text-white space-y-3">
        {nextStop && (
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ZapIcon size={16} className="text-amber-400" />
              <div>
                <p className="font-bold">{nextStop.stationName}</p>
                <p className="text-[10px] text-slate-400">Next Charging Stop • In {nextStop.distanceFromOriginKm} km</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-[11px]">
              Target {nextStop.targetSocPercent}%
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-lg"
          >
            <span>{isPlaying ? 'Pause Simulation' : 'Resume Navigation'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-300 transition-all"
          >
            End Journey
          </button>
        </div>
      </div>
    </div>
  );
};
