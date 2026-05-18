import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdLocalFireDepartment,
  MdVerifiedUser,
  MdAdd,
  MdNotifications,
} from "react-icons/md";

const API_URL = import.meta.env.VITE_API_URL;

const homeText = {
  fr: {
    communitySafety: "Communauté Sécurisée",
    greeting: "Bonjour",
    subtitle: "Prêt à aider la communauté aujourd’hui ?",
    currentStreak: "Série actuelle",
    days: "Jours",
    streakDescription:
      "Vous faites un excellent travail. Continuez à signaler et protéger.",
    reportsMade: "Signalements",
    verifiedReports: "Signalements vérifiés",
    currentBadge: "Badge actuel",
    noBadge: "Aucun badge",
    reportNow: "Signaler maintenant",
    guest: "Invité",
    quickActions: "Actions rapides",
    myIncidents: "Mes incidents",
    incidentsDesc: "Voir les signalements envoyés et reçus",
    myProfile: "Mon profil",
    profileDesc: "Modifier votre compte et avatar",
  },
  en: {
    communitySafety: "Community Safety",
    greeting: "Hi",
    subtitle: "Ready to help the community today?",
    currentStreak: "Current Streak",
    days: "Days",
    streakDescription: "You're doing amazing. Keep reporting and protecting.",
    reportsMade: "Reports Made",
    verifiedReports: "Total verified reports",
    currentBadge: "Current Badge",
    noBadge: "No Badge Yet",
    reportNow: "New Report",
    guest: "Guest",
    quickActions: "Quick Actions",
    myIncidents: "My Incidents",
    incidentsDesc: "View sent and received reports",
    myProfile: "My Profile",
    profileDesc: "Edit your account and avatar",
  },
};

const DEFAULT_AVATAR = "https://api.dicebear.com/9.x/fun-emoji/svg?seed=A";

