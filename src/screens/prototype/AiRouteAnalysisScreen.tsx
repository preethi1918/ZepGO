import React, { useEffect, useState } from 'react';
import { Zap, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface AiRouteAnalysisScreenProps {
  onComplete: () => void;
}

export const AiRouteAnalysisScreen: React.FC<AiRouteAnalysisScreenProps> = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Analyzing battery & vehicle telemetry...',
    'Calculating elevation & highway wind impact...',
    'Predicting charger availability at estimated arrival time...',
    'Optimizing charging stop sequence for zero wait time...',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 800);
          return prev;
        }
      });
    }, 900);

    return () => clearInterval(timer);
  }, [onComplete, steps.length]);

  return (
    <div className="flex-1 bg-[#0B0F0D] text-white flex flex-col justify-between p-6 select-none animate-fadeIn relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag */}
      <div className="pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#22C55E]/10 border border-[#22C55E]/30 px-3 py-1 rounded-full">
          <Sparkles size={14} className="text-[#22C55E]" />
          <span className="text-xs font-bold text-[#22C55E]">ZepGO Neural Engine</span>
        </div>
        <span className="text-xs text-slate-500 font-mono">Chennai → Coimbatore</span>
      </div>

      {/* Center Spinner & AI Animation */}
      <div className="my-auto flex flex-col items-center justify-center space-y-6 text-center z-10">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-[#22C55E]/20 animate-ping" />
          <div className="w-24 h-24 rounded-full bg-[#1A221E] border-2 border-[#22C55E] flex items-center justify-center shadow-2xl shadow-[#22C55E]/30">
            <Zap size={36} className="text-[#22C55E] fill-[#22C55E] animate-pulse" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Synthesizing Route AI</h2>
          <p className="text-xs text-slate-400">Processing 14 highway chargers on NH544</p>
        </div>

        {/* 4-Step Animated Progress Checklist */}
        <div className="w-full max-w-[300px] space-y-3 bg-[#111613] p-4 rounded-[20px] border border-slate-800 text-left">
          {steps.map((text, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;

            return (
              <div key={idx} className="flex items-center gap-3 text-xs">
                {isDone ? (
                  <CheckCircle2 size={18} className="text-[#22C55E] shrink-0" />
                ) : isCurrent ? (
                  <Loader2 size={18} className="text-[#22C55E] animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span
                  className={
                    isDone
                      ? 'text-slate-300 font-medium line-through opacity-70'
                      : isCurrent
                      ? 'text-[#22C55E] font-bold'
                      : 'text-slate-600 font-medium'
                  }
                >
                  {text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Status */}
      <div className="pb-4 text-center z-10 space-y-2">
        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#22C55E] h-full transition-all duration-700"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500">Predicted arrival charger reliability guarantee active</p>
      </div>
    </div>
  );
};
