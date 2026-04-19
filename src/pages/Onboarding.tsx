import { Link } from "react-router-dom";
import { MdOutlineDirectionsCarFilled } from "react-icons/md";

const Onboarding = () => {
  return (
    <div className="min-h-screen w-full bg-white flex justify-center items-center sm:px-6 sm:py-6">
      <div className="relative w-full max-w-[420px] min-h-screen sm:min-h-[844px] bg-[#EEF3F8] sm:rounded-[40px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-gray-200">
        {/* subtle background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(91,163,240,0.18),_transparent_35%)]" />

        <div className="relative z-10 flex flex-col min-h-screen sm:min-h-[844px] px-6 py-10">
          {/* top bar */}
          <div className="mx-auto mb-8 h-1.5 w-16 rounded-full bg-[#D6E1EC]" />

          {/* icon */}
          <div className="relative mx-auto mb-8 flex h-[150px] w-[150px] items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#5BA3F0]/20 blur-3xl" />
            <div className="absolute inset-[12px] rounded-[36px] bg-white/80 backdrop-blur-xl border border-[#D8E5F2]" />

            <div className="relative z-10 flex h-[80px] w-[80px] items-center justify-center rounded-[26px] bg-gradient-to-br from-[#5BA3F0] to-[#4A90E2] text-white shadow-lg animate-carFloat">
              <MdOutlineDirectionsCarFilled size={38} />
            </div>
          </div>

          {/* title */}
          <div className="text-center">
            <h1 className="text-[42px] font-black tracking-tight text-[#12304D]">
              CARAPP
            </h1>

            <p className="mt-4 text-[15px] leading-7 text-[#6B7A90] max-w-[280px] mx-auto">
              Report incidents and keep your vehicle safe with a simple and
              smart experience.
            </p>
          </div>

          <div className="flex-1" />

          {/* buttons */}
          <div className="space-y-4">
            <Link
              to="/app/reports"
              className="flex h-[60px] items-center justify-center rounded-[22px] bg-[#F4B400] text-[16px] font-black text-white shadow-[0_12px_25px_rgba(244,180,0,0.25)] border-b-[5px] border-[#D99800] transition-all duration-300 hover:-translate-y-0.5"
            >
              Report Incident
            </Link>

            {/* ✅ FIXED ROUTE HERE */}
            <Link
              to="/app/vehicles/add"
              className="flex h-[60px] items-center justify-center rounded-[22px] bg-gradient-to-r from-[#5BA3F0] to-[#4A90E2] text-[16px] font-black text-white shadow-[0_12px_25px_rgba(74,144,226,0.25)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Register Vehicle
            </Link>
          </div>

          {/* footer */}
          <div className="mt-6 text-center text-[12px] font-semibold text-[#9AA8BC]">
            Need help? Contact Support
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes carFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
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
