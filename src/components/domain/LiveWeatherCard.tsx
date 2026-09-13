import React from 'react';
import type { RealtimeWeatherData } from '../../services/api/weatherService';

export interface LiveWeatherCardProps {
  weather: RealtimeWeatherData | null;
  isLoading?: boolean;
  lastUpdated?: string;
  onRefresh?: () => void;
}

export const LiveWeatherCard: React.FC<LiveWeatherCardProps> = ({
  weather,
  isLoading,
  lastUpdated,
  onRefresh,
}) => {
  if (isLoading || !weather) {
    return (
      <div className="bg-slate-900 text-white rounded-2xl p-4 animate-pulse border border-slate-800 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-slate-800 rounded"></div>
          <div className="h-5 w-48 bg-slate-800 rounded"></div>
        </div>
        <div className="h-8 w-16 bg-slate-800 rounded-xl"></div>
      </div>
    );
  }

  const isPositive = weather.rangeImpactPercent >= 0;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-4 shadow-md border border-slate-800 relative overflow-hidden">
      {/* Glow highlight background decoration */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{weather.isDaytime ? '☀️' : '🌙'}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-300">Live Weather & EV Range</h3>
              {lastUpdated && (
                <span className="text-[10px] text-slate-400">Synced {lastUpdated}</span>
              )}
            </div>
            <p className="text-sm font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
              <span>{weather.temperatureC}°C {weather.weatherDescription}</span>
              <span className="text-slate-400 font-normal text-xs">• Wind {weather.windSpeedKmh} km/h</span>
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all active:scale-95 border border-slate-700"
          title="Refresh Live Weather"
        >
          🔄
        </button>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Range Impact:</span>
          <span className="font-semibold text-slate-200">{weather.impactReason}</span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border shrink-0 ${
            isPositive
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
              : 'bg-amber-950/80 text-amber-400 border-amber-800/80'
          }`}
        >
          {isPositive ? `+${weather.rangeImpactPercent}% Efficiency` : `${weather.rangeImpactPercent}% Range`}
        </span>
      </div>
    </div>
  );
};
