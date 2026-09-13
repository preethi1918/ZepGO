import React from 'react';
import { ShieldCheckIcon, AlertTriangleIcon, CheckCircleIcon, ZapIcon } from '../common/Icons';

export interface RangeConfidenceProps {
  estimatedRangeKm: number;
  confidencePercent?: number; // e.g. 95%
  minRangeKm?: number;
  maxRangeKm?: number;
  temperatureC?: number;
  terrainFactor?: 'Flat' | 'Hilly' | 'Mountainous';
  plannedDistanceKm?: number;
}

export const RangeConfidence: React.FC<RangeConfidenceProps> = ({
  estimatedRangeKm,
  confidencePercent = 95,
  minRangeKm = Math.round(estimatedRangeKm * 0.88),
  maxRangeKm = Math.round(estimatedRangeKm * 1.08),
  temperatureC = 22,
  terrainFactor = 'Hilly',
  plannedDistanceKm = 148,
}) => {
  const rangeBufferKm = estimatedRangeKm - plannedDistanceKm;
  const bufferPercent = Math.round((rangeBufferKm / estimatedRangeKm) * 100);

  // Phase 7: 4-Level Range Confidence Classification
  let status: 'safe' | 'attention' | 'charging_recommended' | 'critical' = 'safe';
  if (rangeBufferKm < 0) {
    status = 'critical';
  } else if (bufferPercent < 10) {
    status = 'charging_recommended';
  } else if (bufferPercent < 25) {
    status = 'attention';
  }

  const statusConfig = {
    safe: {
      label: 'Safe Range Buffer',
      color: 'bg-emerald-500 text-white',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircleIcon size={16} className="text-emerald-600" />,
      desc: `+${rangeBufferKm} km safe range buffer for journey`,
    },
    attention: {
      label: 'Attention Required',
      color: 'bg-amber-500 text-white',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertTriangleIcon size={16} className="text-amber-600" />,
      desc: `Tight buffer (+${rangeBufferKm} km). Drive at Eco speed (<90km/h)`,
    },
    charging_recommended: {
      label: 'Charging Recommended',
      color: 'bg-orange-500 text-white',
      badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
      icon: <ZapIcon size={16} className="text-orange-600" />,
      desc: `Low SOC buffer. Add a 15-min fast charge en route`,
    },
    critical: {
      label: 'Critical Range Deficit',
      color: 'bg-rose-600 text-white',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <AlertTriangleIcon size={16} className="text-rose-600" />,
      desc: `Insufficient battery range (${Math.abs(rangeBufferKm)} km deficit). Charger required!`,
    },
  };

  const currentConfig = statusConfig[status];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon size={18} className="text-blue-600" />
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phase 7 Range Confidence</span>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">Range Safety Predictor</h4>
          </div>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${currentConfig.badgeBg} flex items-center gap-1`}>
          {currentConfig.icon}
          <span>{currentConfig.label}</span>
        </span>
      </div>

      {/* Min - Est - Max Visual Range Slider */}
      <div>
        <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
          <span>Min: {minRangeKm} km</span>
          <span className="font-bold text-slate-900">{estimatedRangeKm} km Est. Range</span>
          <span>Max: {maxRangeKm} km</span>
        </div>
        <div className="relative w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div className="absolute left-[15%] right-[10%] bg-blue-200 h-full rounded-full" />
          <div className="absolute left-[50%] -translate-x-1/2 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white top-1/2 -translate-y-1/2 shadow-xs" />
        </div>
        <p className="text-[11px] text-slate-600 mt-1.5 font-medium">{currentConfig.desc}</p>
      </div>

      {/* Environmental & Terrain Impact Factors */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium uppercase">Terrain</p>
          <p className="text-xs font-bold text-slate-800 mt-0.5">{terrainFactor}</p>
        </div>
        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium uppercase">Climate</p>
          <p className="text-xs font-bold text-slate-800 mt-0.5">{temperatureC}°C HVAC</p>
        </div>
        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium uppercase">Confidence</p>
          <p className="text-xs font-bold text-blue-600 mt-0.5">{confidencePercent}%</p>
        </div>
      </div>
    </div>
  );
};

