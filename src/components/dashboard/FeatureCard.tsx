import React from 'react';
import {
  Compass,
  ShieldCheck,
  Zap,
  ShieldAlert,
  Activity,
  CheckCircle2,
  BarChart3,
  MessageSquare,
  Coffee,
  LifeBuoy,
  Navigation
} from 'lucide-react';
import { Card } from '../ui/Card';

export const FeatureCard: React.FC = () => {
  const features = [
    {
      title: '1. Realistic EV Range',
      value: '265 km',
      subtitle: 'Physics & weather tuned',
      icon: Compass,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      title: '2. Dynamic Reserve',
      value: '18% Buffer',
      subtitle: 'Configurable (Min 15%)',
      icon: ShieldCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      title: '3. Smart Charger',
      value: 'Tata 250kW',
      subtitle: 'CCS2 • 2/4 Free Ports',
      icon: Zap,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      title: '4. Backup Charger',
      value: 'Zeon 150kW',
      subtitle: '18 km failover reachability',
      icon: ShieldAlert,
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      title: '5. Real-Time Monitoring',
      value: 'Active Engine',
      subtitle: 'Adaptive rerouting',
      icon: Activity,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      title: '6. Unnecessary Charge Check',
      value: 'Direct Safe',
      subtitle: 'Prevents wasteful stops',
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      title: '7. Charger Risk Analytics',
      value: 'Low Risk',
      subtitle: '94/100 Reliability Score',
      icon: BarChart3,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      title: '8. Explainable Decision',
      value: 'Clear Reasoning',
      subtitle: 'Transparent trip advice',
      icon: MessageSquare,
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      title: '9. Nearby Café Stop',
      value: 'Green Leaf Café',
      subtitle: '1.2 km detour during charging',
      icon: Coffee,
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      title: '10. Emergency Support',
      value: 'Safe Stop 500m',
      subtitle: 'Tyre & roadside dispatch',
      icon: LifeBuoy,
      color: 'text-red-700 bg-red-50 border-red-200'
    },
    {
      title: '11. Route Intelligence',
      value: 'Elevation Tuned',
      subtitle: 'Traffic & weather penalties',
      icon: Navigation,
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    }
  ];

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          ZEPGO 11 CORE INTELLIGENCE MODULES
        </h3>
        <span className="text-xs text-emerald-700 font-bold">EcoTech Light System Active</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <Card
              key={feat.title}
              variant="solid"
              className="p-3.5 space-y-2 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-tight">{feat.title}</span>
                <div className={`p-1.5 rounded-lg border ${feat.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900 tracking-tight">
                  {feat.value}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  {feat.subtitle}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
