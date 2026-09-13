import React from 'react';
import { XIcon } from './Icons';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  snapHeight?: 'auto' | 'half' | 'full';
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  snapHeight = 'auto',
}) => {
  if (!isOpen) return null;

  const heightClasses = {
    auto: 'max-h-[85vh]',
    half: 'h-[50vh]',
    full: 'h-[92vh]',
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-200">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Container */}
      <div
        className={`
          relative z-10 w-full bg-white rounded-t-3xl shadow-2xl 
          border-t border-slate-100 flex flex-col overflow-hidden transition-transform duration-300 animate-in slide-in-from-bottom-full
          ${heightClasses[snapHeight]}
        `}
      >
        {/* Mobile Drag Pill */}
        <div className="w-full flex justify-center py-2.5 shrink-0 bg-white" onClick={onClose}>
          <div className="w-10 h-1 rounded-full bg-slate-300 cursor-pointer hover:bg-slate-400 transition-colors" />
        </div>

        {/* Optional Header */}
        {(title || subtitle) && (
          <div className="flex items-center justify-between px-5 pb-3 pt-1 border-b border-slate-100 shrink-0">
            <div>
              {title && <h3 className="text-base font-bold text-slate-900 leading-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
              aria-label="Close sheet"
            >
              <XIcon size={16} />
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
};
