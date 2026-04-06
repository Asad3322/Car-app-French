import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Navigation, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const ReportsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-[#D6E2EC] px-6 pt-10 pb-10">
      <header className="mb-8">
        <h1 className="text-[24px] font-black tracking-tight text-[#0B1A2B] uppercase italic">
          Reports
        </h1>
        <p className="text-[13px] font-bold text-[#6F8194] mt-1">
          Select an action to continue
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {/* Received Reports Option */}
        <button
          onClick={() => navigate('/app/incidents', { state: { filter: 'received' } })}
          className="group flex items-center justify-between rounded-[32px] border border-[#B8C9D6] bg-[#EEF4F8] p-6 shadow-[0_10px_25px_rgba(70,106,140,0.08)] transition-all hover:border-[#2F93F6]/30 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[#E4F0FC] text-[#2F93F6] shadow-sm transition-colors group-hover:bg-[#2F93F6] group-hover:text-white">
              <FileText size={28} />
            </div>
            <div className="text-left">
              <h3 className="text-[17px] font-black text-[#0B1A2B]">Received Reports</h3>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#6F8194]/70 mt-0.5">
                View incident reports for your vehicles
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#7C8FA2] group-hover:text-[#2F93F6]" />
        </button>

        {/* Send Report Option */}
        <button
          onClick={() => navigate('/app/report-details')}
          className="group flex items-center justify-between rounded-[32px] border border-[#B8C9D6] bg-[#EEF4F8] p-6 shadow-[0_10px_25px_rgba(70,106,140,0.08)] transition-all hover:border-[#2F93F6]/30 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[#E4F0FC] text-[#2F93F6] shadow-sm transition-colors group-hover:bg-[#2F93F6] group-hover:text-white">
              <Navigation size={28} />
            </div>
            <div className="text-left">
              <h3 className="text-[17px] font-black text-[#0B1A2B]">Send Report</h3>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#6F8194]/70 mt-0.5">
                Report a new incident to the community
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#7C8FA2] group-hover:text-[#2F93F6]" />
        </button>
      </div>

      {/* Helpful Hint */}
      <div className="mt-auto mb-20 flex items-start gap-4 rounded-[32px] border border-[#C5D6E3] bg-[#EAF2F8] p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2F93F6] shadow-sm">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h4 className="text-[13px] font-black text-[#0B1A2B]">Keep our roads safe</h4>
          <p className="mt-1 text-[11px] font-bold leading-relaxed text-[#6F8194]/80">
            Your reports help other drivers stay informed and encourage better driving behavior across the community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;