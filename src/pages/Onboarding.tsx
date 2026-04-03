import { Link } from 'react-router-dom';
import { MdOutlineDirectionsCarFilled } from 'react-icons/md';

const Onboarding = () => {
  return (
    <div className="min-h-screen w-full bg-[#020B16] text-white flex justify-center items-center">
      <div className="relative w-full max-w-[390px] min-h-screen sm:min-h-[844px] bg-[#07111F] sm:rounded-[36px] sm:border sm:border-white/10 sm:shadow-[0_25px_70px_rgba(0,0,0,0.55)] overflow-hidden flex flex-col px-6 py-10">

        {/* background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(98,216,255,0.15),_transparent_30%)]" />
        <div className="pointer-events-none absolute left-1/2 top-16 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-[#62D8FF]/10 blur-3xl" />

        {/* content */}
        <div className="relative z-10 flex flex-col items-center text-center flex-1">

          {/* icon */}
          <div className="relative mb-6 flex h-[140px] w-[140px] items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#62D8FF]/10 blur-2xl" />
            <div className="absolute inset-[14px] rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl" />

            <div className="relative z-10 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-[#62D8FF]/10 text-[#8DEBFF] shadow-[0_0_25px_rgba(98,216,255,0.25)] animate-carFloat">
              <MdOutlineDirectionsCarFilled size={32} />
            </div>
          </div>

          {/* badge */}
          <div className="inline-flex items-center rounded-full border border-[#62D8FF]/20 bg-[#0E2033]/70 px-4 py-1.5 backdrop-blur-xl mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7AE7FF]">
              Community Safety
            </span>
          </div>

          {/* title */}
          <h1 className="text-[42px] font-black italic tracking-tight text-[#62D8FF] drop-shadow-[0_0_20px_rgba(98,216,255,0.2)]">
            CARAPP
          </h1>

          {/* short text */}
          <p className="mt-4 max-w-[260px] text-[16px] font-semibold leading-7 text-white/90">
            Report incidents and protect your vehicle.
          </p>

          {/* push buttons down */}
          <div className="flex-1" />

          {/* buttons (NO BOX) */}
          <div className="w-full flex flex-col gap-4">

            <Link
              to="/app/reports"
              className="group relative flex h-[56px] items-center justify-center rounded-full bg-gradient-to-r from-[#7AE7FF] via-[#62D8FF] to-[#22C7F3] text-[15px] font-black text-[#062C3D] shadow-[0_12px_30px_rgba(98,216,255,0.30)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.25),transparent)] opacity-0 group-hover:opacity-100 transition" />
              <span className="relative z-10">Report Incident</span>
            </Link>

            <Link
              to="/vehicle/add-onboarding"
              className="flex h-[56px] items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[15px] font-black text-[#62D8FF] backdrop-blur-xl shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-[1.01] hover:bg-white/[0.08]"
            >
              Register Vehicle
            </Link>

          </div>

          {/* support */}
          <div className="mt-6 text-[12px] font-bold uppercase tracking-[0.08em] text-[#62D8FF]">
            Contact Support
          </div>
        </div>
      </div>

      {/* animation */}
      <style>
        {`
          @keyframes carFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }

          .animate-carFloat {
            animation: carFloat 4s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Onboarding;