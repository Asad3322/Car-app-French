import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Camera,
  FileText,
  UploadCloud,
  Trash2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../utils/store';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, setVehicles } = useStore();

  const vehicle = vehicles.find((v) => v.id === id);

  const [name, setName] = useState(vehicle?.name || '');
  const [image, setImage] = useState<string | undefined>(vehicle?.image);
  const [showModal, setShowModal] = useState(false);

  if (!vehicle) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center bg-transparent p-10 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-10 h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] border border-red-400/20 bg-red-500/10 text-red-400 shadow-[0_12px_34px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <AlertCircle size={40} />
        </div>

        <h2 className="relative z-10 mb-2 text-xl font-black text-white">
          Vehicle not found
        </h2>

        <p className="relative z-10 mb-6 text-sm font-bold text-white/50">
          The vehicle may have been removed or the link is invalid.
        </p>

        <button
          onClick={() => navigate('/app/vehicles')}
          className="relative z-10 rounded-[18px] border border-cyan-300/20 bg-cyan-400/10 px-5 py-3 text-[12px] font-black uppercase tracking-widest text-[#62D8FF] transition-all hover:bg-cyan-400/15"
        >
          Go Back
        </button>
      </div>
    );
  }

  const hasChanges =
    (name.trim() !== '' && name !== vehicle.name) || image !== vehicle.image;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, name, image } : v))
    );
    navigate('/app/vehicles');
  };

  const handleDelete = () => {
    setShowModal(false);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    navigate('/app/vehicles');
  };

  return (
    <div className="relative flex h-full flex-col bg-transparent px-6 pb-10 pt-10">
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[#00C2FF]/12 blur-3xl" />
        <div className="absolute -left-16 top-32 h-[220px] w-[220px] rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="absolute bottom-24 right-[-50px] h-[220px] w-[220px] rounded-full bg-[#06B6D4]/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/app/vehicles')}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-all hover:border-cyan-300/25 hover:text-[#62D8FF] active:scale-95"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
            Vehicle Center
          </p>
          <h1 className="mt-1 text-lg font-black uppercase tracking-tight text-white">
            Vehicle Details
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-red-400 transition-all hover:bg-red-500/15 active:scale-95"
        >
          <Trash2 size={20} strokeWidth={2.5} />
        </button>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-48 scrollbar-hide">
        <form
          id="app-edit-vehicle"
          onSubmit={handleSave}
          className="flex flex-col gap-8"
        >
          {/* Hero preview */}
          <section className="rounded-[34px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                <img
                  src={
                    image ||
                    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600'
                  }
                  alt="Vehicle Preview"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                  Registered Vehicle
                </p>
                <h2 className="mt-1 truncate text-xl font-black tracking-tight text-white">
                  {name || vehicle.name}
                </h2>
                <div className="mt-2 inline-flex items-center rounded-xl border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#7DD3FC]">
                  {vehicle.plate}
                </div>
              </div>
            </div>
          </section>

          {/* Photo Section */}
          <section>
            <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.15em] text-white/50">
              Vehicle Photo
            </label>

            <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-1 shadow-[0_12px_34px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all hover:border-cyan-300/30">
              {image ? (
                <div className="relative h-52 w-full overflow-hidden rounded-[30px]">
                  <img
                    src={image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.22)_100%)]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                    <UploadCloud className="mb-2 text-white" size={32} />
                    <span className="text-xs font-black uppercase tracking-widest text-white">
                      Change Photo
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative h-52 w-full overflow-hidden rounded-[30px]">
                  <img
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600"
                    alt="Default car"
                    className="h-full w-full object-cover opacity-35 grayscale transition-all duration-700 group-hover:opacity-55"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[24px] border border-white/10 bg-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.20)] backdrop-blur-xl">
                      <Camera size={28} className="text-[#62D8FF]" />
                    </div>
                    <div className="px-4 text-center">
                      <p className="text-[15px] font-black tracking-tight text-white">
                        Change photo
                      </p>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-white/50">
                        Identity verification
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleImageUpload}
              />
            </div>
          </section>

          {/* Plate + status */}
          <section className="grid grid-cols-1 gap-4">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
              <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                Identification Plate
              </span>

              <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 px-6 py-5 shadow-[0_10px_25px_rgba(0,0,0,0.16)]">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_0%,transparent_30%,transparent_70%,rgba(255,255,255,0.04)_100%)]" />
                <span className="relative block text-center text-[30px] font-black uppercase tracking-[0.28em] text-white">
                  {vehicle.plate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[28px] border border-emerald-400/15 bg-emerald-400/8 p-4 shadow-[0_10px_24px_rgba(0,0,0,0.14)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-white">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.16em] text-emerald-300/80">
                  Verified Vehicle
                </p>
                <p className="mt-0.5 text-sm font-bold text-white/65">
                  Vehicle profile is active and visible to your account.
                </p>
              </div>
            </div>
          </section>

          {/* Nickname */}
          <section>
            <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.15em] text-white/50">
              Nickname
            </label>
            <input
              type="text"
              className="h-[60px] w-full rounded-[20px] border border-white/10 bg-white/5 px-4 text-white outline-none backdrop-blur-xl placeholder:text-white/35 focus:border-[#00C2FF]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nickname"
            />
          </section>

          {/* Documents */}
          <section>
            <label className="mb-4 ml-1 block text-[11px] font-black uppercase tracking-[0.15em] text-white/50">
              Linked Documents
            </label>
            <div className="flex flex-col gap-4">
              <DocumentRow
                label="Registration Cert"
                icon={<FileText size={18} />}
                uploaded
              />
              <DocumentRow
                label="Insurance Doc"
                icon={<UploadCloud size={18} />}
              />
            </div>
          </section>
        </form>
      </div>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/35 p-6 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md gap-3">
          <button
            type="button"
            onClick={() => navigate('/app/vehicles')}
            className="h-[64px] flex-1 rounded-[24px] border border-white/10 bg-white/5 text-[12px] font-black uppercase tracking-widest text-white/60 shadow-[0_10px_25px_rgba(0,0,0,0.18)] transition-all hover:bg-white/[0.08] active:scale-95"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="app-edit-vehicle"
            disabled={!hasChanges}
            className="h-[64px] flex-[2] rounded-[24px] bg-gradient-to-r from-[#00C2FF] via-[#14B8FF] to-[#008FEA] font-black text-white shadow-[0_18px_45px_rgba(0,194,255,0.28)] transition-all hover:brightness-110 disabled:grayscale disabled:opacity-50"
          >
            Update Vehicle
          </button>
        </div>
      </div>

      {/* Delete modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-6 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-[360px] rounded-[40px] border border-white/10 bg-[#0B111A] p-8 shadow-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] border border-red-400/15 bg-red-500/12 text-red-400 shadow-sm">
              <Trash2 size={32} strokeWidth={2.5} />
            </div>

            <h3 className="mb-3 text-center text-2xl font-black tracking-tight text-white">
              Archive Car?
            </h3>

            <p className="mb-8 px-2 text-center text-[14px] font-bold leading-relaxed text-white/55">
              Removing <strong className="text-white">"{vehicle.plate}"</strong>{' '}
              will pause all related community reports.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="h-[60px] w-full rounded-[22px] bg-red-500 text-[15px] font-black text-white transition-all hover:bg-red-400 active:scale-95"
              >
                Archive Vehicle
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="h-[60px] w-full rounded-[22px] border border-white/10 bg-transparent text-[15px] font-black text-white/65 transition-all hover:bg-white/[0.04] active:scale-95"
              >
                Keep it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DocumentRow = ({
  label,
  icon,
  uploaded = false,
}: {
  label: string;
  icon: React.ReactNode;
  uploaded?: boolean;
}) => (
  <button
    type="button"
    className={`group flex items-center gap-4 rounded-[24px] border p-5 transition-all active:scale-[0.98] ${
      uploaded
        ? 'border-emerald-400/15 bg-emerald-400/8 shadow-[0_10px_28px_rgba(0,0,0,0.18)]'
        : 'border-white/10 bg-white/[0.06] shadow-[0_10px_28px_rgba(0,0,0,0.18)]'
    }`}
  >
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
        uploaded
          ? 'border-transparent bg-emerald-400 text-white'
          : 'border-white/10 bg-white/5 text-white/40 group-hover:text-[#62D8FF]'
      }`}
    >
      {icon}
    </div>

    <div className="min-w-0 flex-1 text-left">
      <span
        className={`block truncate text-[14px] font-black ${
          uploaded ? 'text-emerald-300' : 'text-white'
        }`}
      >
        {label}
      </span>
      <span
        className={`block text-[10px] font-bold uppercase tracking-widest ${
          uploaded ? 'text-emerald-300/70' : 'text-white/40'
        }`}
      >
        {uploaded ? 'Verified' : 'Tap to Upload'}
      </span>
    </div>
  </button>
);

export default EditVehicle;