import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { handleMagicLinkLogin } from "../services/authService";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AuthCallback = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const linkPendingReportToReporter = async (token: string) => {
      const pendingReportId = localStorage.getItem("pendingReportId") || "";
      if (!pendingReportId) return null;

      const response = await fetch(`${API_BASE_URL}/api/auth/create-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: "reporter",
          pendingReportId,
        }),
      });

      const result = await response.json();
      console.log("LINK PENDING REPORT RESPONSE:", result);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to link pending report");
      }

      localStorage.removeItem("pendingReportId");
      return result;
    };

    const clearOwnerPendingStorage = () => {
      localStorage.removeItem("verifiedPhone");
      localStorage.removeItem("vehicleId");
      localStorage.removeItem("ownerAccess");
      localStorage.removeItem("ownerPhone");
      localStorage.removeItem("pendingPhone");
    };

    const claimVehicleWithOwnerAccess = async ({
      vehicleId,
      ownerAccessToken,
    }: {
      vehicleId: string;
      ownerAccessToken: string;
    }) => {
      if (!vehicleId || !ownerAccessToken) return null;

      const claimResponse = await fetch(`${API_BASE_URL}/api/vehicles/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-owner-access-token": ownerAccessToken,
        },
        body: JSON.stringify({
          vehicleId,
        }),
      });

      const claimResult = await claimResponse.json();
      console.log(
        "PHONE TOKEN CLAIM VEHICLE RESPONSE:",
        JSON.stringify(claimResult, null, 2),
      );

      if (!claimResponse.ok) {
        throw new Error(claimResult?.message || "Failed to claim vehicle");
      }

      return claimResult;
    };

    const claimVehicleWithAuthToken = async ({
      vehicleId,
      token,
    }: {
      vehicleId: string;
      token: string;
    }) => {
      if (!vehicleId || !token) return null;

      const claimResponse = await fetch(`${API_BASE_URL}/api/vehicles/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicleId,
        }),
      });

      const claimResult = await claimResponse.json();
      console.log("MAGIC LINK CLAIM VEHICLE RESPONSE:", claimResult);

      if (!claimResponse.ok) {
        throw new Error(claimResult?.message || "Failed to claim vehicle");
      }

      return claimResult;
    };

    const run = async () => {
      try {
        const url = new URL(window.location.href);

        const code = url.searchParams.get("code");
        const phoneToken = url.searchParams.get("phone_token");
        const fromParam = url.searchParams.get("from");

        if (phoneToken) {
          const res = await fetch(
            `${API_BASE_URL}/api/auth/verify-phone-link?phone_token=${phoneToken}`,
          );

          const data = await res.json();

          if (!res.ok || !data?.success) {
            throw new Error(data?.message || "Phone verification failed");
          }

          const phone = data?.data?.phone || "";
          const vehicleId = data?.data?.vehicleId || "";
          const ownerAccessToken = data?.data?.ownerAccessToken || "";

          localStorage.setItem("role", "vehicle_owner");
          localStorage.setItem("ownerAccess", "true");
          localStorage.setItem("ownerPhone", phone);
          localStorage.setItem("verifiedPhone", phone);
          localStorage.setItem("vehicleId", vehicleId);
          localStorage.setItem("ownerAccessToken", ownerAccessToken);

          if (data?.data?.profile) {
            localStorage.setItem("user", JSON.stringify(data.data.profile));
          }

          if (vehicleId && ownerAccessToken) {
            await claimVehicleWithOwnerAccess({
              vehicleId,
              ownerAccessToken,
            });
          }

          window.location.href = "/app/vehicles";
          return;
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.access_token) {
          const fallbackRole =
            localStorage.getItem("role") === "vehicle_owner" ||
            localStorage.getItem("pendingAuthRole") === "vehicle_owner" ||
            localStorage.getItem("verifiedPhone") ||
            localStorage.getItem("vehicleId")
              ? "owner"
              : "reporter";

          navigate(`/auth?role=${fallbackRole}`, { replace: true });
          return;
        }

        const token = session.access_token;
        localStorage.setItem("token", token);

        const result = await handleMagicLinkLogin();
        const profile = result?.profile || null;

        const pendingVerifiedPhone =
          localStorage.getItem("verifiedPhone") || "";
        const pendingVehicleId = localStorage.getItem("vehicleId") || "";

        const isPendingOwnerFlow = Boolean(
          pendingVerifiedPhone && pendingVehicleId,
        );

        const fromReportFlow =
          localStorage.getItem("fromReportFlow") === "true" ||
          localStorage.getItem("openIncidentsTab") === "sent" ||
          fromParam === "report";

        if (fromReportFlow) {
          localStorage.removeItem("fromReportFlow");
          localStorage.removeItem("authFlow");
          localStorage.removeItem("redirectAfterAuth");
          localStorage.removeItem("pendingAuthRole");
          localStorage.removeItem("afterMagicLinkRedirect");
          localStorage.removeItem("afterMagicLinkFilter");

          if (!profile) {
            const pendingRole =
              localStorage.getItem("role") ||
              localStorage.getItem("pendingAuthRole") ||
              "reporter";

            localStorage.setItem("role", pendingRole);
            navigate("/complete-profile", { replace: true });
            return;
          }

          localStorage.setItem("role", "reporter");
          localStorage.setItem("openIncidentsTab", "sent");

          await linkPendingReportToReporter(token);

          navigate("/app/history", {
            replace: true,
            state: { filter: "sent" },
          });
          return;
        }

        if (isPendingOwnerFlow) {
          try {
            localStorage.setItem("role", "vehicle_owner");

            await claimVehicleWithAuthToken({
              vehicleId: pendingVehicleId,
              token,
            });

            clearOwnerPendingStorage();

            window.location.href = "/app/vehicles";
            return;
          } catch (claimError) {
            console.error("Claim vehicle error:", claimError);
            alert("Vehicle verification succeeded but claim failed.");
            window.location.href = "/app/vehicles";
            return;
          }
        }

        if (!profile) {
          localStorage.setItem("role", "reporter");
          window.location.href = "/complete-profile";
          return;
        }

        if (profile.role === "vehicle_owner") {
          localStorage.setItem("role", "vehicle_owner");
          navigate("/app/vehicles", { replace: true });
          return;
        }

        localStorage.setItem("role", "reporter");
        window.location.href = "/app/history";
      } catch (err) {
        console.error("Auth callback error:", err);

        const fallbackRole =
          localStorage.getItem("role") === "vehicle_owner" ||
          localStorage.getItem("verifiedPhone") ||
          localStorage.getItem("vehicleId")
            ? "owner"
            : "reporter";

        navigate(`/auth?role=${fallbackRole}`, { replace: true });
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
