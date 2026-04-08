import { useNavigate } from 'react-router-dom';
import { useStore } from '../../utils/store';
import {
  MdLocalFireDepartment,
  MdVerifiedUser,
  MdAdd,
  MdNotifications,
} from 'react-icons/md';

const Home = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  const firstName = user.username ? user.username.split(' ')[0] : 'Driver';
  const streak = user.streak ?? 12;
  const reportsMade = user.totalIncidentsReported ?? 48;
  const coins = user.coins ?? 840;
  const avatar =
    user.profileImage || 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=A';

  const leaders = [
    {
      name: 'RoadWarrior_88',
      role: 'Community Hero',
      reports: 42,
      points: 2450,
      highlight: false,
    },
    {
      name: 'SarahDash',
      role: 'Top Contributor',
      reports: 35,
      points: 1920,
      highlight: false,
    },
    {
      name: `${firstName} (You)`,
      role: 'Climbing fast!',
      reports: 12,
      points: coins,
      highlight: true,
    },
  ];

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-[#F3F7FB]">
      <div className="mx-auto flex min-h-full w-full max-w-[430px] flex-col px-4 pb-28 pt-5 sm:px-5 sm:pt-6">
        {/* Header */}
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
                Community Safety
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

        {/* Greeting */}
        <div className="mt-5">
          <h2 className="break-words text-[24px] font-black leading-[1.05] text-[#0D1633] sm:text-[27px]">
            Hi, {firstName}! 👋
          </h2>
          <p className="mt-1.5 text-[14px] font-medium leading-6 text-[#51627D]">
            Ready to help the community today?
          </p>
        </div>

        {/* Hero Card */}
        <div className="mt-5 overflow-hidden rounded-[26px] border border-[#97C9FF] bg-gradient-to-br from-[#58A9FF] via-[#4DA3FF] to-[#4297F3] p-4 shadow-[0_18px_38px_rgba(77,163,255,0.20)] sm:rounded-[28px] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-white/90">
                Current Streak
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-[38px] font-black leading-none text-white sm:text-[44px]">
                  {streak}
                </span>
                <span className="pb-1 text-[14px] font-bold uppercase text-white/95 sm:text-[15px]">
                  Days
                </span>
              </div>

              <p className="mt-2 max-w-[210px] text-[12px] leading-5 text-white/90 sm:max-w-[230px]">
                You&apos;re doing amazing. Keep reporting and protecting.
              </p>
            </div>

            <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/10 sm:h-[74px] sm:w-[74px]">
              <MdLocalFireDepartment size={36} className="text-white sm:text-[40px]" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-[22px] border border-[#A7D0FF] bg-[#4DA3FF] p-4 shadow-[0_14px_28px_rgba(77,163,255,0.18)]">
            <p className="text-[11px] font-black uppercase tracking-[0.1em] text-white/90">
              Reports Made
            </p>

            <div className="mt-4 flex items-center justify-center">
              <span className="text-[40px] font-black leading-none text-white sm:text-[46px]">
                {reportsMade}
              </span>
            </div>

            <p className="mt-2 text-center text-[11px] leading-5 text-white/80">
              Total verified reports
            </p>
          </div>

          <div className="rounded-[22px] border border-[#A7D0FF] bg-[#4DA3FF] p-4 shadow-[0_14px_28px_rgba(77,163,255,0.18)]">
            <p className="text-[11px] font-black uppercase tracking-[0.1em] text-white/90">
              Badge
            </p>

            <div className="mt-4 flex flex-col items-center justify-center">
              <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-white/12 sm:h-[56px] sm:w-[56px]">
                <MdVerifiedUser size={28} className="text-white sm:text-[30px]" />
              </div>

              <p className="mt-3 text-center text-[11px] font-black uppercase leading-4 tracking-[0.04em] text-white">
                Community Hero
              </p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mt-7 flex items-center justify-between gap-3">
          <p className="text-[12px] font-black uppercase tracking-[0.08em] text-[#95A1B4]">
            Weekly Leaderboard
          </p>

          <button
            type="button"
            onClick={() => navigate('/app/leaderboard')}
            className="shrink-0 text-[13px] font-black text-[#459DFF] transition-opacity hover:opacity-80"
          >
            View All
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {leaders.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => navigate('/app/leaderboard')}
              className={`w-full rounded-[20px] p-4 text-left transition-all duration-300 hover:translate-y-[-1px] ${
                item.highlight
                  ? 'border-2 border-[#4098FF] bg-[#EAF3FF] shadow-[0_12px_24px_rgba(64,152,255,0.10)]'
                  : 'border border-[#D2DEEF] bg-[#E1EAF6] shadow-[0_10px_20px_rgba(15,23,42,0.04)]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[15px] font-black leading-tight text-[#111A34] sm:text-[16px]">
                    {item.name}
                  </h3>

                  <p
                    className={`mt-1 text-[13px] font-semibold ${
                      item.highlight ? 'text-[#3F98FF]' : 'text-[#4B5C76]'
                    }`}
                  >
                    {item.role}
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-[#6C7A92]">
                    {item.reports} Reports
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[15px] text-[#D18B4A]">◉</span>
                  <p className="text-[15px] font-black text-[#4A9CFF] sm:text-[16px]">
                    {item.points}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => navigate('/app/reports')}
          className="mt-6 flex h-[68px] items-center justify-center gap-3 rounded-[24px] border-2 border-[#E0AA00] bg-[#F6F1DF] text-[#E0AA00] shadow-[0_14px_28px_rgba(224,170,0,0.12)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_18px_34px_rgba(224,170,0,0.16)] active:scale-[0.99] sm:h-[72px] sm:rounded-[26px]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E0AA00] text-white shadow-sm">
            <MdAdd size={19} />
          </div>

          <span className="text-[15px] font-black uppercase tracking-[0.04em] sm:text-[16px]">
            New Report
          </span>
        </button>
      </div>
    </div>
  );
};

export default Home;