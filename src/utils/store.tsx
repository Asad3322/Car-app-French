import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Vehicle,
  Incident,
  UserProfile,
  LeaderboardEntry,
  AppContextType
} from './types';

const emptyUser: UserProfile = {
  id: '',
  username: '',
  phone: '',
  email: '',
  verifiedEmail: null,
  verifiedPhone: null,
  isPhoneVerified: false,
  isVehicleOwner: false,
  primaryContactMethod: 'email',
  streak: 0,
  coins: 0,
  badges: [],
  totalIncidentsReported: 0,
  profileImage: ''
};

const emptyLeaderboard: LeaderboardEntry[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('carapp_user');
    return saved ? JSON.parse(saved) : emptyUser;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [leaderboard] = useState<LeaderboardEntry[]>(emptyLeaderboard);

  useEffect(() => {
    localStorage.setItem('carapp_user', JSON.stringify(user));
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        vehicles,
        setVehicles,
        incidents,
        setIncidents,
        leaderboard
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};