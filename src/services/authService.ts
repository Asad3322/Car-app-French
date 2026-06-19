import { supabase } from '../supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL;

type AuthRole = 'reporter' | 'vehicle_owner';

type SendVerificationObjectPayload = {
  contact: string;
  role?: AuthRole;
  vehicleId?: string | null;
};

type SendVerificationPayload = string | SendVerificationObjectPayload;

export const sendVerification = async (payload: SendVerificationPayload) => {
  const finalPayload: SendVerificationObjectPayload =
    typeof payload === 'string'
      ? {
          contact: payload,
          role: 'reporter',
          vehicleId: null,
        }
      : {
          contact: payload.contact,
          role: payload.role || 'reporter',
          vehicleId: payload.vehicleId || null,
        };

  if (!finalPayload.contact?.trim()) {
    throw new Error('Contact is required');
  }

  if (finalPayload.role === 'vehicle_owner') {
    if (!API_BASE_URL) {
      throw new Error('API URL is missing');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contact: finalPayload.contact.trim(),
        role: 'vehicle_owner',
        vehicleId: finalPayload.vehicleId,
      }),
    });

    const result = await response.json();

    console.log('📱 Owner verification response:', result);

    if (!response.ok || !result?.success) {
      throw new Error(result?.message || 'Failed to send owner verification');
    }

    return result;
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: finalPayload.contact.trim(),
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback?from=report`,
    },
  });

  if (error) throw error;

  return {
    success: true,
    message: 'Reporter verification sent successfully',
  };
};

export const handleMagicLinkLogin = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('No active session found');
  }

  if (!API_BASE_URL) {
    throw new Error('API URL is missing');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const result = await response.json();

    console.log('👤 Auth me response:', result);

    if (!response.ok || !result?.success) {
      return {
        session,
        profile: null,
      };
    }

    const profile = result?.data?.profile || null;

   

    return {
      session,
      profile,
    };
  } catch (error) {
    console.error('handleMagicLinkLogin error:', error);

    return {
      session,
      profile: null,
    };
  }
};

export const saveUserProfile = async (payload: any) => {
  if (!API_BASE_URL) {
    throw new Error('API URL is missing');
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('No active session found');
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/create-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  console.log('💾 Save user profile response:', result);

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'Failed to save profile');
  }

  return result?.data || result;
};