import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type {
  Vehicle,
  Incident,
  UserProfile,
  LeaderboardEntry,
  AppContextType,
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
  profileImage: '',
};

const emptyLeaderboard: LeaderboardEntry[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

  useEffect(() => {
    const syncLoggedInUser = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError || !sessionData?.session?.access_token) return;

        const token = sessionData.session.access_token;
        localStorage.setItem('token', token);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          console.error('Store /me fetch error:', result);
          return;
        }

        const authUser = result?.data?.auth;
        const profile = result?.data?.profile;

        const role = profile?.role || 'reporter';
        const isOwner = role === 'vehicle_owner';

        const username =
          profile?.username?.trim() ||
          profile?.name?.trim() ||
          authUser?.email?.split('@')?.[0] ||
          'User';

        const mergedUser: UserProfile = {
          ...emptyUser,
          id: authUser?.id || profile?.auth_user_id || '',
          username,
          phone: profile?.phone || authUser?.phone || '',
          email: profile?.email || authUser?.email || '',
          verifiedEmail: profile?.email || authUser?.email || null,
          verifiedPhone: profile?.phone || authUser?.phone || null,
          isPhoneVerified: Boolean(profile?.phone || authUser?.phone),
          isVehicleOwner: isOwner,
          primaryContactMethod: isOwner ? 'sms' : 'email',
          streak: profile?.streak ?? 0,
          coins: profile?.coins ?? 0,
          badges: profile?.badges ?? [],
          totalIncidentsReported: profile?.totalIncidentsReported ?? 0,
          profileImage: profile?.profileImage || profile?.avatar_url || '',
        };

        setUser(mergedUser);
      } catch (error) {
        console.error('Store syncLoggedInUser error:', error);
      }
    };

    syncLoggedInUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        localStorage.setItem('token', session.access_token);
        syncLoggedInUser();
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('carapp_user');
        setUser(emptyUser);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        vehicles,
        setVehicles,
        incidents,
        setIncidents,
        leaderboard,
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