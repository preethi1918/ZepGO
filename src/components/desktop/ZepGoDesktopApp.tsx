import React, { useState } from 'react';
import { DesktopTopHeader, type DesktopNavTab } from './DesktopTopHeader';
import { PlanJourneyDesktop } from './PlanJourneyDesktop';
import { LiveNavigationDesktop } from './LiveNavigationDesktop';
import { WebSmartStopDashboard } from '../smartStop/WebSmartStopDashboard';
import { LoginDesktop } from './LoginDesktop';
import { SignUpDesktop } from './SignUpDesktop';
import { VehicleOnboardingDesktop } from './VehicleOnboardingDesktop';
import { MyVehicleDesktop } from './MyVehicleDesktop';
import { ChevronRight } from 'lucide-react';
import type { VehicleState } from '../../types/vehicle';

export const ZepGoDesktopApp: React.FC = () => {
  // App Authentication & Flow Stage: 'app' | 'login' | 'signup' | 'onboarding'
  const [flowStage, setFlowStage] = useState<'app' | 'login' | 'signup' | 'onboarding'>('app');

  // Navigation State
  const [activeTab, setActiveTab] = useState<DesktopNavTab>('plan_journey');

  // Active Vehicle State (Default preset Tata Nexon EV Max)
  const [activeVehicle, setActiveVehicle] = useState<VehicleState>({
    modelName: 'Tata Nexon EV Max',
    brand: 'Tata',
    trim: 'Nexon EV Max 40.5 kWh',
    batteryCapacityKwh: 40.5,
    currentSocPercent: 34,
    estimatedRangeKm: 110,
    healthPercent: 98,
    chargingStatus: 'discharging',
    currentChargePowerKw: 0,
    supportedPlugs: ['CCS2'],
    averageConsumptionWhPerKm: 135,
    licensePlate: 'KA-01-EV-2026',
    minArrivalSocBufferPercent: 15,
    preferredNetworks: ['Zeon', 'Tata Power', 'Jio-bp'],
    ecoScore: 92,
    totalKmDriven: 14200,
    totalCo2OffsetKg: 1850,
    totalChargingCostSavedRs: 42000,
  });

  // Handle flow transitions
  if (flowStage === 'login') {
    return (
      <LoginDesktop
        onLoginSuccess={() => setFlowStage('onboarding')}
        onGoToSignUp={() => setFlowStage('signup')}
      />
    );
  }

  if (flowStage === 'signup') {
    return (
      <SignUpDesktop
        onSignUpSuccess={() => setFlowStage('onboarding')}
        onGoToLogin={() => setFlowStage('login')}
      />
    );
  }

  if (flowStage === 'onboarding') {
    return (
      <VehicleOnboardingDesktop
        onCompleteOnboarding={(newVehicle) => {
          setActiveVehicle(newVehicle);
          setFlowStage('app');
          setActiveTab('plan_journey');
        }}
      />
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'plan_journey':
        return <PlanJourneyDesktop onStartNavigation={() => setActiveTab('live_nav')} />;

      case 'live_nav':
        return <LiveNavigationDesktop onEndTrip={() => setActiveTab('plan_journey')} />;

      case 'smart_stops':
        return <WebSmartStopDashboard />;

      case 'my_vehicle':
        return (
          <MyVehicleDesktop
            activeVehicle={activeVehicle}
            onUpdateVehicle={setActiveVehicle}
            onEditVehicleClick={() => setFlowStage('onboarding')}
          />
        );

      case 'charging':
        return (
          <div className="flex-1 bg-[#090D0B] text-white p-6 lg:p-10 space-y-6 overflow-y-auto no-scrollbar font-[Inter,sans-serif]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-black text-[#22C55E] uppercase tracking-wider block">
                  India EV Fast Charger Network
                </span>
                <h1 className="text-xl font-black text-white">CHARGING STATIONS EXPLORER</h1>
              </div>
              <span className="text-xs text-slate-400 font-bold bg-[#141A17] px-3.5 py-1.5 rounded-xl border border-slate-800">
                ⚡ 1,420 Active Fast Chargers
              </span>
            </div>

            {/* Desktop Charging Stations Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  name: 'Zeon Salem Fast Hub',
                  location: 'NH544 Salem Bypass',
                  power: '150 kW DC',
                  plugs: '3/4 Plugs Open',
                  rating: '4.8/5',
                  cafe: 'Saravana Bhavan (120m)',
                },
                {
                  name: 'Tata Power Krishnagiri',
                  location: 'NH544 Toll Plaza',
                  power: '120 kW DC',
                  plugs: '2/4 Plugs Open',
                  rating: '4.6/5',
                  cafe: 'Murugan Idli Shop (90m)',
                },
                {
                  name: 'Zeon Dharmapuri Plaza',
                  location: 'NH544 Highway Star',
                  power: '150 kW DC',
                  plugs: '4/4 Plugs Open',
                  rating: '4.7/5',
                  cafe: 'Food Court & Coffee Day',
                },
              ].map((st, idx) => (
                <div
                  key={idx}
                  className="bg-[#141A17] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg hover:border-[#22C55E]/50 transition-all cursor-pointer"
                  onClick={() => setActiveTab('plan_journey')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-2 py-0.5 rounded-md">
                      {st.power}
                    </span>
                    <span className="text-xs font-black text-amber-400">⭐ {st.rating}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-white">{st.name}</h3>
                  <p className="text-xs text-slate-400">{st.location}</p>

                  <div className="bg-[#0B0F0D] p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Availability:</span>
                      <span className="text-[#22C55E] font-bold">{st.plugs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cafe Amenity:</span>
                      <span className="text-amber-400 font-bold">{st.cafe}</span>
                    </div>
                  </div>

                  <button className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1">
                    <span>Plan Route With This Hub</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="flex-1 bg-[#090D0B] text-white p-6 lg:p-10 space-y-6 overflow-y-auto no-scrollbar font-[Inter,sans-serif]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-black text-[#22C55E] uppercase tracking-wider block">
                  Driver Account & Preferences
                </span>
                <h1 className="text-xl font-black text-white">USER PROFILE & SETTINGS</h1>
              </div>
              <button
                onClick={() => setFlowStage('login')}
                className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Sign Out
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <div className="bg-[#141A17] rounded-3xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black text-base">
                    RK
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Rahul Kumar</h3>
                    <p className="text-xs text-slate-400">rahul.k@zepgo.in • +91 98765 43210</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between bg-[#0B0F0D] p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Account Type:</span>
                    <span className="text-[#22C55E] font-bold">ZepGO India Pro Driver</span>
                  </div>
                  <div className="flex justify-between bg-[#0B0F0D] p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Primary EV:</span>
                    <span className="text-white font-bold">{activeVehicle.modelName}</span>
                  </div>
                </div>

                <button
                  onClick={() => setFlowStage('onboarding')}
                  className="w-full bg-[#161C19] border border-slate-700 hover:border-[#22C55E] text-white font-bold py-2.5 px-4 rounded-xl text-xs cursor-pointer"
                >
                  Re-run Vehicle Setup Wizard
                </button>
              </div>
            </div>
          </div>
        );

      case 'trips':
      case 'home':
      default:
        return <PlanJourneyDesktop onStartNavigation={() => setActiveTab('live_nav')} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#090D0B] text-white flex flex-col font-[Inter,sans-serif] select-none">
      {/* DESKTOP TOP NAVIGATION HEADER */}
      <DesktopTopHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        vehicleName={activeVehicle.modelName}
        batterySoc={activeVehicle.currentSocPercent}
        estimatedRangeKm={activeVehicle.estimatedRangeKm}
      />

      {/* DESKTOP MAIN VIEW AREA */}
      <main className="flex-1 flex overflow-hidden">{renderTabContent()}</main>
    </div>
  );
};
