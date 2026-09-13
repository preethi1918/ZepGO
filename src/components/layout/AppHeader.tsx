import React from 'react';
import type { VehicleState } from '../../types/vehicle';
import { BatteryIndicator } from '../domain/BatteryIndicator';
import { BellIcon } from '../common/Icons';

export interface AppHeaderProps {
  vehicle: VehicleState;
  title?: string;
  onNotificationsClick?: () => void;
  unreadCount?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  vehicle,
  title,
  onNotificationsClick,
  unreadCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 max-w-md mx-auto px-4 py-3 flex items-center justify-between shadow-2xs">
      {/* Brand or Screen Title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs tracking-tighter">
          ZG
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight flex items-center gap-1.5">
            <span>{title || 'ZepGO'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live GPS Connected" />
          </h1>
          <p className="text-[10px] text-slate-500 font-medium line-clamp-1 max-w-[140px]">
            {vehicle.brand} {vehicle.modelName}
          </p>
        </div>
      </div>

      {/* Battery SOC Pill & Action Buttons */}
      <div className="flex items-center gap-2">
        <BatteryIndicator vehicle={vehicle} compact />

        {onNotificationsClick && (
          <button
            onClick={onNotificationsClick}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors relative"
            aria-label="Notifications"
          >
            <BellIcon size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
