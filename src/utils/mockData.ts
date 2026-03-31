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

export const mockVehicles: Vehicle[] = [
  { id: '1', name: 'My Toyota Civic', plate: 'ABC-1234', reportsCount: 2 },
  { id: '2', name: 'Work Truck', plate: 'XYZ-9876', reportsCount: 0 },
];

export const mockIncidents: Incident[] = [
  {
    id: '1',
    plate: 'ABC-1234',
    description: 'Scratched bumper in parking lot',
    urgency: 'Not Urgent',
    date: '2023-10-25T14:30:00Z',
    status: 'reported',
    location: 'Downtown Mall',
  },
  {
    id: '2',
    plate: 'XYZ-9876',
    description: 'Broken tail light',
    urgency: 'Medium Urgency',
    date: '2023-10-20T09:15:00Z',
    status: 'seen',
    location: '123 Main St',
  },
  {
    id: '3',
    plate: 'DEF-5555',
    description: 'Blocked driveway',
    urgency: 'Urgent',
    date: '2023-10-18T18:45:00Z',
    status: 'resolved',
    location: 'My House',
  },
];

export const mockUser = {
  id: 'user1',
  username: 'John Doe',
  phone: '+1 555-0198',
  email: 'john.doe@example.com',
  primaryContact: 'email',
  role: 'owner', // 'reporter' or 'owner'
  streak: 5,
  coins: 1250,
  badges: ['Early Adopter', 'Good Samaritan'],
  totalIncidentsReported: 12,
  totalVehicles: 2,
};
