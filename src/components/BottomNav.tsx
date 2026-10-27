import React from 'react';
import { LayoutDashboard, Navigation, Route, BatteryCharging, User } from 'lucide-react';
import type { ActivePage } from './Sidebar';

interface BottomNavProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, onPageChange }) => {
  const items: { id: ActivePage; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'plan_trip', label: 'Plan', icon: Navigation },
    { id: 'navigation', label: 'Map', icon: Route },
    { id: 'charging', label: 'Charging', icon: BatteryCharging },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around font-[Inter,sans-serif]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
              isActive ? 'text-emerald-600 font-black' : 'text-slate-400 font-semibold hover:text-slate-700'
            }`}
          >
            <Icon size={20} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
