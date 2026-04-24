import { supabase } from '../supabase';

// ================= SEND VERIFICATION =================
export const sendVerification = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'https://car-app-french.vercel.app/auth/callback',
    },
  });

  if (error) throw error;
};

// ================= HANDLE LOGIN =================
export const handleMagicLinkLogin = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return { needsProfileCompletion: false };
    }

    const token = session.access_token;

    localStorage.setItem('token', token);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || 'Failed to fetch profile');
    }

    if (!data?.data?.profile) {
      return { needsProfileCompletion: true };
    }

    return { needsProfileCompletion: false };
  } catch (err) {
    console.error('handleMagicLinkLogin error:', err);
    return { needsProfileCompletion: false };
  }
};

// ================= SAVE PROFILE =================
export const saveUserProfile = async (profileData: any) => {
  try {
    const token = localStorage.getItem('token');
    const isOwnerFlow = profileData.role === 'vehicle_owner';

    // ================= AUTH FLOW (EMAIL USER) =================
    if (token) {
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

      console.log('✅ Backend profile flow complete:', result);

      return result;
    }

    // ================= OWNER PHONE FLOW =================
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
        console.error('❌ Owner phone claim failed:', result);
        throw new Error(result?.message || 'Failed to claim vehicle');
      }

      console.log('✅ Owner phone claim complete:', result);

      return result;
    }

    throw new Error('Invalid profile flow');
  } catch (error) {
    console.error('saveUserProfile error:', error);
    throw error;
  }
};