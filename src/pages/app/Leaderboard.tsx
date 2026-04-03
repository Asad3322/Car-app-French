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
    <div className="relative flex h-full flex-col bg-charcoal px-6 pt-10 pb-10 text-white">
      
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="
            flex h-11 w-11 items-center justify-center
            rounded-full bg-white/5 border border-white/10
            backdrop-blur-md
            shadow-[0_6px_18px_rgba(0,0,0,0.3)]
            active:scale-95 transition
          "
        >
          <HiArrowLeft size={20} className="text-white" />
        </button>

        <h1 className="flex items-center gap-2 text-lg font-black uppercase tracking-tight text-white">
          <MdEmojiEvents size={20} className="text-[#62D8FF]" />
          Leaderboard
        </h1>

        <div className="w-11"></div>
      </header>

      <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">

        {/* My Stats Card */}
        {currentUserEntry && (
          <section className="
            relative mb-8 overflow-hidden
            rounded-[36px] p-6
            bg-white/5 backdrop-blur-xl
            border border-white/10
            shadow-[0_20px_60px_rgba(0,0,0,0.5)]
          ">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#62D8FF]/10" />

            <div className="relative z-10 flex flex-col gap-6">
              
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#62D8FF]/20 text-[#62D8FF] font-black border border-[#62D8FF]/30">
                    {user.username.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-white">
                      {user.username}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                      Global Ranking
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-2xl bg-yellow-400/20 px-3 py-1.5 text-yellow-300 border border-yellow-300/30">
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
                  <span className="text-[9px] uppercase tracking-widest text-white/50">
                    Rank
                  </span>
                  <span className="text-2xl tracking-tight text-white">
                    #{currentUserEntry.rank}
                  </span>
                </div>

                {/* Coins */}
                <div className="flex flex-col gap-1 border-x border-white/10 px-3 font-black">
                  <span className="text-[9px] uppercase tracking-widest text-white/50">
                    Coins
                  </span>
                  <div className="flex items-center gap-1.5">
                    <MdWorkspacePremium className="text-yellow-400" size={18} />
                    <span className="text-2xl tracking-tight text-white">
                      {currentUserEntry.coins.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Streak */}
                <div className="flex flex-col gap-1 font-black">
                  <span className="text-[9px] uppercase tracking-widest text-white/50">
                    Streak
                  </span>
                  <div className="flex items-center gap-1.5">
                    <MdLocalFireDepartment size={18} className="text-orange-400" />
                    <span className="text-2xl tracking-tight text-white">
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
                  ? 'bg-[#62D8FF]/10 border-[#62D8FF]/30'
                  : 'bg-white/5 border-white/10'
              } backdrop-blur-md`}
            >
              {/* Rank */}
              <div className="flex w-10 items-center justify-center">
                {item.rank === 1 ? (
                  <FaCrown size={26} className="text-yellow-400" />
                ) : item.rank === 2 ? (
                  <FaMedal size={24} className="text-slate-300" />
                ) : item.rank === 3 ? (
                  <FaMedal size={24} className="text-orange-400" />
                ) : (
                  <span className="text-[14px] font-black text-white/40">
                    #{item.rank}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-[20px] font-black text-lg border-2 ${
                  item.isCurrentUser
                    ? 'bg-[#62D8FF] text-black border-white shadow-md'
                    : 'bg-white/10 text-white/70 border-white/10'
                }`}
              >
                {item.username.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className={`truncate text-[15px] font-black ${
                      item.isCurrentUser ? 'text-[#62D8FF]' : 'text-white'
                    }`}
                  >
                    {item.username}
                  </h3>

                  {item.isCurrentUser && (
                    <span className="rounded-full bg-[#62D8FF] px-2 py-0.5 text-[8px] font-black uppercase text-black">
                      Me
                    </span>
                  )}
                </div>
              </div>

              {/* Coins */}
              <div className="text-right">
                <div
                  className={`text-[15px] font-black ${
                    item.isCurrentUser ? 'text-[#62D8FF]' : 'text-white'
                  }`}
                >
                  {item.coins.toLocaleString()}
                </div>
                <div className="text-[9px] font-black uppercase text-white/50">
                  PTS
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-white/40 opacity-60">
          Updated every hour
        </p>

      </div>
    </div>
  );
};

export default Leaderboard;