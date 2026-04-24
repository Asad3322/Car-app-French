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

        if (sessionError) {
          console.error('Store session fetch error:', sessionError);
          return;
        }

        if (!sessionData?.session?.access_token) {
          return;
        }

        localStorage.setItem('token', sessionData.session.access_token);

        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error('Store auth fetch error:', authError);
          return;
        }

        if (!authUser) {
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', authUser.id)
          .maybeSingle();

        if (profileError) {
          console.error('Store profile fetch error:', profileError);
        }

        const fallbackUsername =
          (typeof profileData?.username === 'string'
            ? profileData.username.trim()
            : '') ||
          (typeof profileData?.name === 'string'
            ? profileData.name.trim()
            : '') ||
          (typeof authUser.user_metadata?.name === 'string'
            ? authUser.user_metadata.name.trim()
            : '') ||
          (authUser.email ? authUser.email.split('@')[0] : '') ||
          'User';

        const mergedUser: UserProfile = {
          ...emptyUser,
          id: authUser.id,
          username: fallbackUsername,
          phone: profileData?.phone || '',
          email: profileData?.email || authUser.email || '',
          verifiedEmail: authUser.email || null,
          verifiedPhone: profileData?.phone || null,
          isPhoneVerified: Boolean(profileData?.phone),
          isVehicleOwner:
            profileData?.role === 'vehicle_owner' ||
            profileData?.is_vehicle_owner === true ||
            false,
          primaryContactMethod:
            profileData?.primary_contact === 'SMS' ? 'sms' : 'email',
          streak: profileData?.streak ?? 0,
          coins: profileData?.coins ?? 0,
          badges: profileData?.badges ?? [],
          totalIncidentsReported: profileData?.totalIncidentsReported ?? 0,
          profileImage:
            profileData?.profileImage || profileData?.avatar_url || '',
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