import React from 'react';
import { Sliders, CloudSun, Car, Route, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import type { EnvironmentalConditions, TrafficCondition, WeatherCondition, RoadCondition } from '../../types';

interface SimulatedControlPanelProps {
  conditions: EnvironmentalConditions;
  isOnline: boolean;
  onConditionChange: (newConditions: EnvironmentalConditions) => void;
  onToggleOnline: () => void;
  onReset: () => void;
}

export const SimulatedControlPanel: React.FC<SimulatedControlPanelProps> = ({
  conditions,
  isOnline,
  onConditionChange,
  onToggleOnline,
  onReset
}) => {
  const handleTrafficChange = (traffic: TrafficCondition) => {
    onConditionChange({ ...conditions, traffic });
  };

  const handleWeatherChange = (weather: WeatherCondition) => {
    onConditionChange({ ...conditions, weather });
  };

  const handleRoadChange = (road: RoadCondition) => {
    onConditionChange({ ...conditions, road });
  };

  return (
    <Card variant="solid" className="p-5 bg-slate-900/90 border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Developer & Prototype Control Panel
            </h3>
            <p className="text-[11px] text-slate-400">
              Simulate live environmental condition changes to trigger instant recalculation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleOnline}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isOnline
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Online' : 'Offline Mode Active'}</span>
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Reset to Normal Conditions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Traffic Simulation */}
        <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <label className="font-bold text-slate-300 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-cyan-400" />
            <span>Traffic Condition</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['normal', 'moderate', 'heavy'] as TrafficCondition[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTrafficChange(t)}
                className={`py-1.5 rounded-lg text-[11px] font-semibold capitalize border transition-all ${
                  conditions.traffic === t
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {t === 'normal' ? 'Normal' : t === 'moderate' ? 'Moderate' : 'Heavy (+10%)'}
              </button>
            ))}
          </div>
        </div>

        {/* Weather Simulation */}
        <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <label className="font-bold text-slate-300 flex items-center gap-1.5">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span>Weather Condition</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['normal', 'rain', 'extreme'] as WeatherCondition[]).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => handleWeatherChange(w)}
                className={`py-1.5 rounded-lg text-[11px] font-semibold capitalize border transition-all ${
                  conditions.weather === w
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {w === 'normal' ? 'Normal' : w === 'rain' ? 'Rain (+4%)' : 'Extreme (+8%)'}
              </button>
            ))}
          </div>
        </div>

        {/* Road Simulation */}
        <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <label className="font-bold text-slate-300 flex items-center gap-1.5">
            <Route className="w-3.5 h-3.5 text-emerald-400" />
            <span>Road Condition</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['good', 'congested', 'poor'] as RoadCondition[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoadChange(r)}
                className={`py-1.5 rounded-lg text-[11px] font-semibold capitalize border transition-all ${
                  conditions.road === r
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {r === 'good' ? 'Good' : r === 'congested' ? 'Congested' : 'Poor (+6%)'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
