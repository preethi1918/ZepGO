import React from 'react';
import { PlusIcon, MinusIcon, CrosshairIcon, LayersIcon } from '../common/Icons';

export interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRecenter?: () => void;
  onToggleLayer?: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onRecenter,
  onToggleLayer,
}) => {
  return (
    <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
      {onRecenter && (
        <button
          onClick={onRecenter}
          className="w-10 h-10 rounded-xl bg-white text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
          aria-label="Recenter location"
          title="Recenter location"
        >
          <CrosshairIcon size={18} className="text-blue-600" />
        </button>
      )}

      {onToggleLayer && (
        <button
          onClick={onToggleLayer}
          className="w-10 h-10 rounded-xl bg-white text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
          aria-label="Map layers"
          title="Map layers"
        >
          <LayersIcon size={18} />
        </button>
      )}

      {(onZoomIn || onZoomOut) && (
        <div className="flex flex-col bg-white rounded-xl shadow-md border border-slate-200/80 overflow-hidden">
          {onZoomIn && (
            <button
              onClick={onZoomIn}
              className="w-10 h-10 text-slate-700 flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition-colors border-b border-slate-100"
              aria-label="Zoom in"
            >
              <PlusIcon size={18} />
            </button>
          )}
          {onZoomOut && (
            <button
              onClick={onZoomOut}
              className="w-10 h-10 text-slate-700 flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition-colors"
              aria-label="Zoom out"
            >
              <MinusIcon size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
