import React from 'react';
import type { ActiveTab } from '../../types/navigation';
import type { VehicleState } from '../../types/vehicle';
import { BatteryIndicator } from '../domain/BatteryIndicator';
import { CompassIcon, RouteIcon, MapPinIcon, ZapIcon, UserIcon, BellIcon } from '../common/Icons';

export interface DesktopHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  vehicle: VehicleState;
  viewMode: 'mobile' | 'web';
  onToggleViewMode: () => void;
  unreadCount?: number;
  onNotificationsClick?: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  activeTab,
  onTabChange,
  vehicle,
  viewMode,
  onToggleViewMode,
  unreadCount = 0,
  onNotificationsClick,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'home', label: 'Dashboard', icon: CompassIcon },
    { id: 'trips', label: 'Trips & Routes', icon: RouteIcon },
    { id: 'map', label: 'Interactive Map', icon: MapPinIcon },
    { id: 'charging', label: 'Charging Directory', icon: ZapIcon },
    { id: 'profile', label: 'Vehicle & Profile', icon: UserIcon },
  ];

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-xs">
            ZG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 leading-none">ZepGO</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                INDIA EV
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Smart EV Navigation & Charging Network</p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150
                  ${isActive ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}
                `}
              >
                <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-500'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Widgets: Battery, Notifications, View Switcher */}
        <div className="flex items-center gap-3">
          <BatteryIndicator vehicle={vehicle} compact />

          {onNotificationsClick && (
            <button
              onClick={onNotificationsClick}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors relative"
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

          {/* Desktop vs Mobile Prototype Mode Switcher */}
          <button
            onClick={onToggleViewMode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all active:scale-95"
            title="Switch Prototype View Mode"
          >
            <span>{viewMode === 'web' ? '📱 Mobile Frame' : '💻 Web Desktop View'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
