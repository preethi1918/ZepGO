import React from 'react';
import type { ChargingStation } from '../../types/charging';
import type { VehicleState } from '../../types/vehicle';
import { formatDistance, formatPower, formatPrice } from '../../utils/formatters';
import { StarIcon, MapPinIcon, HeartIcon } from '../common/Icons';
import { ChargerCompatibilityBadge } from './ChargerCompatibilityBadge';
import { MOCK_VEHICLE } from '../../data/mockVehicle';

export interface ChargingStationCardProps {
  station: ChargingStation;
  vehicle?: VehicleState;
  isFavorite?: boolean;
  onSelect?: (station: ChargingStation) => void;
  onToggleFavorite?: (stationId: string, e: React.MouseEvent) => void;
  compact?: boolean;
}

export const ChargingStationCard: React.FC<ChargingStationCardProps> = ({
  station,
  vehicle = MOCK_VEHICLE,
  isFavorite = false,
  onSelect,
  onToggleFavorite,
  compact = false,
}) => {
  const { name, operator, distanceKm, maxPowerKw, availablePlugs, totalPlugs, pricePerKwh, rating, status, speedCategory } = station;

  const isAvailable = status === 'available' && availablePlugs > 0;

  const speedBadge = {
    ultra_fast: { text: 'Ultra-Fast', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    fast: { text: 'Fast Charge', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    standard: { text: 'Standard', bg: 'bg-slate-100 text-slate-700 border-slate-200' },
  }[speedCategory];

  if (compact) {
    return (
      <div
        onClick={() => onSelect && onSelect(station)}
        className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
            {maxPowerKw}kW
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{name}</h4>
            <p className="text-[11px] text-slate-500">{formatDistance(distanceKm)} • {availablePlugs}/{totalPlugs} available</p>
          </div>
        </div>
        <ChargerCompatibilityBadge vehicle={vehicle} station={station} />
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect && onSelect(station)}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer my-2 relative active:scale-[0.99]"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="pr-6">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{operator}</span>
          <h3 className="text-sm font-bold text-slate-900 leading-tight mt-0.5 line-clamp-1">{name}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <MapPinIcon size={12} className="text-slate-400 shrink-0" />
            <span className="line-clamp-1">{station.address}</span>
          </p>
        </div>

        {/* Favorite Heart Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => onToggleFavorite(station.id, e)}
            className={`p-2 rounded-full transition-colors ${
              isFavorite ? 'text-red-500 bg-red-50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
            }`}
            aria-label="Favorite station"
          >
            <HeartIcon size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Main Specs Bar & Plug Compatibility Badge */}
      <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
            {formatPower(maxPowerKw)}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg border ${speedBadge.bg}`}>
            {speedBadge.text}
          </span>
          {/* Charger Compatibility Badge */}
          <ChargerCompatibilityBadge vehicle={vehicle} station={station} />
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
          <StarIcon size={14} className="text-amber-400" />
          <span>{rating}</span>
        </div>
      </div>

      {/* Availability Footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 font-semibold">
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className={isAvailable ? 'text-emerald-700' : 'text-amber-700'}>
            {availablePlugs} of {totalPlugs} Plugs Available
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span>{formatDistance(distanceKm)}</span>
          <span>•</span>
          <span className="font-semibold text-slate-800">{formatPrice(pricePerKwh)}</span>
        </div>
      </div>
    </div>
  );
};
