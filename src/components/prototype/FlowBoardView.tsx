import React from 'react';
import { IPhoneMockupFrame } from '../frame/iPhoneMockupFrame';

interface FlowBoardViewProps {
  screens: { name: string; component: React.ReactNode }[];
  onSelectScreen: (index: number) => void;
}

export const FlowBoardView: React.FC<FlowBoardViewProps> = ({ screens, onSelectScreen }) => {
  return (
    <div className="flex-1 bg-[#0F172A] p-6 md:p-10 overflow-y-auto no-scrollbar animate-fadeIn space-y-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-black text-[#22C55E] uppercase tracking-widest bg-[#22C55E]/10 px-3 py-1 rounded-full border border-[#22C55E]/30">
            Figma-Style Presentation Board
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-2">
            Complete 34-Screen ZepGO User Journey & Smart Stop Flow
          </h1>
          <p className="text-xs text-slate-400">
            Click on any screen card to jump into live interactive mode inside the iPhone 390x844 mockup.
          </p>
        </div>
      </div>

      {/* Grid of All 22 iPhone Mockups */}
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-start justify-items-center">
        {screens.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onSelectScreen(idx)}
            className="flex flex-col items-center space-y-3 cursor-pointer group transform transition-all duration-300 hover:-translate-y-2"
          >
            {/* Screen Number Badge */}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full group-hover:border-[#22C55E] transition-all">
              <span className="w-5 h-5 bg-[#22C55E] text-[#0B0F0D] rounded-full text-[11px] font-black flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-xs font-extrabold text-white max-w-[180px] truncate">
                {item.name}
              </span>
            </div>

            {/* Scaled Mini iPhone Mockup */}
            <div className="transform scale-[0.65] origin-top -mb-[280px] shadow-2xl group-hover:shadow-[#22C55E]/20 transition-all rounded-[52px]">
              <IPhoneMockupFrame showGlassReflection={false}>{item.component}</IPhoneMockupFrame>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
