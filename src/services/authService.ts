import { supabase } from '../supabase';

export const sendVerification = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'https://car-app-french.vercel.app/auth/callback',
    },
  });

  if (error) throw error;
};

export const handleMagicLinkLogin = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return {
      needsProfileCompletion: true,
      profile: null,
    };
  }

  localStorage.setItem('token', session.access_token);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || 'Failed to fetch profile');
  }

  return {
    needsProfileCompletion: !result?.data?.profile,
    profile: result?.data?.profile || null,
  };
};

export const saveUserProfile = async (profileData: any) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/create-profile`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || 'Failed to save profile');
    }

    return result;
  } catch (error) {
    console.error('saveUserProfile error:', error);
    throw error;
  }
};