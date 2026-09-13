import React from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

interface iPhoneMockupFrameProps {
  children: React.ReactNode;
  currentTime?: string;
  batterySoc?: number;
  showGlassReflection?: boolean;
}

export const IPhoneMockupFrame: React.FC<iPhoneMockupFrameProps> = ({
  children,
  currentTime = '9:41',
  batterySoc = 72,
  showGlassReflection = true,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-6 transition-all duration-300">
      {/* Outer Phone Hardware Chassis */}
      <div className="relative w-[390px] h-[844px] bg-[#111613] rounded-[52px] p-[12px] shadow-[0_30px_70px_-15px_rgba(11,15,13,0.35),0_0_0_1px_rgba(255,255,255,0.12)] border-[3px] border-[#2A342E] flex flex-col overflow-hidden transition-transform duration-300">
        
        {/* Hardware Side Buttons */}
        {/* Mute Switch */}
        <div className="absolute -left-[16px] top-[100px] w-[4px] h-[26px] bg-[#2A342E] rounded-l-md" />
        {/* Volume Up */}
        <div className="absolute -left-[16px] top-[145px] w-[4px] h-[48px] bg-[#2A342E] rounded-l-md" />
        {/* Volume Down */}
        <div className="absolute -left-[16px] top-[205px] w-[4px] h-[48px] bg-[#2A342E] rounded-l-md" />
        {/* Power / Lock Button */}
        <div className="absolute -right-[16px] top-[160px] w-[4px] h-[72px] bg-[#2A342E] rounded-r-md" />

        {/* Inner Screen Surface (390x844 view container) */}
        <div className="relative w-full h-full bg-[#FFFFFF] rounded-[42px] overflow-hidden flex flex-col select-none border border-slate-200/50 shadow-inner">
          
          {/* iOS Status Bar & Dynamic Island Header */}
          <div className="relative z-50 shrink-0 h-[44px] px-6 pt-3 flex items-center justify-between bg-transparent text-[#0B0F0D] font-medium text-[13px] tracking-tight">
            {/* Clock Time */}
            <span className="font-semibold text-xs tracking-tight">{currentTime}</span>

            {/* Dynamic Island Pill Notch */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[110px] h-[28px] bg-[#0B0F0D] rounded-full flex items-center justify-between px-3 shadow-sm border border-slate-800/80">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1E293B] border border-slate-700/50" />
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">ZEP</span>
              </div>
            </div>

            {/* Hardware Status Icons */}
            <div className="flex items-center gap-1.5 text-[#0B0F0D]">
              <Signal size={13} className="stroke-[2.5]" />
              <Wifi size={13} className="stroke-[2.5]" />
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-[#22C55E]">{batterySoc}%</span>
                <Battery size={15} className="stroke-[2] text-[#0B0F0D] fill-[#22C55E]" />
              </div>
            </div>
          </div>

          {/* Screen Content Container */}
          <div className="flex-1 w-full h-[calc(100%-44px-20px)] overflow-y-auto no-scrollbar relative flex flex-col">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="shrink-0 h-[20px] w-full flex items-center justify-center bg-transparent z-50">
            <div className="w-[130px] h-[4px] bg-[#0B0F0D]/80 rounded-full" />
          </div>

          {/* Subtle Screen Gloss & Reflection Overlay */}
          {showGlassReflection && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] rounded-[42px] z-40" />
          )}
        </div>
      </div>
    </div>
  );
};
