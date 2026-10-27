import React from 'react';
import {
  Zap,
  Compass,
  Navigation,
  MapPin,
  Route,
  Coffee,
  User,
  Bell,
  ChevronDown,
  Car,
} from 'lucide-react';

export type DesktopNavTab =
  | 'home'
  | 'plan_journey'
  | 'live_nav'
  | 'charging'
  | 'smart_stops'
  | 'trips'
  | 'my_vehicle'
  | 'profile';

interface DesktopTopHeaderProps {
  activeTab: DesktopNavTab;
  onTabChange: (tab: DesktopNavTab) => void;
  vehicleName?: string;
  batterySoc?: number;
  estimatedRangeKm?: number;
  unreadAlertsCount?: number;
  onOpenNotifications?: () => void;
}

export const DesktopTopHeader: React.FC<DesktopTopHeaderProps> = ({
  activeTab,
  onTabChange,
  vehicleName = 'Tata Nexon EV Max',
  batterySoc = 34,
  estimatedRangeKm = 110,
  unreadAlertsCount = 2,
  onOpenNotifications,
}) => {
  const navItems: { id: DesktopNavTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'plan_journey', label: 'Plan Journey', icon: Navigation },
    { id: 'live_nav', label: 'Live Navigation', icon: Route },
    { id: 'charging', label: 'Charging', icon: Zap },
    { id: 'smart_stops', label: 'Smart Stops', icon: Coffee },
    { id: 'trips', label: 'Trips', icon: MapPin },
    { id: 'my_vehicle', label: 'My Vehicle', icon: Car },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="bg-[#0B0F0D] text-white border-b border-slate-800/80 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-2xl select-none shrink-0 font-[Inter,sans-serif]">
      {/* BRAND & LOGO */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('home')}>
        <div className="w-9 h-9 rounded-xl bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black shadow-md shadow-[#22C55E]/30">
          <Zap size={20} className="fill-[#0B0F0D]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-tight text-white">ZepGO</span>
            <span className="text-[10px] font-extrabold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>🇮🇳</span> India EV
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
            Smart Stop & Cafe Sync AI
          </span>
        </div>
      </div>

      {/* CENTER NAVIGATION LINKS */}
      <nav className="flex items-center gap-1 bg-[#141A17] p-1.5 rounded-2xl border border-slate-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#22C55E] text-[#0B0F0D] shadow-md shadow-[#22C55E]/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-[#0B0F0D]' : 'text-[#22C55E]'} />
              <span>{item.label}</span>
              {item.id === 'smart_stops' && (
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-[#0B0F0D] text-[#22C55E]' : 'bg-[#22C55E]/20 text-[#22C55E]'
                }`}>
                  AI Sync
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* RIGHT SIDE USER & VEHICLE STATUS */}
      <div className="flex items-center gap-3">
        {/* Vehicle Telemetry Pill */}
        <div
          onClick={() => onTabChange('my_vehicle')}
          className="flex items-center gap-2.5 bg-[#141A17] border border-slate-800 hover:border-[#22C55E]/50 px-3.5 py-1.5 rounded-xl cursor-pointer transition-all"
        >
          <div className="w-6 h-6 rounded-lg bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center border border-[#22C55E]/30">
            <Zap size={13} />
          </div>
          <div className="text-left leading-tight">
            <span className="text-xs font-black text-white block">{vehicleName}</span>
            <span className="text-[10px] text-[#22C55E] font-extrabold">
              {batterySoc}% SOC • {estimatedRangeKm} km range
            </span>
          </div>
        </div>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-xl bg-[#141A17] border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          title="Alerts & Notifications"
        >
          <Bell size={17} />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#22C55E] rounded-full border-2 border-[#0B0F0D] animate-pulse" />
          )}
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={() => onTabChange('profile')}
          className="flex items-center gap-2 bg-[#141A17] border border-slate-800 hover:border-slate-700 p-1.5 pr-3 rounded-xl cursor-pointer transition-all"
        >
          <div className="w-7 h-7 rounded-lg bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black text-xs">
            EV
          </div>
          <span className="text-xs font-extrabold text-white">Rahul K.</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
};
