import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthContextType, User } from '../types';
import { storage } from '../utils/storage';
import { DEMO_USER } from '../data/mockAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => storage.isAuthenticated());
  const [user, setUser] = useState<User | null>(() => storage.getUserData() || (storage.isAuthenticated() ? DEMO_USER : null));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Keep sync with storage if modified externally
    const handleStorageChange = () => {
      const auth = storage.isAuthenticated();
      setIsAuthenticated(auth);
      if (!auth) {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate slight API latency for smooth loading UI feedback
    await new Promise((resolve) => setTimeout(resolve, 600));

    const loggedInUser: User = {
      id: `usr_${Date.now()}`,
      email: email,
      name: email.split('@')[0] || 'Driver',
      vehicleModel: 'ZepGO EV Connected'
    };

    storage.setAuthenticated(true, loggedInUser);
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setIsLoading(false);
    return true;
  };

  const loginAsDemo = async (): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    storage.setAuthenticated(true, DEMO_USER);
    setUser(DEMO_USER);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = (): void => {
    storage.clearAuth();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        loginAsDemo,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
