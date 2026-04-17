import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
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

  useEffect(() => {
    const syncLoggedInUser = async () => {
      try {
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

        let profileData: Record<string, any> | null = null;

        const { data: profileById, error: profileByIdError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (!profileByIdError && profileById) {
          profileData = profileById as Record<string, any>;
        } else {
          const { data: profileByAuthUserId, error: profileByAuthUserIdError } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_user_id', authUser.id)
            .maybeSingle();

          if (!profileByAuthUserIdError && profileByAuthUserId) {
            profileData = profileByAuthUserId as Record<string, any>;
          }
        }

        const fallbackUsername =
          profileData?.username?.trim?.() ||
          (typeof authUser.user_metadata?.name === 'string'
            ? authUser.user_metadata.name.trim()
            : '') ||
          (authUser.email ? authUser.email.split('@')[0] : '') ||
          '';

        const mergedUser: UserProfile = {
          ...emptyUser,
          ...user,
          id: profileData?.id || authUser.id,
          username: fallbackUsername,
          phone: profileData?.phone || user.phone || '',
          email: profileData?.email || authUser.email || user.email || '',
          verifiedEmail:
            profileData?.verifiedEmail ??
            user.verifiedEmail ??
            authUser.email ??
            null,
          verifiedPhone:
            profileData?.verifiedPhone ??
            user.verifiedPhone ??
            null,
          isPhoneVerified:
            profileData?.isPhoneVerified ??
            user.isPhoneVerified ??
            false,
          isVehicleOwner:
            profileData?.isVehicleOwner ??
            user.isVehicleOwner ??
            false,
          primaryContactMethod:
            profileData?.primaryContactMethod ||
            user.primaryContactMethod ||
            'email',
          streak: profileData?.streak ?? user.streak ?? 0,
          coins: profileData?.coins ?? user.coins ?? 0,
          badges: profileData?.badges ?? user.badges ?? [],
          totalIncidentsReported:
            profileData?.totalIncidentsReported ??
            user.totalIncidentsReported ??
            0,
          profileImage:
            profileData?.profileImage ||
            profileData?.avatar_url ||
            user.profileImage ||
            '',
        };

        setUser(mergedUser);
      } catch (error) {
        console.error('Store syncLoggedInUser error:', error);
      }
    };

    syncLoggedInUser();
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