import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Gift, CheckCircle2, Trophy, Flame } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);

  useEffect(() => {
    if (location.state?.gamification) {
      setRewardData(location.state.gamification);

      localStorage.setItem(
        "lastGamificationReward",
        JSON.stringify(location.state.gamification),
      );
    } else {
      const stored = localStorage.getItem("lastGamificationReward");
      if (stored) {
        setRewardData(JSON.parse(stored));
      }
    }
  }, [location.state]);

  const reward = rewardData?.reward || "+10 Coins";
  const points = rewardData?.points ?? 10;
  const badge = rewardData?.badge || "Rookie Reporter";
  const streak = rewardData?.streak ?? 1;

  const handleClaim = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    localStorage.removeItem("authFlow");
    localStorage.removeItem("redirectAfterAuth");
    localStorage.removeItem("pendingAuthRole");
    localStorage.removeItem("afterMagicLinkRedirect");
    localStorage.removeItem("afterMagicLinkFilter");

    localStorage.setItem("fromReportFlow", "true");

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/auth?role=reporter&from=report');
    }, 1200);
  };

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#EEF3F8] px-6 pt-8 text-center sm:rounded-[40px]">
      <div className="pointer-events-none absolute left-1/2 top-20 h-52 w-52 -translate-x-1/2 rounded-full bg-[#5BA3F0]/20 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/70 blur-[130px]" />

      <div className="relative flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center py-6">
          <div className="relative mb-8 flex items-center justify-center">
            <div className="absolute h-28 w-28 rounded-full bg-emerald-400/20 blur-[60px]" />
            <CheckCircle2
              size={64}
              strokeWidth={2.8}
              className="relative z-10 text-emerald-500"
            />
          </div>

          <h1 className="text-[34px] font-black text-[#1F2A37]">Thank You!</h1>

          <p className="mt-4 max-w-[320px] text-[15px] font-bold text-[#6B7A90]">
            🎉 You just earned <span className="text-[#F4B400]">{reward}</span>.
            Your report is making a difference.
          </p>

          <div className="mt-10 w-full max-w-[320px]">
            <div className="rounded-[32px] border border-[#D9E5F1] bg-white px-6 py-7 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#5BA3F0] to-[#4A90E2] text-white">
                  <Gift size={30} />
                </div>

                <h2 className="text-[22px] font-black text-[#1F2A37]">
                  Your Reward
                </h2>

                <div className="mt-5 grid w-full grid-cols-3 gap-3">
                  <div className="rounded-[18px] border bg-[#F8FBFF] p-3">
                    <p className="text-[18px] font-black text-[#F4B400]">
                      {points}
                    </p>
                    <p className="text-[9px] uppercase text-[#9AA8BC]">
                      Points
                    </p>
                  </div>

                  <div className="rounded-[18px] border bg-[#F8FBFF] p-3">
                    <Flame className="mx-auto text-orange-500" />
                    <p className="text-[9px] uppercase text-[#9AA8BC]">
                      {streak} Day
                    </p>
                  </div>

                  <div className="rounded-[18px] border bg-[#F8FBFF] p-3">
                    <Trophy className="mx-auto text-[#4A90E2]" />
                    <p className="text-[9px] uppercase text-[#9AA8BC]">Badge</p>
                  </div>
                </div>

                <p className="mt-4 bg-[#EEF6FF] px-4 py-2 text-[11px] font-black text-[#4A90E2] rounded-full">
                  {badge}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-8">
          <div className="mx-auto w-full max-w-[320px] flex flex-col gap-3">
            <button
              onClick={handleClaim}
              disabled={isSubmitting}
              className="h-[66px] rounded-[22px] bg-[#F4B400] text-white"
            >
              {isSubmitting ? "Loading..." : "Claim Reward"}
            </button>

            <Link
              to="/"
              className="h-12 flex items-center justify-center border rounded-[18px]"
            >
              Skip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;