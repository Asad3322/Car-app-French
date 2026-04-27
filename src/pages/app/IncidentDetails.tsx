import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ShieldCheck,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  AlertTriangle,
  Calendar,
  Info,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const DEFAULT_CAR_IMAGE =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=900';

const IncidentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackType, setFeedbackType] = useState<'thanks' | 'bad' | null>(null);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token');

        const res = await fetch(`${API_BASE_URL}/api/reports/${id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const result = await res.json();
        console.log('Single incident:', result);

        if (!res.ok) {
          setIncident(null);
          return;
        }

        setIncident(result.data);
      } catch (err) {
        console.error('Single incident fetch error:', err);
        setIncident(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [id]);

  const image =
    Array.isArray(incident?.medias) && incident.medias.length > 0
      ? incident.medias[0]
      : DEFAULT_CAR_IMAGE;

  const urgencyLabel =
    incident?.urgency === 'urgent'
      ? 'Urgent'
      : incident?.urgency === 'medium'
      ? 'Medium'
      : incident?.urgency === 'not_urgent'
      ? 'Not Urgent'
      : 'Report';

  const isUrgent = incident?.urgency === 'urgent';

  if (loading) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center bg-[#F3F7FB] px-6 py-10 text-center">
        <h2 className="text-[20px] font-black text-[#0F172A]">Loading report...</h2>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center bg-[#F3F7FB] px-6 py-10 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-10 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-red-100 blur-3xl" />
        </div>

        <div className="relative z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-[28px] bg-red-50 text-red-500 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <Info size={34} />
        </div>

        <h2 className="relative z-10 text-[24px] font-black tracking-tight text-[#0F172A]">
          Report Not Found
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="relative z-10 mt-5 rounded-[16px] bg-[#111827] px-5 py-3 text-[12px] font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)] transition-all active:scale-95"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-[#F3F7FB] font-sans">
      {feedbackType && (
        <div className="animate-in fade-in slide-in-from-top-4 absolute left-1/2 top-5 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-5 py-3 text-[#1D4ED8] shadow-[0_12px_28px_rgba(37,99,235,0.14)] duration-300">
          <ShieldCheck size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.16em]">
            {feedbackType === 'thanks'
              ? 'Thanks sent to the reporter'
              : 'Report flagged for review'}
          </span>
        </div>
      )}

      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#E6EDF5] bg-[#F3F7FB]/95 px-5 py-4 backdrop-blur-xl">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCE6F2] bg-white text-[#0F172A] shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition-all active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>

        <h1 className="text-[13px] font-black uppercase tracking-[0.14em] text-[#0F172A]">
          Report Details
        </h1>

        <div className="w-10" />
      </header>

      <div className="scrollbar-hide flex-1 overflow-y-auto bg-[#F3F7FB] pb-32">
        <div className="relative aspect-video w-full overflow-hidden bg-[#EAF1F8]">
          <img
            src={image}
            alt="Reported car evidence"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_CAR_IMAGE;
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] shadow-lg ${
                isUrgent ? 'bg-red-500 text-white' : 'bg-[#2563EB] text-white'
              }`}
            >
              {isUrgent ? <AlertTriangle size={14} /> : <Clock size={14} />}
              {urgencyLabel}
            </div>

            <div className="rounded-full bg-emerald-500 px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-lg">
              {incident.status || 'reported'}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 bg-[#F3F7FB] px-5 py-6">
          <section className="rounded-[28px] border border-[#DCE6F2] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="rounded-[20px] border border-[#DCE6F2] bg-[#F8FBFF] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <span className="font-mono text-[18px] font-black tracking-[0.18em] text-[#0F172A]">
                    {incident.licence_plate || ''}
                  </span>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#2563EB]" strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#2563EB]">
                      Incident
                    </span>
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#94A3B8]">
                    Licence Plate
                  </p>
                  <p className="text-[12px] font-black text-[#0F172A]">
                    {incident.plate_registered ? 'Registered Vehicle' : 'Unregistered Vehicle'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1">
                <div className="flex items-center gap-4 rounded-[22px] border border-[#E6EDF5] bg-[#F8FBFF] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#2563EB]">
                    <Calendar size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
                      Date & Time
                    </p>
                    <p className="truncate text-[13px] font-black text-[#0F172A]">
                      {incident.created_at
                        ? new Date(incident.created_at).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <label className="mb-3 ml-2 block text-[10px] font-black uppercase tracking-[0.16em] text-[#94A3B8]">
              Incident Description
            </label>

            <div className="rounded-[28px] border border-[#DCE6F2] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
              <p className="text-[15px] font-medium leading-7 text-[#475569]">
                “{incident.description || ''}”
              </p>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[28px] border border-[#DCE6F2] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#DBEAFE] blur-3xl" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
                  <Sparkles size={16} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.14em] text-[#0F172A]">
                  Assistant Tip
                </h3>
              </div>

              <p className="text-[14px] leading-7 text-[#64748B]">
                This report was verified by our community. Review the details
                carefully and stay aware of similar incidents nearby.
              </p>

              <div className="mt-6 border-t border-[#E6EDF5] pt-5">
                <div className="mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#94A3B8]">
                    Quick Feedback
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFeedbackType('thanks')}
                    className={`flex min-h-[54px] items-center justify-center gap-2 rounded-[18px] border px-4 text-[11px] font-black uppercase tracking-[0.12em] transition-all active:scale-[0.97] ${
                      feedbackType === 'thanks'
                        ? 'border-[#2563EB] bg-[#2563EB] text-white shadow-[0_10px_20px_rgba(37,99,235,0.20)]'
                        : 'border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]'
                    }`}
                  >
                    <ThumbsUp size={16} />
                    Say Thanks
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackType('bad')}
                    className={`flex min-h-[54px] items-center justify-center gap-2 rounded-[18px] border px-4 text-[11px] font-black uppercase tracking-[0.12em] transition-all active:scale-[0.97] ${
                      feedbackType === 'bad'
                        ? 'border-red-500 bg-red-500 text-white shadow-[0_10px_20px_rgba(239,68,68,0.18)]'
                        : 'border-red-200 bg-red-50 text-red-500'
                    }`}
                  >
                    <ThumbsDown size={16} />
                    Bad Report
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-1 flex items-center justify-center">
            <div className="rounded-full border border-[#DCE6F2] bg-white px-5 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#94A3B8] shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
              Community Verified Report
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;