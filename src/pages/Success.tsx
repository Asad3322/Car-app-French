import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, CheckCircle2, Star } from 'lucide-react';

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
    <div className="flex h-full flex-col items-center bg-appBg px-8 text-center sm:rounded-[40px] relative">
      <div className="flex-1 flex flex-col items-center justify-center -mt-16">
        <div className="mb-4 flex flex-col items-center">
          <div className="flex items-center gap-1.5 bg-amber-100 text-amber-600 px-4 py-2 rounded-full border border-amber-200 shadow-sm animate-bounce">
            <Star size={16} fill="currentColor" />
            <span className="text-[15px] font-black italic">500 CARAPP Coins</span>
          </div>
          <p className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Reward</p>
        </div>
        {/* Success Decoration */}
        <div className="relative mb-10">
          <div className="absolute inset-0 m-auto h-32 w-32 animate-pulse rounded-full bg-emerald-100 blur-[40px]"></div>
          
          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[32px] bg-emerald-500 text-white shadow-lg transition-transform hover:rotate-6">
            <CheckCircle2 size={48} strokeWidth={3} />
            <Star size={18} className="absolute -top-3 -right-3 text-amber-400 fill-amber-300 animate-bounce" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-[32px] font-black leading-tight tracking-tight text-appText">
          Thank You
        </h1>
        <p className="mt-4 px-2 text-[16px] font-bold leading-relaxed text-appTextSecondary max-w-[280px]">
          Your report is live! The community is safer because of you.
        </p>

        {/* Reward Card Section */}
        <div className="mt-12 w-full max-w-[320px]">
          <div className="relative overflow-hidden rounded-[40px] border border-appBorder bg-appSurface p-8 shadow-waze">
            <div className="absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-blue-50 opacity-50" />
            <div className="relative">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px] bg-blue-50 text-blue-600">
                <Gift size={32} />
              </div>
              <h2 className="text-xl font-black text-appText">Claim Your Reward</h2>
              <p className="mt-3 text-[13px] font-bold text-appTextSecondary leading-relaxed px-1">
                Create an account now to claim your <span className="text-emerald-500 font-black">+500 Coins</span> and <span className="text-indigo-600 font-black">Safety Badge</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Persistence/Action Footer */}
      <div className="mt-auto mb-10 flex w-full flex-col gap-3 max-w-[320px]">
        <button 
          onClick={handleClaim}
          disabled={isSubmitting}
          className="waze-btn-primary h-[68px] text-[15px] shadow-lg flex flex-col items-center justify-center leading-tight disabled:grayscale opacity-90"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="font-black">Create my account</span>
              <span className="text-[10px] opacity-80 font-bold uppercase tracking-widest">And claim my reward</span>
            </>
          )}
        </button>
        
        <Link 
          to="/" 
          className="waze-btn-tertiary h-12 flex items-center justify-center text-slate-400 hover:text-slate-600 font-black uppercase text-[11px] tracking-[0.1em]"
        >
          No, I don't want to claim my reward
        </Link>

        <a 
          href="mailto:support@carapp.com" 
          className="mt-4 text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-blue-500 transition-colors"
        >
          Contact Support Team
        </a>
      </div>
    </div>
  );
};

export default Success;
