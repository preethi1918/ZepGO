import React from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Grid, Smartphone, Palette, RotateCcw } from 'lucide-react';

interface PrototypeToolbarProps {
  currentScreenIndex: number;
  totalScreens: number;
  screenNames: string[];
  onSelectScreen: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  isAutoPlay: boolean;
  onToggleAutoPlay: () => void;
  viewMode: 'single' | 'grid' | 'design_system';
  onChangeViewMode: (mode: 'single' | 'grid' | 'design_system') => void;
  onResetFlow: () => void;
}

export const PrototypeToolbar: React.FC<PrototypeToolbarProps> = ({
  currentScreenIndex,
  totalScreens,
  screenNames,
  onSelectScreen,
  onPrev,
  onNext,
  isAutoPlay,
  onToggleAutoPlay,
  viewMode,
  onChangeViewMode,
  onResetFlow,
}) => {
  return (
    <header className="bg-[#0B0F0D] text-white border-b border-slate-800 px-4 py-3 sticky top-0 z-50 shadow-xl flex flex-wrap items-center justify-between gap-3">
      {/* Brand & Prototype Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#22C55E] text-[#0B0F0D] font-extrabold rounded-xl flex items-center justify-center text-sm shadow-md">
          ⚡
        </div>
        <div>
          <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
            ZepGO Design System & Interactive Prototype
            <span className="text-[10px] font-extrabold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 px-2 py-0.5 rounded-full">
              iPhone 390x844
            </span>
          </h1>
          <p className="text-[11px] text-slate-400">Predictive EV Journey Planning • 34 Cohesive Screens</p>
        </div>
      </div>

      {/* Center Screen Navigator */}
      <div className="flex items-center gap-2 bg-[#161C19] border border-slate-800 p-1 rounded-2xl">
        <button
          onClick={onPrev}
          disabled={currentScreenIndex === 0}
          className="p-2 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
          title="Previous Screen"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dropdown Selector */}
        <select
          value={currentScreenIndex}
          onChange={(e) => onSelectScreen(Number(e.target.value))}
          className="bg-[#0B0F0D] text-white text-xs font-bold border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#22C55E] cursor-pointer max-w-[240px] truncate"
        >
          {screenNames.map((name, idx) => (
            <option key={idx} value={idx}>
              {idx + 1}. {name}
            </option>
          ))}
        </select>

        <button
          onClick={onNext}
          disabled={currentScreenIndex === totalScreens - 1}
          className="p-2 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
          title="Next Screen"
        >
          <ChevronRight size={18} />
        </button>

        {/* Auto Play */}
        <button
          onClick={onToggleAutoPlay}
          className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-bold ${
            isAutoPlay ? 'bg-[#22C55E] text-[#0B0F0D]' : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
          title="Auto Play Journey Flow"
        >
          {isAutoPlay ? <Pause size={15} /> : <Play size={15} />}
          <span className="hidden sm:inline">{isAutoPlay ? 'Pause' : 'Play Flow'}</span>
        </button>
      </div>

      {/* Right View Modes */}
      <div className="flex items-center gap-2">
        <button
          onClick={onResetFlow}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors text-xs font-bold flex items-center gap-1"
          title="Restart from Splash Screen"
        >
          <RotateCcw size={14} />
          <span className="hidden md:inline">Restart</span>
        </button>

        <div className="flex items-center bg-[#161C19] border border-slate-800 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => onChangeViewMode('single')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'single'
                ? 'bg-[#22C55E] text-[#0B0F0D] font-extrabold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={14} />
            <span>Interactive Phone</span>
          </button>

          <button
            onClick={() => onChangeViewMode('grid')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-[#22C55E] text-[#0B0F0D] font-extrabold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid size={14} />
            <span>34-Screen Flow Board</span>
          </button>

          <button
            onClick={() => onChangeViewMode('design_system')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'design_system'
                ? 'bg-[#22C55E] text-[#0B0F0D] font-extrabold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette size={14} />
            <span>Design Specs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
