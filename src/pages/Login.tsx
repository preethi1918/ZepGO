import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('driver@zepgo.ev');
  const [password, setPassword] = useState('password123');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 1 temporary navigation to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-sm mb-4">
          <Zap className="w-8 h-8 fill-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Zep<span className="text-emerald-600">GO</span>
        </h1>
        <h2 className="mt-1 text-lg font-semibold text-slate-700">
          Smart EV Navigation
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
          Intelligent EV journey planning, range prediction, and charging stops optimization.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {isSignUp ? 'Create ZepGO Account' : 'Sign In to Dashboard'}
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 focus:outline-none"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create account"}
            </button>
          </div>

          <div className="mt-6 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Phase 1 Demo Access:</span> Click login above to explore the ZepGO interface structure.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
