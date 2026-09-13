import React from 'react';
import { ArrowLeft, Zap, AlertTriangle } from 'lucide-react';

interface NotificationsListScreenProps {
  onBack: () => void;
}

export const NotificationsListScreen: React.FC<NotificationsListScreenProps> = ({ onBack }) => {
  const notifications = [
    {
      id: '1',
      title: 'Charger Queue Forecast Alert',
      desc: 'Zeon Salem Fast Charger predicted to have 3 of 4 plugs open at 1:30 PM (94% confidence).',
      time: '5 mins ago',
      type: 'success',
    },
    {
      id: '2',
      title: 'High Congestion Warning',
      desc: 'Tata Power Tindivanam predicted 100% busy between 12:30 PM - 1:15 PM.',
      time: '18 mins ago',
      type: 'warning',
    },
    {
      id: '3',
      title: 'Battery SOC Safety Buffer',
      desc: 'Elevation gain (+420m) on Salem Bypass considered in range estimation.',
      time: '1 hour ago',
      type: 'info',
    },
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-[#0B0F0D]"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-extrabold text-sm text-[#0B0F0D]">Smart Notifications</span>
        <div className="w-9" />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar py-1">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-4 rounded-[20px] bg-white border border-[#E5E7EB] shadow-sm space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {n.type === 'warning' ? (
                  <AlertTriangle size={16} className="text-[#F59E0B]" />
                ) : (
                  <Zap size={16} className="text-[#22C55E]" />
                )}
                <h4 className="font-extrabold text-xs text-[#0B0F0D]">{n.title}</h4>
              </div>
              <span className="text-[10px] text-[#6B7280] font-medium">{n.time}</span>
            </div>
            <p className="text-xs text-[#6B7280] leading-snug">{n.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
