import React from 'react';
import type { AiRecommendation } from '../../services/ai/aiRecommendationService';
import { ChevronRightIcon } from '../common/Icons';

export interface AiRecommendationCardProps {
  recommendation: AiRecommendation;
  onApply?: (rec: AiRecommendation) => void;
  compact?: boolean;
}

export const AiRecommendationCard: React.FC<AiRecommendationCardProps> = ({
  recommendation,
  onApply,
  compact = false,
}) => {
  const { title, subtitle, explanation, impactBadge, confidenceScore, actionLabel } = recommendation;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-4 shadow-lg border border-blue-800/80 relative overflow-hidden space-y-3">
      {/* Background Glowing Orb Accent */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            🤖
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">ZepGO AI Co-Pilot</span>
            <h3 className="text-xs font-bold leading-tight text-white line-clamp-1">{title}</h3>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-700">
          {confidenceScore}% AI Match
        </span>
      </div>

      <p className="text-[11px] font-semibold text-slate-200">{subtitle}</p>

      {!compact && (
        <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
          {explanation}
        </p>
      )}

      {/* Footer Impact Badge & Action Button */}
      <div className="flex items-center justify-between pt-1 border-t border-blue-900/60">
        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/80">
          {impactBadge}
        </span>

        {onApply && (
          <button
            onClick={() => onApply(recommendation)}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-md"
          >
            <span>{actionLabel}</span>
            <ChevronRightIcon size={12} />
          </button>
        )}
      </div>
    </div>
  );
};
