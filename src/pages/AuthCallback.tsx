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
        const code = url.searchParams.get('code');

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            throw error;
          }
        }

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
        <h2 className="text-2xl font-bold text-[#0B1A2B]">Signing you in...</h2>
        <p className="mt-3 text-sm text-[#5B6B7A]">
          Please wait while we verify your secure link.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;