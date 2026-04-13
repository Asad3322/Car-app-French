import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setValid(false);
          return;
        }

        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          await supabase.auth.signOut();
          localStorage.removeItem('pendingEmail');
          localStorage.removeItem('pendingPhone');
          setValid(false);
        } else {
          setValid(true);
        }
      } catch (error) {
        console.error('ProtectedRoute error:', error);
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
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
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;