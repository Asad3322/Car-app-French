import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const allow = () => {
      if (!isMounted) return;
      setValid(true);
      setLoading(false);
    };

    const deny = () => {
      if (!isMounted) return;
      setValid(false);
      setLoading(false);
    };

    const checkAuth = async () => {
      try {
        // ✅ 1. Owner phone flow access
        // Owner flow does not have Supabase session, so allow it after profile completion.
        const ownerAccess = localStorage.getItem('ownerAccess');

        if (ownerAccess === 'true') {
          allow();
          return;
        }

        // ✅ 2. Backend/Supabase token access
        const token = localStorage.getItem('token');

        if (token) {
          allow();
          return;
        }

        // ✅ 3. Check Supabase session BEFORE calling getUser()
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError || !sessionData?.session) {
          deny();
          return;
        }

        if (sessionData.session.access_token) {
          localStorage.setItem('token', sessionData.session.access_token);
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          deny();
          return;
        }

        allow();
      } catch (error) {
        console.error('ProtectedRoute error:', error);
        deny();
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      const ownerAccess = localStorage.getItem('ownerAccess');

      if (ownerAccess === 'true') {
        setValid(true);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setValid(true);

        if (session.access_token) {
          localStorage.setItem('token', session.access_token);
        }
      } else {
        setValid(false);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EEF3F8] px-6">
        <div className="rounded-[24px] border border-[#D9E5F1] bg-white px-6 py-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#6B7A90]">
            Checking session...
          </p>
        </div>
      </div>
    );
  }

  if (!valid) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;