import React from 'react';
import type { ActiveTab } from '../../types/navigation';
import type { VehicleState } from '../../types/vehicle';
import {
  CompassIcon,
  RouteIcon,
  MapPinIcon,
  ZapIcon,
  UserIcon,
  BellIcon,
} from '../common/Icons';

export interface DesktopSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  vehicle: VehicleState;
  onToggleViewMode: () => void;
  unreadCount?: number;
  onNotificationsClick?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  onTabChange,
  vehicle,
  onToggleViewMode,
  unreadCount = 0,
  onNotificationsClick,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: CompassIcon },
    { id: 'trips', label: 'Trips & Routes', icon: RouteIcon },
    { id: 'map', label: 'Map Explorer', icon: MapPinIcon },
    { id: 'charging', label: 'Charge Stations', icon: ZapIcon },
    { id: 'profile', label: 'Profile & EV', icon: UserIcon },
  ];

  return (
    <aside className="w-64 bg-[#0B0F0D] text-white border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30 select-none shadow-2xl">
      {/* Top Logo & App Brand */}
      <div>
        <div className="p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-[#0B0F0D] font-black shadow-md shadow-[#22C55E]/20">
              <ZapIcon size={20} className="fill-[#0B0F0D]" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white leading-none">ZepGO</h1>
              <span className="text-[10px] font-bold tracking-widest text-[#22C55E] uppercase">Predictive EV AI</span>
            </div>
          </div>

          {onNotificationsClick && (
            <button
              onClick={onNotificationsClick}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              title="Notifications"
            >
              <BellIcon size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#22C55E] rounded-full border-2 border-[#0B0F0D]" />
              )}
            </button>
          )}
        </div>

        {/* Vehicle Quick Telemetry Bar */}
        <div className="mx-4 my-4 p-3.5 bg-[#161C19] rounded-[18px] border border-slate-800 flex items-center justify-between space-x-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center font-black text-xs border border-[#22C55E]/30">
              ⚡
            </div>
            <div>
              <p className="text-xs font-extrabold text-white leading-tight">{vehicle.modelName}</p>
              <p className="text-[10px] text-[#22C55E] font-bold">{vehicle.currentSocPercent}% SOC • ~{vehicle.estimatedRangeKm} km</p>
            </div>
          </div>
          <span className="text-[9px] font-extrabold text-[#22C55E] bg-[#22C55E]/20 border border-[#22C55E]/40 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        {/* Navigation Items List */}
        <nav className="px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-[16px] font-bold text-xs transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? 'bg-[#22C55E] text-[#0B0F0D] shadow-md shadow-[#22C55E]/20 font-black'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }
                `}
              >
                <Icon size={18} className={isActive ? 'text-[#0B0F0D]' : 'text-[#22C55E]'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switch to Mobile App View Banner */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={onToggleViewMode}
          className="w-full text-center py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-[14px] transition-all border border-slate-700 cursor-pointer"
        >
          📱 Switch to iPhone Frame Mockup
        </button>
        <p className="text-[10px] text-slate-500 text-center">ZepGO v2.0 • Tailored for Indian Highways</p>
      </div>
    </aside>
  );
};
