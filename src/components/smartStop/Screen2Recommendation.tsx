import React, { useState } from 'react';
import { ArrowLeft, Zap, Coffee, Star, Check, Layers, X } from 'lucide-react';

interface Screen2RecommendationProps {
  onUseThisStop: () => void;
  onBack: () => void;
}

export const Screen2Recommendation: React.FC<Screen2RecommendationProps> = ({
  onUseThisStop,
  onBack,
}) => {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);

  const stops = [
    {
      name: 'Saravana Bhavan + Zep Fast Hub',
      sub: 'NH544 Salem Bypass Complex',
      dist: '214 km',
      dev: '+0.2 km',
      rating: '4.8/5',
      charger: 'CCS2 Dual DC',
      avail: '3/4 chargers available',
      speed: '150 kW DC',
      chargeTime: '24 min',
      cafe: 'Saravana Bhavan Tiffin & Meals',
      walkDist: '120 m away (2 min walk)',
      breakEst: '25 min',
      amenities: ['AC Dining', 'Clean Restrooms', '24/7 Security'],
    },
    {
      name: 'Murugan Idli + Tata Power Hub',
      sub: 'NH544 Krishnagiri Plaza',
      dist: '208 km',
      dev: '+0.5 km',
      rating: '4.6/5',
      charger: 'CCS2 Dual DC',
      avail: '2/4 chargers available',
      speed: '120 kW DC',
      chargeTime: '28 min',
      cafe: 'Murugan Idli Shop & Coffee',
      walkDist: '90 m away (1 min walk)',
      breakEst: '30 min',
      amenities: ['Traditional South Indian', 'Play Area'],
    },
    {
      name: 'Highway Star + Zeon Fast Hub',
      sub: 'NH544 Dharmapuri Highway',
      dist: '226 km',
      dev: '+1.1 km',
      rating: '4.7/5',
      charger: 'CCS2 Dual DC',
      avail: '4/4 chargers available',
      speed: '150 kW DC',
      chargeTime: '22 min',
      cafe: 'Food Court & Coffee Day',
      walkDist: '150 m away (3 min walk)',
      breakEst: '25 min',
      amenities: ['Multi-cuisine', 'EV Lounge'],
    },
  ];

  const currentStop = stops[selectedStopIndex];

  return (
    <div className="flex-1 bg-[#0B0F0D] text-white flex flex-col justify-between p-4 select-none font-[Inter,sans-serif] overflow-y-auto no-scrollbar animate-fadeIn relative">
      {/* Header */}
      <div className="flex items-center justify-between pt-1 pb-2 border-b border-slate-800/80">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-[#161C19] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="text-center">
          <span className="text-xs font-black text-white tracking-wider block uppercase">Recommended Smart Stop</span>
          <span className="text-[10px] text-[#22C55E] font-bold">Screen 2 of 5</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Main Content Area */}
      <div className="space-y-3.5 my-2">
        {/* Recommendation Badge Banner */}
        <div className="bg-[#141A17] border border-[#22C55E]/40 rounded-[20px] p-3.5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-2 py-0.5 rounded-full inline-block">
                ★ Best Match For Your Journey
              </span>
              <h2 className="text-base font-black text-white leading-tight mt-1">{currentStop.name}</h2>
              <p className="text-[11px] text-slate-400">{currentStop.sub}</p>
            </div>

            <div className="bg-[#0B0F0D] border border-amber-500/30 px-2.5 py-1.5 rounded-xl text-center">
              <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
                <Star size={13} className="fill-amber-400" />
                <span>{currentStop.rating}</span>
              </div>
              <span className="text-[8px] font-bold text-slate-400 block uppercase mt-0.5">Top Rated</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-[#0B0F0D] p-2 rounded-xl border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Distance</span>
              <span className="font-extrabold text-white">{currentStop.dist}</span>
            </div>
            <div className="bg-[#0B0F0D] p-2 rounded-xl border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Route Deviation</span>
              <span className="font-extrabold text-[#22C55E]">{currentStop.dev}</span>
            </div>
          </div>
        </div>

        {/* EV Charger Details Container */}
        <div className="bg-[#141A17] rounded-[20px] p-3.5 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
                <Zap size={14} />
              </div>
              <span className="text-xs font-extrabold text-white">Charger Specifications</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-md">
              {currentStop.speed}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Charger Type</span>
              <span className="text-xs font-black text-white">{currentStop.charger}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Plugs Available</span>
              <span className="text-xs font-black text-[#22C55E]">{currentStop.avail}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Est. Charging Time</span>
              <span className="text-xs font-black text-white">{currentStop.chargeTime}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Power Level</span>
              <span className="text-xs font-black text-amber-400">{currentStop.speed}</span>
            </div>
          </div>
        </div>

        {/* Cafe & Rest Facilities Container */}
        <div className="bg-[#141A17] rounded-[20px] p-3.5 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Coffee size={14} />
              </div>
              <span className="text-xs font-extrabold text-white">Cafe / Rest Amenities</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
              {currentStop.breakEst} break
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-white">{currentStop.cafe}</span>
              <span className="text-slate-400 text-[10px]">{currentStop.walkDist}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentStop.amenities.map((item, idx) => (
                <span
                  key={idx}
                  className="text-[9px] font-extrabold bg-[#0B0F0D] border border-slate-700/80 text-slate-300 px-2 py-1 rounded-lg"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA & Compact Alternatives Toggle */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <button
          onClick={onUseThisStop}
          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-3.5 px-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-[0.98]"
        >
          <Check size={16} className="stroke-[3]" />
          <span>Use This Stop</span>
        </button>

        <button
          onClick={() => setShowAlternatives(!showAlternatives)}
          className="w-full bg-[#161C19] hover:bg-slate-800 text-slate-300 font-bold py-2.5 px-4 rounded-xl border border-slate-800 transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Layers size={14} className="text-[#22C55E]" />
          <span>{showAlternatives ? 'Hide Alternatives' : 'View Alternatives (2)'}</span>
        </button>
      </div>

      {/* COMPACT BOTTOM SHEET FOR ALTERNATIVE STOPS (No separate full screen!) */}
      {showAlternatives && (
        <div className="absolute inset-x-0 bottom-0 bg-[#121815] border-t-2 border-[#22C55E]/50 rounded-t-[24px] p-4 shadow-2xl space-y-3 z-30 animate-slideUp">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers size={15} className="text-[#22C55E]" />
              <span className="text-xs font-black text-white">Alternative Smart Stops</span>
            </div>
            <button
              onClick={() => setShowAlternatives(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
            {stops.map((stop, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedStopIndex(idx);
                  setShowAlternatives(false);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedStopIndex === idx
                    ? 'bg-[#1E2923] border-[#22C55E] text-white'
                    : 'bg-[#0B0F0D] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-white">{stop.name}</span>
                    {selectedStopIndex === idx && (
                      <span className="text-[8px] bg-[#22C55E] text-[#0B0F0D] font-black px-1.5 py-0.5 rounded">Selected</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {stop.dist} • {stop.dev} deviation • {stop.chargeTime} charge
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-400">⭐ {stop.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
