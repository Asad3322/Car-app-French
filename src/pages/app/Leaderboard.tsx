import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Coins, Trophy, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import en from "../../i18n/en";
import fr from "../../i18n/fr";

type LeaderboardEntry = {
  rank: number;
  profileId: string;
  username: string;
  avatarUrl?: string | null;
  profileImage?: string | null;
  points: number;
  reportsCount: number;
  coins: number;
  streak: number;
  currentBadge?: string;
  isDummy?: boolean;
};

const DEFAULT_AVATAR =
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=carapp-user";

const translations = {
  en,
  fr,
};

const getLanguage = (): keyof typeof translations => {
  const savedLanguage = localStorage.getItem("language");

  if (savedLanguage === "en" || savedLanguage === "fr") {
    return savedLanguage;
  }

  return "fr";
};

const DUMMY_USERS: LeaderboardEntry[] = [
  {
    rank: 0,
    profileId: "dummy-sarah",
    username: "Sarah Williams",
    avatarUrl: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Sarah",
    points: 120,
    reportsCount: 12,
    coins: 500,
    streak: 5,
    currentBadge: "Expert Contributor",
    isDummy: true,
  },
  {
    rank: 0,
    profileId: "dummy-michael",
    username: "Michael Chen",
    avatarUrl: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Michael",
    points: 95,
    reportsCount: 9,
    coins: 420,
    streak: 4,
    currentBadge: "Rising Star",
    isDummy: true,
  },
  {
    rank: 0,
    profileId: "dummy-jessica",
    username: "Jessica Moore",
    avatarUrl: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Jessica",
    points: 80,
    reportsCount: 8,
    coins: 360,
    streak: 3,
    currentBadge: "Active Reporter",
    isDummy: true,
  },
  {
    rank: 0,
    profileId: "dummy-david",
    username: "David Smith",
    avatarUrl: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=David",
    points: 60,
    reportsCount: 6,
    coins: 280,
    streak: 2,
    currentBadge: "Contributor",
    isDummy: true,
  },
  {
    rank: 0,
    profileId: "dummy-emma",
    username: "Emma Wilson",
    avatarUrl: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emma",
    points: 45,
    reportsCount: 4,
    coins: 210,
    streak: 1,
    currentBadge: "New Helper",
    isDummy: true,
  },
];

const getBadgeTitle = (player: LeaderboardEntry, t: typeof en.leaderboard) => {
  if (player.currentBadge) return player.currentBadge;
  if (player.reportsCount >= 10) return t.expertContributor;
  if (player.reportsCount >= 5) return t.risingStar;
  if (player.reportsCount >= 1) return t.activeReporter;
  return t.contributor;
};

