import React from 'react';
import { X, Zap, Sparkles, CheckCircle2, Layers, Cpu, Globe, ArrowRight } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-100 space-y-6 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white flex items-center justify-center shadow-md">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">ZepGo – Project Overview</h2>
            <p className="text-xs text-sky-600 font-bold">Go Smart. Charge Smarter.</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-slate-800 space-y-2">
            <h3 className="font-extrabold text-sky-950 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Main Innovation: Pre-Trip Range Anxiety Prediction
            </h3>
            <p className="text-xs">
              Unlike traditional turn-by-turn navigation apps that notify you when your battery is already depleted mid-journey, <strong>ZepGo evaluates charging requirements BEFORE the trip starts</strong> by analyzing mountain elevation, weather temperature loss, driver speed, and AC climate load.
            </p>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-2">AI Charging Recommendation Weights</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sky-600 block">30%</span>
                <span className="text-slate-500 text-[11px]">Battery Safety</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-emerald-600 block">20%</span>
                <span className="text-slate-500 text-[11px]">Waiting Time</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">15%</span>
                <span className="text-slate-500 text-[11px]">Charging Cost</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-indigo-600 block">15%</span>
                <span className="text-slate-500 text-[11px]">Detour Distance</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-2">Future Roadmap</h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Charging Slot Reservation & Instant Digital Payments</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Battery Degradation SOH AI Prediction</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Vehicle-to-Grid (V2G) Energy Trading</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Solar & Renewable Energy Preferred Charging Times</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all cursor-pointer"
          >
            Close Project Summary
          </button>
        </div>
      </div>
    </div>
  );
};