const Home = () => {
  const navigate = useNavigate();

  const [activeUser, setActiveUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const language =
    (localStorage.getItem("language") as keyof typeof homeText) || "fr";

  const t = homeText[language] || homeText.fr;

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const ownerAccessToken =
        localStorage.getItem("ownerAccessToken") ||
        localStorage.getItem("ownerAccess");

      const headers: Record<string, string> = {};

      if (token) headers.Authorization = `Bearer ${token}`;
      if (!token && ownerAccessToken) {
        headers["x-owner-access-token"] = ownerAccessToken;
      }

      if (!token && !ownerAccessToken) {
        setActiveUser(null);
        return;
      }

      const [meRes, gamificationRes] = await Promise.all([
        fetch(`${API_URL}/api/auth/me`, { headers }),
        fetch(`${API_URL}/api/gamification/me`, { headers }),
      ]);

      const meData = await meRes.json();
      const gamificationData = await gamificationRes.json();

      const profile = meData?.data?.profile || {};
      const auth = meData?.data?.auth || {};
      const game = gamificationData?.data || {};

      const latestUser = {
        ...profile,
        id: profile?.id || auth?.id,
        username:
          profile?.username ||
          profile?.name ||
          auth?.email?.split("@")?.[0] ||
          "Guest",
        name:
          profile?.name ||
          profile?.username ||
          auth?.email?.split("@")?.[0] ||
          "Guest",
        email: profile?.email || auth?.email || "",
        phone: profile?.phone || auth?.phone || "",
        avatar_url:
          profile?.avatar_url || profile?.profileImage || DEFAULT_AVATAR,
        coins: Number(game?.coins || profile?.coins || 0),
        points: Number(game?.points || profile?.points || 0),
        streak: Number(game?.streak || profile?.streak || 0),
        reportsCount: Number(
          game?.reportsCount ||
            game?.reports_count ||
            profile?.reportsCount ||
            profile?.reports_count ||
            0,
        ),
        badges: Array.isArray(game?.badges)
          ? game.badges
          : Array.isArray(profile?.badges)
            ? profile.badges
            : [],
      };

      localStorage.setItem("user", JSON.stringify(latestUser));
      if (latestUser.id) localStorage.setItem("profileId", latestUser.id);

      setActiveUser(latestUser);
    } catch (error) {
      console.error("Home fetch error:", error);

      try {
        const rawUser = localStorage.getItem("user");
        setActiveUser(rawUser ? JSON.parse(rawUser) : null);
      } catch {
        setActiveUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();

    const refreshHome = () => {
      fetchHomeData();
    };

    window.addEventListener("profileUpdated", refreshHome);
    window.addEventListener("focus", refreshHome);

    return () => {
      window.removeEventListener("profileUpdated", refreshHome);
      window.removeEventListener("focus", refreshHome);
    };
  }, []);

  const firstName =
    activeUser?.username?.trim()?.split(" ")[0] ||
    activeUser?.name?.trim()?.split(" ")[0] ||
    activeUser?.email?.split("@")?.[0] ||
    t.guest;

  const streak = activeUser?.streak ?? 0;

  const reportsMade =
    activeUser?.reportsCount ??
    activeUser?.reports_count ??
    activeUser?.totalIncidentsReported ??
    0;

  const currentBadge =
    activeUser?.badges?.[activeUser.badges.length - 1] || t.noBadge;

  const rawAvatar =
    activeUser?.profileImage || activeUser?.avatar_url || DEFAULT_AVATAR;

  const avatar = rawAvatar.includes("?")
    ? `${rawAvatar}&t=${Date.now()}`
    : `${rawAvatar}?t=${Date.now()}`;

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-[#F3F7FB]">
      <div className="mx-auto flex min-h-full w-full max-w-[430px] flex-col px-4 pb-28 pt-5 sm:px-5 sm:pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex items-center gap-3">
            <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border-[3px] border-[#111827] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
              <img
                src={avatar}
                alt="avatar"
                className="h-[36px] w-[36px] rounded-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8A97AB]">
                {t.communitySafety}
              </p>

              <h1 className="truncate text-[22px] font-black tracking-tight text-[#4A9CFF] sm:text-[24px]">
                CARAPP
              </h1>
            </div>
          </div>

          <button
            type="button"
            className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#0B2350] text-[#63A9FF] shadow-[0_12px_24px_rgba(11,35,80,0.22)] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <MdNotifications size={20} />
          </button>
        </div>

        <div className="mt-5">
          <h2 className="break-words text-[24px] font-black leading-[1.05] text-[#0D1633] sm:text-[27px]">
            {loading ? `${t.greeting}...` : `${t.greeting}, ${firstName}! 👋`}
          </h2>

          <p className="mt-1.5 text-[14px] font-medium leading-6 text-[#51627D]">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-[26px] border border-[#97C9FF] bg-gradient-to-br from-[#58A9FF] via-[#4DA3FF] to-[#4297F3] p-4 shadow-[0_18px_38px_rgba(77,163,255,0.20)] sm:rounded-[28px] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-white/90">
                {t.currentStreak}
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-[38px] font-black leading-none text-white sm:text-[44px]">
                  {streak}
                </span>

                <span className="pb-1 text-[14px] font-bold uppercase text-white/95 sm:text-[15px]">
                  {t.days}
                </span>
              </div>

              <p className="mt-2 max-w-[210px] text-[12px] leading-5 text-white/90 sm:max-w-[230px]">
                {t.streakDescription}
              </p>
            </div>

            <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/10 sm:h-[74px] sm:w-[74px]">
              <MdLocalFireDepartment
                size={36}
                className="text-white sm:text-[40px]"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-[22px] border border-[#A7D0FF] bg-[#4DA3FF] p-4 shadow-[0_14px_28px_rgba(77,163,255,0.18)]">
            <p className="text-[11px] font-black uppercase tracking-[0.1em] text-white/90">
              {t.reportsMade}
            </p>

            <div className="mt-4 flex items-center justify-center">
              <span className="text-[40px] font-black leading-none text-white sm:text-[46px]">
                {reportsMade}
              </span>
            </div>

            <p className="mt-2 text-center text-[11px] leading-5 text-white/80">
              {t.verifiedReports}
            </p>
          </div>

          <div className="rounded-[22px] border border-[#A7D0FF] bg-[#4DA3FF] p-4 shadow-[0_14px_28px_rgba(77,163,255,0.18)]">
            <p className="text-[11px] font-black uppercase tracking-[0.1em] text-white/90">
              {t.currentBadge}
            </p>

            <div className="mt-4 flex flex-col items-center justify-center">
              <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-white/12 sm:h-[56px] sm:w-[56px]">
                <MdVerifiedUser
                  size={28}
                  className="text-white sm:text-[30px]"
                />
              </div>

              <p className="mt-3 text-center text-[11px] font-black uppercase leading-4 tracking-[0.04em] text-white">
                {currentBadge}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-[26px] border border-[#D2DEEF] bg-white p-5 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
          <p className="text-[12px] font-black uppercase tracking-[0.12em] text-[#95A1B4]">
            {t.quickActions}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                const token = localStorage.getItem("token");

                const ownerAccessToken =
                  localStorage.getItem("ownerAccessToken") ||
                  localStorage.getItem("ownerAccess");

                if (!token && !ownerAccessToken) {
                  navigate("/auth?role=reporter");
                  return;
                }

                navigate("/app/history");
              }}
              className="rounded-[20px] bg-[#EAF3FF] p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <p className="text-[24px]">🚨</p>

              <p className="mt-2 text-[13px] font-black text-[#111A34]">
                {t.myIncidents}
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#6C7A92]">
                {t.incidentsDesc}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                const token = localStorage.getItem("token");

                const ownerAccessToken =
                  localStorage.getItem("ownerAccessToken") ||
                  localStorage.getItem("ownerAccess");

                if (!token && !ownerAccessToken) {
                  navigate("/auth?role=reporter");
                  return;
                }

                navigate("/app/profile");
              }}
              className="rounded-[20px] bg-[#F6F1DF] p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <p className="text-[24px]">👤</p>

              <p className="mt-2 text-[13px] font-black text-[#111A34]">
                {t.myProfile}
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#6C7A92]">
                {t.profileDesc}
              </p>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/app/reports", {
              state: { fromHomeReport: true },
            })
          }
          className="mt-6 flex h-[68px] items-center justify-center gap-3 rounded-[24px] border-2 border-[#E0AA00] bg-[#F6F1DF] text-[#E0AA00] shadow-[0_14px_28px_rgba(224,170,0,0.12)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_18px_34px_rgba(224,170,0,0.16)] active:scale-[0.99] sm:h-[72px] sm:rounded-[26px]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E0AA00] text-white shadow-sm">
            <MdAdd size={19} />
          </div>

          <span className="text-[15px] font-black uppercase tracking-[0.04em] sm:text-[16px]">
            {t.reportNow}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Home;
