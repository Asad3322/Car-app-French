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

    const checkAuth = async () => {
      try {
        // ✅ 1. Check backend token FIRST
        const token = localStorage.getItem('token');

        if (token) {
          if (isMounted) {
            setValid(true);
            setLoading(false);
          }
          return;
        }

        // ✅ 2. Fallback to Supabase session
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (error || !user) {
          setValid(false);
        } else {
          setValid(true);

          // ✅ Save token if session exists
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.access_token) {
            localStorage.setItem('token', sessionData.session.access_token);
          }
        }
      } catch (error) {
        console.error('ProtectedRoute error:', error);
        if (isMounted) {
          setValid(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setValid(true);

        // ✅ Sync token
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