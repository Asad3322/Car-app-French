import { useEffect,  useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

type LeaderboardEntry = {
  rank: number;
  profileId: string;
  username: string;
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();

        if (result.success) {
          setData(result.data);
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
        ) : (
          <div className="space-y-4">
            {data.map((player) => {
              const isYou =
                player.profileId === localStorage.getItem("profileId");

              return (
                <div
                  key={player.profileId}
                  className="flex items-center justify-between rounded-[24px] px-4 py-4 bg-white shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold">
                      {player.rank}
                    </div>

                    <img
                      src={DEFAULT_AVATAR}
                      className="h-12 w-12 rounded-full"
                    />

                    <div>
                      <p className="font-bold">
                        {player.username} {isYou && "(You)"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {player.reportsCount} Reports
                      </p>
                    </div>
                  </div>

                  <div className="font-bold text-blue-600">
                    {player.points} pts
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