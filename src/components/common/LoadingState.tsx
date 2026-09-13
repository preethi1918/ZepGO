import React from 'react';

export interface LoadingStateProps {
  message?: string;
  type?: 'full' | 'inline' | 'skeleton';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Updating EV status...',
  type = 'full',
}) => {
  if (type === 'skeleton') {
    return (
      <div className="w-full space-y-3 p-4 animate-pulse">
        <div className="h-24 bg-slate-200/80 rounded-xl w-full" />
        <div className="h-16 bg-slate-200/60 rounded-xl w-full" />
        <div className="h-16 bg-slate-200/40 rounded-xl w-full" />
      </div>
    );
  }

  if (type === 'inline') {
    return (
      <div className="flex items-center justify-center gap-2 p-3 text-slate-500 text-xs font-medium">
        <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center my-6">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-sm border border-blue-100">
        <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-700">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Connecting to navigation network</p>
    </div>
  );
};
