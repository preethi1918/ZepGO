import React, { useState } from 'react';
import { ZapIcon, RefreshCwIcon, RadioIcon, ChevronDownIcon, ChevronUpIcon } from '../common/Icons';

export interface RealtimeControlBarProps {
  lastSyncTime?: string;
  isSyncing?: boolean;
  onRefreshData?: () => void;
  onTriggerPlugChange?: () => void;
  hasGps?: boolean;
  locationAddress?: string;
}

export const RealtimeControlBar: React.FC<RealtimeControlBarProps> = ({
  lastSyncTime,
  isSyncing,
  onRefreshData,
  onTriggerPlugChange,
  hasGps,
  locationAddress,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-3 shadow-md border border-slate-800 space-y-2">
      {/* Primary Bar: Live Connection Badges & Quick Action */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Live Status Pulse */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 border border-emerald-800/80 rounded-xl text-emerald-400 font-bold shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Realtime Live</span>
          </div>

          {/* GPS Badge */}
          <div className="px-2 py-1 bg-slate-800 rounded-xl text-[11px] font-semibold text-slate-300 shrink-0 flex items-center gap-1">
            <RadioIcon size={12} className={hasGps ? 'text-blue-400' : 'text-slate-500'} />
            <span>{hasGps ? 'GPS Connected' : 'Simulated GPS'}</span>
          </div>

          {lastSyncTime && (
            <span className="text-[10px] text-slate-400 shrink-0">Updated {lastSyncTime}</span>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/60 transition-all shrink-0 ml-2"
        >
          <span>Live Tools</span>
          {isExpanded ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
        </button>
      </div>

      {/* Expanded Controls Drawer */}
      {isExpanded && (
        <div className="pt-2.5 border-t border-slate-800 space-y-2.5 text-xs animate-fadeIn">
          {locationAddress && (
            <p className="text-[11px] text-slate-300 font-medium line-clamp-1 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
              📍 <span className="text-slate-400">Current Location:</span> {locationAddress}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRefreshData}
              disabled={isSyncing}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
            >
              <RefreshCwIcon size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Syncing OSM...' : 'Refresh Live API'}</span>
            </button>

            <button
              onClick={onTriggerPlugChange}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
            >
              <ZapIcon size={14} />
              <span>Simulate Plug Event</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
