import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const allow = (token?: string) => {
      if (!isMounted) return;

      if (token) {
        localStorage.setItem("token", token);
      }

      setValid(true);
      setLoading(false);
    };

    const deny = () => {
      if (!isMounted) return;

      localStorage.removeItem("token");
      localStorage.removeItem("ownerAccess");
      localStorage.removeItem("ownerPhone");
      localStorage.removeItem("ownerAccessToken");

      setValid(false);
      setLoading(false);
    };

    const checkAuth = async () => {
      try {
        const ownerAccess = localStorage.getItem("ownerAccess");
        const ownerAccessToken = localStorage.getItem("ownerAccessToken");
        const role = localStorage.getItem("role");

        if (
          ownerAccess === "true" &&
          ownerAccessToken &&
          role === "vehicle_owner"
        ) {
          allow();
          return;
        }

        const localToken = localStorage.getItem("token");

        if (localToken) {
          allow(localToken);
          return;
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session?.access_token) {
          deny();
          return;
        }

        allow(session.access_token);
      } catch (error) {
        console.error("ProtectedRoute error:", error);
        deny();
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (session?.access_token) {
        allow(session.access_token);
      }
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
    const authRole =
      location.pathname.includes("/vehicles") ||
      localStorage.getItem("role") === "vehicle_owner"
        ? "owner"
        : "reporter";

    return (
      <Navigate
        to={`/auth?role=${authRole}`}
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;