import React from 'react';
import type { ActiveTab } from '../../types/navigation';
import { CompassIcon, RouteIcon, MapPinIcon, ZapIcon, UserIcon } from '../common/Icons';

export interface BottomNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: CompassIcon },
    { id: 'trips', label: 'Trips', icon: RouteIcon },
    { id: 'map', label: 'Map', icon: MapPinIcon },
    { id: 'charging', label: 'Charging', icon: ZapIcon },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 w-full p-2 pointer-events-none">
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-900/10 max-w-md mx-auto h-16 px-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-150 active:scale-95 cursor-pointer
                ${isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'}
              `}
            >
              <div className={`p-1.5 rounded-2xl transition-all ${isActive ? 'bg-emerald-50 text-emerald-600 scale-105' : 'bg-transparent'}`}>
                <Icon size={18} className={isActive ? 'text-emerald-600' : 'text-slate-500'} />
              </div>
              <span className="text-[9px] font-semibold tracking-tight mt-0.5">{tab.label}</span>
              {isActive && (
                <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
