import React from 'react';
import type { VehicleState } from '../../types/vehicle';
import type { ChargingStation } from '../../types/charging';
import { checkChargerCompatibility } from '../../utils/compatibilityChecker';
import { ShieldCheckIcon, AlertTriangleIcon, ZapIcon, CarIcon } from '../common/Icons';

export interface AiVehicleCompatibilityCardProps {
  vehicle: VehicleState;
  station: ChargingStation;
}

export const AiVehicleCompatibilityCard: React.FC<AiVehicleCompatibilityCardProps> = ({
  vehicle,
  station,
}) => {
  const result = checkChargerCompatibility(vehicle, station);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-4 shadow-lg border border-blue-800/80 space-y-3 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-blue-900/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
            🤖
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">AI Compatibility Engine</span>
            <h3 className="text-xs font-bold text-white leading-tight">Vehicle Plug & Power Analysis</h3>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${result.badgeBg}`}>
          {result.badgeLabel}
        </span>
      </div>

      {/* AI Verdict Box */}
      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-emerald-400">
          {result.status === 'compatible' ? (
            <ShieldCheckIcon size={16} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangleIcon size={16} className="text-amber-400 shrink-0" />
          )}
          <span>{result.voltageArchitecture}</span>
        </div>
        <p className="text-[11px] text-slate-200 leading-relaxed font-normal">
          {result.aiVerdictText}
        </p>
      </div>

      {/* Vehicle vs Station Specifications Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
            <CarIcon size={12} className="text-blue-400" />
            <span>Vehicle ({vehicle.brand})</span>
          </div>
          <p className="font-bold text-white line-clamp-1">{vehicle.modelName}</p>
          <p className="text-[10px] text-slate-400">Plugs: <strong className="text-slate-200">{vehicle.supportedPlugs.join(', ')}</strong></p>
          <p className="text-[10px] text-slate-400">Capacity: <strong className="text-slate-200">{vehicle.batteryCapacityKwh} kWh</strong></p>
        </div>

        <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
            <ZapIcon size={12} className="text-amber-400" />
            <span>Station ({station.operator})</span>
          </div>
          <p className="font-bold text-white line-clamp-1">{station.name}</p>
          <p className="text-[10px] text-slate-400">Plugs: <strong className="text-slate-200">{station.connectorTypes.join(', ')}</strong></p>
          <p className="text-[10px] text-slate-400">Max Speed: <strong className="text-emerald-400">{station.maxPowerKw} kW DC</strong></p>
        </div>
      </div>

      {/* Estimated Charge Time Metric */}
      {result.status === 'compatible' && (
        <div className="flex items-center justify-between text-[11px] bg-blue-950/60 p-2.5 rounded-xl border border-blue-900/80">
          <span className="text-blue-300">20% ➔ 80% Fast Charge Duration</span>
          <span className="font-bold text-emerald-400">⏱️ {result.estimatedChargeTimeMins} Minutes @ {result.maxAchievableKw}kW</span>
        </div>
      )}
    </div>
  );
};
