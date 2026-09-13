import React, { useState } from 'react';
import { IPhoneMockupFrame } from '../frame/iPhoneMockupFrame';
import { SmartStopDetectionCard } from './SmartStopDetectionCard';
import { RecommendedStopScreen } from './RecommendedStopScreen';
import { CafeDuringChargingScreen } from './CafeDuringChargingScreen';
import { ChargingCafeCombinedScreen } from './ChargingCafeCombinedScreen';
import { AddStopSelectionMenu } from './AddStopSelectionMenu';
import { SmartStopPreferencesScreen } from './SmartStopPreferencesScreen';
import { RouteUpdatedScreen } from './RouteUpdatedScreen';
import { AlternativeStopComparisonScreen } from './AlternativeStopComparisonScreen';
import { StopDetailsDeepDiveScreen } from './StopDetailsDeepDiveScreen';
import { SmartStopLiveNavCard } from './SmartStopLiveNavCard';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const SmartStopSuiteMaster: React.FC = () => {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  const screenNames = [
    '1. Smart Stop Detection Card (Route Planning)',
    '2. Recommended Stop Screen (Single Full View)',
    '3. Cafe Recommendation During Charging',
    '4. Charging + Cafe Combined Screen (Sync Gauge)',
    '5. Add Stop Selection Menu (Category Modal)',
    '6. User Smart Stop Preferences Screen',
    '7. Route Updated Screen (Recalculated Metrics)',
    '8. Alternative Stop Comparison (Side-by-Side)',
    '9. Stop Details Deep-Dive Screen',
    '10. Smart Stop Card in Live Navigation',
  ];

  const renderActiveScreen = () => {
    switch (activeScreenIndex) {
      case 0:
        return (
          <div className="p-4 flex-1 flex items-center justify-center">
            <SmartStopDetectionCard
              onViewRecommendation={() => setActiveScreenIndex(1)}
              onViewAlternatives={() => setActiveScreenIndex(7)}
            />
          </div>
        );
      case 1:
        return (
          <RecommendedStopScreen
            onAddStop={() => setActiveScreenIndex(6)}
            onViewAlternatives={() => setActiveScreenIndex(7)}
            onBack={() => setActiveScreenIndex(0)}
          />
        );
      case 2:
        return (
          <CafeDuringChargingScreen
            onSelectCafe={() => setActiveScreenIndex(3)}
            onClose={() => setActiveScreenIndex(0)}
          />
        );
      case 3:
        return (
          <ChargingCafeCombinedScreen
            onConfirmUnifiedStop={() => setActiveScreenIndex(6)}
            onBack={() => setActiveScreenIndex(2)}
          />
        );
      case 4:
        return (
          <AddStopSelectionMenu
            onSelectCategory={() => setActiveScreenIndex(1)}
            onBack={() => setActiveScreenIndex(0)}
          />
        );
      case 5:
        return (
          <SmartStopPreferencesScreen
            onSavePreferences={() => setActiveScreenIndex(0)}
            onBack={() => setActiveScreenIndex(0)}
          />
        );
      case 6:
        return (
          <RouteUpdatedScreen
            onStartNavigation={() => setActiveScreenIndex(9)}
            onViewRouteDetails={() => setActiveScreenIndex(8)}
          />
        );
      case 7:
        return (
          <AlternativeStopComparisonScreen
            onSelectAlternative={() => setActiveScreenIndex(8)}
            onBack={() => setActiveScreenIndex(1)}
          />
        );
      case 8:
        return (
          <StopDetailsDeepDiveScreen
            onConfirmStop={() => setActiveScreenIndex(6)}
            onBack={() => setActiveScreenIndex(1)}
          />
        );
      case 9:
        return (
          <div className="flex-1 bg-[#0F172A] p-4 flex flex-col justify-end">
            <SmartStopLiveNavCard
              onOpenFullRecommendation={() => setActiveScreenIndex(1)}
              onDismiss={() => setActiveScreenIndex(0)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-slate-900 text-white flex flex-col font-[Inter,sans-serif] select-none">
      {/* Smart Stop Feature Suite Sub-Toolbar */}
      <div className="bg-[#111613] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 z-40">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#22C55E]" />
          <span className="text-xs font-black text-white">Smart Stop & Cafe Recommendation Feature</span>
          <span className="text-[10px] font-extrabold bg-[#22C55E]/15 text-[#22C55E] px-2 py-0.5 rounded-full border border-[#22C55E]/30">
            10 Screen Suite
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreenIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeScreenIndex === 0}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-white cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          <select
            value={activeScreenIndex}
            onChange={(e) => setActiveScreenIndex(Number(e.target.value))}
            className="bg-[#0B0F0D] text-white text-xs font-bold border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#22C55E] cursor-pointer max-w-[280px] truncate"
          >
            {screenNames.map((name, idx) => (
              <option key={idx} value={idx}>
                {name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setActiveScreenIndex((prev) => Math.min(9, prev + 1))}
            disabled={activeScreenIndex === 9}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-white cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Screen Render Container */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto no-scrollbar">
        <IPhoneMockupFrame>{renderActiveScreen()}</IPhoneMockupFrame>
      </div>
    </div>
  );
};
