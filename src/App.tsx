import { useState } from 'react';
import { AppNavigator } from './navigation/AppNavigator';
import { PrototypeMasterApp } from './components/prototype/PrototypeMasterApp';
import { SmartStopSuiteMaster } from './components/smartStop/SmartStopSuiteMaster';
import { Monitor, Smartphone, Coffee, Zap } from 'lucide-react';

export function App() {
  const [activeAppMode, setActiveAppMode] = useState<'web' | 'mobile_prototype' | 'smart_stop'>('smart_stop');

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-[Inter,sans-serif]">
      {/* Top Main Mode Switcher Bar */}
      <div className="bg-[#0B0F0D] text-white border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between z-50 sticky top-0 shadow-lg shrink-0 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#22C55E] text-[#0B0F0D] font-black rounded-xl flex items-center justify-center text-xs shadow-md shadow-[#22C55E]/20">
            <Zap size={18} className="fill-[#0B0F0D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">ZepGO India EV</span>
              <span className="text-[10px] font-extrabold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>🇮🇳</span> Smart Stop & Cafe AI Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Intelligent Journey & Rest Stop Synchronization</p>
          </div>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center bg-[#161C19] border border-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveAppMode('smart_stop')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeAppMode === 'smart_stop'
                ? 'bg-[#22C55E] text-[#0B0F0D] font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coffee size={15} />
            <span>Smart Stop Feature (10 Screens) ☕</span>
          </button>

          <button
            onClick={() => setActiveAppMode('web')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeAppMode === 'web'
                ? 'bg-[#22C55E] text-[#0B0F0D] font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor size={15} />
            <span>Web Desktop View 💻</span>
          </button>

          <button
            onClick={() => setActiveAppMode('mobile_prototype')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeAppMode === 'mobile_prototype'
                ? 'bg-[#22C55E] text-[#0B0F0D] font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={15} />
            <span>22-Screen Prototype 📱</span>
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeAppMode === 'smart_stop' && <SmartStopSuiteMaster />}
        {activeAppMode === 'web' && <AppNavigator />}
        {activeAppMode === 'mobile_prototype' && <PrototypeMasterApp />}
      </div>
    </div>
  );
}

export default App;
