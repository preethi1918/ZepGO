import React from 'react';
import type { RouteStop } from '../../types/trip';
import { formatDuration, formatPower } from '../../utils/formatters';
import { ZapIcon, ClockIcon } from '../common/Icons';

export interface StopCardProps {
  stop: RouteStop;
  stopNumber: number;
  onSelectStation?: (stationId: string) => void;
}

export const StopCard: React.FC<StopCardProps> = ({
  stop,
  stopNumber,
  onSelectStation,
}) => {
  const { stationName, arrivalSocPercent, targetSocPercent, durationMinutes, chargingPowerKw, amenities } = stop;

  return (
    <div className="relative pl-6 pb-4 border-l-2 border-slate-200 last:border-l-transparent last:pb-0">
      {/* Circle Badge Number */}
      <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
        {stopNumber}
      </div>

      <div
        onClick={() => onSelectStation && onSelectStation(stop.stationId)}
        className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Charging Stop</span>
            <h4 className="text-xs font-bold text-slate-900 mt-0.5">{stationName}</h4>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            {formatPower(chargingPowerKw)}
          </span>
        </div>

        {/* SOC Increase & Duration Pill */}
        <div className="flex items-center gap-3 mt-2.5 text-xs">
          <div className="flex items-center gap-1 font-semibold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <ZapIcon size={12} className="text-amber-500" />
            <span>{arrivalSocPercent}% → {targetSocPercent}%</span>
          </div>

          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <ClockIcon size={12} />
            <span>{formatDuration(durationMinutes)} charge</span>
          </div>
        </div>

        {/* Amenities Icons Row */}
        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
            {amenities.map((item, idx) => (
              <span key={idx} className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
