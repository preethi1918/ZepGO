import React from 'react';
import { Zap, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getBatteryStatus } from '../utils/calculations';

interface BatteryCardProps {
  socPercent: number;
  batteryCapacityKwh: number;
  availableEnergyKwh: number;
  estimatedRangeKm: number;
  safetyReservePercent?: number;
  onSocChange?: (soc: number) => void;
  interactive?: boolean;
}

export const BatteryCard: React.FC<BatteryCardProps> = ({
  socPercent,
  batteryCapacityKwh,
  availableEnergyKwh,
  estimatedRangeKm,
  safetyReservePercent = 18,
  onSocChange,
  interactive = false
}) => {
  const status = getBatteryStatus(socPercent, safetyReservePercent);

  const getStatusColor = () => {
    switch (status) {
      case 'Comfortable':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Normal':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Low':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Critical':
        return 'text-rose-700 bg-rose-50 border-rose-200';
    }
  };

  const getBarGradient = () => {
    if (socPercent < safetyReservePercent) return 'from-rose-500 to-red-600';
    if (socPercent < 35) return 'from-amber-400 to-amber-500';
    return 'from-emerald-400 to-teal-500';
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Zap size={20} className="fill-emerald-500" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Live Battery State</span>
            <span className="text-sm font-bold text-slate-900">{batteryCapacityKwh} kWh Pack</span>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor()} flex items-center gap-1.5`}>
          {status === 'Critical' ? <AlertTriangle size={13} /> : <ShieldCheck size={13} />}
          {status} Status
        </span>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4 my-3">
        <div>
          <span className="text-xs text-slate-500 block mb-1">State of Charge (SOC)</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{Math.round(socPercent)}%</span>
            <span className="text-xs text-slate-400 font-medium">remaining</span>
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-500 block mb-1">Estimated Range</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-emerald-600 tracking-tight">{Math.round(estimatedRangeKm)}</span>
            <span className="text-xs text-slate-500 font-bold">km</span>
          </div>
        </div>
      </div>

      {/* Visual Battery Bar */}
      <div className="space-y-1.5 mt-4">
        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60 relative">
          {/* Safety Reserve Marker Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
            style={{ left: `${safetyReservePercent}%` }}
            title={`Safety Reserve Threshold (${safetyReservePercent}%)`}
          />
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getBarGradient()} transition-all duration-500`}
            style={{ width: `${Math.min(100, Math.max(2, socPercent))}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <span className="text-rose-500 font-semibold">Reserve: {safetyReservePercent}%</span>
          <span>Available: {availableEnergyKwh.toFixed(1)} kWh</span>
          <span>100% (Full)</span>
        </div>
      </div>

      {/* Interactive slider for demo simulation */}
      {interactive && onSocChange && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Simulate SOC:</span>
          <input
            type="range"
            min="5"
            max="100"
            value={socPercent}
            onChange={(e) => onSocChange(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <span className="text-xs font-bold text-slate-700 min-w-8 text-right">{socPercent}%</span>
        </div>
      )}
    </div>
  );
};
