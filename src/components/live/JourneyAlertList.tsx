import React from 'react';
import { Bell, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import type { JourneyAlert } from '../../types';

interface JourneyAlertListProps {
  alerts: JourneyAlert[];
}

export const JourneyAlertList: React.FC<JourneyAlertListProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <Card variant="glass" className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-Time Telematics Journey Alerts</span>
        </h4>
        <span className="text-[10px] text-slate-400 font-mono">{alerts.length} Active</span>
      </div>

      <div className="space-y-2">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
              alt.severity === 'critical'
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 animate-pulse'
                : alt.severity === 'warning'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-slate-950/70 border-slate-800 text-slate-300'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {alt.severity === 'critical' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {alt.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {alt.severity === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
            </div>

            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{alt.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">{alt.timestamp}</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">{alt.message}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
