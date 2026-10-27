import React from 'react';
import { Zap, Bell, ShieldAlert, WifiOff, Car } from 'lucide-react';
import type { ActivePage } from './Sidebar';

interface NavbarProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  onOpenNotifications: () => void;
  onOpenSOS: () => void;
  unreadCount?: number;
  vehicleName?: string;
  isLowNetworkMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage: _activePage,
  onPageChange,
  onOpenNotifications,
  onOpenSOS,
  unreadCount = 2,
  vehicleName = 'Tata Nexon EV Max',
  isLowNetworkMode = false
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-3 flex items-center justify-between font-[Inter,sans-serif]">
      {/* Mobile Brand and Page title */}
      <div className="flex items-center gap-3">
        <div
          className="md:hidden flex items-center gap-2 cursor-pointer"
          onClick={() => onPageChange('landing')}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
            <Zap size={18} className="fill-white" />
          </div>
          <span className="font-black text-slate-900 text-base">ZepGO</span>
        </div>

        {/* Active vehicle badge on Desktop */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs">
          <Car size={14} className="text-emerald-600" />
          <span className="font-semibold text-slate-700">{vehicleName}</span>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-1.5 py-0.2 rounded-full">
            40.5 kWh
          </span>
        </div>
      </div>

      {/* Right Tools: Offline status, Notifications, SOS */}
      <div className="flex items-center gap-2.5">
        {isLowNetworkMode && (
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <WifiOff size={13} />
            <span className="hidden sm:inline">Offline Cache</span>
          </span>
        )}

        <button
          onClick={onOpenNotifications}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative cursor-pointer transition"
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenSOS}
          className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition"
        >
          <ShieldAlert size={14} />
          <span>SOS</span>
        </button>
      </div>
    </header>
  );
};
