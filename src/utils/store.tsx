import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Vehicle, 
  Incident, 
  UserProfile, 
  LeaderboardEntry, 
  AppContextType 
} from './types';

const defaultUser: UserProfile = {
  id: 'user1',
  username: 'Guest User',
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
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky&backgroundColor=b6e3f4'
};

const defaultVehicles: Vehicle[] = [
  { id: '1', name: 'My Toyota Civic', plate: 'ABC-1234', reportsCount: 2 },
  { id: '2', name: 'Work Truck', plate: 'XYZ-9876', reportsCount: 0 },
];

const defaultIncidents: Incident[] = [
  {
    id: '1',
    plate: 'ABC-1234',
    incidentType: 'Accident',
    description: 'Scratched bumper in parking lot',
    urgency: 'Not Urgent',
    date: '2023-10-25T14:30:00Z',
    status: 'reported',
    location: 'Downtown Mall',
    reporterId: 'some-other-user',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '2',
    plate: 'DEF-5555',
    incidentType: 'Police',
    description: 'Broken tail light reported by me',
    urgency: 'Medium Urgency',
    date: '2023-10-20T09:15:00Z',
    status: 'seen',
    location: '123 Main St',
    reporterId: 'user1',
    image: '',
  },
  {
    id: '3',
    plate: 'ABC-1234',
    incidentType: 'Traffic',
    description: 'Your car is double parked',
    urgency: 'Urgent',
    date: '2023-10-26T10:00:00Z',
    status: 'reported',
    location: 'Office Complex',
    reporterId: 'anonymous',
    image: '',
  },
];

const defaultLeaderboard: LeaderboardEntry[] = [
  { id: 'u1', username: 'SpeedRacer', rank: 1, coins: 5400, isCurrentUser: false },
  { id: 'u2', username: 'SafetyFirst', rank: 2, coins: 4200, isCurrentUser: false },
  { id: 'u3', username: 'RoadWarrior', rank: 3, coins: 2450, isCurrentUser: false },
  { id: 'user1', username: 'You', rank: 14, coins: 0, isCurrentUser: true },
  { id: 'u4', username: 'NightOwl99', rank: 15, coins: 800, isCurrentUser: false },
  { id: 'u5', username: 'CarLover', rank: 16, coins: 400, isCurrentUser: false },
  { id: 'u6', username: 'ZenDriver', rank: 102, coins: 150, isCurrentUser: false },
  { id: 'u7', username: 'Flash', rank: 103, coins: 120, isCurrentUser: false },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('carapp_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('carapp_vehicles');
    return saved ? JSON.parse(saved) : defaultVehicles;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('carapp_incidents');
    return saved ? JSON.parse(saved) : defaultIncidents;
  });

  const [leaderboard] = useState<LeaderboardEntry[]>(defaultLeaderboard);

  useEffect(() => {
    localStorage.setItem('carapp_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('carapp_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('carapp_incidents', JSON.stringify(incidents));
  }, [incidents]);

  return (
    <AppContext.Provider value={{ user, setUser, vehicles, setVehicles, incidents, setIncidents, leaderboard }}>
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
