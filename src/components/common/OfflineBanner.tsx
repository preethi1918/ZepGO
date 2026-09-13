import React, { useState, useEffect } from 'react';
import { WifiOffIcon } from './Icons';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [justCameOnline, setJustCameOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setJustCameOnline(true);
      setTimeout(() => setJustCameOnline(false), 3000);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setJustCameOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (justCameOnline) {
    return (
      <div className="fixed top-3 right-3 z-50 bg-emerald-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in duration-200 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <span>● Online Mode Restored</span>
      </div>
    );
  }

  if (!isOffline) return null;

  return (
    <div className="fixed top-3 right-3 z-50 bg-slate-900/90 backdrop-blur-md text-amber-300 border border-amber-500/30 font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in duration-200 pointer-events-none">
      <WifiOffIcon size={14} className="text-amber-400" />
      <span>● Offline Mode (Cached Data)</span>
    </div>
  );
};
