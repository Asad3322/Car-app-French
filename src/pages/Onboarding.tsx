import { Link } from 'react-router-dom';

const Onboarding = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,#18345a_0%,#111c3e_35%,#0b1227_100%)] px-4">
      
      <div className="w-full max-w-[390px] min-h-[844px] rounded-[36px] bg-[#1a2147] border border-white/10 shadow-2xl flex flex-col px-6 py-10 text-white">
        
        {/* Logo */}
        <div className="flex flex-col items-center mt-10">
          <div className="w-20 h-20 bg-[#19cfd0] rounded-2xl flex items-center justify-center mb-8 shadow-lg">
            <span className="text-3xl">🚗</span>
          </div>

          <h1 className="text-[48px] font-extrabold tracking-tight mb-3">
            CARAPP
          </h1>

          <p className="text-center text-sm text-white/70 max-w-[280px] leading-relaxed">
            Help your community — report vehicle incidents instantly, no account needed.
          </p>
        </div>

        <div className="flex-1" />

        {/* Buttons */}
        <div className="flex flex-col gap-4 mb-6">
          <Link
            to="/app/reports"
            className="h-[56px] bg-[#19cfd0] rounded-xl flex items-center justify-center font-semibold text-sm active:scale-[0.98]"
          >
            🚨 Report an Incident
          </Link>

          <Link
            to="/vehicle/add-onboarding"
            className="h-[56px] border border-white/20 rounded-xl flex items-center justify-center font-semibold text-sm hover:bg-white/5 active:scale-[0.98]"
          >
            🚓 Register my Vehicle
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center">
          <a href="mailto:support@carapp.com" className="text-xs text-[#19cfd0] underline">
            Contact Support Team
          </a>
        </div>

      </div>
    </div>
  );
};

export default Onboarding;