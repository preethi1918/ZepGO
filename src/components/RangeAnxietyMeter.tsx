import React from 'react';
import { ShieldCheck, AlertTriangle, Zap, ArrowRight, Gauge } from 'lucide-react';

interface RangeAnxietyMeterProps {
  score: number; // 0 - 100
  currentBattery: number;
  canReachDestination: boolean;
  preTripChargingRequired: boolean;
  deficitKwh?: string;
  onPlanTripClick?: () => void;
}

export const RangeAnxietyMeter: React.FC<RangeAnxietyMeterProps> = ({
  score,
  currentBattery,
  canReachDestination,
  preTripChargingRequired,
  deficitKwh,
  onPlanTripClick
}) => {
  const getMeterColor = () => {
    if (score >= 75) return { stroke: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'High Confidence' };
    if (score >= 45) return { stroke: '#f59e0b', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Moderate Caution' };
    return { stroke: '#ef4444', text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', label: 'High Range Anxiety' };
  };

  const style = getMeterColor();
  const circumference = 2 * Math.PI * 42; // r = 42
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`p-5 rounded-2xl border ${style.bg} ${style.border} transition-all shadow-xs relative overflow-hidden`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Gauge Visual */}
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-200/70"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="42"
                stroke={style.stroke}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-2xl font-black ${style.text}`}>{score}%</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confidence</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-slate-900 text-base">Range Anxiety Meter</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style.bg} ${style.border} ${style.text}`}>
                {style.label}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-1 max-w-sm">
              {preTripChargingRequired ? (
                <span className="text-rose-700 font-medium">
                  ⚠️ High probability of battery exhaustion before reaching destination. Energy deficit of ~{deficitKwh || '12'} kWh.
                </span>
              ) : canReachDestination ? (
                <span className="text-emerald-700 font-medium">
                  ✅ Safe journey predicted with {currentBattery}% initial battery. Recommended safety buffer maintained.
                </span>
              ) : (
                <span className="text-amber-700 font-medium">
                  ⚡ Caution: Trip is near your vehicle's range margin. Pre-trip charging recommended.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        {onPlanTripClick && (
          <button
            onClick={onPlanTripClick}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
              preTripChargingRequired
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-bounce'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{preTripChargingRequired ? 'Charge Before Starting' : 'Optimize Trip Plan'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
