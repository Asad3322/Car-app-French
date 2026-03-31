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
    <div className="flex h-full flex-col bg-[#EEF3F8] px-6 pt-10 pb-10">
      <header className="mb-8">
        <h1 className="text-[24px] font-black tracking-tight text-appText uppercase italic">
          Reports
        </h1>
        <p className="text-[13px] font-bold text-appTextSecondary mt-1">
          Select an action to continue
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {/* Received Reports Option */}
        <button
          onClick={() => navigate('/app/incidents', { state: { filter: 'received' } })}
          className="group flex items-center justify-between rounded-[32px] border border-appBorder bg-white p-6 shadow-waze transition-all hover:border-blue-500/20 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-slate-50 text-appTextSecondary shadow-sm transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
              <FileText size={28} />
            </div>
            <div className="text-left">
              <h3 className="text-[17px] font-black text-appText">Received Reports</h3>
              <p className="text-[11px] font-bold uppercase tracking-widest text-appTextSecondary/60 mt-0.5">
                View incident reports for your vehicles
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-appTextSecondary/30 group-hover:text-blue-500" />
        </button>

        {/* Send Report Option */}
        <button
          onClick={() => navigate('/app/report-details')}
          className="group flex items-center justify-between rounded-[32px] border border-appBorder bg-white p-6 shadow-waze transition-all hover:border-blue-500/20 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-indigo-50 text-indigo-600 shadow-sm transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Navigation size={28} />
            </div>
            <div className="text-left">
              <h3 className="text-[17px] font-black text-appText">Send Report</h3>
              <p className="text-[11px] font-bold uppercase tracking-widest text-appTextSecondary/60 mt-0.5">
                Report a new incident to the community
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-appTextSecondary/30 group-hover:text-indigo-500" />
        </button>
      </div>

      {/* Helpful Hint */}
      <div className="mt-auto mb-20 flex items-start gap-4 rounded-[32px] border border-blue-100 bg-blue-50/50 p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h4 className="text-[13px] font-black text-appText">Keep our roads safe</h4>
          <p className="mt-1 text-[11px] font-bold leading-relaxed text-appTextSecondary/70">
            Your reports help other drivers stay informed and encourage better driving behavior across the community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
