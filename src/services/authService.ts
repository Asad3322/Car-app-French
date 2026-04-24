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
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  const session = data?.session;
  const user = session?.user;

  if (!user) {
    throw new Error('No user session found');
  }

  if (session?.access_token) {
    localStorage.setItem('token', session.access_token);
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  if (profileError) throw profileError;

  if (!profile || !profile.name) {
    return { needsProfileCompletion: true, user, profile: null };
  }

  return { needsProfileCompletion: false, user, profile };
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  return data.session;
};

export const getCurrentUser = async () => {
  try {
    const { data } = await supabase.auth.getSession();

    if (!data?.session) return null;

    const { data: userData, error } = await supabase.auth.getUser();

    if (error) return null;

    return userData.user || null;
  } catch {
    return null;
  }
};

export const isProfileComplete = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      profile: null,
      isComplete: false,
    };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  if (error) throw error;

  return {
    user,
    profile,
    isComplete: !!profile?.name,
  };
};

type SaveUserProfilePayload = {
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  primaryContact?: 'email' | 'phone';
  profileImage?: string;
  role?: 'reporter' | 'vehicle_owner';
  verifiedPhone?: string;
  vehicleId?: string;
};

export const saveUserProfile = async (profileData: SaveUserProfilePayload) => {
  console.log('🔥 NEW saveUserProfile (FULL FLOW SAFE AUTH)');

  const isOwnerFlow = profileData.role === 'vehicle_owner';

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  if (!session?.access_token && !isOwnerFlow) {
    throw new Error('User not authenticated');
  }

  const token = session?.access_token || '';
  let user: any = null;

  if (session?.access_token) {
    const {
      data: { user: authUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && !isOwnerFlow) throw userError;

    user = authUser;
  }

  if (!user && !isOwnerFlow) {
    throw new Error('User not authenticated');
  }

  console.log('👤 Logged-in user:', user?.id || 'OWNER_FLOW_NO_AUTH_USER');

  const trimmedName = profileData.name?.trim();
  const trimmedUsername =
    profileData.username?.trim().toLowerCase() || trimmedName?.toLowerCase();

  if (!trimmedName) throw new Error('Name is required');
  if (!trimmedUsername) throw new Error('Username is required');

  if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
    throw new Error('Username must be between 3 and 20 characters');
  }

  if (!/^[a-z0-9_.]+$/.test(trimmedUsername)) {
    throw new Error(
      'Username can only contain letters, numbers, underscore, and dot'
    );
  }

  const { data: usernameMatches, error: usernameCheckError } = await supabase
    .from('profiles')
    .select('id, auth_user_id, username')
    .ilike('username', trimmedUsername);

  if (usernameCheckError) {
    console.error('❌ Username check error:', usernameCheckError);
    throw usernameCheckError;
  }

  const usernameTakenByAnotherUser = (usernameMatches || []).some(
    (item: any) => {
      const ownerId = item?.auth_user_id || item?.id;

      if (user?.id) {
        return ownerId !== user.id;
      }

      return true;
    }
  );

  if (usernameTakenByAnotherUser) {
    const duplicateError: any = new Error('This username is already taken');
    duplicateError.code = '23505';
    throw duplicateError;
  }

  if (token) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/create-profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: profileData.role || 'reporter',
            verifiedPhone: profileData.verifiedPhone || '',
            vehicleId: profileData.vehicleId || '',
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Backend create-profile failed:', result);
        throw new Error(
          result?.message || 'Failed to create profile on backend'
        );
      }

      console.log('✅ Backend profile flow complete:', result);
    } catch (err) {
      console.error('❌ Backend profile call failed:', err);
      throw err;
    }
  } else {
    console.log('🟢 Owner flow: skipping protected backend create-profile route');
  }

  const payload = {
    auth_user_id: user?.id || null,
    email: profileData.email || user?.email || null,
    name: trimmedName,
    username: trimmedUsername,
    phone: profileData.verifiedPhone || profileData.phone?.trim() || null,
    primary_contact:
      profileData.role === 'vehicle_owner'
        ? 'SMS'
        : profileData.primaryContact === 'phone'
        ? 'phone'
        : 'email',
    avatar_url: profileData.profileImage || null,
    updated_at: new Date().toISOString(),
  };

  console.log('📦 Payload:', payload);

  let existingProfile = null;
  let fetchError = null;

  if (user?.id) {
    const result = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    existingProfile = result.data;
    fetchError = result.error;
  } else if (profileData.verifiedPhone || profileData.phone?.trim()) {
    const ownerPhone = profileData.verifiedPhone || profileData.phone?.trim();

    const result = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', ownerPhone)
      .maybeSingle();

    existingProfile = result.data;
    fetchError = result.error;
  }

  if (fetchError) {
    console.error('❌ Fetch existing profile error:', fetchError);
    throw fetchError;
  }

  console.log('🔍 Existing profile:', existingProfile);

  if (existingProfile) {
    console.log('🟡 Updating existing profile');

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', existingProfile.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Update profile error:', error);
      throw error;
    }

    console.log('✅ Profile updated successfully:', data);
    return data;
  }

  // ✅ FINAL FIX:
  // Owner flow has no Supabase auth session, so RLS blocks frontend insert.
  // Do not insert owner profile from frontend.
  if (isOwnerFlow && !token) {
    console.log('🟢 Owner flow: skipping Supabase insert because RLS requires auth');

    return {
      success: true,
      message: 'Owner flow completed without frontend profile insert',
      data: {
        name: trimmedName,
        username: trimmedUsername,
        phone: profileData.verifiedPhone || profileData.phone || null,
        vehicleId: profileData.vehicleId || null,
        role: 'vehicle_owner',
      },
    };
  }

  console.log('🟢 Creating new profile');

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      ...payload,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Insert profile error:', error);
    throw error;
  }

  console.log('✅ Profile created successfully:', data);
  return data;
};

export const getMyProfile = async () => {
  const { data } = await supabase.auth.getSession();

  if (!data?.session) {
    throw new Error('User not authenticated');
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  if (error) throw error;

  return profile;
};

export const signOutUser = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('verifiedPhone');
  localStorage.removeItem('vehicleId');
  localStorage.removeItem('role');
  localStorage.removeItem('ownerAccess');

  const { error } = await supabase.auth.signOut();

  if (error) throw error;
};