import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ShieldCheck,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  AlertTriangle,
  CameraOff,
  Calendar,
  Info
} from 'lucide-react';
import { useStore } from '../../utils/store';

const IncidentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { incidents, vehicles } = useStore();
  const incident = incidents.find((i) => i.id === id);
  const isReceived = incident && vehicles.some((v) => v.plate === incident.plate);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [feedbackSent] = useState(false);

  if (!incident) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-full bg-red-50 p-4 text-red-500">
          <Info size={32} />
        </div>
        <h2 className="text-xl font-black text-appText">Report Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 font-bold text-primary underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-charcoal font-sans">
      {feedbackSent && (
        <div className="animate-in fade-in slide-in-from-top-4 absolute left-1/2 top-6 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full bg-silicon-cyan px-6 py-3 text-charcoal shadow-[0_0_30px_rgba(53,215,255,0.4)] duration-300">
          <ShieldCheck size={18} />
          <span className="text-xs font-black uppercase tracking-widest">
            Thanks sent to the reporter!
          </span>
        </div>
      )}

      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-charcoal/80 px-6 py-5 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-silicon-cyan transition-all active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[14px] font-black uppercase tracking-[0.05em] text-white">
          Report Details
        </h1>
        <div className="w-10" />
      </header>

      <div className="scrollbar-hide flex-1 overflow-y-auto pb-32">
        <div className="relative aspect-video w-full overflow-hidden bg-[#11161D]">
          {incident.image ? (
            <img
              src={incident.image}
              alt="Reported car evidence"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-white/10">
              <div className="flex h-20 w-20 items-center justify-center rounded-[32px] border border-white/5 bg-[#1A1F26] shadow-sm">
                <CameraOff size={40} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">
                No car image available
              </span>
            </div>
          )}

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <div
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-black uppercase tracking-widest shadow-2xl ${
                incident.urgency === 'Urgent'
                  ? 'bg-red-600 text-white shadow-red-600/30'
                  : 'bg-silicon-cyan text-charcoal shadow-silicon-cyan/30'
              }`}
            >
              {incident.urgency === 'Urgent' ? (
                <AlertTriangle size={15} />
              ) : (
                <Clock size={15} />
              )}
              {incident.urgency}
            </div>

            {!isReceived && (
              <div className="rounded-full bg-emerald-500 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white shadow-emerald-500/30">
                {incident.status}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8 px-6 py-8">
          <section className="rounded-[40px] border border-white/5 bg-[#1A1F26] p-8">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-5">
                <div className="rounded-2xl border border-white/10 bg-charcoal px-6 py-4 shadow-inner">
                  <span className="font-mono text-xl font-black tracking-widest text-white">
                    {incident.plate}
                  </span>
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-1.5">
                    <Sparkles
                      size={12}
                      className="text-silicon-cyan"
                      strokeWidth={3}
                    />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-silicon-cyan">
                      {incident.incidentType}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Licence Plate
                  </p>
                  <p className="text-xs font-black text-white">Registered Vehicle</p>
                </div>
              </div>

              <div className="grid grid-cols-1">
                <div className="flex items-center gap-4 rounded-3xl border border-white/5 bg-charcoal p-5">
                  <div className="text-silicon-cyan">
                    <Calendar size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-white/30">
                      Date & Time
                    </p>
                    <p className="truncate text-[13px] font-black text-white">
                      {new Date(incident.date).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <label className="mb-4 ml-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
              Reporter Notes
            </label>
            <div className="rounded-[40px] border border-white/5 bg-[#1A1F26] p-8 shadow-sm">
              <p className="text-[15px] font-medium italic leading-relaxed text-white/80">
                "{incident.description}"
              </p>
            </div>
          </section>

          <section className="group relative overflow-hidden rounded-[40px] border border-silicon-cyan/20 bg-charcoal p-8 shadow-[0_0_40px_rgba(53,215,255,0.05)]">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-silicon-cyan/5 blur-3xl transition-all group-hover:scale-125" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-silicon-cyan" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  Assistant Tip
                </h3>
              </div>
              <p className="text-[14px] font-medium leading-relaxed text-white/60">
                This report was verified by our community. Please review the details carefully and stay aware of similar vehicle-related incidents nearby.
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                  Helpful?
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsHelpful(true)}
                    className={`flex h-9 items-center gap-2 rounded-full border px-5 text-[10px] font-black uppercase tracking-widest transition-all ${
                      isHelpful === true
                        ? 'border-silicon-cyan bg-silicon-cyan text-charcoal shadow-[0_0_15px_rgba(53,215,255,0.2)]'
                        : 'border-white/10 bg-white/5 text-white/40'
                    }`}
                  >
                    <ThumbsUp size={14} /> Yes
                  </button>
                  <button
                    onClick={() => setIsHelpful(false)}
                    className={`flex h-9 items-center gap-2 rounded-full border px-5 text-[10px] font-black uppercase tracking-widest transition-all ${
                      isHelpful === false
                        ? 'border-red-500 bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                        : 'border-white/10 bg-white/5 text-white/40'
                    }`}
                  >
                    <ThumbsDown size={14} /> No
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 flex items-center justify-center">
            <div className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/30">
              Community Verified Report
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;