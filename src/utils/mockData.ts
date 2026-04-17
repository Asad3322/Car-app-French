export type Status = 'reported' | 'seen' | 'resolved';
export type Urgency = 'Urgent' | 'Medium Urgency' | 'Not Urgent';

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  reportsCount: number;
}

export interface Incident {
  id: string;
  plate: string;
  description: string;
  urgency: Urgency;
  date: string;
  status: Status;
  location: string;
}

export interface UserProfile {
  id: string;
  username: string;
  phone: string;
  email: string;
  primaryContact: 'email' | 'phone';
  role: 'reporter' | 'owner';
  streak: number;
  coins: number;
  badges: string[];
  totalIncidentsReported: number;
  totalVehicles: number;
}