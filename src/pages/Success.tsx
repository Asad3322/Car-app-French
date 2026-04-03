import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, CheckCircle2 } from 'lucide-react';

const Success = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClaim = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/auth?role=reporter');
    }, 1200);
  };

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#081120] px-6 pt-8 text-center sm:rounded-[40px]">
      
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-52 w-52 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="relative flex flex-1 flex-col">
        
        {/* Main Content */}
        <div className="flex flex-1 flex-col items-center justify-center py-6">
          
          {/* ✅ CLEAN SUCCESS ICON (NO CIRCLE) */}
          <div className="relative mb-8 flex items-center justify-center">
            {/* soft glow */}
            <div className="absolute h-28 w-28 rounded-full bg-emerald-500/20 blur-[60px]" />

            {/* tick only */}
            <CheckCircle2
              size={64}
              strokeWidth={2.8}
              className="relative z-10 text-emerald-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.5)]"
            />
          </div>

          {/* Title */}
          <h1 className="bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-[34px] font-black leading-none tracking-tight text-transparent">
            Thank You
          </h1>

          {/* Message */}
          <p className="mt-4 max-w-[290px] text-[15px] font-bold leading-7 text-slate-300">
            Your report is live. The community is safer because of you.
          </p>

          {/* Card */}
          <div className="mt-10 w-full max-w-[320px]">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />
              <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />

              <div className="relative flex flex-col items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-[0_12px_30px_rgba(59,130,246,0.35)]">
                  <Gift size={30} />
                </div>

                <h2 className="text-[22px] font-black text-white">
                  Continue Your Journey
                </h2>

                <p className="mt-3 max-w-[250px] text-[13px] font-bold leading-6 text-slate-300">
                  Create an account to track your reports, manage your vehicles, and stay connected.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-8">
          <div className="mx-auto flex w-full max-w-[320px] flex-col gap-3">
            
            <button
              onClick={handleClaim}
              disabled={isSubmitting}
              className="flex h-[66px] w-full flex-col items-center justify-center rounded-[22px] bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 text-white shadow-[0_18px_40px_rgba(34,211,238,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(34,211,238,0.38)] disabled:cursor-not-allowed disabled:opacity-80 disabled:grayscale"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span className="text-[15px] font-black">Create my account</span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] opacity-85">
                    Continue setup
                  </span>
                </>
              )}
            </button>

            <Link
              to="/"
              className="flex h-12 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.04] text-[11px] font-black uppercase tracking-[0.12em] text-slate-300 transition-all duration-300 hover:bg-white/[0.08] hover:text-white"
            >
              Skip for now
            </Link>

            <a
              href="mailto:support@carapp.com"
              className="pt-2 text-center text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-cyan-400"
            >
              Contact Support Team
            </a>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;