const Leaderboard = () => {
  const navigate = useNavigate();

  const language = getLanguage();
  const t = translations[language].leaderboard;

  const [apiData, setApiData] = useState<LeaderboardEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const localProfileId = useMemo(() => {
    const storedProfileId = localStorage.getItem("profileId");
    const storedUser = localStorage.getItem("user");

    if (storedProfileId) return storedProfileId;

    try {
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser?.id || parsedUser?.profileId || "";
      }
    } catch {
      return "";
    }

    return "";
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/gamification/leaderboard?t=${Date.now()}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );

        const result = await res.json();

        if (result.success) {
          setApiData(result.data || []);
        } else {
          console.error("Leaderboard API error:", result.message);
        }
      } catch (err) {
        console.error("Leaderboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // ✅ LIVE REFRESH
    window.addEventListener("profileUpdated", fetchLeaderboard);

    window.addEventListener("focus", fetchLeaderboard);

    return () => {
      window.removeEventListener("profileUpdated", fetchLeaderboard);

      window.removeEventListener("focus", fetchLeaderboard);
    };
  }, []);

  const data = useMemo(() => {
    const merged = [...apiData, ...DUMMY_USERS];

    const sorted = merged
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.reportsCount !== a.reportsCount) {
          return b.reportsCount - a.reportsCount;
        }
        return b.coins - a.coins;
      })
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    return sorted;
  }, [apiData]);

  const displayUser = selectedUser
    ? data.find((item) => item.profileId === selectedUser.profileId) ||
      selectedUser
    : data[0];

  return (
    <div className="min-h-screen bg-[#F1F5F9] px-4 pb-24 pt-4 text-[#101B35]">
      <div className="mx-auto w-full max-w-[430px]">
        <div className="mb-6 flex items-center justify-between rounded-b-[28px] bg-white px-2 py-3">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft size={23} />
          </button>

          <h1 className="text-[24px] font-black tracking-tight">{t.title}</h1>

          <button className="p-2">
            <Search size={23} />
          </button>
        </div>

        {loading ? (
          <div className="rounded-[26px] bg-white p-8 text-center text-sm font-semibold text-gray-500 shadow-sm">
            {t.loading}
          </div>
        ) : (
          <>
            {displayUser && (
              <div className="mb-8 rounded-[30px] bg-white px-6 py-7 text-center shadow-[0_12px_35px_rgba(15,35,64,0.08)]">
                <div className="relative mx-auto mb-4 h-[96px] w-[96px]">
                  <div className="absolute inset-0 rounded-full bg-[#FFE8A3]" />

                  <img
                    src={
                      (
                        displayUser.avatarUrl ||
                        displayUser.profileImage ||
                        DEFAULT_AVATAR
                      ).includes("?")
                        ? `${displayUser.avatarUrl || displayUser.profileImage || DEFAULT_AVATAR}&t=${Date.now()}`
                        : `${displayUser.avatarUrl || displayUser.profileImage || DEFAULT_AVATAR}?t=${Date.now()}`
                    }
                    alt={displayUser.username}
                    className="relative h-full w-full rounded-full border-[6px] border-[#EEF2FF] bg-white object-cover"
                  />

                  <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFCA42] text-white shadow-md">
                    <Crown size={17} />
                  </div>
                </div>

                <h2 className="text-[28px] font-black leading-tight text-[#111A3A]">
                  {displayUser.username}
                </h2>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                  <span className="rounded-full bg-[#EEF0F7] px-3 py-1 text-[12px] font-black uppercase text-[#222B55]">
                    {t.rank} #{displayUser.rank}
                  </span>

                  <span className="text-[14px] font-semibold text-[#6B7280]">
                    {displayUser.reportsCount} {t.reportsSubmitted}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-[18px] bg-[#F7FAFC] py-3">
                    <p className="text-[16px] font-black text-[#111A3A]">
                      {displayUser.points}
                    </p>
                    <p className="text-[11px] font-bold text-[#8B95A5]">
                      {t.points}
                    </p>
                  </div>

                  <div className="rounded-[18px] bg-[#F7FAFC] py-3">
                    <p className="text-[16px] font-black text-[#E7764D]">
                      {displayUser.coins}
                    </p>
                    <p className="text-[11px] font-bold text-[#8B95A5]">
                      {t.coins}
                    </p>
                  </div>

                  <div className="rounded-[18px] bg-[#F7FAFC] py-3">
                    <p className="text-[16px] font-black text-[#111A3A]">
                      {displayUser.streak}
                    </p>
                    <p className="text-[11px] font-bold text-[#8B95A5]">
                      {t.streak}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[25px] font-black">{t.weekLeaderboard}</h3>

              <span className="text-[13px] font-black uppercase tracking-[0.25em] text-[#8B95A5]">
                {t.global}
              </span>
            </div>

            <div className="space-y-4">
              {data.map((player) => {
                const isYou = player.profileId === localProfileId;
                const isSelected = displayUser?.profileId === player.profileId;

                const avatar =
                  player.avatarUrl || player.profileImage || DEFAULT_AVATAR;

                return (
                  <button
                    key={player.profileId}
                    onClick={() => setSelectedUser(player)}
                    className={`flex w-full items-center rounded-[26px] px-4 py-4 text-left transition active:scale-[0.98] ${
                      isSelected
                        ? "border border-[#2F93F6] bg-[#EEF8FF]"
                        : isYou
                          ? "border border-[#2F93F6] bg-[#F7FBFF]"
                          : "bg-white"
                    } shadow-[0_10px_28px_rgba(15,35,64,0.07)]`}
                  >
                    <div
                      className={`mr-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[18px] font-black ${
                        player.rank === 1
                          ? "bg-[#FFF1BC] text-[#D69A00]"
                          : player.rank === 2
                            ? "bg-[#EEF2F7] text-[#7B8794]"
                            : player.rank === 3
                              ? "bg-[#FFE8DD] text-[#E06D3A]"
                              : "bg-[#F4F6F9] text-[#8B95A5]"
                      }`}
                    >
                      {player.rank}
                    </div>

                    <img
                      src={
                        avatar.includes("?")
                          ? `${avatar}&t=${Date.now()}`
                          : `${avatar}?t=${Date.now()}`
                      }
                      alt={player.username}
                      className="mr-4 h-[58px] w-[58px] shrink-0 rounded-full bg-[#EEF2F7] object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[18px] font-black text-[#101B35]">
                        {player.username} {isYou ? `(${t.you})` : ""}
                      </p>

                      <p className="truncate text-[14px] font-medium text-[#7A8494]">
                        {getBadgeTitle(player, t)}
                      </p>

                      <p className="mt-1 text-[13px] font-semibold text-[#8B95A5]">
                        {player.reportsCount} {t.reports}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="flex items-center justify-end gap-1 text-[17px] font-black text-[#111A3A]">
                        <Trophy size={16} className="text-[#59718D]" />
                        {player.points} {t.pts}
                      </div>

                      <div className="mt-1 flex items-center justify-end gap-1 text-[14px] font-black text-[#E7764D]">
                        <Coins size={14} />
                        {player.coins} {t.coinsLower}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
