import React from 'react';
import { Palette, Layout } from 'lucide-react';

export const DesignSystemSpecs: React.FC = () => {
  return (
    <div className="flex-1 bg-slate-900 text-white p-6 md:p-10 overflow-y-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="max-w-5xl mx-auto space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-[#22C55E]">
          <Palette size={24} />
          <span className="text-xs font-black uppercase tracking-widest">Design System Tokens</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          ZepGO Mobile Design Language
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          A clean, premium modern mobile aesthetic built with rounded cards (16–20px radius), soft subtle shadows, spacious white backgrounds, consistent 8px grid spacing, and strict color hierarchy.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Color Palette Spec */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-[24px] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-[#22C55E]">
            <Palette size={18} />
            <h3 className="font-extrabold text-base text-white">Color Tokens</h3>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Deep Black', hex: '#0B0F0D', role: 'Primary text, navigation headers, primary action CTAs', bg: 'bg-[#0B0F0D] text-white border-slate-700' },
              { name: 'EV Green', hex: '#22C55E', role: 'Charging status, intelligent features, LOW RISK badges, confidence indicators', bg: 'bg-[#22C55E] text-[#0B0F0D]' },
              { name: 'Light Green', hex: '#EAF8EF', role: 'Backgrounds, success cards, active chip highlights', bg: 'bg-[#EAF8EF] text-[#0B0F0D]' },
              { name: 'White', hex: '#FFFFFF', role: 'Main container surface, primary elevated cards', bg: 'bg-white text-[#0B0F0D]' },
              { name: 'Secondary Grey', hex: '#6B7280', role: 'Secondary text, captions, inactive icons', bg: 'bg-[#6B7280] text-white' },
              { name: 'Warning Amber', hex: '#F59E0B', role: 'Moderate risk, battery level warnings', bg: 'bg-[#F59E0B] text-white' },
              { name: 'Alert Red', hex: '#EF4444', role: 'High congestion risk alerts, emergency warnings', bg: 'bg-[#EF4444] text-white' },
            ].map((c) => (
              <div key={c.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center font-mono font-bold text-xs border border-white/10 shadow-md`}>
                    ■
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{c.name}</h4>
                    <p className="text-[11px] text-slate-400">{c.role}</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#22C55E]">{c.hex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Layout & Typography Specs */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-[24px] p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-[#22C55E]">
            <Layout size={18} />
            <h3 className="font-extrabold text-base text-white">Component Architecture</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-extrabold text-[#22C55E] uppercase tracking-wider">Card Radius & Geometry</h4>
              <p className="text-xs text-slate-300">
                Standard cards use <strong>16px - 20px rounded corners</strong> with subtle 1px border (<code className="text-[#22C55E]">#E5E7EB</code>) and soft drop shadow (<code className="text-[#22C55E]">shadow-sm</code>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-extrabold text-[#22C55E] uppercase tracking-wider">Viewport Specification</h4>
              <p className="text-xs text-slate-300">
                Designed for standard <strong>iPhone 390px × 844px</strong> viewports with top status bar (44px) and bottom home indicator (20px).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-extrabold text-[#22C55E] uppercase tracking-wider">ZepGO Core Visual Differentiator</h4>
              <p className="text-xs text-slate-300">
                Predictive availability status is ALWAYS highlighted in EV Green (<code className="text-[#22C55E]">#22C55E</code>) with explicit arrival timeframe predictions (+30m/+60m) and <strong>LOW RISK</strong> badges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
