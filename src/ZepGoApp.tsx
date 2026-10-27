import React, { useState } from 'react';
import { Sidebar, type ActivePage } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlanTripPage } from './pages/PlanTripPage';
import { NavigationPage } from './pages/NavigationPage';
import { ChargingPage } from './pages/ChargingPage';
import { TripHistoryPage } from './pages/TripHistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SOSPanel } from './components/SOSPanel';
import { NotificationPanel, type AppNotification } from './components/NotificationPanel';

export const ZepGoApp: React.FC = () => {
  // Current active view
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [isLowNetworkMode, setIsLowNetworkMode] = useState<boolean>(false);
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [activeVehicle, setActiveVehicle] = useState('Tata Nexon EV Max');

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'charging',
      title: 'Zeon Salem Fast Hub Available',
      message: '3/4 120 kW plugs open. Predicted zero waiting time upon your arrival.',
      time: '2m ago',
      read: false
    },
    {
      id: 'notif-2',
      type: 'battery',
      title: 'Optimal Battery Efficiency',
      message: 'Operating at 6.8 km/kWh. Predicted arrival battery exceeds safety reserve.',
      time: '12m ago',
      read: false
    }
  ]);

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // If user navigated to Landing Page
  if (activePage === 'landing') {
    return (
      <LandingPage
        onStartJourney={() => setActivePage('dashboard')}
        onExploreFeatures={() => {
          const el = document.getElementById('features');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onGoToLogin={() => setActivePage('dashboard')}
      />
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-900 font-[Inter,sans-serif] overflow-hidden select-none">
      {/* DESKTOP SIDEBAR (Prompt Section 39) */}
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
        onOpenSOS={() => setIsSOSOpen(true)}
        onLogout={() => setActivePage('landing')}
        isLowNetworkMode={isLowNetworkMode}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden pb-14 md:pb-0 relative">
        {/* TOP NAVBAR */}
        <Navbar
          activePage={activePage}
          onPageChange={setActivePage}
          onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
          onOpenSOS={() => setIsSOSOpen(true)}
          unreadCount={notifications.length}
          vehicleName={activeVehicle}
          isLowNetworkMode={isLowNetworkMode}
        />

        {/* ACTIVE PAGE CONTENT */}
        <main className="flex-1 flex overflow-hidden">
          {activePage === 'dashboard' && (
            <DashboardPage
              onStartNavigation={() => setActivePage('navigation')}
              onGoToPlanTrip={() => setActivePage('plan_trip')}
              onGoToCharging={() => setActivePage('charging')}
            />
          )}

          {activePage === 'plan_trip' && (
            <PlanTripPage
              onStartNavigation={() => setActivePage('navigation')}
              onGoToCharging={() => setActivePage('charging')}
            />
          )}

          {activePage === 'navigation' && (
            <NavigationPage
              onEndNavigation={() => setActivePage('dashboard')}
              onGoToCharging={() => setActivePage('charging')}
            />
          )}

          {activePage === 'charging' && (
            <ChargingPage onBackToDashboard={() => setActivePage('dashboard')} />
          )}

          {activePage === 'history' && <TripHistoryPage />}

          {activePage === 'analytics' && <AnalyticsPage />}

          {activePage === 'profile' && (
            <ProfilePage
              onLogout={() => setActivePage('landing')}
              onSelectVehicle={setActiveVehicle}
              isLowNetworkMode={isLowNetworkMode}
              onToggleLowNetworkMode={() => setIsLowNetworkMode(!isLowNetworkMode)}
            />
          )}
        </main>

        {/* MOBILE BOTTOM NAVIGATION (Prompt Section 39) */}
        <BottomNav activePage={activePage} onPageChange={setActivePage} />

        {/* NOTIFICATIONS DRAWER POPUP */}
        {isNotificationsOpen && (
          <div className="absolute top-14 right-4 z-50 animate-in fade-in slide-in-from-top-2">
            <NotificationPanel
              notifications={notifications}
              onDismiss={handleDismissNotification}
              onClearAll={handleClearNotifications}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>
        )}

        {/* EMERGENCY SOS MODAL (Prompt Section 28) */}
        {isSOSOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <SOSPanel currentSoc={62} onClose={() => setIsSOSOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
};
