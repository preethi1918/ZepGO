import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, Car, History, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card';

export const QuickActionCard: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Plan Trip',
      subtitle: 'Smart EV Route Planner',
      path: '/plan-trip',
      icon: MapPin,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Find Charger',
      subtitle: 'Live Telematics & Queues',
      path: '/chargers',
      icon: Zap,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'My Vehicle',
      subtitle: 'Battery & Health Metrics',
      path: '/vehicle',
      icon: Car,
      color: 'bg-slate-100 text-slate-800 border-slate-200'
    },
    {
      title: 'Journey History',
      subtitle: 'Past Logs & Efficiency',
      path: '/history',
      icon: History,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          QUICK ACTIONS
        </h3>
        <span className="text-[11px] text-slate-500 font-semibold">Fast shortcuts</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.path}
              onClick={() => navigate(act.path)}
              className="text-left group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-2xl"
            >
              <Card
                variant="solid"
                className="p-4 transition-all duration-200 bg-white border-slate-200 group-hover:border-emerald-300 group-hover:shadow-md flex flex-col justify-between h-full space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
                    {act.subtitle}
                  </p>
                </div>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
};
