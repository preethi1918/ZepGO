import React, { useState } from 'react';
import type { VehicleState } from '../../types/vehicle';
import type { ChargingStation } from '../../types/charging';
import { checkChargerCompatibility } from '../../utils/compatibilityChecker';
import { ShieldCheckIcon, AlertTriangleIcon } from '../common/Icons';

export interface ChargerCompatibilityBadgeProps {
  vehicle: VehicleState;
  station: ChargingStation;
  showDetails?: boolean;
}

export const ChargerCompatibilityBadge: React.FC<ChargerCompatibilityBadgeProps> = ({
  vehicle,
  station,
  showDetails = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const result = checkChargerCompatibility(vehicle, station);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all flex items-center gap-1 ${result.badgeBg} active:scale-95`}
        title={result.details}
      >
        {result.status === 'compatible' ? (
          <ShieldCheckIcon size={12} className="text-emerald-600" />
        ) : result.status === 'adapter_required' ? (
          <AlertTriangleIcon size={12} className="text-amber-600" />
        ) : (
          <AlertTriangleIcon size={12} className="text-rose-600" />
        )}
        <span>{result.badgeLabel}</span>
      </button>

      {/* Popover Diagnostic Details */}
      {(showTooltip || showDetails) && (
        <div className="absolute right-0 top-full mt-1.5 z-40 bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-slate-700 w-64 text-xs space-y-1.5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="font-bold text-[10px] uppercase text-blue-400">Compatibility Diagnostics</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="font-semibold text-[11px] leading-snug">{result.details}</p>
          <div className="text-[10px] text-slate-300 space-y-0.5 pt-1 border-t border-slate-800">
            <p>• Vehicle Plugs: <strong className="text-white">{vehicle.supportedPlugs.join(', ')}</strong></p>
            <p>• Station Plugs: <strong className="text-white">{station.connectorTypes.join(', ')}</strong></p>
            <p>• Max Charge Speed: <strong className="text-emerald-400">{result.maxAchievableKw} kW</strong></p>
          </div>
        </div>
      )}
    </div>
  );
};
