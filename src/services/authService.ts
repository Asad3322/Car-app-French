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
    return { needsProfileCompletion: false };
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
  };
};

export const saveUserProfile = async (profileData: any) => {
  try {
    const isOwnerFlow = profileData.role === 'vehicle_owner';

    // ✅ OWNER PHONE FLOW FIRST — do not use token
    if (isOwnerFlow) {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vehicles/claim-owner-phone`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vehicleId: profileData.vehicleId,
            phone: profileData.verifiedPhone || profileData.phone,
            username: profileData.username,
            name: profileData.name,
            profileImage: profileData.profileImage || null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to claim vehicle');
      }

      return result;
    }

    // ✅ REPORTER / EMAIL AUTH FLOW
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