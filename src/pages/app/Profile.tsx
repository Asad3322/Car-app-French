import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Edit3,
  Mail,
  Phone as PhoneIcon,
  ShieldCheck,
  Navigation,
  FileText,
  ChevronRight,
  Globe,
  Plus,
  CarFront,
  Sparkles,
  LogOut,
} from "lucide-react";
import { supabase } from "../../supabase";

const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";

type ProfileUser = {
  id: string;
  auth_user_id?: string;
  username?: string;
  name?: string;
  phone?: string;
  email?: string;
  profileImage?: string;
  avatar_url?: string;
  role?: string;
  isVehicleOwner?: boolean;
  is_vehicle_owner?: boolean;
};

type ProfileVehicle = {
  id: string;
  name?: string;
  vehicle_name?: string;
  plate?: string;
  licence_plate?: string;
};

type ProfileIncident = {
  id: string;
  reporterId?: string;
  reporter_id?: string;
  receiverId?: string;
  receiver_id?: string;
  plate?: string;
  licence_plate?: string;
};

const Profile = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [vehicles, setVehicles] = useState<ProfileVehicle[]>([]);
  const [sentIncidents, setSentIncidents] = useState<ProfileIncident[]>([]);
  const [receivedIncidents, setReceivedIncidents] = useState<ProfileIncident[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  const [gamification, setGamification] = useState({
    coins: 0,
    points: 0,
    streak: 0,
    reportsCount: 0,
    currentBadge: "Rookie Reporter",
  });

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fetchProfileData = useCallback(async () => {
    let isActive = true;

    try {
      setIsLoading(true);
      setImageError(false);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token || localStorage.getItem("token");
      const ownerAccessToken = localStorage.getItem("ownerAccessToken");

      if (token) {
        localStorage.setItem("token", token);
      }

      if (!token && !ownerAccessToken) {
        if (isActive) {
          setUser(null);
          setVehicles([]);
          setSentIncidents([]);
          setReceivedIncidents([]);
        }
        return;
      }

      const headers: Record<string, string> = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      if (!token && ownerAccessToken) {
        headers["x-owner-access-token"] = ownerAccessToken;
      }

      const meRes = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        headers,
      });

      const meResult = await meRes.json();

      if (!meRes.ok) {
        console.error("Profile /me fetch failed:", meResult);
        if (isActive) setUser(null);
        return;
      }

      const authUser = meResult?.data?.auth;
      const profile = meResult?.data?.profile;

      const savedLanguage =
        localStorage.getItem("app_language") ||
        localStorage.getItem("language");

      if (
        !savedLanguage &&
        (profile?.language === "en" || profile?.language === "fr")
      ) {
        i18n.changeLanguage(profile.language);
        localStorage.setItem("app_language", profile.language);
        localStorage.setItem("language", profile.language);
      }

      const fallbackProfile: ProfileUser = {
        id: authUser?.id || "",
        auth_user_id: authUser?.id || "",
        email: authUser?.email || "",
        username:
          profile?.username?.trim() ||
          profile?.name?.trim() ||
          authUser?.email?.split("@")?.[0] ||
          "User",
        name:
          profile?.username?.trim() ||
          profile?.name?.trim() ||
          authUser?.email?.split("@")?.[0] ||
          "User",
        phone: authUser?.phone || "",
        avatar_url: DEFAULT_AVATAR,
        role: "reporter",
        is_vehicle_owner: false,
      };

      const mergedProfile: ProfileUser = {
        ...fallbackProfile,
        ...(profile || {}),
        id: profile?.id || authUser?.id || fallbackProfile.id,
        auth_user_id: profile?.auth_user_id || authUser?.id || "",
        username:
          profile?.username ||
          profile?.name ||
          fallbackProfile.username ||
          "User",
        name:
          profile?.name || profile?.username || fallbackProfile.name || "User",
        email: profile?.email || authUser?.email || "",
        phone: profile?.phone || authUser?.phone || "",
        profileImage: profile?.profileImage || profile?.avatar_url || "",
        avatar_url:
          profile?.avatar_url || profile?.profileImage || DEFAULT_AVATAR,
      };

      if (isActive) {
        setUser(mergedProfile);
        localStorage.setItem("user", JSON.stringify(mergedProfile));
        if (mergedProfile.id)
          localStorage.setItem("profileId", mergedProfile.id);
        if (mergedProfile.role)
          localStorage.setItem("role", mergedProfile.role);
      }

      const [vehiclesRes, sentRes, receivedRes, gamificationRes] =
        await Promise.allSettled([
          fetch(`${API_URL}/api/vehicles`, { method: "GET", headers }),
          fetch(`${API_URL}/api/reports/sent`, { method: "GET", headers }),
          fetch(`${API_URL}/api/reports/received`, { method: "GET", headers }),
          fetch(`${API_URL}/api/gamification/me`, { method: "GET", headers }),
        ]);

      if (!isActive) return;

      if (vehiclesRes.status === "fulfilled") {
        const response = vehiclesRes.value;
        const result = await response.json();
        setVehicles(
          response.ok && Array.isArray(result?.data) ? result.data : [],
        );
      } else {
        console.error("Vehicles request error:", vehiclesRes.reason);
        setVehicles([]);
      }

      if (sentRes.status === "fulfilled") {
        const response = sentRes.value;
        const result = await response.json();
        setSentIncidents(
          response.ok && Array.isArray(result?.data) ? result.data : [],
        );
      } else {
        console.error("Sent incidents request error:", sentRes.reason);
        setSentIncidents([]);
      }

      if (receivedRes.status === "fulfilled") {
        const response = receivedRes.value;
        const result = await response.json();
        setReceivedIncidents(
          response.ok && Array.isArray(result?.data) ? result.data : [],
        );
      } else {
        console.error("Received incidents request error:", receivedRes.reason);
        setReceivedIncidents([]);
      }

      if (gamificationRes.status === "fulfilled") {
        const response = gamificationRes.value;
        const result = await response.json();

        if (response.ok) {
          const badges = Array.isArray(result?.data?.badges)
            ? result.data.badges
            : [];

          setGamification({
            coins: Number(result?.data?.coins || 0),
            points: Number(result?.data?.points || 0),
            streak: Number(result?.data?.streak || 0),
            reportsCount: Number(
              result?.data?.reportsCount || result?.data?.reports_count || 0,
            ),
            currentBadge: badges[badges.length - 1] || "Rookie Reporter",
          });
        }
      } else {
        console.error("Gamification request error:", gamificationRes.reason);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      if (isActive) {
        setUser(null);
        setVehicles([]);
        setSentIncidents([]);
        setReceivedIncidents([]);
      }
    } finally {
      if (isActive) setIsLoading(false);
    }

    return () => {
      isActive = false;
    };
  }, [i18n]);

  const handleLanguageChange = async (lang: "en" | "fr") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("app_language", lang);
    localStorage.setItem("language", lang);
    setShowLangMenu(false);

    try {
      const rawUser = localStorage.getItem("user");
      const savedUser = rawUser ? JSON.parse(rawUser) : null;

      if (savedUser) {
        const updatedUser = { ...savedUser, language: lang };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new Event("profileUpdated"));
      }
    } catch (error) {
      console.error("Language local update error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("vehicleId");
      localStorage.removeItem("profileId");
      localStorage.removeItem("user");
      localStorage.removeItem("ownerAccess");
      localStorage.removeItem("ownerAccessToken");
      localStorage.removeItem("verifiedPhone");
      localStorage.removeItem("pendingEmail");
      localStorage.removeItem("pendingPhone");

      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();

    const refreshProfile = () => {
      fetchProfileData();
    };

    window.addEventListener("profileUpdated", refreshProfile);
    window.addEventListener("focus", refreshProfile);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setVehicles([]);
        setSentIncidents([]);
        setReceivedIncidents([]);
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        fetchProfileData();
      }
    });

    return () => {
      window.removeEventListener("profileUpdated", refreshProfile);
      window.removeEventListener("focus", refreshProfile);
      subscription.unsubscribe();
    };
  }, [fetchProfileData]);

  const sentCount = sentIncidents.length;
  const receivedCount = receivedIncidents.length;

  const rawAvatar = user?.profileImage || user?.avatar_url || DEFAULT_AVATAR;

  const avatarSrc = !imageError
    ? rawAvatar.includes("?")
      ? `${rawAvatar}&t=${Date.now()}`
      : `${rawAvatar}?t=${Date.now()}`
    : DEFAULT_AVATAR;

  const isOwner =
    user?.role === "vehicle_owner" ||
    user?.isVehicleOwner ||
    user?.is_vehicle_owner;

  const currentLanguage = i18n.language === "en" ? "en" : "fr";

  if (isLoading) {
    return (
      <div className="relative flex h-full flex-col overflow-hidden bg-[#D6E2EC] text-[#0B1A2B]">
        <div className="relative z-20 flex flex-1 items-center justify-center px-5">
          <p className="text-sm font-semibold text-[#6F8194]">
            {t("profile.loadingProfile", "Loading profile...")}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative flex h-full flex-col overflow-hidden bg-[#D6E2EC] text-[#0B1A2B]">
        <div className="relative z-20 flex flex-1 flex-col items-center justify-center px-5 text-center">
          <h2 className="text-xl font-black">
            {t("profile.notFound", "Profile not found")}
          </h2>
          <p className="mt-2 text-sm text-[#6F8194]">
            {t(
              "profile.signInAgain",
              "Please sign in again to load your account.",
            )}
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="mt-5 rounded-[18px] bg-[#2F93F6] px-5 py-3 text-sm font-bold text-white"
          >
            {t("auth.goToSignIn", "Go to Sign In")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#D6E2EC] text-[#0B1A2B]">
      <div className="relative z-30 flex items-center justify-between px-6 pt-8 pb-5">
        <div>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-[#6F8194]">
            {t("profile.account", "Account")}
          </p>
          <h1 className="text-[24px] font-black uppercase italic tracking-tight text-[#0B1A2B]">
            {t("profile.profile", "Profile")}
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowLangMenu((prev) => !prev)}
            className="flex h-10 min-w-10 items-center justify-center gap-1 rounded-full border border-[#AFC0CF] bg-[#F3F8FC] px-3 shadow-[0_6px_14px_rgba(47,147,246,0.10)] active:scale-95"
          >
            <Globe size={16} className="text-[#2F93F6]" />
            <span className="text-[10px] font-black uppercase text-[#2F93F6]">
              {currentLanguage === "fr" ? "FR" : "EN"}
            </span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 top-14 z-[70] w-44 rounded-[18px] border border-[#C7D7E4] bg-[#F3F8FC] p-2 shadow-[0_16px_32px_rgba(43,78,112,0.14)]">
              <button
                onClick={() => handleLanguageChange("fr")}
                className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#35506B] hover:bg-[#E7F0F8]"
              >
                🇫🇷 {t("profile.french", "Français")}
              </button>

              <button
                onClick={() => handleLanguageChange("en")}
                className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#35506B] hover:bg-[#E7F0F8]"
              >
                🇺🇸 {t("profile.english", "English")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-20 flex-1 overflow-y-auto px-5 pb-28">
        <div className="flex flex-col gap-4">
          <section className="relative rounded-[28px] border border-[#BDD0DE] bg-[#EEF4F8] p-4 shadow-[0_10px_22px_rgba(70,106,140,0.10)]">
            <button
              onClick={() => navigate("/app/profile/edit")}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#C5D4E0] bg-white shadow-[0_6px_14px_rgba(47,147,246,0.14)] active:scale-95"
            >
              <Edit3 size={14} className="text-[#2F93F6]" />
            </button>

            <div className="flex gap-3">
              <img
                src={avatarSrc}
                alt="Profile"
                className="h-20 w-20 rounded-[20px] border border-[#C7D7E3] bg-white object-cover"
                onError={() => setImageError(true)}
              />

              <div className="flex-1 pt-1">
                <h2 className="text-[20px] font-extrabold text-[#0B1A2B]">
                  {user?.username?.trim()
                    ? user.username
                    : user?.name?.trim()
                      ? user.name
                      : user?.email?.split("@")[0] || "User"}
                </h2>

                <p className="text-[10px] uppercase tracking-[0.25em] text-[#2F93F6]">
                  {t("profile.communityDriver", "Community Driver")}
                </p>

                {isOwner && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase text-emerald-600">
                    <ShieldCheck size={12} />
                    {t("profile.verifiedOwner", "Verified Owner")}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {isOwner ? (
                <div className="flex items-center gap-3 rounded-[18px] border bg-white px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4F0FC]">
                    <PhoneIcon size={14} className="text-[#2F93F6]" />
                  </div>
                  <p className="text-[13px] text-[#0B1A2B]">
                    {user?.phone || t("profile.noPhone", "No phone")}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-[18px] border bg-white px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4F0FC]">
                    <Mail size={14} className="text-[#2F93F6]" />
                  </div>
                  <p className="text-[13px] text-[#0B1A2B]">
                    {user?.email || t("profile.noEmail", "No email")}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-[24px] border bg-[#EEF4F8] p-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4D9EF2]">
                <Navigation size={18} className="text-white" />
              </div>
              <p className="text-[20px] font-black">{sentCount}</p>
              <p className="text-[10px] text-[#6F8194]">
                {t("profile.sent", "Sent")}
              </p>
            </div>

            <div className="rounded-[24px] border bg-[#EEF4F8] p-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4D9EF2]">
                <FileText size={18} className="text-white" />
              </div>
              <p className="text-[20px] font-black">{receivedCount}</p>
              <p className="text-[10px] text-[#6F8194]">
                {t("profile.received", "Received")}
              </p>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-[24px] border bg-[#EEF4F8] p-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400">
                🪙
              </div>
              <p className="text-[20px] font-black">{gamification.coins}</p>
              <p className="text-[10px] text-[#6F8194]">Coins</p>
            </div>

            <div className="rounded-[24px] border bg-[#EEF4F8] p-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white">
                ⭐
              </div>
              <p className="text-[20px] font-black">{gamification.points}</p>
              <p className="text-[10px] text-[#6F8194]">Points</p>
            </div>
          </section>

          <section className="rounded-[24px] border bg-[#EEF4F8] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#6F8194]">
                  Current Badge
                </p>

                <h3 className="mt-1 text-[18px] font-black text-[#0B1A2B]">
                  {gamification.currentBadge}
                </h3>

                <p className="mt-1 text-[11px] font-semibold text-[#6F8194]">
                  🔥 {gamification.streak} day streak ·{" "}
                  {gamification.reportsCount} reports
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F2FC] text-[24px]">
                🏆
              </div>
            </div>
          </section>

          <section className="rounded-[26px] border bg-[#EEF4F8] p-4">
            <div className="mb-3 flex justify-between">
              <h3 className="text-[16px] font-bold">
                {t("vehicles.myVehicles", "Vehicles")}
              </h3>
              <button onClick={() => navigate("/app/vehicles")}>
                <ChevronRight size={16} />
              </button>
            </div>

            {vehicles.length === 0 ? (
              <button
                onClick={() => navigate("/app/vehicles/add")}
                className="flex w-full flex-col items-center py-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E4F0FC]">
                  <Plus size={20} className="text-[#2F93F6]" />
                </div>
                <p className="mt-2 text-sm font-bold">
                  {t("vehicles.addVehicle", "Add Vehicle")}
                </p>
              </button>
            ) : (
              vehicles.map((v) => (
                <div key={v.id} className="flex justify-between py-2">
                  <div className="flex items-center gap-2">
                    <CarFront size={16} />
                    <p>{v.name || v.vehicle_name || ""}</p>
                  </div>
                  <ChevronRight size={16} />
                </div>
              ))
            )}
          </section>

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-between rounded-[22px] border bg-[#EEF4F8] px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} />
                <span className="text-sm font-bold">
                  {t("profile.support", "Support")}
                </span>
              </div>
              <ChevronRight size={16} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-between rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <LogOut size={16} className="text-red-500" />
                <span className="text-sm font-bold text-red-500">
                  {t("profile.logout", "Logout")}
                </span>
              </div>
              <ChevronRight size={16} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
