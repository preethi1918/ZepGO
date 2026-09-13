import React, { useState } from 'react';
import type { RecommendationResult } from '../../services/recommendation/recommendationEngine';

export interface BatterySimulationControlsProps {
  currentSoc: number;
  onSocChange: (newSoc: number) => void;
  recommendation?: RecommendationResult | null;
}

export const BatterySimulationControls: React.FC<BatterySimulationControlsProps> = ({
  currentSoc,
  onSocChange,
  recommendation,
}) => {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-4 shadow-xl border border-slate-800 space-y-3 font-[Inter,sans-serif] my-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">🪫</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Interactive Battery Simulation</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-[10px] font-bold text-blue-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-full border border-slate-700 transition-all cursor-pointer"
          >
            {showDebug ? 'Hide Debug Info' : 'Show Debug Info 🛠️'}
          </button>
          <span className="text-xs font-black text-emerald-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            {currentSoc}% SOC
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min="10"
          max="100"
          step="1"
          value={currentSoc}
          onChange={(e) => onSocChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
          <span>10% (Critical)</span>
          <span>25% (Low)</span>
          <span>60% (Medium)</span>
          <span>100% (Full)</span>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div className="grid grid-cols-4 gap-1.5 pt-1">
        {[
          { soc: 10, label: '🪫 10% Critical' },
          { soc: 24, label: '⚠️ 24% Low' },
          { soc: 40, label: '⚡ 40% Mid' },
          { soc: 85, label: '🔋 85% High' },
        ].map((btn) => (
          <button
            key={btn.soc}
            onClick={() => onSocChange(btn.soc)}
            className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer border ${
              currentSoc === btn.soc
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Requirement 14: Development Debug Info Panel */}
      {showDebug && recommendation && (
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-[11px] font-mono text-slate-300 animate-fadeIn">
          <div className="flex justify-between border-b border-slate-800 pb-1 text-slate-400 font-bold uppercase text-[9px]">
            <span>Metric</span>
            <span>Engine Value</span>
          </div>
          <div className="flex justify-between">
            <span>Current Battery:</span>
            <span className="font-bold text-white">{recommendation.debugInfo.currentBattery}%</span>
          </div>
          <div className="flex justify-between">
            <span>Total Segment Distance:</span>
            <span className="font-bold text-white">{recommendation.debugInfo.totalDistance} km</span>
          </div>
          <div className="flex justify-between">
            <span>Usable Range (85% Safety):</span>
            <span className="font-bold text-blue-400">{recommendation.usableRangeKm} km</span>
          </div>
          <div className="flex justify-between">
            <span>Predicted Arrival Battery:</span>
            <span className={`font-bold ${recommendation.predictedArrivalSocPercent < recommendation.minBufferPercent ? 'text-amber-400' : 'text-emerald-400'}`}>
              {recommendation.predictedArrivalSocPercent}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Minimum Safety Reserve:</span>
            <span className="font-bold text-white">{recommendation.minBufferPercent}%</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-800">
            <span>Charging Required:</span>
            <span className={`font-black ${recommendation.needsCharging ? 'text-amber-400' : 'text-emerald-400'}`}>
              {recommendation.needsCharging ? 'TRUE (⚡ CHARGING RECOMMENDED)' : 'FALSE (✓ NO CHARGING NEEDED)'}
            </span>
          </div>
          {recommendation.debugInfo.failedSegment && (
            <div className="flex justify-between text-amber-300 text-[10px]">
              <span>Failed Segment:</span>
              <span className="font-bold">{recommendation.debugInfo.failedSegment}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
