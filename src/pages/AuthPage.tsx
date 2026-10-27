import React, { useState } from 'react';
import { Zap, ArrowRight, Check } from 'lucide-react';
import { AuthService } from '../services/auth';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'onboarding'>('login');
  const [email, setEmail] = useState('preethi@zepgo.in');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Preethi');

  // Onboarding vehicle state (Section 9)
  const [selectedBrand, setSelectedBrand] = useState('Tata');
  const [selectedModel, setSelectedModel] = useState('Nexon EV Max');
  const [batteryCapacity, setBatteryCapacity] = useState(40.5);
  const [efficiency, setEfficiency] = useState(6.8);
  const [connector, setConnector] = useState('CCS2');
  const [maxSpeed, setMaxSpeed] = useState(50);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await AuthService.login(email, password);
    onAuthSuccess();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await AuthService.register(name, email);
    setMode('onboarding');
  };

  const handleCompleteOnboarding = () => {
    onAuthSuccess();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 font-[Inter,sans-serif] text-slate-800">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black mx-auto shadow-md shadow-emerald-500/20">
            <Zap size={26} className="fill-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'login' ? 'Sign in to ZepGO' : mode === 'register' ? 'Create Driver Account' : 'Set Up Your EV Profile'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'onboarding'
              ? 'Tell ZepGO about your vehicle battery and charging specifications'
              : 'AI-Powered EV Navigation & Charging Intelligence Platform'}
          </p>
        </div>

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-emerald-500"
              />
            </div>

            {/* Quick Demo Preethi Fill */}
            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <strong className="text-emerald-950 block">Demo Persona: Preethi</strong>
                <span className="text-[11px] text-emerald-800">Tata Nexon EV Max • 62% SOC</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('preethi@zepgo.in');
                  setPassword('password123');
                }}
                className="text-[11px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                Use Preset
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight size={16} />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-slate-500 hover:text-emerald-600 font-semibold cursor-pointer"
              >
                Don't have an account? <strong className="text-emerald-600">Register</strong>
              </button>
            </div>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Vehicle Setup</span>
              <ArrowRight size={16} />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-500 hover:text-emerald-600 font-semibold cursor-pointer"
              >
                Already registered? <strong className="text-emerald-600">Sign in</strong>
              </button>
            </div>
          </form>
        )}

        {mode === 'onboarding' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Select Brand</label>
              <div className="grid grid-cols-4 gap-2">
                {['Tata', 'MG', 'Mahindra', 'Hyundai'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBrand(b)}
                    className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      selectedBrand === b
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">EV Model Name</label>
              <input
                type="text"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Battery (kWh)</label>
                <input
                  type="number"
                  value={batteryCapacity}
                  onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Efficiency (km/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  value={efficiency}
                  onChange={(e) => setEfficiency(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Connector</label>
                <input
                  type="text"
                  value={connector}
                  onChange={(e) => setConnector(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Max Speed (kW)</label>
                <input
                  type="number"
                  value={maxSpeed}
                  onChange={(e) => setMaxSpeed(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                />
              </div>
            </div>

            <button
              onClick={handleCompleteOnboarding}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Save EV & Enter Dashboard</span>
              <Check size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
