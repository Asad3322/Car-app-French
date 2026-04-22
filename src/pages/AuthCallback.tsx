import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { handleMagicLinkLogin } from '../services/authService';

const AuthCallback = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const run = async () => {
      try {
        const url = new URL(window.location.href);

        const code = url.searchParams.get('code'); // email flow
        const phoneToken = url.searchParams.get('phone_token'); // owner phone-link flow

        // =========================
        // 🟢 PHONE FLOW (OWNER)
        // =========================
        // IMPORTANT:
        // This flow does NOT create a Supabase session in your current architecture.
        // It only verifies the backend phone link and stores temporary data for CompleteProfile.
        if (phoneToken) {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/verify-phone-link?phone_token=${phoneToken}`
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data?.message || 'Phone verification failed');
          }

          localStorage.setItem('verifiedPhone', data?.data?.phone || '');
          localStorage.setItem('vehicleId', data?.data?.vehicleId || '');
          localStorage.setItem('role', 'vehicle_owner');

          // Do NOT call handleMagicLinkLogin here because it requires a Supabase session.
          navigate('/complete-profile', { replace: true });
          return;
        }

        // =========================
        // 🔵 EMAIL FLOW (REPORTER)
        // =========================
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            throw error;
          }
        }

        // =========================
        // 🔐 GET SESSION (REPORTER)
        // =========================
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (session?.access_token) {
          localStorage.setItem('token', session.access_token);
        }

        // =========================
        // 🎯 REPORTER NEXT STEP
        // =========================
        const result = await handleMagicLinkLogin();

        if (result?.needsProfileCompletion) {
          navigate('/complete-profile', { replace: true });
        } else {
          navigate('/app/home', { replace: true });
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        navigate('/auth', { replace: true });
      }
    };

    run();
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[28px] bg-[#EEF3F8] p-8 text-center shadow-lg">
        <h2 className="text-2xl font-bold text-[#0B1A2B]">
          Signing you in...
        </h2>
        <p className="mt-3 text-sm text-[#5B6B7A]">
          Please wait while we verify your secure link.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;