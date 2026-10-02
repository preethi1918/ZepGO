import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import VehicleProfile from '../pages/VehicleProfile';
import NavigationPage from '../pages/Navigation';
import Charging from '../pages/Charging';
import Profile from '../pages/Profile';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Main Authenticated Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicle" element={<VehicleProfile />} />
        <Route path="/navigation" element={<NavigationPage />} />
        <Route path="/charging" element={<Charging />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Redirect Root & Fallbacks */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
