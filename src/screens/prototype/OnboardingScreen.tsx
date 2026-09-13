import React, { useState } from 'react';
import { Route, ShieldCheck, Zap, ArrowRight, Check } from 'lucide-react';

interface OnboardingScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onNext, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Route className="w-10 h-10 text-[#22C55E]" />,
      title: 'Smart Route Planning',
      subtitle: 'Real-Time Battery & Range AI',
      description:
        'Calculates optimal highway charging stops based on elevation, speed, climate, and real-world EV efficiency.',
      badge: 'Zero Range Anxiety',
    },
    {
      icon: <Zap className="w-10 h-10 text-[#22C55E]" />,
      title: 'Predictive Charger Availability',
      subtitle: 'Know Before You Arrive',
      description:
        'ZepGO predicts plug availability at your exact arrival time (+30m/+60m), so you never wait in line at a busy station.',
      badge: '98.4% Accuracy',
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-[#22C55E]" />,
      title: 'Intelligent Journey Confidence',
      subtitle: 'Automated Backup Rerouting',
      description:
        'Monitors charger health live. If a station becomes congested or faulty, ZepGO automatically routes you to a verified backup charger.',
      badge: 'Verified Station Network',
    },
  ];

  const handleForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onNext();
    }
  };

  const stepData = steps[currentStep];

  return (
    <div className="flex-1 bg-white text-[#0B0F0D] flex flex-col justify-between p-6 select-none animate-fadeIn">
      {/* Top Header Controls */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-1.5">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-7 bg-[#22C55E]' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
        <button
          onClick={onSkip}
          className="text-xs font-semibold text-[#6B7280] hover:text-[#0B0F0D] transition-colors px-2 py-1"
        >
          Skip
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center text-center my-auto px-4 space-y-6">
        <div className="w-24 h-24 bg-[#EAF8EF] rounded-3xl flex items-center justify-center border border-[#22C55E]/30 shadow-sm relative">
          {stepData.icon}
          <div className="absolute -bottom-2 bg-[#22C55E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            {stepData.badge}
          </div>
        </div>

        <div className="space-y-2 max-w-[280px]">
          <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
            {stepData.subtitle}
          </span>
          <h2 className="text-2xl font-extrabold text-[#0B0F0D] tracking-tight">{stepData.title}</h2>
          <p className="text-sm text-[#6B7280] leading-relaxed pt-1">{stepData.description}</p>
        </div>
      </div>

      {/* Bottom CTA Area */}
      <div className="space-y-3 pb-2">
        <button
          onClick={handleForward}
          className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-bold py-4 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
        >
          <span>{currentStep === steps.length - 1 ? 'Get Started Now' : 'Continue'}</span>
          {currentStep === steps.length - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
        </button>

        <p className="text-center text-[11px] text-[#6B7280]">
          Step {currentStep + 1} of {steps.length} • Tailored for Indian Highways
        </p>
      </div>
    </div>
  );
};
