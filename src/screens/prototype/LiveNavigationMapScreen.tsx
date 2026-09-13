import React, { useState } from 'react';
import { Zap, AlertTriangle } from 'lucide-react';

interface LiveNavigationMapScreenProps {
  onArriveAtStation: () => void;
  onTriggerRiskAlert: () => void;
  onEndTrip: () => void;
}

export const LiveNavigationMapScreen: React.FC<LiveNavigationMapScreenProps> = ({
  onArriveAtStation,
  onTriggerRiskAlert,
  onEndTrip,
}) => {
  const [speedKmvh] = useState(82);

  return (
    <div className="flex-1 bg-[#0B0F0D] text-white flex flex-col justify-between relative overflow-hidden select-none animate-fadeIn">
      {/* Mock Interactive Canvas Map Area */}
      <div className="absolute inset-0 bg-[#0F172A] flex items-center justify-center">
        {/* Map Route Graphic Representation */}
        <svg className="w-full h-full opacity-60 pointer-events-none" viewBox="0 0 390 844">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
          </defs>
          {/* Simulated Highway Roads */}
          <path d="M 60 700 Q 150 450, 200 320 T 320 100" stroke="#334155" strokeWidth="18" fill="none" />
          <path
            d="M 60 700 Q 150 450, 200 320 T 320 100"
            stroke="url(#routeGrad)"
            strokeWidth="6"
            fill="none"
            strokeDasharray="8 4"
          />

          {/* Current Vehicle Position Pin */}
          <g transform="translate(180, 360)">
            <circle r="18" fill="#22C55E" fillOpacity="0.2" className="animate-ping" />
            <circle r="10" fill="#0B0F0D" stroke="#22C55E" strokeWidth="3" />
          </g>

          {/* Planned Charger Station Pin */}
          <g transform="translate(240, 230)">
            <rect x="-14" y="-14" width="28" height="28" rx="8" fill="#22C55E" stroke="#FFFFFF" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#0B0F0D" fontSize="12" fontWeight="bold">
              ⚡
            </text>
          </g>

          {/* Backup Charger Pin */}
          <g transform="translate(270, 210)">
            <circle r="8" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Top Overlay Turn-by-Turn Instruction Card */}
        <div className="absolute top-4 left-4 right-4 bg-[#0B0F0D]/90 backdrop-blur-md border border-slate-800 rounded-[20px] p-3.5 shadow-2xl flex items-center justify-between text-white z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22C55E] text-[#0B0F0D] rounded-2xl flex items-center justify-center font-black text-lg">
              ↑
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">In 2.4 km</span>
              <h4 className="text-xs font-extrabold text-white">Continue straight on NH544 Bypass</h4>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-[#22C55E]">{speedKmvh}</span>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">km/h</span>
          </div>
        </div>

        {/* Floating Quick Action Side Controls */}
        <div className="absolute right-4 top-24 flex flex-col gap-2.5 z-20">
          <button
            onClick={onTriggerRiskAlert}
            className="w-10 h-10 bg-[#FFFBEB] text-[#F59E0B] rounded-2xl border border-[#F59E0B]/40 flex items-center justify-center shadow-lg hover:scale-105 transition-all"
            title="Simulate Charger Risk Alert"
          >
            <AlertTriangle size={18} />
          </button>
          <button
            onClick={onEndTrip}
            className="w-10 h-10 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-700 transition-all text-xs font-bold"
            title="End Trip"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Floating Bottom Card: Next Charging Stop Telemetry */}
      <div className="relative z-30 m-4 mt-auto bg-[#0B0F0D]/95 backdrop-blur-md border border-slate-800 rounded-[24px] p-4 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">Next Charging Stop</span>
          </div>
          <span className="text-[11px] font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30 px-2.5 py-0.5 rounded-full">
            Predicted 94% Reliable
          </span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-white">Zeon Fast Charger Salem</h3>
            <p className="text-xs text-slate-400">84 km away • 42 mins remaining</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-[#22C55E] block">Arrival SOC: 22%</span>
            <span className="text-[10px] text-slate-400">Target SOC: 80% (24m)</span>
          </div>
        </div>

        {/* Real-time Plug Availability Status */}
        <div className="bg-[#1A221E] border border-slate-800 rounded-[16px] p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[#22C55E] fill-[#22C55E]" />
            <div>
              <span className="text-xs font-extrabold text-white block">3 / 4 CCS2 Plugs Open</span>
              <span className="text-[10px] text-slate-400">No wait predicted at 1:30 PM</span>
            </div>
          </div>
          <button
            onClick={onArriveAtStation}
            className="bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold text-xs py-2 px-3 rounded-xl transition-all shadow-md active:scale-95"
          >
            Arrive & Plug In ⚡
          </button>
        </div>
      </div>
    </div>
  );
};
