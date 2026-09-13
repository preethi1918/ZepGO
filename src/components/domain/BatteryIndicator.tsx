import React from 'react';
import type { VehicleState } from '../../types/vehicle';
import { ZapIcon } from '../common/Icons';

export interface BatteryIndicatorProps {
  vehicle: VehicleState;
  compact?: boolean;
}

export const BatteryIndicator: React.FC<BatteryIndicatorProps> = ({
  vehicle,
  compact = false,
}) => {
  const { currentSocPercent, estimatedRangeKm, chargingStatus, currentChargePowerKw } = vehicle;

  // Determine indicator color theme
  const getBatteryColor = (soc: number) => {
    if (soc > 40) return { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' };
    if (soc > 20) return { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' };
    return { bar: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' };
  };

  const colorTheme = getBatteryColor(currentSocPercent);
  const isCharging = chargingStatus === 'charging';

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80">
        <div className="relative flex items-center justify-center">
          <ZapIcon size={14} className={isCharging ? 'text-emerald-600 animate-pulse' : 'text-slate-600'} />
        </div>
        <span className="text-xs font-semibold text-slate-800">{currentSocPercent}%</span>
        <span className="text-[11px] text-slate-500 font-medium">({estimatedRangeKm} km)</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs relative overflow-hidden">
      {/* Top Info Bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${colorTheme.bg} ${colorTheme.text}`}>
            <ZapIcon size={18} className={isCharging ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900">{vehicle.brand} {vehicle.modelName}</h4>
            <p className="text-[11px] text-slate-500 font-medium">{vehicle.trim}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xl font-bold text-slate-900 leading-none">{currentSocPercent}%</span>
          {isCharging && (
            <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">
              Charging @ {currentChargePowerKw} kW
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorTheme.bar}`}
          style={{ width: `${Math.min(100, Math.max(0, currentSocPercent))}%` }}
        />
      </div>

      {/* Range Details Footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
        <span className="text-slate-500 font-medium">Estimated Range</span>
        <span className="font-bold text-slate-900">{estimatedRangeKm} km</span>
      </div>
    </div>
  );
};
