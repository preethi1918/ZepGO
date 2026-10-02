import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, Shield, Menu, Car, Zap, Wifi, WifiOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../utils/storage';
import { DemoController } from '../ui/DemoController';
import type { Vehicle } from '../../types';

interface TopHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showDemoController, setShowDemoController] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle>(() => storage.getVehicleData());

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVehicle(storage.getVehicleData());
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userName = user?.name || 'Alex Rivera';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left: Hamburger menu toggle for mobile & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{getGreeting()}, {userName}!</span>
            <span className="inline-block animate-bounce text-sm">👋</span>
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            ZepGO EcoTech Intelligent EV Platform
          </p>
        </div>
      </div>

      {/* Right Side: Battery Status, Network Status Toggle, Demo Controller & User Profile */}
      <div className="flex items-center gap-3">
        {/* Battery % Indicator (Global Header Requirement) */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
          <span className="text-xs font-extrabold text-slate-900">{vehicle.soc}% Battery</span>
          <span className="text-[10px] text-emerald-700 font-mono font-bold">({Math.round((vehicle.batteryCapacity * vehicle.soc) / 100 * 6.2)} km)</span>
        </div>

        {/* Global Network Status Toggle (Phase 19 Low Network / Offline Support) */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
            isOnline
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
          }`}
          title="Click to toggle Network Online/Offline state"
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
          <span>{isOnline ? 'ONLINE (LIVE)' : 'OFFLINE MODE'}</span>
        </button>

        {/* Hackathon Demo Controller Trigger Button */}
        <button
          onClick={() => setShowDemoController(!showDemoController)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 font-bold text-xs shadow-xs transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span className="hidden sm:inline">Demo Controller</span>
        </button>

        {/* Notification Bell Icon */}
        <button
          onClick={() => alert('Notifications: All telemetry sensors operational. Battery reserve ok.')}
          className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 group"
            aria-expanded={dropdownOpen}
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 p-0.5 shadow-xs shrink-0 flex items-center justify-center text-xs font-extrabold text-white">
              {userName.charAt(0)}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight font-mono">
                {vehicle.brand} {vehicle.model}
              </span>
            </div>

            <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{userName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || 'driver@zepgo.ev'}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/vehicle');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors font-medium"
                >
                  <Car className="w-4 h-4 text-emerald-600" />
                  <span>My Vehicle Specs</span>
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors font-medium"
                >
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Settings & Margins</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Hackathon Demo Scenario Controller */}
      <DemoController isOpen={showDemoController} onClose={() => setShowDemoController(false)} />
    </header>
  );
};
