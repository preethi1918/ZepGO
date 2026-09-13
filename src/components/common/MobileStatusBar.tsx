import React, { useState, useEffect } from 'react';

export interface MobileStatusBarProps {
  batterySoc?: number;
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({ batterySoc = 85 }) => {
  const [timeString, setTimeString] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setTimeString(`${hours}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-slate-900 text-white px-6 py-2 flex items-center justify-between text-xs font-semibold select-none rounded-t-[32px] sm:rounded-t-[32px]">
      {/* Time & Location Pill */}
      <div className="flex items-center gap-1.5">
        <span className="font-black tracking-tight text-[13px]">{timeString}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" title="GPS Active" />
      </div>

      {/* Center Camera Notch Simulator */}
      <div className="w-20 h-4 bg-black rounded-full border border-slate-800 flex items-center justify-center gap-1">
        <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
      </div>

      {/* Network & Battery Status Icons */}
      <div className="flex items-center gap-2 text-[11px] text-slate-300">
        <span className="font-bold tracking-tighter text-[10px]">5G</span>
        {/* Signal Bars */}
        <div className="flex items-end gap-0.5 h-3">
          <div className="w-0.5 h-1 bg-white rounded-xs" />
          <div className="w-0.5 h-1.5 bg-white rounded-xs" />
          <div className="w-0.5 h-2 bg-white rounded-xs" />
          <div className="w-0.5 h-2.5 bg-white rounded-xs" />
        </div>
        {/* Wifi */}
        <span className="text-[10px]" title="Wi-Fi">📶</span>
        {/* Battery Pill */}
        <div className="flex items-center gap-1">
          <div className="w-5 h-2.5 rounded-xs border border-white/80 p-0.5 flex items-center relative">
            <div
              className={`h-full rounded-2xs ${batterySoc <= 20 ? 'bg-amber-500' : 'bg-emerald-400'}`}
              style={{ width: `${Math.min(100, Math.max(10, batterySoc))}%` }}
            />
            <div className="w-0.5 h-1 bg-white/80 absolute -right-1 top-0.5 rounded-r-2xs" />
          </div>
          <span className="text-[10px] font-bold">{batterySoc}%</span>
        </div>
      </div>
    </div>
  );
};
