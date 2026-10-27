import React, { useState } from 'react';
import { IPhoneMockupFrame } from '../frame/iPhoneMockupFrame';
import { Screen1RoutePlanning } from './Screen1RoutePlanning';
import { Screen2Recommendation } from './Screen2Recommendation';
import { Screen3Sync } from './Screen3Sync';
import { Screen4RouteUpdated } from './Screen4RouteUpdated';
import { Screen5LiveNav } from './Screen5LiveNav';
import { WebSmartStopDashboard } from './WebSmartStopDashboard';
import { ChevronLeft, ChevronRight, Sparkles, Zap, Smartphone, Monitor } from 'lucide-react';

export const SmartStopSuiteMaster: React.FC = () => {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [deviceFormat, setDeviceFormat] = useState<'mobile' | 'web'>('mobile');

  const screenSteps = [
    { name: 'Screen 1 — Route Planning + Detection', label: '1. Route & Detect' },
    { name: 'Screen 2 — Smart Stop Recommendation', label: '2. Stop Details' },
    { name: 'Screen 3 — Charging + Cafe Sync (Novelty)', label: '3. Charge & Cafe Sync' },
    { name: 'Screen 4 — Route Updated', label: '4. Route Updated' },
    { name: 'Screen 5 — Live Navigation + Alert', label: '5. Live Navigation' },
  ];

  const renderActiveMobileScreen = () => {
    switch (activeScreenIndex) {
      case 0:
        return <Screen1RoutePlanning onViewSmartStop={() => setActiveScreenIndex(1)} />;
      case 1:
        return (
          <Screen2Recommendation
            onUseThisStop={() => setActiveScreenIndex(2)}
            onBack={() => setActiveScreenIndex(0)}
          />
        );
      case 2:
        return (
          <Screen3Sync
            onAddSmartStop={() => setActiveScreenIndex(3)}
            onBack={() => setActiveScreenIndex(1)}
          />
        );
      case 3:
        return (
          <Screen4RouteUpdated
            onStartNavigation={() => setActiveScreenIndex(4)}
            onBack={() => setActiveScreenIndex(2)}
          />
        );
      case 4:
        return <Screen5LiveNav onResetFlow={() => setActiveScreenIndex(0)} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-[#090D0B] text-white flex flex-col font-[Inter,sans-serif] select-none min-h-screen">
      {/* Sub-Toolbar: 5-Screen Flow & Device View Format Controller */}
      <div className="bg-[#111613] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-40 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#22C55E] text-[#0B0F0D] rounded-xl flex items-center justify-center font-black shadow-md shadow-[#22C55E]/20">
            <Zap size={16} className="fill-[#0B0F0D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white tracking-wider">Smart Stop & Cafe Sync Flow</span>
              <span className="text-[10px] font-extrabold bg-[#22C55E]/15 text-[#22C55E] px-2 py-0.5 rounded-full border border-[#22C55E]/30">
                5 Screens / States
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Streamlined EV Journey & Rest Stop Synchronization</p>
          </div>
        </div>

        {/* Step Navigation Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {screenSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveScreenIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeScreenIndex === idx
                  ? 'bg-[#22C55E] text-[#0B0F0D] font-extrabold shadow-md shadow-[#22C55E]/20'
                  : 'bg-[#161C19] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  activeScreenIndex === idx ? 'bg-[#0B0F0D] text-[#22C55E]' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {idx + 1}
              </span>
              <span>{step.label}</span>
            </button>
          ))}
        </div>

        {/* Device View Format Switcher (Mobile App vs Web Desktop) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#161C19] border border-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setDeviceFormat('mobile')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                deviceFormat === 'mobile'
                  ? 'bg-[#22C55E] text-[#0B0F0D] font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span>Mobile 📱</span>
            </button>

            <button
              onClick={() => setDeviceFormat('web')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                deviceFormat === 'web'
                  ? 'bg-[#22C55E] text-[#0B0F0D] font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor size={14} />
              <span>Web Dashboard 💻</span>
            </button>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            <button
              onClick={() => setActiveScreenIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeScreenIndex === 0}
              className="p-1.5 bg-[#161C19] hover:bg-slate-800 disabled:opacity-30 rounded-xl border border-slate-800 text-white cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setActiveScreenIndex((prev) => Math.min(4, prev + 1))}
              disabled={activeScreenIndex === 4}
              className="p-1.5 bg-[#161C19] hover:bg-slate-800 disabled:opacity-30 rounded-xl border border-slate-800 text-white cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ZEPGO CORE DIFFERENTIATOR BANNER */}
      <div className="bg-gradient-to-r from-[#142318] via-[#121A15] to-[#142318] border-b border-[#22C55E]/20 px-4 py-2 text-center flex items-center justify-center gap-2 shrink-0">
        <Sparkles size={14} className="text-[#22C55E]" />
        <p className="text-xs font-extrabold text-white">
          <span className="text-[#22C55E]">ZepGO Core Differentiator:</span> "ZepGO doesn't just find where to charge. It finds the best place to charge AND what you can do while charging."
        </p>
      </div>

      {/* RENDER SELECTED FORMAT (MOBILE FRAME vs WEB DESKTOP DASHBOARD) */}
      <div className="flex-1 flex overflow-hidden">
        {deviceFormat === 'mobile' ? (
          <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto no-scrollbar">
            <IPhoneMockupFrame>{renderActiveMobileScreen()}</IPhoneMockupFrame>
          </div>
        ) : (
          <WebSmartStopDashboard
            initialStateIndex={activeScreenIndex}
            onStateChange={setActiveScreenIndex}
          />
        )}
      </div>
    </div>
  );
};
