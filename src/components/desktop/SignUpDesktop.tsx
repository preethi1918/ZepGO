import React, { useState } from 'react';
import { Zap, ArrowRight, User, Mail, Phone, Lock } from 'lucide-react';

interface SignUpDesktopProps {
  onSignUpSuccess: () => void;
  onGoToLogin: () => void;
}

export const SignUpDesktop: React.FC<SignUpDesktopProps> = ({ onSignUpSuccess, onGoToLogin }) => {
  const [fullName, setFullName] = useState('Rahul Kumar');
  const [email, setEmail] = useState('rahul.k@zepgo.in');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [password, setPassword] = useState('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••');
  const [agreedTerms, setAgreedTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreedTerms) {
      onSignUpSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#090D0B] text-white flex items-center justify-center p-6 font-[Inter,sans-serif] select-none">
      <div className="w-full max-w-lg bg-[#141A17] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl animate-fadeIn">
        {/* Top App Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black shadow-md shadow-[#22C55E]/20">
              <Zap size={18} className="fill-[#0B0F0D]" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block leading-none">ZepGO</span>
              <span className="text-[10px] font-bold text-[#22C55E] tracking-wider uppercase">India EV Network</span>
            </div>
          </div>

          <span className="text-[10px] font-extrabold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-1 rounded-full">
            New Driver Account
          </span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white">Create your ZepGO account</h1>
          <p className="text-xs text-slate-400">
            Join thousands of EV drivers enjoying smart charging & rest synchronization across India.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-300 block">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User size={15} />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rahul Kumar"
                className="w-full bg-[#0B0F0D] border border-slate-800 focus:border-[#22C55E] text-white text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none transition-all font-semibold"
              />
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-300 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul.k@zepgo.in"
                  className="w-full bg-[#0B0F0D] border border-slate-800 focus:border-[#22C55E] text-white text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none transition-all font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-300 block">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone size={15} />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#0B0F0D] border border-slate-800 focus:border-[#22C55E] text-white text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none transition-all font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-300 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={15} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B0F0D] border border-slate-800 focus:border-[#22C55E] text-white text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none transition-all font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-300 block">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={15} />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B0F0D] border border-slate-800 focus:border-[#22C55E] text-white text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none transition-all font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 accent-[#22C55E] rounded cursor-pointer"
              />
              <span>I agree to the Terms of Service & Privacy Policy</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-[0.98] mt-2"
          >
            <span>Create Account</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="text-center pt-3 text-xs text-slate-400 font-medium border-t border-slate-800">
          Already have an account?{' '}
          <button
            onClick={onGoToLogin}
            className="text-[#22C55E] font-extrabold hover:underline ml-1 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
