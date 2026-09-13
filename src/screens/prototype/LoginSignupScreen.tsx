import React, { useState } from 'react';
import { Zap, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginSignupScreenProps {
  onLoginSuccess: () => void;
  onGuestMode: () => void;
}

export const LoginSignupScreen: React.FC<LoginSignupScreenProps> = ({
  onLoginSuccess,
  onGuestMode,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('9876543210');

  return (
    <div className="flex-1 bg-white text-[#0B0F0D] flex flex-col justify-between p-6 select-none animate-fadeIn">
      {/* Top Header */}
      <div className="pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0B0F0D] rounded-xl flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#22C55E] fill-[#22C55E]" />
          </div>
          <span className="font-extrabold text-base text-[#0B0F0D] tracking-tight">ZepGO</span>
        </div>
        <button
          onClick={onGuestMode}
          className="text-xs font-semibold text-[#6B7280] hover:text-[#0B0F0D] bg-[#F3F4F6] px-3 py-1.5 rounded-full transition-colors"
        >
          Guest Mode
        </button>
      </div>

      {/* Main Form Content */}
      <div className="my-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-[#0B0F0D] tracking-tight">Welcome to ZepGO</h2>
          <p className="text-sm text-[#6B7280]">
            Enter your mobile number to unlock predictive charger reservations & route history.
          </p>
        </div>

        {/* Mobile Number Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#0B0F0D] uppercase tracking-wider">
            Mobile Number
          </label>
          <div className="flex items-center bg-[#F3F4F6] border border-[#E5E7EB] rounded-[16px] px-3.5 py-3 focus-within:border-[#22C55E] focus-within:bg-white transition-all shadow-sm">
            <span className="font-bold text-sm text-[#0B0F0D] pr-2.5 border-r border-[#E5E7EB] flex items-center gap-1">
              🇮🇳 +91
            </span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter 10-digit number"
              className="w-full pl-3 bg-transparent text-sm font-semibold text-[#0B0F0D] focus:outline-none"
            />
          </div>
        </div>

        {/* Primary Continue Button */}
        <button
          onClick={onLoginSuccess}
          className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-bold py-3.5 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
        >
          <span>Continue with Mobile</span>
          <ArrowRight size={16} />
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px bg-[#E5E7EB] flex-1" />
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">or</span>
          <div className="h-px bg-[#E5E7EB] flex-1" />
        </div>

        {/* Google Login Option */}
        <button
          onClick={onLoginSuccess}
          className="w-full bg-white hover:bg-slate-50 text-[#0B0F0D] font-bold py-3.5 px-6 rounded-[16px] border border-[#E5E7EB] shadow-sm transition-all flex items-center justify-center gap-3 text-sm cursor-pointer active:scale-[0.98]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.1 0-5.74-2.09-6.68-4.91H1.36v3.15C3.34 21.32 7.37 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.36C.49 8.29 0 10.09 0 12s.49 3.71 1.36 5.44l3.96-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.34 2.68 1.36 6.56l3.96 3.15c.94-2.82 3.58-4.96 6.68-4.96z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      {/* Bottom Footer Note */}
      <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#6B7280]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#22C55E]" />
          <span>Encrypted 256-bit EV Telemetry</span>
        </div>
        <button onClick={onGuestMode} className="underline hover:text-[#0B0F0D]">
          Explore as Guest
        </button>
      </div>
    </div>
  );
};
