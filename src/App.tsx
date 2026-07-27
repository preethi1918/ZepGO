import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { PreTripPlanner } from './components/PreTripPlanner';
import { InteractiveMap } from './components/InteractiveMap';
import { StationFinder } from './components/StationFinder';
import { AIChatAssistant } from './components/AIChatAssistant';
import { AnalyticsHistory } from './components/AnalyticsHistory';
import { LandingHero } from './components/LandingHero';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { AboutModal } from './components/AboutModal';
import { EVModel, ChargingStation, TripAnalysisResult, UserProfile, TripPlanRequest } from './types';
import { fetchEvModels, fetchStations, analyzeTrip } from './services/api';
import { getStoredUser } from './services/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(getStoredUser());
  const [currentBattery, setCurrentBattery] = useState<number>(35);

  // Data collections
  const [evModels, setEvModels] = useState<EVModel[]>([]);
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<TripAnalysisResult | null>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const modelsData = await fetchEvModels();
      setEvModels(modelsData);

      const stationsData = await fetchStations();
      setStations(stationsData);
      if (stationsData.length > 0) {
        setSelectedStation(stationsData[0]);
      }
    }
    loadData();
  }, []);

  const activeEvModel = evModels.find(m => m.id === user?.vehicleModelId) || evModels[0] || {
    id: 'tesla-model-y-lr',
    name: 'Tesla Model Y Long Range',
    brand: 'Tesla',
    batteryCapacityKwh: 75,
    usableCapacityKwh: 72.7,
    avgConsumptionKwhPer100Km: 16.8,
    connectorTypes: ['NACS', 'CCS2 (Adapter)'],
    maxChargingPowerKw: 250,
    rangeKm: 531
  };

  const handleRunTripAnalysis = async (req: TripPlanRequest) => {
    const res = await analyzeTrip(req);
    setLastAnalysis(res);
    if (res.recommendedStation) {
      setSelectedStation(res.recommendedStation);
    }
    return res;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-sky-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={() => setUser(null)}
        onOpenAbout={() => setIsAboutOpen(true)}
        currentBattery={currentBattery}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Landing Hero preview if on dashboard */}
        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LandingHero
              onStartPlanner={() => setActiveTab('planner')}
              onExploreMap={() => setActiveTab('map')}
            />
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <Dashboard
            user={user}
            evModel={activeEvModel}
            stations={stations}
            currentBattery={currentBattery}
            setCurrentBattery={setCurrentBattery}
            lastAnalysis={lastAnalysis}
            onNavigateTab={setActiveTab}
            onSelectStation={(sta) => {
              setSelectedStation(sta);
              setActiveTab('map');
            }}
          />
        )}

        {activeTab === 'planner' && (
          <PreTripPlanner
            evModels={evModels}
            onAnalyze={handleRunTripAnalysis}
            onSelectStation={(sta) => setSelectedStation(sta)}
            onNavigateToMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            stations={stations}
            selectedStation={selectedStation}
            onSelectStation={(sta) => setSelectedStation(sta)}
            evModel={activeEvModel}
            currentBattery={currentBattery}
          />
        )}

        {activeTab === 'stations' && (
          <StationFinder
            stations={stations}
            evModel={activeEvModel}
            onSelectStation={(sta) => setSelectedStation(sta)}
            onNavigateToMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'chat' && (
          <AIChatAssistant
            evModel={activeEvModel}
            currentBattery={currentBattery}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsHistory user={user} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">ZepGo</span>
            <span>– AI Powered Smart EV Charging & Navigation Assistant</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by Gemini AI</span>
            <span>•</span>
            <span>Firebase Auth & Firestore</span>
            <span>•</span>
            <button onClick={() => setIsAboutOpen(true)} className="hover:text-white underline">
              About Project
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onUserLogin={(u) => setUser(u)}
      />

      {user && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
          evModels={evModels}
          onUpdateUser={(u) => setUser(u)}
        />
      )}

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
