import React from 'react';
import { Bell, AlertTriangle, Zap, CheckCircle2, Route, Activity, X } from 'lucide-react';

export interface AppNotification {
  id: string;
  type: 'battery' | 'charging' | 'route' | 'anomaly' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onClose?: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onDismiss,
  onClearAll,
  onClose
}) => {
  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'battery':
        return <Zap size={15} className="text-rose-600" />;
      case 'charging':
        return <AlertTriangle size={15} className="text-amber-600" />;
      case 'route':
        return <Route size={15} className="text-blue-600" />;
      case 'anomaly':
        return <Activity size={15} className="text-purple-600" />;
      case 'success':
        return <CheckCircle2 size={15} className="text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xl max-w-sm w-full text-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-emerald-600" />
          <h3 className="font-black text-sm text-slate-900">Notifications & Alerts</h3>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">All clear! No pending vehicle or route alerts.</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 hover:bg-slate-100/80 p-3 rounded-2xl border border-slate-200/80 transition relative text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  {getIcon(item.type)}
                  <span>{item.title}</span>
                </div>
                <span className="text-[10px] text-slate-400">{item.time}</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">{item.message}</p>
              <button
                onClick={() => onDismiss(item.id)}
                className="text-[10px] text-slate-400 hover:text-slate-600 font-medium block pt-1 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
