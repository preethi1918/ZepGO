import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onNext: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNext }) => {
  return (
    <div
      onClick={onNext}
      className="flex-1 bg-[#0B0F0D] text-white flex flex-col justify-between p-8 cursor-pointer relative overflow-hidden select-none animate-fadeIn"
    >
      {/* Soft Background Glow Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#22C55E]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <div className="pt-6 flex justify-between items-center z-10">
        <span className="text-[11px] font-bold tracking-widest text-[#22C55E] uppercase bg-[#22C55E]/10 px-3 py-1 rounded-full border border-[#22C55E]/20">
          ZepGO EV 2.0
        </span>
        <span className="text-xs text-slate-500 font-medium">Click to Launch</span>
      </div>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center justify-center my-auto text-center z-10 space-y-6">
        <div className="w-20 h-20 bg-[#22C55E] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#22C55E]/40 border-2 border-[#22C55E]/30 transform transition-transform hover:scale-105">
          <Zap className="w-10 h-10 text-[#0B0F0D] fill-[#0B0F0D]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Zep<span className="text-[#22C55E]">GO</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium max-w-[240px] mx-auto leading-relaxed">
            Intelligent EV Journey Planning & Charger Availability Prediction
          </p>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="space-y-4 z-10 pb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-4 px-6 rounded-[16px] shadow-lg shadow-[#22C55E]/25 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
        >
          <span>Get Started</span>
          <ArrowRight size={18} />
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          <span>Predictive Charger Reliability Engine</span>
        </div>
      </div>
    </div>
  );
};
