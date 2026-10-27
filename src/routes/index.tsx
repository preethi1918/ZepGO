import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { PlanTripPage } from '../pages/PlanTripPage';
import { RouteResultPage } from '../pages/RouteResultPage';
import { LiveJourneyPage } from '../pages/LiveJourneyPage';
import { ChargersPage } from '../pages/ChargersPage';
import { ChargerDetailsPage } from '../pages/ChargerDetailsPage';
import { BackupChargerPage } from '../pages/BackupChargerPage';
import { SmartStopsPage } from '../pages/SmartStopsPage';
import { ChargingSessionPage } from '../pages/ChargingSessionPage';
import { EnergyPredictionPage } from '../pages/EnergyPredictionPage';
import { RiskAnalysisPage } from '../pages/RiskAnalysisPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { GaragePage } from '../pages/GaragePage';
import { HistoryPage } from '../pages/HistoryPage';
import { AssistancePage } from '../pages/AssistancePage';
import { SettingsPage } from '../pages/SettingsPage';
import { AuthPage } from '../pages/AuthPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/login" element={<AuthPage />} />

      {/* 22 Platform Modules */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/dashboard" element={<HomePage />} />
      <Route path="/plan-trip" element={<PlanTripPage />} />
      <Route path="/route-result" element={<RouteResultPage />} />
      <Route path="/routes" element={<RouteResultPage />} />
      <Route path="/live-journey" element={<LiveJourneyPage />} />
      <Route path="/navigation" element={<LiveJourneyPage />} />
      <Route path="/energy-prediction" element={<EnergyPredictionPage />} />
      <Route path="/charging-session" element={<ChargingSessionPage />} />
      <Route path="/chargers" element={<ChargersPage />} />
      <Route path="/charger/:id" element={<ChargerDetailsPage />} />
      <Route path="/backup-charger" element={<BackupChargerPage />} />
      <Route path="/smart-stops" element={<SmartStopsPage />} />
      <Route path="/amenities" element={<ChargingSessionPage />} />
      <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/battery-health" element={<AnalyticsPage />} />
      <Route path="/garage" element={<GaragePage />} />
      <Route path="/vehicle" element={<GaragePage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/assistance" element={<AssistancePage />} />
      <Route path="/sos" element={<AssistancePage />} />
      <Route path="/emergency" element={<AssistancePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={<SettingsPage />} />

      {/* Root & Fallback Redirection */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
