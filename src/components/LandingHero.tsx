import React from 'react';
import { Sparkles, Zap, ArrowRight, ShieldCheck, MapPin, Gauge, Radio, CheckCircle2 } from 'lucide-react';

interface LandingHeroProps {
  onStartPlanner: () => void;
  onExploreMap: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartPlanner, onExploreMap }) => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden my-6 border border-slate-800">
      {/* Subtle Glow backdrop */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left: Text Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Smart EV Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Drive Smarter <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
              With AI Journey Intelligence
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            ZepGo predicts EV charging needs <strong>before you start your trip</strong>, monitors route traffic in real time, and dynamically recommends optimal chargers based on battery, weather degradation, and live queue times.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartPlanner}
              className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Get Started – Pre-Trip Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreMap}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>Explore Live Station Map</span>
            </button>
          </div>

          {/* Key Value Props */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pre-Trip Range Prediction</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Dynamic Re-routing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Live Port Availability</span>
            </div>
          </div>
        </div>

        {/* Right: Premium Interactive EV Dashboard Graphic Preview */}
        <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-extrabold text-xs text-slate-200">ZepGo Active AI Telemetry</span>
            </div>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider bg-sky-950 px-2 py-0.5 rounded-md border border-sky-800">
              Tesla Model Y
            </span>
          </div>

          {/* Interactive Range Gauge Graphic */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pre-Trip Recommendation</span>
              <h4 className="font-extrabold text-white text-sm mt-0.5">Charge at GreenCharge Hub</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">250 kW | 0 min queue | $0.38/kWh</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-sky-400">97/100</span>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">AI Score</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-semibold">Predicted Battery</span>
              <span className="font-black text-emerald-400 text-base">38% Safe</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-semibold">Range Confidence</span>
              <span className="font-black text-sky-400 text-base">92% High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
