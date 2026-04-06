import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  HelpCircle,
  Camera,
  UploadCloud,
  Car,
} from 'lucide-react';
import type { Urgency, Incident } from '../utils/types';
import { useStore } from '../utils/store';

const ReportDetails = () => {
  const navigate = useNavigate();
  const { setIncidents } = useStore();

  const [description, setDescription] = useState('');
  const [insuranceDescription, setInsuranceDescription] = useState('');
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
    if (!plate || !description || (hasInsurance && !insuranceDescription.trim())) {
      return;
    }

    setIsSubmitting(true);

    const finalDescription = hasInsurance
      ? `${description}\n\nInsurance Description: ${insuranceDescription}`
      : description;

    const newIncident: Incident = {
      id: Date.now().toString(),
      plate,
      incidentType: 'TRAFFIC',
      description: finalDescription,
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
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#EEF3F8] px-6 pb-36 pt-8">
      <header className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#6B7A90] transition hover:bg-white"
        >
          <ChevronLeft size={24} />
        </button>

        <h1 className="text-[16px] font-black uppercase tracking-[0.05em] text-[#1F2A37]">
          REPORT INCIDENT
        </h1>

        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#6B7A90] transition hover:bg-white">
          <HelpCircle size={20} />
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <section>
          <label className="mb-2 ml-1 block text-[10px] font-black uppercase tracking-widest text-[#6B7A90]">
            Licence Plate
          </label>

          <div className="flex items-center rounded-full border border-[#D9E5F1] bg-white px-5 py-4 shadow-sm">
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="ABC 1234"
              className="w-full bg-transparent text-[16px] font-bold text-[#1F2A37] outline-none placeholder:text-[#9AA8BC]"
            />
            <Car size={20} className="ml-3 text-[#9AA8BC]" />
          </div>
        </section>

        <section>
          <label className="mb-2 ml-1 block text-[10px] font-black uppercase tracking-widest text-[#6B7A90]">
            Urgency Level
          </label>

          <div className="flex rounded-full bg-white p-1 shadow-sm">
            {(['Urgent', 'Medium Urgency', 'Not Urgent'] as Urgency[]).map((level) => {
              const active = urgency === level;

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUrgency(level)}
                  className={`flex-1 rounded-full py-3 text-[10px] font-black uppercase transition ${
                    active ? 'bg-[#4A90E2] text-white' : 'text-[#6B7A90]'
                  }`}
                >
                  {level === 'Medium Urgency' ? 'MEDIUM' : level.toUpperCase()}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#6B7A90]">
              Incident Description
            </label>

            <button
              type="button"
              onClick={handleAiOptimize}
              disabled={!description || aiUses >= 3 || isOptimizing}
              className="rounded-full border border-[#CFE0F2] bg-white px-3 py-1 text-[10px] font-bold text-[#4A90E2] transition disabled:opacity-50"
            >
              {isOptimizing ? 'Optimizing...' : 'AI Optimize'}
            </button>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe what happened..."
            className="w-full resize-none rounded-[22px] border border-[#D9E5F1] bg-white p-4 text-[15px] font-medium leading-relaxed text-[#1F2A37] outline-none shadow-sm placeholder:text-[#9AA8BC]"
          />
        </section>

        {hasInsurance && (
          <section>
            <label className="mb-2 ml-1 block text-[10px] font-black uppercase tracking-widest text-[#6B7A90]">
              Insurance Description
            </label>

            <textarea
              value={insuranceDescription}
              onChange={(e) => setInsuranceDescription(e.target.value)}
              rows={4}
              placeholder="Provide insurance-related details..."
              className="w-full resize-none rounded-[22px] border border-[#D9E5F1] bg-white p-4 text-[15px] font-medium leading-relaxed text-[#1F2A37] outline-none shadow-sm placeholder:text-[#9AA8BC]"
            />
          </section>
        )}

        <div className="grid grid-cols-2 gap-4">
          <ActionCard
            label="Add Photos"
            icon={<Camera size={22} />}
            active={mediaCount > 0}
            onClick={() => setMediaCount((prev) => (prev > 0 ? 0 : 1))}
          />

          <ActionCard
            label="Insurance"
            subLabel="Optional"
            icon={<UploadCloud size={22} />}
            active={hasInsurance}
            onClick={() => {
              setHasInsurance((prev) => {
                const next = !prev;
                if (!next) {
                  setInsuranceDescription('');
                }
                return next;
              });
            }}
          />
        </div>

        <button
          type="button"
          onClick={sendReport}
          disabled={
            !plate ||
            !description ||
            isSubmitting ||
            (hasInsurance && !insuranceDescription.trim())
          }
          className="mt-3 flex h-[60px] w-full items-center justify-center rounded-full border-b-4 border-[#E09E00] bg-[#F4B400] text-[15px] font-black uppercase tracking-[0.06em] text-white shadow-md transition disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
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
      type="button"
      onClick={onClick}
      className={`flex min-h-[140px] flex-col items-center justify-center rounded-[22px] border p-5 transition ${
        active
          ? 'border-[#4A90E2] bg-[#4A90E2]/10'
          : 'border-[#D9E5F1] bg-white'
      }`}
    >
      <div className="mb-3 text-[#4A90E2]">{icon}</div>

      <span className="text-center text-xs font-bold text-[#1F2A37]">
        {label}
      </span>

      {subLabel && (
        <span className="mt-1 text-[10px] font-medium text-[#9AA8BC]">
          {subLabel}
        </span>
      )}
    </button>
  );
};

export default ReportDetails;