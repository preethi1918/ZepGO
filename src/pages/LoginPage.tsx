import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, BatteryCharging, Navigation, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { useAuth } from '../context/AuthContext';
import { DEMO_USER } from '../data/mockAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [demoLoading, setDemoLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/vehicle-setup');
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      await loginAsDemo();
      navigate('/vehicle-setup');
    } catch (err) {
      console.error('Demo login failed', err);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT COLUMN: ZEPGO Branding & Showcase */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-8 py-4">
          <div className="space-y-6">
            <Logo size="lg" showTagline />

            <div className="space-y-3 pt-2">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                Plan smarter. <br />
                <span className="text-[#16A34A]">Drive safer.</span> Reach your destination.
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md">
                ZepGO EcoTech Light powers electric journeys with realistic battery calculations, charger risk analysis, and backup failover safety.
              </p>
            </div>
          </div>

          {/* Interactive EV Telemetry Showcase Card */}
          <Card variant="solid" className="relative overflow-hidden border-slate-200 p-5 space-y-4 shadow-sm bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <StatusIndicator status="active" label="EcoTech Engine Active" />
              </div>
              <Badge variant="success" icon={<Sparkles className="w-3 h-3" />}>
                v2.0 EcoTech Light
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                  <span>Battery Level</span>
                  <BatteryCharging className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-slate-900">88%</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#16A34A] h-full w-[88%] rounded-full shadow-xs" />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                  <span>Realistic Range</span>
                  <Navigation className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-black text-slate-900">420 km</div>
                <div className="text-[11px] text-blue-700 font-bold mt-1">Optimal Climate (+14km)</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Safety Reserve: 18% Buffer Enforced</span>
              </span>
              <span className="text-emerald-700 font-bold">Safe</span>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: SaaS Login Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <Card variant="solid" className="p-6 sm:p-8 space-y-6 border-slate-200 bg-white shadow-sm relative">
            <div className="space-y-1 text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                Authentication Portal
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Welcome Back</h2>
              <p className="text-xs text-slate-500">Sign in to your ZepGO Intelligent EV Assistant.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email Address"
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                error={errors.email}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />

              <Input
                label="Password"
                isPassword
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none group font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="group-hover:text-slate-900 transition-colors">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Forgot password action: Use "Continue as Demo User" or enter test credentials.')}
                  className="text-emerald-700 hover:text-emerald-800 font-bold transition-colors focus:outline-none focus:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Login
                </Button>

                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                    Or Hackathon Access
                  </span>
                </div>

                <Button
                  type="button"
                  onClick={handleDemoLogin}
                  variant="secondary"
                  fullWidth
                  size="lg"
                  isLoading={demoLoading}
                  leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                >
                  Continue as Demo User
                </Button>
              </div>
            </form>

            <div className="text-center pt-2 text-[11px] text-slate-500 border-t border-slate-200 font-medium">
              Demo account pre-configured for: <span className="text-slate-900 font-mono font-bold">{DEMO_USER.email}</span>
            </div>
          </Card>
        </div>
      </div>
    </AuthLayout>
  );
};
