import { useNavigate } from 'react-router-dom';
import { useStore } from '../../utils/store';
import { HiArrowLeft } from 'react-icons/hi';
import {
  MdEmojiEvents,
  MdLocalFireDepartment,
  MdWorkspacePremium,
} from 'react-icons/md';
import { FaCrown, FaMedal } from 'react-icons/fa';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user, leaderboard } = useStore();

  const sortedLeaderboard = [...leaderboard].sort((a, b) => a.rank - b.rank);
  const currentUserEntry = sortedLeaderboard.find(e => e.isCurrentUser);

  return (
    <div className="relative flex h-full flex-col bg-[#EEF3F8] px-6 pt-10 pb-10">
      
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="
            flex h-11 w-11 items-center justify-center
            rounded-full bg-white border border-slate-200
            shadow-[0_6px_18px_rgba(0,0,0,0.08)]
            active:scale-95 transition
          "
        >
          <HiArrowLeft size={20} className="text-slate-800" />
        </button>

        <h1 className="flex items-center gap-2 text-lg font-black uppercase tracking-tight text-slate-900">
          <MdEmojiEvents size={20} className="text-amber-500" />
          Leaderboard
        </h1>

        <div className="w-11"></div>
      </header>

      <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">

        {/* My Stats Card */}
        {currentUserEntry && (
          <section className="
            relative mb-8 overflow-hidden
            rounded-[36px] bg-white p-6
            shadow-[0_12px_40px_rgba(0,0,0,0.08)]
            border border-slate-100
          ">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-blue-50/50" />

            <div className="relative z-10 flex flex-col gap-6">
              
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-black border border-blue-100">
                    {user.username.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      {user.username}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Global Ranking
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-2xl bg-amber-100 px-3 py-1.5 text-amber-600 border border-amber-200">
                  <FaMedal size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Platinum
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">

                {/* Rank */}
                <div className="flex flex-col gap-1 font-black">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400">
                    Rank
                  </span>
                  <span className="text-2xl tracking-tight text-slate-900">
                    #{currentUserEntry.rank}
                  </span>
                </div>

                {/* Coins */}
                <div className="flex flex-col gap-1 border-x border-slate-100 px-3 font-black">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400">
                    Coins
                  </span>
                  <div className="flex items-center gap-1.5">
                    <MdWorkspacePremium className="text-amber-500" size={18} />
                    <span className="text-2xl tracking-tight text-slate-900">
                      {currentUserEntry.coins.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Streak */}
                <div className="flex flex-col gap-1 font-black">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400">
                    Streak
                  </span>
                  <div className="flex items-center gap-1.5">
                    <MdLocalFireDepartment size={18} className="text-orange-500" />
                    <span className="text-2xl tracking-tight text-slate-900">
                      {user.streak}d
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* Ranking List */}
        <div className="flex flex-col gap-3">
          {sortedLeaderboard.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-5 rounded-[24px] border transition active:scale-[0.98] ${
                item.isCurrentUser
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Rank */}
              <div className="flex w-10 items-center justify-center">
                {item.rank === 1 ? (
                  <FaCrown size={26} className="text-amber-500" />
                ) : item.rank === 2 ? (
                  <FaMedal size={24} className="text-slate-400" />
                ) : item.rank === 3 ? (
                  <FaMedal size={24} className="text-amber-600" />
                ) : (
                  <span className="text-[14px] font-black text-slate-300">
                    #{item.rank}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-[20px] font-black text-lg border-2 ${
                  item.isCurrentUser
                    ? 'bg-blue-600 text-white border-white shadow-md'
                    : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}
              >
                {item.username.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className={`truncate text-[15px] font-black ${
                      item.isCurrentUser ? 'text-blue-600' : 'text-slate-900'
                    }`}
                  >
                    {item.username}
                  </h3>

                  {item.isCurrentUser && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[8px] font-black uppercase text-white">
                      Me
                    </span>
                  )}
                </div>
              </div>

              {/* Coins */}
              <div className="text-right">
                <div
                  className={`text-[15px] font-black ${
                    item.isCurrentUser ? 'text-blue-600' : 'text-slate-900'
                  }`}
                >
                  {item.coins.toLocaleString()}
                </div>
                <div className="text-[9px] font-black uppercase text-slate-400">
                  PTS
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">
          Updated every hour
        </p>

      </div>
    </div>
  );
};

export default Leaderboard;