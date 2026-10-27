import React, { useState } from 'react';
import { Zap, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';

interface LoginDesktopProps {
  onLoginSuccess: () => void;
  onGoToSignUp: () => void;
}

export const LoginDesktop: React.FC<LoginDesktopProps> = ({ onLoginSuccess, onGoToSignUp }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('driver@zepgo.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#090D0B] text-white flex font-[Inter,sans-serif] select-none">
      {/* LEFT SIDE — BRANDING & VISUAL GRAPHIC (50% WIDTH) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0B0F0D] via-[#121A15] to-[#0A140E] border-r border-slate-800/80 p-12 flex-col justify-between relative overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#22C55E]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black shadow-lg shadow-[#22C55E]/30">
            <Zap size={22} className="fill-[#0B0F0D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white tracking-tight">ZepGO</span>
              <span className="text-[10px] font-extrabold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-0.5 rounded-full">
                🇮🇳 India EV
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Predictive Highway EV Intelligence</span>
          </div>
        </div>

        {/* Hero Slogan & Illustration Canvas */}
        <div className="relative z-10 space-y-6 max-w-xl my-auto">
          <div className="inline-flex items-center gap-2 bg-[#22C55E]/15 border border-[#22C55E]/30 px-3.5 py-1.5 rounded-full text-[#22C55E] text-xs font-black uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Intelligent Journey & Rest Stop Synchronization</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            Plan smarter. <br />
            Charge better. <br />
            <span className="text-[#22C55E]">Travel without range anxiety.</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            ZepGO doesn't just find where to charge. It synchronizes EV fast charging with high-quality dining, cafes, and rest breaks across Indian highways.
          </p>

          {/* Interactive Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-[#141A17]/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-extrabold text-[#22C55E] block">⚡ Smart Stop Detection</span>
              <span className="text-[11px] text-slate-300">Synchronized charge & dining timing</span>
            </div>
            <div className="bg-[#141A17]/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-extrabold text-amber-400 block">☕ Highway Comfort Hubs</span>
              <span className="text-[11px] text-slate-300">Verified cafes, dining & restrooms</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          © 2026 ZepGO India EV Technologies • Built for Indian Highway Drivers
        </div>
      </div>

      {/* RIGHT SIDE — NATIVE DESKTOP LOGIN CARD (50% WIDTH) */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-[#141A17] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl animate-fadeIn">
          {/* Header */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-[#22C55E] tracking-wider block">
              ZepGO Desktop Portal
            </span>
            <h2 className="text-2xl font-black text-white">Welcome back</h2>
            <p className="text-xs text-slate-400">Sign in to continue your EV journey.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Phone Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-300 block">Email or Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="driver@zepgo.in or +91 98765 43210"
                  className="w-full bg-[#0B0F0D] border border-slate-800 focus:border-[#22C55E] text-white text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-all font-semibold"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-300 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B0F0D] border border-slate-800 focus:border-[#22C55E] text-white text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-all font-semibold"
                />
              </div>
            </div>

            {/* Checkbox & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#22C55E] rounded cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button type="button" className="text-[#22C55E] font-extrabold hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-[0.98] mt-2"
            >
              <span>Sign In</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-[#141A17] px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest absolute">
              OR
            </span>
          </div>

          {/* Google SSO Button */}
          <button
            onClick={onLoginSuccess}
            className="w-full bg-[#0B0F0D] hover:bg-slate-800/80 text-slate-200 font-extrabold py-3 px-4 rounded-2xl border border-slate-800 transition-all flex items-center justify-center gap-2.5 text-xs cursor-pointer"
          >
            <span className="text-base">🌐</span>
            <span>Continue with Google</span>
          </button>

          {/* Footer Link to Sign Up */}
          <div className="text-center pt-2 text-xs text-slate-400 font-medium border-t border-slate-800/80">
            Don't have an account?{' '}
            <button
              onClick={onGoToSignUp}
              className="text-[#22C55E] font-extrabold hover:underline ml-1 cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
