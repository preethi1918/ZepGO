import React from 'react';
import {
  Zap,
  Navigation,
  ShieldCheck,
  TrendingDown,
  Coffee,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onStartJourney: () => void;
  onExploreFeatures: () => void;
  onGoToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartJourney,
  onExploreFeatures,
  onGoToLogin
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-[Inter,sans-serif] selection:bg-emerald-500 selection:text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-md shadow-emerald-500/20">
            <Zap size={22} className="fill-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900">ZepGO</span>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ml-2 border border-emerald-200">
              EV Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onExploreFeatures}
            className="text-xs font-bold text-slate-600 hover:text-emerald-600 transition hidden md:block cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={onGoToLogin}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl transition cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onStartJourney}
            className="text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 shadow-xs">
            <Sparkles size={14} className="text-emerald-600" />
            <span>AI-Powered EV Navigation & Charging Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Navigate Smarter. <br />
            <span className="text-emerald-600">Charge Safer.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            AI-powered EV navigation that predicts your range, understands your route and recommends the right charger at the right time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartJourney}
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Your Journey</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onExploreFeatures}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm rounded-2xl border border-slate-200 shadow-xs transition cursor-pointer"
            >
              Explore Features
            </button>
          </div>
        </div>

        {/* HERO MOCKUP VISUAL */}
        <div className="mt-14 relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Live Demo Corridor</span>
              <h3 className="text-xl font-black text-slate-900">Salem → Coimbatore Expressway (142 km)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Pre-configured with Tata Nexon EV Max (40.5 kWh, 62% SOC)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Safe to Continue
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                XGBoost ML Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">State of Charge (SOC)</span>
              <span className="text-3xl font-extrabold text-slate-900">62%</span>
              <span className="text-xs text-slate-400 block mt-1">Available: 25.1 kWh</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">Estimated Realistic Range</span>
              <span className="text-3xl font-extrabold text-emerald-600">184 km</span>
              <span className="text-xs text-slate-400 block mt-1">Adjusted for highway AC</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">Expected Arrival Battery</span>
              <span className="text-3xl font-extrabold text-slate-900">24%</span>
              <span className="text-xs text-emerald-600 font-semibold block mt-1">+6% over 18% reserve</span>
            </div>
          </div>

          {/* Recommended Charger Highlight */}
          <div className="mt-6 bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                  RECOMMENDED CHARGER
                </span>
                <span className="text-xs font-bold text-emerald-700">LOW RISK</span>
              </div>
              <h4 className="font-extrabold text-base text-slate-900">Zeon Fast Charging Hub - Salem Bypass</h4>
              <p className="text-xs text-slate-600">120 kW DC • 3/4 Plugs Open • Saravana Bhavan & sanitized lounge within 80m</p>
            </div>

            <button
              onClick={onStartJourney}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition whitespace-nowrap cursor-pointer"
            >
              Inspect Explanation
            </button>
          </div>
        </div>
      </section>

      {/* WHY ZEPGO? COMPARISON SECTION */}
      <section className="py-16 bg-white border-y border-slate-200/80 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider block">Differentiation</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Why ZepGO?</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              How ZepGO fundamentally evolves beyond traditional navigation apps into an EV intelligence platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Navigation */}
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600">
                  <Navigation size={18} />
                </div>
                <h3 className="text-lg font-black text-slate-800">Traditional Map Applications</h3>
              </div>
              <p className="text-xs text-slate-500">Treats electric vehicles identically to petrol/diesel cars.</p>

              <div className="space-y-3 pt-2">
                {[
                  'Shows route based only on speed limits',
                  'Shows static distance in kilometers',
                  'Only displays unverified charger pins',
                  'No understanding of battery capacity or health',
                  'No arrival battery percentage prediction',
                  'Cannot explain why a charger was chosen'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-slate-600">
                    <XCircle size={16} className="text-rose-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ZepGO Intelligence */}
            <div className="bg-emerald-50/40 rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <Zap size={18} className="fill-white" />
                </div>
                <h3 className="text-lg font-black text-emerald-950">ZepGO Platform</h3>
              </div>
              <p className="text-xs text-emerald-800">Predicts whether the EV can safely get there and intelligently decides where, when and why it should charge.</p>

              <div className="space-y-3 pt-2">
                {[
                  'Predicts realistic energy consumption with XGBoost ML',
                  'Understands specific vehicle efficiency & charging curves',
                  'Evaluates multi-factor charging risk (LOW / MED / HIGH)',
                  'Ranks chargers by safety, speed, plugs open & amenities',
                  'Provides transparent "Why This Charger?" explanations',
                  'Synchronizes driver rest breaks with charging duration'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-emerald-950 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 CORE PLATFORM PILLARS */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider block">Intelligent Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Engineered for Indian EV Corridors</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Six interconnected pillars designed to eliminate range anxiety and unpredicted charger queues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: '1. Smart Range Prediction',
              icon: Zap,
              color: 'text-emerald-600 bg-emerald-50',
              desc: 'Calculates usable kWh, nominal efficiency, and dynamically adjusts for AC cooling, headwind drag and terrain gradient.'
            },
            {
              title: '2. Intelligent Charging',
              icon: ShieldCheck,
              color: 'text-blue-600 bg-blue-50',
              desc: 'Multi-factor algorithm ranking stations on safety reserve, connector compatibility, verified speeds, and live plug occupancy.'
            },
            {
              title: '3. Risk-Aware Navigation',
              icon: TrendingDown,
              color: 'text-amber-600 bg-amber-50',
              desc: 'Continuous risk assessment preventing drivers from arriving at remote chargers with critically low (<18%) battery buffers.'
            },
            {
              title: '4. Real-Time Route Intelligence',
              icon: Navigation,
              color: 'text-purple-600 bg-purple-50',
              desc: 'Provides 3 tailored routes: Fastest, Energy Efficient, and Charging Safe with transparent arrival battery estimates.'
            },
            {
              title: '5. Smart Stop Recommendations',
              icon: Coffee,
              color: 'text-orange-600 bg-orange-50',
              desc: 'Harmonizes human comfort with vehicle telemetry—matching top highway cafes and clean restrooms to charging stop times.'
            },
            {
              title: '6. Emergency Assistance (SOS)',
              icon: PhoneCall,
              color: 'text-rose-600 bg-rose-50',
              desc: 'One-touch dispatch for flat tyres, unexpected battery drain, and towing to nearest verified DC charging hubs.'
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition space-y-3"
              >
                <div className={`w-11 h-11 rounded-2xl ${feature.color} flex items-center justify-center`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-10 px-6 text-center text-xs text-slate-400 space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
            ⚡
          </div>
          <span className="font-black text-slate-800 text-sm">ZepGO</span>
        </div>
        <p>© 2026 ZepGO – AI-Powered EV Navigation & Charging Intelligence Platform. Built for Indian Highways & EVs.</p>
      </footer>
    </div>
  );
};
