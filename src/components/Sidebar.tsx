import React from 'react';
import {
  Zap,
  LayoutDashboard,
  Navigation,
  Route,
  BatteryCharging,
  History,
  BarChart3,
  User,
  ShieldAlert,
  WifiOff,
  LogOut
} from 'lucide-react';

export type ActivePage =
  | 'landing'
  | 'dashboard'
  | 'plan_trip'
  | 'navigation'
  | 'charging'
  | 'history'
  | 'analytics'
  | 'profile';

interface SidebarProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  onOpenSOS: () => void;
  onLogout: () => void;
  isLowNetworkMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onPageChange,
  onOpenSOS,
  onLogout,
  isLowNetworkMode = false
}) => {
  const menuItems: { id: ActivePage; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plan_trip', label: 'Plan Trip', icon: Navigation },
    { id: 'navigation', label: 'Live Navigation', icon: Route },
    { id: 'charging', label: 'Charging & Stops', icon: BatteryCharging },
    { id: 'history', label: 'Trip History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile & Garage', icon: User }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 h-screen sticky top-0 flex flex-col justify-between p-4 shrink-0 select-none hidden md:flex font-[Inter,sans-serif]">
      {/* Top Logo & App Title */}
      <div className="space-y-6">
        <div
          className="flex items-center gap-3 px-2 cursor-pointer"
          onClick={() => onPageChange('landing')}
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/20">
            <Zap size={22} className="fill-white" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tight block">ZepGO</span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">EV Intelligence</span>
          </div>
        </div>

        {/* Low Network Mode Banner if active */}
        {isLowNetworkMode && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-2.5 text-[11px] text-amber-900 font-semibold flex items-center gap-2">
            <WifiOff size={14} className="text-amber-600 shrink-0" />
            <span>Low network mode active (cached telemetry)</span>
          </div>
        )}

        {/* Nav Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: SOS & Logout */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <button
          onClick={onOpenSOS}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200/80 transition cursor-pointer"
        >
          <ShieldAlert size={18} className="text-rose-600" />
          <span>Emergency Assistance (SOS)</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-semibold text-xs transition cursor-pointer"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
