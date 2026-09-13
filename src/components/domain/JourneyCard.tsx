import React from 'react';
import type { Trip } from '../../types/trip';
import { formatDistance, formatDuration } from '../../utils/formatters';
import { NavigationIcon, ZapIcon, ChevronRightIcon } from '../common/Icons';

export interface JourneyCardProps {
  trip: Trip;
  onSelect?: (trip: Trip) => void;
  onStartNavigation?: (trip: Trip) => void;
}

export const JourneyCard: React.FC<JourneyCardProps> = ({
  trip,
  onSelect,
  onStartNavigation,
}) => {
  const { title, originName, destinationName, totalDistanceKm, totalDurationMinutes, stops, startSocPercent, arrivalSocPercent } = trip;

  return (
    <div
      onClick={() => onSelect && onSelect(trip)}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer my-2 active:scale-[0.99]"
    >
      {/* Header Title */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900 leading-snug">{title}</h3>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          trip.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
        }`}>
          {trip.status === 'active' ? 'Active Route' : 'Planned'}
        </span>
      </div>

      {/* Origin -> Destination Route Visual */}
      <div className="space-y-2 relative pl-5 my-3 border-l-2 border-dashed border-blue-300 ml-1">
        <div className="relative">
          <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">From</p>
          <p className="text-xs font-semibold text-slate-800 truncate">{originName}</p>
        </div>

        <div className="relative pt-1">
          <div className="absolute -left-[25px] top-2.5 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-slate-100" />
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">To</p>
          <p className="text-xs font-semibold text-slate-800 truncate">{destinationName}</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 text-center my-3">
        <div>
          <p className="text-[10px] text-slate-400 font-medium uppercase">Distance</p>
          <p className="text-xs font-bold text-slate-800 mt-0.5">{formatDistance(totalDistanceKm)}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium uppercase">Est. Time</p>
          <p className="text-xs font-bold text-slate-800 mt-0.5">{formatDuration(totalDurationMinutes)}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium uppercase">Charging</p>
          <p className="text-xs font-bold text-blue-600 mt-0.5">
            {stops.length > 0 ? `${stops.length} stop${stops.length > 1 ? 's' : ''}` : 'Direct'}
          </p>
        </div>
      </div>

      {/* Battery SOC Flow & Start Action */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <ZapIcon size={14} className="text-emerald-600" />
          <span>{startSocPercent}%</span>
          <ChevronRightIcon size={14} className="text-slate-400" />
          <span className="font-bold text-slate-800">{arrivalSocPercent}% at arrival</span>
        </div>

        {onStartNavigation && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartNavigation(trip);
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <NavigationIcon size={12} />
            <span>Start</span>
          </button>
        )}
      </div>
    </div>
  );
};
