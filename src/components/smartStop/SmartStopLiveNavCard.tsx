import React from 'react';
import { ChevronRight, X } from 'lucide-react';

interface SmartStopLiveNavCardProps {
  onOpenFullRecommendation: () => void;
  onDismiss: () => void;
}

export const SmartStopLiveNavCard: React.FC<SmartStopLiveNavCardProps> = ({
  onOpenFullRecommendation,
  onDismiss,
}) => {
  return (
    <div className="bg-[#0B0F0D]/95 backdrop-blur-md border border-slate-800 rounded-[22px] p-3.5 shadow-2xl space-y-2.5 text-white font-[Inter,sans-serif] animate-fadeIn">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#22C55E] text-[#0B0F0D] rounded-lg flex items-center justify-center font-bold text-xs">
            ⚡
          </div>
          <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-wider">
            Smart Rest Stop • 12 km Ahead
          </span>
        </div>
        <button onClick={onDismiss} className="text-slate-400 hover:text-white p-0.5">
          <X size={15} />
        </button>
      </div>

      {/* Main Info Line */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-xs font-black text-white flex items-center gap-1.5">
            <span>Saravana Bhavan & Zeon Salem Hub</span>
          </h4>
          <p className="text-[11px] text-slate-300 font-medium">
            "Good time for a 25 min break • 150kW DC (3/4 Plugs Open)"
          </p>
        </div>

        <button
          onClick={onOpenFullRecommendation}
          className="bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold text-xs py-2 px-3 rounded-xl transition-all shadow-md active:scale-95 shrink-0 flex items-center gap-1 cursor-pointer"
        >
          <span>View</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
