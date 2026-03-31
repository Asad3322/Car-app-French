import React from 'react';

export type Status = 'reported' | 'seen' | 'resolved';
export type Urgency = 'Urgent' | 'Medium Urgency' | 'Not Urgent';

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  reportsCount: number;
  image?: string;
}

export interface Incident {
  id: string;
  plate: string;
  incidentType: string;
  description: string;
  urgency: Urgency;
  date: string;
  status: Status;
  location: string;
  reporterId?: string;
  image?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  phone: string;
  email: string;
  verifiedEmail: string | null;
  verifiedPhone: string | null;
  isPhoneVerified: boolean;
  isVehicleOwner: boolean;
  primaryContactMethod: 'email' | 'sms';
  streak: number;
  coins: number;
  badges: string[];
  totalIncidentsReported: number;
  profileImage?: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  rank: number;
  coins: number;
  isCurrentUser: boolean;
}

export interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  leaderboard: LeaderboardEntry[];
}
