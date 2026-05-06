import { useEffect, useState } from "react";
import { ArrowLeft, Search, Coins, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

type LeaderboardEntry = {
  rank: number;
  profileId: string;
  username: string;
  avatarUrl?: string | null;
  points: number;
  reportsCount: number;
  coins: number;
  streak: number;
};

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=4EA1F3&color=fff&bold=true";

const Leaderboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/gamification/leaderboard`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        const result = await res.json();

        if (result.success) {
          setData(result.data || []);
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
  }, []);

  return (
    <div className="min-h-screen bg-[#DDEBF7] px-4 pb-8 pt-4 text-[#0F2340]">
      <div className="mx-auto w-full max-w-[430px]">
        <div className="mb-5 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-2xl font-bold">Leaderboard</h1>

          <button className="p-2">
            <Search size={22} />
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500">No leaderboard data found.</p>
        ) : (
          <div className="space-y-4">
            {data.map((player) => {
              const storedProfileId = localStorage.getItem("profileId");
              const storedUser = localStorage.getItem("user");

              let localProfileId = storedProfileId || "";

              try {
                if (!localProfileId && storedUser) {
                  const parsedUser = JSON.parse(storedUser);
                  localProfileId = parsedUser?.id || parsedUser?.profileId || "";
                }
              } catch {
                localProfileId = "";
              }

              const isYou = player.profileId === localProfileId;

              return (
                <div
                  key={player.profileId}
                  className={`flex items-center justify-between rounded-[24px] px-4 py-4 shadow ${
                    isYou
                      ? "border border-[#2F93F6] bg-[#F0F8FF]"
                      : "bg-white"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold">
                      {player.rank}
                    </div>

                    <img
                      src={player.avatarUrl || DEFAULT_AVATAR}
                      alt={player.username}
                      className="h-12 w-12 shrink-0 rounded-full bg-white object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate font-bold">
                        {player.username} {isYou && "(You)"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {player.reportsCount} Reports
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="flex items-center justify-end gap-1 font-bold text-blue-600">
                      <Trophy size={14} />
                      {player.points} pts
                    </div>

                    <div className="mt-1 flex items-center justify-end gap-1 text-xs font-semibold text-yellow-600">
                      <Coins size={13} />
                      {player.coins} coins
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;