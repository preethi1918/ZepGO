import React from 'react';
import { AlertTriangleIcon, RefreshCwIcon } from './Icons';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Data',
  message = 'Check your mobile connection or try searching again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-red-50/50 rounded-2xl border border-red-100 my-4">
      <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
        <AlertTriangleIcon size={24} />
      </div>
      <h3 className="text-sm font-semibold text-red-950 mb-1">{title}</h3>
      <p className="text-xs text-red-700/80 max-w-xs mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-medium transition-all shadow-sm active:scale-95"
        >
          <RefreshCwIcon size={14} />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
