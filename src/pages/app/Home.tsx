import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../utils/store';
import {
  MdLocalFireDepartment,
  MdEmojiEvents,
  MdSecurity,
} from 'react-icons/md';
import { FaAward } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';

const Home = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  const firstName = user.username ? user.username.split(' ')[0] : 'John';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#EEF3F8]">
      <div className="flex min-h-screen flex-col gap-6 overflow-y-auto px-6 pb-24 pt-10 scrollbar-hide">
        {/* Top Header */}
        <div className="flex items-center justify-between px-1">
          <h1 className="text-[24px] font-black uppercase italic tracking-tight text-appText">
            CARAPP
          </h1>

          <div className="flex items-center gap-2 rounded-2xl border border-appBorder bg-appSurface px-3 py-2 text-orange-500 shadow-sm">
            <MdEmojiEvents size={18} className="text-orange-500" />
            <span className="text-[13px] font-black">
              {user.coins.toLocaleString()}
            </span>
          </div>
        </div>

        <p className="-mt-2 px-1 text-[17px] font-bold text-appTextSecondary">
          Hi, {firstName}! Ready to help? 👋
        </p>

        {/* Hero Stats Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-600 to-blue-500 p-6 text-white shadow-waze">
            <div className="absolute -right-2 -top-2 opacity-20">
              <MdLocalFireDepartment size={62} />
            </div>

            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Current Streak
            </p>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-4xl font-black">{user.streak}</span>
              <span className="text-sm font-bold opacity-80">Days</span>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[32px] border border-appBorder bg-appSurface p-6 shadow-waze">
            <p className="text-[10px] font-black uppercase tracking-widest text-appTextSecondary">
              Reports
            </p>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-4xl font-black text-appText">
                {user.totalIncidentsReported}
              </span>

              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-500">
                <MdSecurity size={18} />
              </div>
            </div>
          </div>
        </section>

        {/* Badge Section */}
        <section className="px-1">
          <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.15em] text-appTextSecondary">
            My Badges
          </label>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {user.badges.map((badge, idx) => (
              <div
                key={idx}
                className="flex min-w-[90px] flex-col items-center gap-2 rounded-[28px] border border-appBorder bg-appSurface p-4 shadow-waze"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <FaAward size={22} />
                </div>

                <span className="text-center text-[9px] font-black uppercase tracking-tight text-appTextSecondary">
                  {badge}
                </span>
              </div>
            ))}

            {user.badges.length === 0 && (
              <div className="flex flex-1 items-center justify-center py-6 text-sm italic font-bold text-appTextSecondary/30">
                No badges yet
              </div>
            )}
          </div>
        </section>

        {/* Leaderboard Preview */}
        <section>
          <div className="mb-4 flex items-center justify-between px-1">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-appTextSecondary">
              Weekly Leaderboard
            </label>

            <button
              onClick={() => navigate('/app/leaderboard')}
              className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div
            className="cursor-pointer rounded-[32px] border border-appBorder bg-appSurface p-2 shadow-waze transition-all hover:shadow-md active:scale-[0.99]"
            onClick={() => navigate('/app/leaderboard')}
          >
            <ActivityItem
              icon={<span className="text-xs font-black">#1</span>}
              iconClass="bg-amber-100 text-amber-600"
              title="Road Warrior"
              subtitle="2,450 Coins this week"
              time="🔥"
            />

            <ActivityItem
              icon={<span className="text-xs font-black">#2</span>}
              iconClass="bg-appBg text-appTextSecondary"
              title="Safe Driver"
              subtitle="1,920 Coins this week"
              time=""
            />

            <div className="mt-1 border-t border-appBorder p-3 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                Open Full Leaderboard
              </span>
            </div>
          </div>
        </section>

        {/* Primary CTA */}
        <section className="mt-4">
          <button
            onClick={() => navigate('/app/reports')}
            className="waze-btn-primary flex h-[80px] w-full items-center justify-between rounded-[32px] px-8 text-lg shadow-xl shadow-blue-500/20"
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-black tracking-tight">Report now!</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none">
                Protect the community
              </span>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <FiPlus size={24} className="text-white" />
            </div>
          </button>
        </section>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  subtitle: string;
  time: string;
}

const ActivityItem = ({
  icon,
  iconClass,
  title,
  subtitle,
  time,
}: ActivityItemProps) => (
  <div className="flex items-center gap-4 p-4 transition-colors hover:bg-appBg first:rounded-t-[28px]">
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm ${iconClass}`}
    >
      {icon}
    </div>

    <div className="min-w-0 flex-1">
      <h3 className="truncate text-sm font-black text-appText">{title}</h3>
      <p className="mt-0.5 truncate text-[12px] font-bold text-appTextSecondary">
        {subtitle}
      </p>
    </div>

    <div className="shrink-0 text-[11px] font-bold text-appTextSecondary/40">
      {time}
    </div>
  </div>
);

export default Home;