import React from 'react';
import { MapPin, Zap, Coffee, Navigation, Clock, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const RouteMap: React.FC = () => {
  return (
    <Card variant="solid" className="relative overflow-hidden p-5 bg-white border-slate-200 space-y-4 shadow-sm">
      {/* Map Header Overlay */}
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              LIVE NAVIGATION ROUTE MAP
            </h3>
            <p className="text-sm font-extrabold text-slate-900">Chennai → Salem → Coimbatore (510 km)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" icon={<Navigation className="w-3 h-3" />}>
            Traffic Normal
          </Badge>
          <Badge variant="info" icon={<Clock className="w-3 h-3" />}>
            7h 15m
          </Badge>
        </div>
      </div>

      {/* Simulated Vector Route Map Container */}
      <div className="relative w-full h-80 rounded-2xl bg-slate-100/90 border border-slate-200 overflow-hidden flex items-center justify-center p-4">
        {/* Light map grid lines pattern */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #CBD5E1 1px, transparent 1px), linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        {/* Ambient route tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-emerald-500/5 pointer-events-none" />

        {/* SVG Route Line & Animated pulses */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 220" preserveAspectRatio="none">
          {/* Main route path line */}
          <path
            d="M 50,150 C 140,170 210,60 320,120 L 450,70"
            stroke="#16A34A"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Animated dashed progress line */}
          <path
            d="M 50,150 C 140,170 210,60 320,120 L 450,70"
            stroke="#22C55E"
            strokeWidth="2"
            strokeDasharray="8 8"
            fill="none"
            strokeLinecap="round"
            className="animate-pulse"
          />
        </svg>

        {/* Node 1: Chennai (Origin) */}
        <div className="absolute left-[8%] bottom-[22%] flex flex-col items-center group cursor-pointer z-10">
          <div className="p-2 rounded-full bg-[#16A34A] text-white shadow-md ring-4 ring-emerald-100">
            <MapPin className="w-4 h-4 fill-white" />
          </div>
          <span className="mt-1 text-[11px] font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-xs">
            Chennai (Origin)
          </span>
        </div>

        {/* Node 2: Primary Charger (Tata Power 250kW Salem) */}
        <div className="absolute left-[54%] top-[32%] flex flex-col items-center group cursor-pointer z-10">
          <div className="relative">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-50" />
            <div className="relative p-2 rounded-full bg-[#16A34A] text-white shadow-md">
              <Zap className="w-4 h-4 fill-white" />
            </div>
          </div>
          <div className="mt-1 text-center bg-white p-1.5 rounded-xl border border-emerald-200 shadow-sm max-w-[140px]">
            <span className="text-[10px] font-extrabold text-emerald-700 block">Primary Charger</span>
            <span className="text-[9px] text-slate-600 block">Tata Power 250kW (Available)</span>
          </div>
        </div>

        {/* Node 3: Backup Charger (Zeon Charging Salem Bypass) */}
        <div className="absolute left-[70%] top-[45%] flex flex-col items-center group cursor-pointer z-10">
          <div className="p-1.5 rounded-full bg-blue-600 text-white shadow-md">
            <Zap className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="text-[9px] text-blue-700 font-extrabold bg-white px-2 py-0.5 rounded-lg border border-blue-200 shadow-xs">
            Backup: Zeon 150kW
          </span>
        </div>

        {/* Marker 4: Smart Stop (Green Leaf Café) */}
        <div className="absolute left-[34%] bottom-[38%] flex flex-col items-center group cursor-pointer z-10">
          <div className="p-1.5 rounded-full bg-amber-500 text-white shadow-xs">
            <Coffee className="w-3.5 h-3.5" />
          </div>
          <span className="text-[9px] text-amber-800 font-bold bg-white px-1.5 rounded-md border border-amber-200">
            Green Leaf Café
          </span>
        </div>

        {/* Marker 5: Destination (Coimbatore) */}
        <div className="absolute right-[6%] top-[18%] flex flex-col items-center group cursor-pointer z-10">
          <div className="p-2 rounded-full bg-blue-600 text-white shadow-md ring-4 ring-blue-100">
            <Navigation className="w-4 h-4 fill-white" />
          </div>
          <span className="mt-1 text-[11px] font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-xs">
            Coimbatore (End)
          </span>
        </div>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#16A34A] inline-block" />
            <span className="text-slate-800 font-semibold">Primary Charger</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <span className="text-slate-800 font-semibold">Backup Charger</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="text-slate-800 font-semibold">Smart Rest Stop</span>
          </span>
        </div>
        <span className="text-emerald-700 font-bold flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Optimal Route Verified</span>
        </span>
      </div>
    </Card>
  );
};
