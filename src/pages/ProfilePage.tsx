import React, { useState } from 'react';
import { Wifi, WifiOff, Check, LogOut } from 'lucide-react';
import { AuthService, type UserProfile } from '../services/auth';

interface ProfilePageProps {
  onLogout: () => void;
  onSelectVehicle: (vName: string) => void;
  isLowNetworkMode: boolean;
  onToggleLowNetworkMode: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onLogout,
  onSelectVehicle,
  isLowNetworkMode,
  onToggleLowNetworkMode
}) => {
  const [user, setUser] = useState<UserProfile>(AuthService.getCurrentUser());
  const [safetyReserve, setSafetyReserve] = useState(user.preferences?.safety_reserve_percent || 18);
  const [routePref, setRoutePref] = useState(user.preferences?.route_preference || 'fastest');
  const [chargingPref, setChargingPref] = useState(user.preferences?.charging_preference || 'fast_charging');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = () => {
    const updated = {
      ...user,
      preferences: {
        ...user.preferences,
        safety_reserve_percent: safetyReserve,
        route_preference: routePref,
        charging_preference: chargingPref
      }
    };
    setUser(updated);
    AuthService.saveUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const savedVehicles = [
    { name: 'Tata Nexon EV Max', pack: '40.5 kWh', eff: '6.8 km/kWh', connector: 'CCS2', active: true },
    { name: 'MG ZS EV Exclusive', pack: '50.3 kWh', eff: '6.4 km/kWh', connector: 'CCS2', active: false },
    { name: 'Mahindra XUV400 EL', pack: '39.4 kWh', eff: '6.5 km/kWh', connector: 'CCS2', active: false },
    { name: 'Hyundai Ioniq 5 AWD', pack: '72.6 kWh', eff: '5.9 km/kWh', connector: 'CCS2', active: false }
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-800 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto font-[Inter,sans-serif]">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Account Settings</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Driver Profile & Preferences</h1>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-500/20">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">{user.name}</h3>
              <p className="text-xs text-slate-400">{user.email}</p>
              <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                Verified EV Driver
              </span>
            </div>
          </div>

          {/* Low Network Mode Toggle (Prompt Section 29) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isLowNetworkMode ? <WifiOff size={16} className="text-amber-600" /> : <Wifi size={16} className="text-emerald-600" />}
                <span className="text-xs font-bold text-slate-800">Low Network Mode</span>
              </div>
              <button
                onClick={onToggleLowNetworkMode}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  isLowNetworkMode ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${
                    isLowNetworkMode ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When toggled, ZepGO caches essential highway routes, offline charger contacts, and emergency points to function during weak rural cellular connectivity.
            </p>
          </div>
        </div>

        {/* Saved EVs Garage (Prompt Section 9) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">My EV Garage</h3>
              <p className="text-xs text-slate-400">Select active vehicle or configure specifications</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedVehicles.map((v, idx) => (
              <div
                key={idx}
                onClick={() => onSelectVehicle(v.name)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  v.name === 'Tata Nexon EV Max'
                    ? 'bg-emerald-50/50 border-emerald-400 ring-1 ring-emerald-400'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm text-slate-900">{v.name}</span>
                  {v.name === 'Tata Nexon EV Max' && (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Battery: <strong className="text-slate-800">{v.pack}</strong></span>
                  <span>•</span>
                  <span>{v.eff}</span>
                  <span>•</span>
                  <span>{v.connector}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DRIVER PREFERENCES (Prompt Section 33) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
          Trip & Safety Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Safety Reserve Slider (Section 22 & 33) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Safety Reserve Threshold</span>
              <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                {safetyReserve}% Reserve
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="30"
              value={safetyReserve}
              onChange={(e) => setSafetyReserve(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Default 18%. The platform flags any route where arrival battery drops below this threshold.
            </p>
          </div>

          {/* Route Preference */}
          <div className="space-y-2">
            <span className="font-bold text-xs text-slate-700 block">Default Route Bias</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'fastest', label: 'Fastest Route' },
                { id: 'energy_efficient', label: 'Energy Efficient' },
                { id: 'cheapest', label: 'Cheapest Tolls' },
                { id: 'safety_first', label: 'Safety First' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRoutePref(r.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    routePref === r.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Charging Preference */}
          <div className="space-y-2">
            <span className="font-bold text-xs text-slate-700 block">Charging Preference</span>
            <div className="space-y-1.5">
              {[
                { id: 'fast_charging', label: 'Fastest Chargers (120-150 kW DC)' },
                { id: 'cheapest', label: 'Most Cost Effective (₹/kWh)' },
                { id: 'min_wait', label: 'Minimum Waiting & Verified Amenities' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setChargingPref(c.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold border text-left transition cursor-pointer ${
                    chargingPref === c.id
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check size={14} /> Preferences updated successfully!
            </span>
          )}
          <div className="ml-auto">
            <button
              onClick={handleSavePreferences}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
