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

  const user = data?.session?.user;

  if (!user) {
    throw new Error('No user session found');
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

export const saveUserProfile = async (profileData: {
  name: string;
  phone?: string;
  primaryContact?: 'email' | 'phone';
  profileImage?: string;
}) => {
  console.log('🔥 NEW saveUserProfile is running');
  console.log('✅ Using auth_user_id (NOT upsert)');

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error('User not authenticated');
  }

  console.log('👤 Logged-in user:', user.id);

  const trimmedName = profileData.name?.trim();

  if (!trimmedName) {
    throw new Error('Name is required');
  }

  const payload = {
    auth_user_id: user.id,
    email: user.email || null,
    name: trimmedName,
    username: trimmedName,
    phone: profileData.phone?.trim() || null,
    primary_contact: profileData.primaryContact || 'email',
    avatar_url: profileData.profileImage || null,
    updated_at: new Date().toISOString(),
  };

  console.log('📦 Payload:', payload);

  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  if (fetchError) {
    console.error('❌ Fetch existing profile error:', fetchError);
    throw fetchError;
  }

  console.log('🔍 Existing profile:', existingProfile);

  // 🔁 UPDATE
  if (existingProfile) {
    console.log('🟡 Updating existing profile');

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('auth_user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Update profile error:', error);
      throw error;
    }

    console.log('✅ Profile updated successfully:', data);
    return data;
  }

  // ➕ INSERT
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
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};