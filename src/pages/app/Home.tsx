import { useNavigate } from 'react-router-dom';
import { useStore } from '../../utils/store';
import {
  MdLocalFireDepartment,
  MdEmojiEvents,
  MdSecurity,
} from 'react-icons/md';
import { FaAward } from 'react-icons/fa';

const Home = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  const firstName = user.username ? user.username.split(' ')[0] : 'John';

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent">
      {/* Glow Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[#00C2FF]/12 blur-3xl" />
        <div className="absolute -left-16 top-24 h-[220px] w-[220px] rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="absolute bottom-24 right-[-40px] h-[220px] w-[220px] rounded-full bg-[#06B6D4]/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col gap-6 overflow-y-auto px-6 pb-24 pt-10 scrollbar-hide">
        
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/40">
              Community Safety
            </p>
            <h1 className="mt-1 text-[24px] font-black uppercase italic tracking-tight text-white">
              CARAPP
            </h1>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <MdEmojiEvents size={18} className="text-yellow-400" />
            <span className="text-[13px] font-black text-white">
              {user.coins.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Greeting */}
        <div className="px-1">
          <p className="text-[17px] font-bold text-white">
            Hi, {firstName}! Ready to help? 👋
          </p>
          <p className="mt-1 text-[12px] font-semibold text-white/60">
            Track activity, earn badges, and protect the community.
          </p>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#00C2FF] via-[#14B8FF] to-[#008FEA] p-6 text-white shadow-[0_20px_50px_rgba(0,194,255,0.35)]">
            <div className="absolute -right-3 -top-3 opacity-20">
              <MdLocalFireDepartment size={68} />
            </div>

            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
              Current Streak
            </p>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-4xl font-black">{user.streak}</span>
              <span className="text-sm font-bold opacity-90">Days</span>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
              Reports
            </p>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-4xl font-black text-white">
                {user.totalIncidentsReported}
              </span>

              <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-300">
                <MdSecurity size={18} />
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="px-1">
          <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.15em] text-white/50">
            My Badges
          </label>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {user.badges.map((badge, idx) => (
              <div
                key={idx}
                className="flex min-w-[96px] flex-col items-center gap-2 rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/10 text-blue-300">
                  <FaAward size={22} />
                </div>

                <span className="text-center text-[9px] font-black uppercase text-white/70">
                  {badge}
                </span>
              </div>
            ))}

            {user.badges.length === 0 && (
              <div className="flex flex-1 items-center justify-center py-6 text-sm italic font-bold text-white/30">
                No badges yet
              </div>
            )}
          </div>
        </section>

        {/* Leaderboard */}
        <section>
          <div className="mb-4 flex items-center justify-between px-1">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-white/50">
              Weekly Leaderboard
            </label>

            <button
              onClick={() => navigate('/app/leaderboard')}
              className="text-[10px] font-black uppercase tracking-widest text-[#62D8FF]"
            >
              View All
            </button>
          </div>

          <div
            className="cursor-pointer rounded-[32px] border border-white/10 bg-white/5 p-2 backdrop-blur-xl transition-all hover:bg-white/10"
            onClick={() => navigate('/app/leaderboard')}
          >
            <ActivityItem
              icon={<span className="text-xs font-black">#1</span>}
              iconClass="bg-yellow-300/10 text-yellow-300"
              title="Road Warrior"
              subtitle="2,450 Coins this week"
              time="🔥"
            />

            <ActivityItem
              icon={<span className="text-xs font-black">#2</span>}
              iconClass="bg-white/10 text-white/70"
              title="Safe Driver"
              subtitle="1,920 Coins this week"
              time=""
            />

            <div className="mt-1 border-t border-white/10 p-3 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#62D8FF]">
                Open Full Leaderboard
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ActivityItem = ({ icon, iconClass, title, subtitle, time }: any) => (
  <div className="flex items-center gap-4 p-4 hover:bg-white/5">
    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconClass}`}>
      {icon}
    </div>

    <div className="flex-1">
      <h3 className="text-sm font-black text-white">{title}</h3>
      <p className="text-[12px] text-white/60">{subtitle}</p>
    </div>

    <div className="text-[11px] text-white/40">{time}</div>
  </div>
);

export default Home;