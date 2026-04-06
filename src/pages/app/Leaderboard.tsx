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

const Leaderboard = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('daily');

  const entries = useMemo(() => leaderboardData[period], [period]);
  const topThree = useMemo(() => [entries[1], entries[0], entries[2]], [entries]);
  const rest = useMemo(() => entries.slice(3), [entries]);

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
                period === item.value
                  ? 'bg-[#3793F6] text-white'
                  : 'text-[#5c6f87]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mb-8 flex items-end justify-between">
          {topThree.map((player, i) => (
            <div key={player.id} className="flex w-[31%] flex-col items-center text-center">
              <Avatar
                src={player.avatar}
                alt={player.name}
                className={`rounded-full border-4 border-[#3793F6] object-cover ${
                  i === 1 ? 'h-24 w-24' : 'h-16 w-16'
                }`}
              />
              <p className="mt-2 line-clamp-2 text-sm font-bold">{player.name}</p>
              <p className="text-xs text-[#6b7f99]">{player.reports} Reports</p>
              <p className="text-sm font-semibold text-[#3793F6]">{player.points} pts</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {rest.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-xl bg-[#4EA1F3] px-4 py-3 text-white"
            >
              <span className="w-8 text-left font-bold">{index + 4}</span>

              <div className="mx-3 flex min-w-0 flex-1 items-center gap-3">
                <Avatar
                  src={player.avatar}
                  alt={player.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{player.name}</p>
                  <p className="text-xs opacity-80">{player.reports} Reports</p>
                </div>
              </div>

              <span className="whitespace-nowrap font-semibold">{player.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;