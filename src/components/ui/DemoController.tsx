import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, RotateCcw } from 'lucide-react';
import { Badge } from './Badge';
import { storage } from '../../utils/storage';
import { findRoute } from '../../data/mockRoutes';
import { calculateTripPlan } from '../../utils/batteryEngine';
import type { Vehicle } from '../../types';

interface Step {
  id: number;
  title: string;
  desc: string;
  action: () => void;
}

export const DemoController: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = false, onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const runStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    const vehicle: Vehicle = storage.getVehicleData();
    const route = findRoute('Chennai', 'Coimbatore');

    switch (stepIndex) {
      case 0: {
        // Scenario 1 — High Battery (90%, 100 km) -> No Charging Required
        const sc1Route = { ...route, distanceKm: 100 };
        const plan = calculateTripPlan(sc1Route, 'Fastest', { traffic: 'normal', weather: 'normal', road: 'good' }, '08:00 AM', { ...vehicle, soc: 90, batteryCapacity: 40.5 });
        localStorage.setItem('zepgo_active_trip', JSON.stringify(plan));
        navigate('/route-result');
        break;
      }
      case 1: {
        // Scenario 2 — Medium Battery (55%, 180 km) -> Charging Required
        const sc2Route = { ...route, distanceKm: 180 };
        const plan = calculateTripPlan(sc2Route, 'Fastest', { traffic: 'heavy', weather: 'normal', road: 'good' }, '08:00 AM', { ...vehicle, soc: 55, batteryCapacity: 40.5 });
        localStorage.setItem('zepgo_active_trip', JSON.stringify(plan));
        navigate('/route-result');
        break;
      }
      case 2: {
        // Scenario 3 — Low Battery (25%, 150 km) -> Critical Charging Required
        const sc3Route = { ...route, distanceKm: 150 };
        const plan = calculateTripPlan(sc3Route, 'Fastest', { traffic: 'heavy', weather: 'rain', road: 'good' }, '08:00 AM', { ...vehicle, soc: 25, batteryCapacity: 40.5 });
        localStorage.setItem('zepgo_active_trip', JSON.stringify(plan));
        navigate('/route-result');
        break;
      }
      case 3: {
        // Scenario 4 — Short Trip (30%, 25 km) -> No Charging Required
        const sc4Route = { ...route, distanceKm: 25 };
        const plan = calculateTripPlan(sc4Route, 'Fastest', { traffic: 'normal', weather: 'normal', road: 'good' }, '08:00 AM', { ...vehicle, soc: 30, batteryCapacity: 40.5 });
        localStorage.setItem('zepgo_active_trip', JSON.stringify(plan));
        navigate('/route-result');
        break;
      }
      case 4: {
        navigate('/chargers');
        break;
      }
      case 5: {
        navigate('/backup-charger');
        break;
      }
      case 6: {
        navigate('/smart-stops');
        break;
      }
      case 7: {
        navigate('/live-journey');
        break;
      }
    }
  };

  const steps: Step[] = [
    { id: 0, title: 'Scenario 1: High Battery', desc: '90% SOC, 100km -> 🟢 No Charging Required', action: () => runStep(0) },
    { id: 1, title: 'Scenario 2: Medium Battery', desc: '55% SOC, 180km -> 🟡 Charging Required', action: () => runStep(1) },
    { id: 2, title: 'Scenario 3: Low Battery', desc: '25% SOC, 150km -> 🔴 Charging Required', action: () => runStep(2) },
    { id: 3, title: 'Scenario 4: Short Trip', desc: '30% SOC, 25km -> 🟢 No Charging Required', action: () => runStep(3) },
    { id: 4, title: 'Chargers & Risk Model', desc: 'Evaluate Tata Power 250kW & queue risk', action: () => runStep(4) },
    { id: 5, title: 'Backup Reachability', desc: 'Verify failover charger reachability', action: () => runStep(5) },
    { id: 6, title: 'Smart Rest Stop', desc: 'Green Leaf Café detour', action: () => runStep(6) },
    { id: 7, title: 'Live Journey Monitoring', desc: 'Real-time telemetry dashboard', action: () => runStep(7) }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full bg-white border border-emerald-200 rounded-2xl shadow-2xl p-4 space-y-3 text-slate-900 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Hackathon Demo Scenario Controller
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Phase 27 Active</Badge>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-0.5 rounded bg-slate-100"
          >
            ✕
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-600 leading-tight">
        Click a step below to simulate real-time ZepGO intelligence features (Chennai → Coimbatore demo route).
      </p>

      <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          return (
            <button
              key={step.id}
              onClick={step.action}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="truncate">{step.title}</span>
                <ChevronRight className="w-3 h-3 text-emerald-600 shrink-0" />
              </div>
              <p className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">{step.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
        <button
          onClick={() => runStep(0)}
          className="text-[10px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo</span>
        </button>
        <span className="text-[10px] text-emerald-700 font-mono font-bold">Step {currentStep + 1} of 8</span>
      </div>
    </div>
  );
};
