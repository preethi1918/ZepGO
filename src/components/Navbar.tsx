import React from 'react';
import { Zap, Navigation, MapPin, MessageSquareCode, BarChart3, User, LogIn, LogOut, Sparkles, ShieldCheck, BatteryCharging, Info } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  onOpenAbout: () => void;
  currentBattery: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  onOpenAbout,
  currentBattery
}) => {
  const getBatteryColor = (level: number) => {
    if (level > 70) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (level > 35) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 ring-2 ring-sky-100">
              <Zap className="w-5 h-5 fill-current text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-slate-900 font-sans">Zep<span className="text-sky-600">Go</span></span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-sky-700 bg-sky-50 rounded-full border border-sky-200 uppercase">
                  AI EV Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Go Smart. Charge Smarter.</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-sky-50 text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Navigation className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'planner'
                  ? 'bg-sky-50 text-sky-700 shadow-xs ring-1 ring-sky-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              Pre-Trip Planner
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-sky-50 text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Live Map & Re-routing
            </button>

            <button
              onClick={() => setActiveTab('stations')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'stations'
                  ? 'bg-sky-50 text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BatteryCharging className="w-4 h-4" />
              Chargers
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-sky-50 text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MessageSquareCode className="w-4 h-4 text-emerald-600" />
              AI Assistant
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-sky-50 text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Impact & History
            </button>
          </nav>

          {/* Right Actions & User Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Battery Status Widget */}
            <div className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${getBatteryColor(currentBattery)}`}>
              <BatteryCharging className="w-3.5 h-3.5 animate-pulse" />
              <span>EV Battery: {currentBattery}%</span>
            </div>

            <button
              onClick={onOpenAbout}
              title="About & AI Logic"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-slate-200 rounded-full hover:border-sky-300 hover:bg-slate-50 transition-all text-xs font-medium text-slate-700"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-sky-500"
                  />
                  <span className="hidden lg:inline max-w-[100px] truncate">{user.name}</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 bg-slate-50/80 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            activeTab === 'dashboard' ? 'text-sky-600 font-bold' : 'text-slate-600'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab('planner')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            activeTab === 'planner' ? 'text-sky-600 font-bold' : 'text-slate-600'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Planner</span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            activeTab === 'map' ? 'text-sky-600 font-bold' : 'text-slate-600'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Map</span>
        </button>
        <button
          onClick={() => setActiveTab('stations')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            activeTab === 'stations' ? 'text-sky-600 font-bold' : 'text-slate-600'
          }`}
        >
          <BatteryCharging className="w-4 h-4" />
          <span>Chargers</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            activeTab === 'chat' ? 'text-sky-600 font-bold' : 'text-slate-600'
          }`}
        >
          <MessageSquareCode className="w-4 h-4" />
          <span>Assistant</span>
        </button>
      </div>
    </header>
  );
};
