import React, { useState, useEffect } from 'react';
import { IPhoneMockupFrame } from '../frame/iPhoneMockupFrame';
import { PrototypeToolbar } from './PrototypeToolbar';
import { FlowBoardView } from './FlowBoardView';
import { DesignSystemSpecs } from './DesignSystemSpecs';

import { SplashScreen } from '../../screens/prototype/SplashScreen';
import { OnboardingScreen } from '../../screens/prototype/OnboardingScreen';
import { LoginSignupScreen } from '../../screens/prototype/LoginSignupScreen';
import { HomeScreenPrototype } from '../../screens/prototype/HomeScreenPrototype';
import { VehicleSelectionScreen } from '../../screens/prototype/VehicleSelectionScreen';
import { BatteryInputScreen } from '../../screens/prototype/BatteryInputScreen';
import { PreferencesScreen } from '../../screens/prototype/PreferencesScreen';
import { AiRouteAnalysisScreen } from '../../screens/prototype/AiRouteAnalysisScreen';
import { RouteResultsScreen } from '../../screens/prototype/RouteResultsScreen';
import { RouteComparisonScreen } from '../../screens/prototype/RouteComparisonScreen';
import { LiveNavigationMapScreen } from '../../screens/prototype/LiveNavigationMapScreen';
import { StationDetailsScreen } from '../../screens/prototype/StationDetailsScreen';
import { ChargerRiskAlertScreen } from '../../screens/prototype/ChargerRiskAlertScreen';
import { BackupChargerSelectionScreen } from '../../screens/prototype/BackupChargerSelectionScreen';
import { ChargingProgressScreen } from '../../screens/prototype/ChargingProgressScreen';
import { TripCompletedScreen } from '../../screens/prototype/TripCompletedScreen';
import { TripSummaryAnalyticsScreen } from '../../screens/prototype/TripSummaryAnalyticsScreen';
import { MapScreenView } from '../../screens/prototype/MapScreenView';
import { StationListView } from '../../screens/prototype/StationListView';
import { AiAssistantScreenView } from '../../screens/prototype/AiAssistantScreenView';
import { NotificationsListScreen } from '../../screens/prototype/NotificationsListScreen';
import { ProfileSettingsScreen } from '../../screens/prototype/ProfileSettingsScreen';
import { SavedPlacesScreen } from '../../screens/prototype/SavedPlacesScreen';
import { MyVehicleScreen } from '../../screens/prototype/MyVehicleScreen';

import { SmartStopDetectionCard } from '../smartStop/SmartStopDetectionCard';
import { RecommendedStopScreen } from '../smartStop/RecommendedStopScreen';
import { CafeDuringChargingScreen } from '../smartStop/CafeDuringChargingScreen';
import { ChargingCafeCombinedScreen } from '../smartStop/ChargingCafeCombinedScreen';
import { AddStopSelectionMenu } from '../smartStop/AddStopSelectionMenu';
import { SmartStopPreferencesScreen } from '../smartStop/SmartStopPreferencesScreen';
import { RouteUpdatedScreen } from '../smartStop/RouteUpdatedScreen';
import { AlternativeStopComparisonScreen } from '../smartStop/AlternativeStopComparisonScreen';
import { StopDetailsDeepDiveScreen } from '../smartStop/StopDetailsDeepDiveScreen';
import { SmartStopLiveNavCard } from '../smartStop/SmartStopLiveNavCard';

