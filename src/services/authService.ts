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

  if (profileError) {
    throw profileError;
  }

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
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  return data.user;
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

export const saveUserProfile = async (
  profileData: SaveUserProfilePayload
) => {
  console.log('🔥 NEW saveUserProfile (FULL FLOW)');

  const isOwnerFlow = profileData.role === 'vehicle_owner';

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  // ✅ Reporter must have Supabase session
  // ✅ Owner flow is allowed without Supabase session
  if (!session?.access_token && !isOwnerFlow) {
    throw new Error('User not authenticated');
  }

  const token = session?.access_token || '';

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // For reporter: user is required
  // For owner: user can be null in your current architecture
  if (userError && !isOwnerFlow) throw userError;

  if (!user && !isOwnerFlow) {
    throw new Error('User not authenticated');
  }

  console.log('👤 Logged-in user:', user?.id || 'OWNER_FLOW_NO_AUTH_USER');

  const trimmedName = profileData.name?.trim();
  const trimmedUsername =
    profileData.username?.trim().toLowerCase() ||
    trimmedName?.toLowerCase();

  if (!trimmedName) {
    throw new Error('Name is required');
  }

  if (!trimmedUsername) {
    throw new Error('Username is required');
  }

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

      // Reporter flow → compare against current auth user
      if (user?.id) {
        return ownerId !== user.id;
      }

      // Owner flow without auth user → any match means taken
      return true;
    }
  );

  if (usernameTakenByAnotherUser) {
    const duplicateError: any = new Error('This username is already taken');
    duplicateError.code = '23505';
    throw duplicateError;
  }

  // ✅ BACKEND CALL FOR OWNER / REPORTER FLOW
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/create-profile`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
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
      throw new Error(result?.message || 'Failed to create profile on backend');
    }

    console.log('✅ Backend profile flow complete:', result);
  } catch (err) {
    console.error('❌ Backend profile call failed:', err);
    throw err;
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

  // Reporter flow → check by auth_user_id
  // Owner flow without auth user → try by phone
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
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const signOutUser = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('verifiedPhone');
  localStorage.removeItem('vehicleId');
  localStorage.removeItem('role');

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};