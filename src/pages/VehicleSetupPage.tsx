import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Zap, ArrowRight, CheckCircle, Sliders, Battery, Info } from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';
import { useAuth } from '../context/AuthContext';

export const VehicleSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto py-4">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<Car className="w-3.5 h-3.5" />}>
                EcoTech Onboarding
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/vehicle-setup</span>
            </div>
            <PageTitle gradient>Vehicle Profile Onboarding</PageTitle>
            <PageSubtitle>
              Configure EV specs for range estimation and smart charging optimization.
            </PageSubtitle>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate('/home')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Go to Home Dashboard
          </Button>
        </div>

        {/* Notice Card */}
        <Card variant="solid" className="bg-emerald-50 border-emerald-200 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl border border-emerald-200 text-emerald-700 shrink-0 shadow-xs">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                Authentication & Vehicle Telemetry Sync Active
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                Welcome <span className="text-emerald-800 font-bold">{user?.name || 'EV Driver'}</span>! Telemetry sync initialized. Your profile is saved in local storage.
              </p>
              <div className="text-xs text-slate-600 pt-1 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Default EV parameters initialized for Tata Nexon EV / Tesla specs.</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Preview Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Card variant="solid" className="space-y-3 bg-white border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Model Selection</span>
              <Car className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-base font-black text-slate-900">{user?.vehicleModel || 'Tata Nexon EV (40.5 kWh)'}</div>
            <Badge variant="info" icon={<CheckCircle className="w-3 h-3" />}>Pre-configured</Badge>
          </Card>

          <Card variant="solid" className="space-y-3 bg-white border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Usable Battery</span>
              <Battery className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-base font-black text-slate-900">40.5 kWh (Usable)</div>
            <Badge variant="neutral">Default Spec</Badge>
          </Card>

          <Card variant="solid" className="space-y-3 bg-white border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Max DC Fast Charge</span>
              <Sliders className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-base font-black text-slate-900">250 kW Peak</div>
            <Badge variant="neutral">Auto-detected</Badge>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};
