import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  MapPin,
  Navigation,
  Zap,
  Coffee,
  LifeBuoy,
  History,
  Car,
  Settings,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose, className }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Plan Trip', path: '/plan-trip', icon: MapPin },
    { label: 'Live Journey', path: '/live-journey', icon: Navigation, badge: 'Live' },
    { label: 'Chargers', path: '/chargers', icon: Zap },
    { label: 'Smart Stops', path: '/smart-stops', icon: Coffee },
    { label: 'Assistance', path: '/assistance', icon: LifeBuoy },
    { label: 'History', path: '/history', icon: History },
    { label: 'Vehicle', path: '/vehicle', icon: Car },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside
      className={cn(
        'w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 transition-all duration-300 z-40',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        className
      )}
    >
      {/* Top Header Logo */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between">
        <Logo size="md" showTagline={false} />
      </div>

      {/* Main Nav Items List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive: linkActive }) =>
                cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group',
                  linkActive || isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-700'
                  )}
                />
                <span>{item.label}</span>
              </div>

              {item.badge ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className={cn('w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400', isActive && 'opacity-100 text-emerald-600')} />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Sidebar Card Section */}
      <div className="p-4 border-t border-slate-200">
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 relative overflow-hidden group">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-slate-900">EcoTech Intelligence</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            Next-gen EV navigation, charger safety & range prediction.
          </p>
          <NavLink
            to="/plan-trip"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 pt-1 transition-colors"
          >
            <span>Plan Next Journey</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
