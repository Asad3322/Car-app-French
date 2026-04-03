import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  HelpCircle,
  Camera,
  UploadCloud,
  Sparkles,
  Car,
} from 'lucide-react';
import type { Urgency, Incident } from '../utils/types';
import { useStore } from '../utils/store';

const ReportDetails = () => {
  const navigate = useNavigate();
  const { setIncidents } = useStore();

  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('Medium Urgency');
  const [plate, setPlate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiUses, setAiUses] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [mediaCount, setMediaCount] = useState(0);

  const handleAiOptimize = () => {
    if (!description || aiUses >= 3 || isOptimizing) return;

    setIsOptimizing(true);

    setTimeout(() => {
      setDescription((prev) => prev + ' (Refined by CARAPP AI)');
      setAiUses((prev) => prev + 1);
      setIsOptimizing(false);
    }, 1200);
  };

  const sendReport = () => {
    if (!plate || !description) return;

    setIsSubmitting(true);

    const newIncident: Incident = {
      id: Date.now().toString(),
      plate,
      incidentType: 'TRAFFIC',
      description,
      urgency,
      date: new Date().toISOString(),
      status: 'reported',
      location: 'Current Location',
      reporterId: 'user1',
    };

    setTimeout(() => {
      setIncidents((prev: Incident[]) => [newIncident, ...prev]);
      setIsSubmitting(false);
      navigate('/success');
    }, 1500);
  };

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#050B14] px-6 pb-36 pt-8 font-sans text-white scrollbar-hide">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/8 blur-3xl" />
        <div className="absolute -right-16 top-24 h-56 w-56 rounded-full bg-cyan-400/6 blur-3xl" />
        <div className="absolute bottom-16 left-0 h-48 w-48 rounded-full bg-cyan-400/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-10 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#4DD8FF] transition-all active:scale-90"
        >
          <ChevronLeft size={24} strokeWidth={2.8} />
        </button>

        <h1 className="text-[17px] font-black uppercase tracking-[0.04em] text-white">
          REPORT INCIDENT
        </h1>

        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#4DD8FF] transition-all active:scale-90">
          <HelpCircle size={20} strokeWidth={2.6} />
        </button>
      </header>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-7">
        {/* LICENCE PLATE */}
        <section>
          <label className="mb-3 ml-1 block text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
            LICENCE PLATE
          </label>

          <div className="flex items-center rounded-full border border-white/5 bg-[linear-gradient(180deg,#121A26_0%,#0D1520_100%)] px-6 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.28)]">
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="ABC 1234"
              className="w-full bg-transparent text-[18px] font-extrabold tracking-[0.06em] text-white/90 outline-none placeholder:text-white/45"
            />
            <Car size={20} className="ml-3 text-white/55" />
          </div>
        </section>

        {/* URGENCY */}
        <section>
          <label className="mb-3 ml-1 block text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
            URGENCY LEVEL
          </label>

          <div className="flex rounded-full border border-white/5 bg-[linear-gradient(180deg,#121A26_0%,#0D1520_100%)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.24)]">
            {(['Urgent', 'Medium Urgency', 'Not Urgent'] as Urgency[]).map(
              (level) => {
                const active = urgency === level;

                return (
                  <button
                    key={level}
                    onClick={() => setUrgency(level)}
                    className={`flex-1 rounded-full px-2 py-3 text-[10px] font-black uppercase tracking-[0.08em] transition-all duration-300 ${
                      active
                        ? 'bg-[#62D8FF] text-[#07111A] shadow-[0_0_22px_rgba(98,216,255,0.35)]'
                        : 'text-white/55 hover:text-white/80'
                    }`}
                  >
                    {level === 'Medium Urgency' ? 'MEDIUM' : level.toUpperCase()}
                  </button>
                );
              }
            )}
          </div>
        </section>

        {/* DESCRIPTION */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <label className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
              INCIDENT DESCRIPTION
            </label>

            <button
              onClick={handleAiOptimize}
              disabled={!description || aiUses >= 3 || isOptimizing}
              className="flex items-center gap-1.5 rounded-full border border-[#62D8FF]/20 bg-[#0E1722] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#62D8FF] transition-all active:scale-95 disabled:opacity-35"
            >
              <Sparkles size={10} className={isOptimizing ? 'animate-spin' : ''} />
              {isOptimizing ? 'OPTIMIZING...' : 'OPTIMIZE WITH AI'}
            </button>
          </div>

          <div className="rounded-[30px] border border-white/5 bg-[linear-gradient(180deg,#121A26_0%,#0D1520_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.28)]">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Please describe what happened..."
              className="min-h-[125px] w-full resize-none bg-transparent text-[16px] font-semibold leading-relaxed text-white/90 outline-none placeholder:text-white/45"
            />
          </div>
        </section>

        {/* ACTION CARDS */}
        <div className="grid grid-cols-2 gap-5 pt-1">
          <ActionCard
            label="ADD PHOTOS"
            icon={<Camera size={24} />}
            active={mediaCount > 0}
            onClick={() => setMediaCount((prev) => (prev > 0 ? 0 : 1))}
          />

          <ActionCard
            label="INSURANCE"
            subLabel="(OPT)"
            icon={<UploadCloud size={24} />}
            active={hasInsurance}
            onClick={() => setHasInsurance((prev) => !prev)}
          />
        </div>

        {/* CTA */}
        <div className="pt-3">
          <button
            onClick={sendReport}
            disabled={!plate || !description || isSubmitting}
            className="flex h-[68px] w-full items-center justify-center rounded-full bg-[linear-gradient(90deg,#63DFFF_0%,#16C7FF_100%)] px-6 text-[15px] font-black uppercase tracking-[0.1em] text-[#07111A] shadow-[0_18px_38px_rgba(34,211,238,0.28)] transition-all hover:shadow-[0_20px_44px_rgba(34,211,238,0.34)] active:scale-[0.985] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-3">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#07111A]/30 border-t-[#07111A]" />
                SUBMITTING...
              </span>
            ) : (
              'SUBMIT REPORT DETAILS'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

type ActionCardProps = {
  label: string;
  subLabel?: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
};

const ActionCard = ({
  label,
  subLabel,
  icon,
  active,
  onClick,
}: ActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex aspect-square flex-col items-center justify-center rounded-[34px] border transition-all active:scale-95 ${
        active
          ? 'border-[#62D8FF]/25 bg-[linear-gradient(180deg,rgba(98,216,255,0.12)_0%,rgba(14,23,34,0.92)_100%)] shadow-[0_12px_28px_rgba(34,211,238,0.10)]'
          : 'border-white/5 bg-[linear-gradient(180deg,#121A26_0%,#0D1520_100%)] shadow-[0_10px_24px_rgba(0,0,0,0.22)]'
      }`}
    >
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-all ${
          active
            ? 'bg-[#62D8FF] text-[#07111A] shadow-[0_0_22px_rgba(98,216,255,0.30)]'
            : 'bg-white/5 text-[#62D8FF]'
        }`}
      >
        {icon}
      </div>

      <span className="text-center text-[11px] font-black uppercase tracking-[0.12em] text-white/78">
        {label}
      </span>

      {subLabel && (
        <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">
          {subLabel}
        </span>
      )}
    </button>
  );
};

export default ReportDetails;