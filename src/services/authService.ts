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
    .eq('id', user.id)
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
    .eq('id', user.id)
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
}) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;

  const user = userData.user;

  if (!user) {
    throw new Error('User not authenticated');
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: profileData.name.trim(),
    phone: profileData.phone?.trim() || null,
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};