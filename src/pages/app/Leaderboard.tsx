import { useMemo, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Period = 'daily' | 'monthly' | 'allTime';

type LeaderboardEntry = {
  id: number;
  name: string;
  points: number;
  reports: number;
  avatar: string;
};

type RankedLeaderboardEntry = LeaderboardEntry & {
  rank: number;
};

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?name=User&background=4EA1F3&color=fff&bold=true';

const leaderboardData: Record<Period, LeaderboardEntry[]> = {
  daily: [
    { id: 1, name: 'Peter Thomas', points: 1800, reports: 42, avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 2, name: 'Emma Wilson', points: 1490, reports: 35, avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, name: 'Daniel Harris', points: 1205, reports: 30, avatar: 'https://i.pravatar.cc/150?img=15' },
    { id: 4, name: 'Sophia Clark', points: 1000, reports: 28, avatar: 'https://i.pravatar.cc/150?img=32' },
    { id: 5, name: 'Michael Brown', points: 900, reports: 25, avatar: 'https://i.pravatar.cc/150?img=22' },
    { id: 6, name: 'Olivia Martin', points: 800, reports: 22, avatar: 'https://i.pravatar.cc/150?img=18' },
    { id: 7, name: 'James Walker', points: 750, reports: 20, avatar: 'https://i.pravatar.cc/150?img=44' },
    { id: 8, name: 'Peter Thomas (You)', points: 720, reports: 12, avatar: 'https://i.pravatar.cc/150?img=9' },
  ],
  monthly: [
    { id: 1, name: 'Peter Thomas', points: 5200, reports: 82, avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 2, name: 'Daniel Harris', points: 4700, reports: 74, avatar: 'https://i.pravatar.cc/150?img=15' },
    { id: 3, name: 'Emma Wilson', points: 4300, reports: 69, avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 4, name: 'Sophia Clark', points: 3900, reports: 60, avatar: 'https://i.pravatar.cc/150?img=32' },
    { id: 5, name: 'Michael Brown', points: 3400, reports: 56, avatar: 'https://i.pravatar.cc/150?img=22' },
    { id: 6, name: 'Olivia Martin', points: 3100, reports: 51, avatar: 'https://i.pravatar.cc/150?img=18' },
    { id: 7, name: 'James Walker', points: 2800, reports: 48, avatar: 'https://i.pravatar.cc/150?img=44' },
    { id: 8, name: 'Peter Thomas (You)', points: 2500, reports: 41, avatar: 'https://i.pravatar.cc/150?img=9' },
  ],
  allTime: [
    { id: 1, name: 'Peter Thomas', points: 15400, reports: 210, avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 2, name: 'Emma Wilson', points: 14850, reports: 201, avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, name: 'Daniel Harris', points: 14120, reports: 193, avatar: 'https://i.pravatar.cc/150?img=15' },
    { id: 4, name: 'Sophia Clark', points: 12670, reports: 172, avatar: 'https://i.pravatar.cc/150?img=32' },
    { id: 5, name: 'Michael Brown', points: 11220, reports: 158, avatar: 'https://i.pravatar.cc/150?img=22' },
    { id: 6, name: 'Olivia Martin', points: 10480, reports: 149, avatar: 'https://i.pravatar.cc/150?img=18' },
    { id: 7, name: 'James Walker', points: 9980, reports: 141, avatar: 'https://i.pravatar.cc/150?img=44' },
    { id: 8, name: 'Peter Thomas (You)', points: 9540, reports: 136, avatar: 'https://i.pravatar.cc/150?img=9' },
  ],
};

const Avatar = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.src = DEFAULT_AVATAR;
      }}
    />
  );
};

const getRowClasses = (rank: number, isYou: boolean) => {
  if (isYou) {
    return 'bg-[#EAF3FF] border-2 border-[#3793F6] shadow-[0_8px_24px_rgba(55,147,246,0.12)]';
  }

  switch (rank) {
    case 1:
      return 'bg-[#FFF0B8] border border-[#F2C94C] shadow-[0_8px_24px_rgba(242,201,76,0.18)]';
    case 2:
      return 'bg-[#DDF3FF] border border-[#6EC6FF] shadow-[0_8px_24px_rgba(110,198,255,0.18)]';
    case 3:
      return 'bg-[#FFE1E8] border border-[#FF8FA3] shadow-[0_8px_24px_rgba(255,143,163,0.18)]';
    default:
      return 'bg-white border border-[#C9DFF5] shadow-[0_6px_18px_rgba(15,35,64,0.06)]';
  }
};

const getRankTextClasses = (rank: number, isYou: boolean) => {
  if (isYou) return 'text-[#3793F6]';
  if (rank === 1) return 'text-[#B78103]';
  if (rank === 2) return 'text-[#2686D9]';
  if (rank === 3) return 'text-[#E35D7A]';
  return 'text-[#7A8CA5]';
};

const getBadgePillClasses = (rank: number, isYou: boolean) => {
  if (isYou) return 'bg-[#D6EAFF] text-[#3793F6]';
  if (rank === 1) return 'bg-[#FFE08A] text-[#9A6A00]';
  if (rank === 2) return 'bg-[#CFEFFF] text-[#1877C9]';
  if (rank === 3) return 'bg-[#FFD5DE] text-[#D94F6D]';
  return 'bg-[#EEF5FD] text-[#3793F6]';
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('daily');

  const rankedEntries: RankedLeaderboardEntry[] = useMemo(
    () =>
      leaderboardData[period].map((item, index) => ({
        ...item,
        rank: index + 1,
      })),
    [period]
  );

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

        <div className="mb-6 flex rounded-full bg-[#cfe3f7] p-1">
          {[
            { label: 'Daily', value: 'daily' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'All time', value: 'allTime' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setPeriod(item.value as Period)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                period === item.value ? 'bg-[#3793F6] text-white' : 'text-[#5c6f87]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {rankedEntries.map((player) => {
            const isYou = player.name.includes('(You)');
            const cleanName = player.name.replace(' (You)', '');

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between rounded-[24px] px-4 py-4 ${getRowClasses(
                  player.rank,
                  isYou
                )}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold ${getRankTextClasses(
                      player.rank,
                      isYou
                    )}`}
                  >
                    {player.rank}
                  </div>

                  <div className="relative">
                    <Avatar
                      src={player.avatar}
                      alt={cleanName}
                      className="h-12 w-12 rounded-full border-2 border-white object-cover"
                    />

                    {isYou && (
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#3793F6] px-2 py-[2px] text-[9px] font-bold text-white shadow-sm">
                        YOU
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[17px] font-bold text-[#0F2340]">
                      {cleanName}
                    </p>
                    <p className="text-sm text-[#60738C]">{player.reports} Reports</p>
                  </div>
                </div>

                <div
                  className={`ml-3 flex items-center gap-2 rounded-full px-3 py-2 font-bold ${getBadgePillClasses(
                    player.rank,
                    isYou
                  )}`}
                >
                  <span className="text-base">🏅</span>
                  <span>{player.reports}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;