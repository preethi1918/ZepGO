import React from 'react';
import { AlertTriangle, ShieldCheck, Zap, X } from 'lucide-react';

interface ChargerRiskAlertScreenProps {
  onAcceptReroute: () => void;
  onDismiss: () => void;
}

export const ChargerRiskAlertScreen: React.FC<ChargerRiskAlertScreenProps> = ({
  onAcceptReroute,
  onDismiss,
}) => {
  return (
    <div className="flex-1 bg-[#0B0F0D]/95 text-white flex flex-col justify-between p-6 select-none animate-fadeIn relative space-y-4">
      {/* Top Warning Banner Header */}
      <div className="pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#FEF2F2] text-[#EF4444] border border-[#EF4444]/40 px-3 py-1 rounded-full text-xs font-black">
          <AlertTriangle size={14} />
          <span>Charger Risk Alert</span>
        </div>
        <button onClick={onDismiss} className="text-slate-400 hover:text-white p-1">
          <X size={18} />
        </button>
      </div>

      {/* Main Alert Body */}
      <div className="my-auto space-y-5 text-center">
        <div className="w-20 h-20 bg-[#FEF2F2] rounded-3xl flex items-center justify-center border-2 border-[#EF4444]/40 mx-auto shadow-xl shadow-[#EF4444]/20 animate-bounce">
          <AlertTriangle size={36} className="text-[#EF4444]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-white tracking-tight">Unavailability Predicted</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-[280px] mx-auto">
            ZepGO AI detected high congestion at your planned stop{' '}
            <strong className="text-white">Zeon Ulundurpet</strong> (100% occupied at 12:15 PM, estimated 35-minute wait).
          </p>
        </div>

        {/* Recommended Alternative Reroute Box */}
        <div className="bg-[#1A221E] border border-[#22C55E]/40 rounded-[20px] p-4 text-left space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-black text-[#22C55E] flex items-center gap-1.5">
              <ShieldCheck size={16} />
              Recommended Backup Reroute
            </span>
            <span className="text-[10px] font-bold bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded-md">
              +12 km Ahead
            </span>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-white">Zeon Fast Charger Salem (150 kW)</h4>
            <p className="text-xs text-slate-400">3 of 4 Plugs Open at Arrival • 0 Mins Wait Time</p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            <span>Predicted Arrival SOC: 22%</span>
            <span className="font-bold text-[#22C55E]">Optimal Power Intake</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pb-2">
        <button
          onClick={onAcceptReroute}
          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-4 px-6 rounded-[16px] shadow-lg shadow-[#22C55E]/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
        >
          <Zap size={18} className="fill-[#0B0F0D]" />
          <span>Accept Reroute to Salem Fast Charger</span>
        </button>

        <button
          onClick={onDismiss}
          className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-3 px-6 rounded-[16px] text-xs transition-colors"
        >
          Keep Original Route (Risk Wait Time)
        </button>
      </div>
    </div>
  );
};