export const PrototypeMasterApp: React.FC = () => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'grid' | 'design_system'>('single');
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // App Interactive State
  const [vehicleModel, setVehicleModel] = useState('Tata Nexon EV Max');
  const [batterySoc, setBatterySoc] = useState(72);

  // Auto-play timer effect across all 34 screens
  useEffect(() => {
    let timer: any;
    if (isAutoPlay) {
      timer = setInterval(() => {
        setCurrentScreenIndex((prev) => (prev < 33 ? prev + 1 : 0));
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const screenNames = [
    'Splash Screen',
    'Three Onboarding Screens',
    'Login / Sign-up',
    'Home Screen',
    'EV Selection Cards',
    'Battery Input Screen',
    'Journey Preferences',
    'AI Route Analysis',
    'Route Results (Hero Screen)',
    'Route Comparison (3 Options)',
    'Smart Stop Detection Card',
    'Recommended Stop Screen (Salem)',
    'Cafe During Charging',
    'Charging + Cafe Combined',
    'Add Stop Selection Menu',
    'Smart Stop Preferences',
    'Route Updated Screen',
    'Alternative Stop Comparison',
    'Stop Details Deep-Dive',
    'Live Navigation Map',
    'Smart Stop Live Nav Card',
    'Charging Station Details',
    'Charger Risk Alert',
    'Backup Charger Selection',
    'Charging Progress (120 kW)',
    'Trip Completed Celebration',
    'Trip Summary Analytics',
    'Interactive Map & Filters',
    'Charging Stations List',
    'ZepGO AI Assistant',
    'Notifications Center',
    'Saved Places & Hubs',
    'My EV Garage',
    'Profile & Settings',
  ];

  // Render Screen Component by Index (0 through 33)
  const renderScreenByIndex = (idx: number) => {
    switch (idx) {
      case 0:
        return <SplashScreen onNext={() => setCurrentScreenIndex(1)} />;
      case 1:
        return (
          <OnboardingScreen
            onNext={() => setCurrentScreenIndex(2)}
            onSkip={() => setCurrentScreenIndex(3)}
          />
        );
      case 2:
        return (
          <LoginSignupScreen
            onLoginSuccess={() => setCurrentScreenIndex(3)}
            onGuestMode={() => setCurrentScreenIndex(3)}
          />
        );
      case 3:
        return (
          <HomeScreenPrototype
            batterySoc={batterySoc}
            vehicleModel={vehicleModel}
            onPlanJourney={() => setCurrentScreenIndex(5)}
            onChangeVehicle={() => setCurrentScreenIndex(4)}
            onChangeBattery={() => setCurrentScreenIndex(5)}
            onOpenPreferences={() => setCurrentScreenIndex(6)}
            onNavigateTab={(tab) => {
              if (tab === 'map') setCurrentScreenIndex(27);
              else if (tab === 'charge') setCurrentScreenIndex(21);
              else if (tab === 'trips') setCurrentScreenIndex(8);
              else if (tab === 'profile') setCurrentScreenIndex(33);
            }}
          />
        );
      case 4:
        return (
          <VehicleSelectionScreen
            selectedModel={vehicleModel}
            onSelectVehicle={(model) => {
              setVehicleModel(model);
              setCurrentScreenIndex(3);
            }}
            onBack={() => setCurrentScreenIndex(3)}
          />
        );
      case 5:
        return (
          <BatteryInputScreen
            initialSoc={batterySoc}
            onConfirm={(soc) => {
              setBatterySoc(soc);
              setCurrentScreenIndex(7); // Go to AI Analysis
            }}
            onBack={() => setCurrentScreenIndex(3)}
          />
        );
      case 6:
        return (
          <PreferencesScreen
            onSave={() => setCurrentScreenIndex(7)}
            onBack={() => setCurrentScreenIndex(3)}
          />
        );
      case 7:
        return <AiRouteAnalysisScreen onComplete={() => setCurrentScreenIndex(8)} />;
      case 8:
        return (
          <RouteResultsScreen
            onStartJourney={() => setCurrentScreenIndex(19)} // Go to Live Nav
            onCompareRoutes={() => setCurrentScreenIndex(9)}
            onViewStationDetails={() => setCurrentScreenIndex(10)} // Go to Smart Stop Detection
            onBack={() => setCurrentScreenIndex(3)}
          />
        );
      case 9:
        return (
          <RouteComparisonScreen
            onSelectRoute={() => setCurrentScreenIndex(8)}
            onBack={() => setCurrentScreenIndex(8)}
          />
        );
      case 10:
        return (
          <div className="p-4 flex-1 flex items-center justify-center">
            <SmartStopDetectionCard
              onViewRecommendation={() => setCurrentScreenIndex(11)}
              onViewAlternatives={() => setCurrentScreenIndex(17)}
            />
          </div>
        );
      case 11:
        return (
          <RecommendedStopScreen
            onAddStop={() => setCurrentScreenIndex(15)}
            onViewAlternatives={() => setCurrentScreenIndex(17)}
            onBack={() => setCurrentScreenIndex(8)}
          />
        );
      case 12:
        return (
          <CafeDuringChargingScreen
            onSelectCafe={() => setCurrentScreenIndex(13)}
            onClose={() => setCurrentScreenIndex(11)}
          />
        );
      case 13:
        return (
          <ChargingCafeCombinedScreen
            onConfirmUnifiedStop={() => setCurrentScreenIndex(15)}
            onBack={() => setCurrentScreenIndex(12)}
          />
        );
      case 14:
        return (
          <AddStopSelectionMenu
            onSelectCategory={() => setCurrentScreenIndex(11)}
            onBack={() => setCurrentScreenIndex(8)}
          />
        );
      case 15:
        return (
          <SmartStopPreferencesScreen
            onSavePreferences={() => setCurrentScreenIndex(16)}
            onBack={() => setCurrentScreenIndex(11)}
          />
        );
      case 16:
        return (
          <RouteUpdatedScreen
            onStartNavigation={() => setCurrentScreenIndex(19)}
            onViewRouteDetails={() => setCurrentScreenIndex(18)}
          />
        );
      case 17:
        return (
          <AlternativeStopComparisonScreen
            onSelectAlternative={() => setCurrentScreenIndex(18)}
            onBack={() => setCurrentScreenIndex(11)}
          />
        );
      case 18:
        return (
          <StopDetailsDeepDiveScreen
            onConfirmStop={() => setCurrentScreenIndex(16)}
            onBack={() => setCurrentScreenIndex(11)}
          />
        );
      case 19:
        return (
          <LiveNavigationMapScreen
            onArriveAtStation={() => setCurrentScreenIndex(24)}
            onTriggerRiskAlert={() => setCurrentScreenIndex(22)}
            onEndTrip={() => setCurrentScreenIndex(25)}
          />
        );
      case 20:
        return (
          <div className="flex-1 bg-[#0F172A] p-4 flex flex-col justify-end">
            <SmartStopLiveNavCard
              onOpenFullRecommendation={() => setCurrentScreenIndex(11)}
              onDismiss={() => setCurrentScreenIndex(19)}
            />
          </div>
        );
      case 21:
        return (
          <StationDetailsScreen
            onBack={() => setCurrentScreenIndex(8)}
            onSelectBackup={() => setCurrentScreenIndex(23)}
            onStartSession={() => setCurrentScreenIndex(24)}
          />
        );
      case 22:
        return (
          <ChargerRiskAlertScreen
            onAcceptReroute={() => setCurrentScreenIndex(23)}
            onDismiss={() => setCurrentScreenIndex(19)}
          />
        );
      case 23:
        return (
          <BackupChargerSelectionScreen
            onConfirmBackup={() => setCurrentScreenIndex(21)}
            onBack={() => setCurrentScreenIndex(21)}
          />
        );
      case 24:
        return <ChargingProgressScreen onFinishCharging={() => setCurrentScreenIndex(25)} />;
      case 25:
        return <TripCompletedScreen onViewSummary={() => setCurrentScreenIndex(26)} />;
      case 26:
        return <TripSummaryAnalyticsScreen onBackToHome={() => setCurrentScreenIndex(3)} />;
      case 27:
        return (
          <MapScreenView
            onSwitchToList={() => setCurrentScreenIndex(28)}
            onSelectStation={() => setCurrentScreenIndex(21)}
          />
        );
      case 28:
        return (
          <StationListView
            onSelectStation={() => setCurrentScreenIndex(21)}
            onBackToMap={() => setCurrentScreenIndex(27)}
          />
        );
      case 29:
        return <AiAssistantScreenView onBack={() => setCurrentScreenIndex(3)} />;
      case 30:
        return <NotificationsListScreen onBack={() => setCurrentScreenIndex(3)} />;
      case 31:
        return <SavedPlacesScreen onBack={() => setCurrentScreenIndex(3)} />;
      case 32:
        return (
          <MyVehicleScreen
            vehicleModel={vehicleModel}
            batterySoc={batterySoc}
            onChangeVehicle={() => setCurrentScreenIndex(4)}
            onChangeBattery={() => setCurrentScreenIndex(5)}
            onBack={() => setCurrentScreenIndex(3)}
          />
        );
      case 33:
        return (
          <ProfileSettingsScreen
            onBack={() => setCurrentScreenIndex(3)}
            onChangeVehicle={() => setCurrentScreenIndex(4)}
          />
        );
      default:
        return <SplashScreen onNext={() => setCurrentScreenIndex(1)} />;
    }
  };

  const allScreensData = screenNames.map((name, idx) => ({
    name,
    component: renderScreenByIndex(idx),
  }));

  return (
    <div className="min-h-screen bg-[#0B0F0D] flex flex-col font-[Inter,sans-serif] select-none">
      {/* Top Prototype Navigation Toolbar */}
      <PrototypeToolbar
        currentScreenIndex={currentScreenIndex}
        totalScreens={34}
        screenNames={screenNames}
        onSelectScreen={(idx) => setCurrentScreenIndex(idx)}
        onPrev={() => setCurrentScreenIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setCurrentScreenIndex((prev) => Math.min(33, prev + 1))}
        isAutoPlay={isAutoPlay}
        onToggleAutoPlay={() => setIsAutoPlay(!isAutoPlay)}
        viewMode={viewMode}
        onChangeViewMode={(mode) => setViewMode(mode)}
        onResetFlow={() => setCurrentScreenIndex(0)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {viewMode === 'single' && (
          <div className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-y-auto no-scrollbar">
            <IPhoneMockupFrame batterySoc={batterySoc}>
              {renderScreenByIndex(currentScreenIndex)}
            </IPhoneMockupFrame>
          </div>
        )}

        {viewMode === 'grid' && (
          <FlowBoardView
            screens={allScreensData}
            onSelectScreen={(idx) => {
              setCurrentScreenIndex(idx);
              setViewMode('single');
            }}
          />
        )}

        {viewMode === 'design_system' && <DesignSystemSpecs />}
      </main>
    </div>
  );
};
