import React, { useState } from 'react';
import type { RoadTypeBreakdown } from '../../types/trip';
import { RouteIcon } from '../common/Icons';

export interface RoadTypeEnergyCardProps {
  roadTypes?: RoadTypeBreakdown;
  elevationGainMeters?: number;
  baseWhPerKm?: number;
}

export const RoadTypeEnergyCard: React.FC<RoadTypeEnergyCardProps> = ({
  roadTypes = { highwayPercent: 70, urbanPercent: 20, hillyPercent: 10 },
  elevationGainMeters = 420,
  baseWhPerKm = 130,
}) => {
  const [speedStyle, setSpeedStyle] = useState<'eco' | 'normal' | 'sport'>('normal');
  const [acTemp, setAcTemp] = useState<number>(23); // 23°C AC

  // Speed multiplier
  const speedMult = speedStyle === 'eco' ? 0.88 : speedStyle === 'sport' ? 1.22 : 1.0;
  // AC load multiplier
  const acMult = acTemp <= 20 ? 1.12 : acTemp <= 23 ? 1.05 : 1.0;
  // Road terrain multiplier
  const terrainMult = 1.0 + (roadTypes.hillyPercent / 100) * 0.35 + (elevationGainMeters / 1000) * 0.1;

  const adjustedWhPerKm = Math.round(baseWhPerKm * speedMult * acMult * terrainMult);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <RouteIcon size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Phase 6 Energy Prediction</span>
            <h3 className="text-sm font-bold text-slate-900">Road Type & Terrain Model</h3>
          </div>
        </div>
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
          {adjustedWhPerKm} Wh/km
        </span>
      </div>

      {/* Road Types Distribution Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
          <span>Highway ({roadTypes.highwayPercent}%)</span>
          <span>Urban ({roadTypes.urbanPercent}%)</span>
          <span>Hilly ({roadTypes.hillyPercent}%)</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-lg overflow-hidden flex">
          <div
            style={{ width: `${roadTypes.highwayPercent}%` }}
            className="bg-blue-600 h-full"
            title="Highway (120 km/h)"
          />
          <div
            style={{ width: `${roadTypes.urbanPercent}%` }}
            className="bg-emerald-500 h-full"
            title="Urban (40-60 km/h)"
          />
          <div
            style={{ width: `${roadTypes.hillyPercent}%` }}
            className="bg-amber-500 h-full"
            title="Hilly (+ Elevation)"
          />
        </div>
      </div>

      {/* Interactive Driving & Weather Factors */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Driving Style Toggle */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Driving Speed Profile</span>
          <div className="flex bg-slate-200/70 p-0.5 rounded-lg">
            {(['eco', 'normal', 'sport'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSpeedStyle(mode)}
                className={`flex-1 py-1 rounded-md text-[10px] font-bold capitalize transition-all ${
                  speedStyle === mode ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* AC / Temperature Load */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
            <span>Cabin AC Temp</span>
            <span className="text-blue-600">{acTemp}°C</span>
          </div>
          <input
            type="range"
            min="18"
            max="26"
            value={acTemp}
            onChange={(e) => setAcTemp(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer mt-1"
          />
        </div>
      </div>

      {/* Energy Metrics Summary */}
      <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
        <span>Slope & Elevation: <strong>+{elevationGainMeters}m</strong></span>
        <span>HVAC Load Impact: <strong>+{(acMult * 100 - 100).toFixed(0)}%</strong></span>
      </div>
    </div>
  );
};
