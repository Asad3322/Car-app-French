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
  Info,
} from 'lucide-react';
import { useStore } from '../../utils/store';

const IncidentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { incidents, vehicles, user } = useStore();

  const incident = incidents.find((i) => i.id === id);

  const isReceived =
    !!incident &&
    vehicles.some((v) => v.plate === incident.plate) &&
    incident.reporterId !== user.id;

  const [feedbackType, setFeedbackType] = useState<'thanks' | 'bad' | null>(null);

  if (!incident) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-charcoal p-6 text-center">
        <div className="mb-4 rounded-full bg-red-500/10 p-4 text-red-400">
          <Info size={32} />
        </div>
        <h2 className="text-xl font-black text-white">Report Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 font-bold text-silicon-cyan underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-charcoal font-sans">
      {feedbackType && isReceived && (
        <div className="animate-in fade-in slide-in-from-top-4 absolute left-1/2 top-6 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full bg-silicon-cyan px-6 py-3 text-charcoal shadow-[0_0_30px_rgba(53,215,255,0.35)] duration-300">
          <ShieldCheck size={18} />
          <span className="text-[11px] font-black uppercase tracking-[0.16em]">
            {feedbackType === 'thanks'
              ? 'Thanks sent to the reporter'
              : 'Report flagged for review'}
          </span>
        </div>
      )}

      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-charcoal/80 px-6 py-5 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-silicon-cyan transition-all duration-300 hover:bg-white/10 active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>

        <h1 className="text-[14px] font-black uppercase tracking-[0.08em] text-white">
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

          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-3">
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

        <div className="flex flex-col gap-7 px-6 py-7">
          <section className="rounded-[34px] border border-white/5 bg-[#1A1F26] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-white/10 bg-charcoal px-5 py-4 shadow-inner">
                  <span className="font-mono text-lg font-black tracking-[0.2em] text-white">
                    {incident.plate}
                  </span>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
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
                  <p className="text-xs font-black text-white">
                    Registered Vehicle
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1">
                <div className="flex items-center gap-4 rounded-3xl border border-white/5 bg-charcoal p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-silicon-cyan/10 text-silicon-cyan">
                    <Calendar size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-white/30">
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
            <label className="mb-3 ml-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
              Reporter Notes
            </label>

            <div className="rounded-[34px] border border-white/5 bg-[#1A1F26] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
              <p className="text-[15px] font-medium italic leading-8 text-white/80">
                "{incident.description}"
              </p>
            </div>
          </section>

          <section className="group relative overflow-hidden rounded-[34px] border border-silicon-cyan/15 bg-[#101820] p-6 shadow-[0_0_35px_rgba(53,215,255,0.04)]">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-silicon-cyan/5 blur-3xl transition-all duration-500 group-hover:scale-125" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-silicon-cyan/10 text-silicon-cyan">
                  <Sparkles size={16} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  Assistant Tip
                </h3>
              </div>

              <p className="text-[14px] leading-7 text-white/60">
                This report was verified by our community. Review the details
                carefully and stay aware of similar incidents nearby.
              </p>

              {isReceived && (
                <div className="mt-6 border-t border-white/5 pt-5">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                      Quick Feedback
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFeedbackType('thanks')}
                      className={`group/button flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border px-4 text-[11px] font-black uppercase tracking-[0.12em] transition-all duration-300 active:scale-[0.97] ${
                        feedbackType === 'thanks'
                          ? 'border-silicon-cyan bg-silicon-cyan text-charcoal shadow-[0_0_18px_rgba(53,215,255,0.22)]'
                          : 'border-silicon-cyan/25 bg-silicon-cyan/10 text-silicon-cyan hover:bg-silicon-cyan hover:text-charcoal'
                      }`}
                    >
                      <ThumbsUp size={16} />
                      Say Thanks
                    </button>

                    <button
                      onClick={() => setFeedbackType('bad')}
                      className={`group/button flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border px-4 text-[11px] font-black uppercase tracking-[0.12em] transition-all duration-300 active:scale-[0.97] ${
                        feedbackType === 'bad'
                          ? 'border-red-500 bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.22)]'
                          : 'border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <ThumbsDown size={16} />
                      Bad Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="mt-2 flex items-center justify-center">
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