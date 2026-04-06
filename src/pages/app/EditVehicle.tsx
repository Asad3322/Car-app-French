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
      <div className="relative flex h-full flex-col items-center justify-center bg-transparent px-6 py-10 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-10 h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-red-100 blur-3xl" />
        </div>

        <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] border border-red-200 bg-red-50 text-red-500 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
          <AlertCircle size={38} />
        </div>

        <h2 className="relative z-10 mb-2 text-[24px] font-black tracking-tight text-[#0F172A]">
          Vehicle not found
        </h2>

        <p className="relative z-10 mb-6 max-w-[280px] text-[14px] font-medium leading-relaxed text-[#64748B]">
          The vehicle may have been removed or the link is invalid.
        </p>

        <button
          onClick={() => navigate('/app/vehicles')}
          className="relative z-10 rounded-[18px] bg-[#111827] px-5 py-3 text-[12px] font-black uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)] transition-all active:scale-95"
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
    <div className="relative flex h-full flex-col bg-transparent px-5 pt-10 pb-10">
      {/* Soft atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
        <div className="absolute right-[-40px] top-24 h-[180px] w-[180px] rounded-full bg-[#D8EAFF]/35 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/app/vehicles')}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DCE6F2] bg-white text-[#0F172A] shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all active:scale-95"
        >
          <ChevronLeft size={18} strokeWidth={3} />
        </button>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#94A3B8]">
            Vehicle Center
          </p>
          <h1 className="mt-1 text-[14px] font-black uppercase tracking-[0.16em] text-[#0F172A]">
            Vehicle Details
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-all active:scale-95"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      </header>

      {/* Content */}
      <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto pb-44">
        <form
          id="app-edit-vehicle"
          onSubmit={handleSave}
          className="flex flex-col gap-6"
        >
          {/* Hero preview */}
          <section className="rounded-[28px] border border-[#DCE6F2] bg-white/90 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[22px] border border-[#E5EDF6] bg-white shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
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
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#94A3B8]">
                  Registered Vehicle
                </p>
                <h2 className="mt-1 truncate text-[22px] font-black tracking-tight text-[#0F172A]">
                  {name || vehicle.name}
                </h2>
                <div className="mt-2 inline-flex items-center rounded-xl border border-[#D9E4F1] bg-[#F8FBFF] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#64748B]">
                  {vehicle.plate}
                </div>
              </div>
            </div>
          </section>

          {/* Photo Section */}
          <section>
            <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.15em] text-[#94A3B8]">
              Vehicle Photo
            </label>

            <div className="group relative overflow-hidden rounded-[28px] border border-[#DCE6F2] bg-white/90 p-1 shadow-[0_12px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all">
              {image ? (
                <div className="relative h-52 w-full overflow-hidden rounded-[24px]">
                  <img
                    src={image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.14)_100%)]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
                    <UploadCloud className="mb-2 text-white" size={32} />
                    <span className="text-xs font-black uppercase tracking-widest text-white">
                      Change Photo
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative h-52 w-full overflow-hidden rounded-[24px]">
                  <img
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600"
                    alt="Default car"
                    className="h-full w-full object-cover opacity-40 grayscale transition-all duration-700 group-hover:opacity-55"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#DCE6F2] bg-white/85 shadow-[0_10px_24px_rgba(15,23,42,0.10)]">
                      <Camera size={28} className="text-[#2563EB]" />
                    </div>
                    <div className="px-4 text-center">
                      <p className="text-[15px] font-black tracking-tight text-[#0F172A]">
                        Change photo
                      </p>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
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
            <div className="rounded-[28px] border border-[#DCE6F2] bg-white/90 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.18em] text-[#94A3B8]">
                Identification Plate
              </span>

              <div className="relative overflow-hidden rounded-[22px] border border-[#DCE6F2] bg-[#F8FBFF] px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <span className="block text-center text-[28px] font-black uppercase tracking-[0.24em] text-[#0F172A]">
                  {vehicle.plate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-[0_10px_20px_rgba(16,185,129,0.18)]">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.14em] text-emerald-600">
                  Verified Vehicle
                </p>
                <p className="mt-0.5 text-[13px] font-medium text-[#64748B]">
                  Vehicle profile is active and visible to your account.
                </p>
              </div>
            </div>
          </section>

          {/* Nickname */}
          <section>
            <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.15em] text-[#94A3B8]">
              Nickname
            </label>
            <input
              type="text"
              className="h-[60px] w-full rounded-[20px] border border-[#DCE6F2] bg-white px-4 text-[15px] font-semibold text-[#0F172A] outline-none placeholder:text-[#94A3B8] shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition-all focus:border-[#93C5FD] focus:ring-4 focus:ring-[#DBEAFE]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nickname"
            />
          </section>

          {/* Documents */}
          <section>
            <label className="mb-4 ml-1 block text-[11px] font-black uppercase tracking-[0.15em] text-[#94A3B8]">
              Linked Documents
            </label>
            <div className="flex flex-col gap-3">
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
      <div className="absolute bottom-0 left-0 right-0 z-50 border-t border-[#DCE6F2] bg-white/95 p-5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md gap-3">
          <button
            type="button"
            onClick={() => navigate('/app/vehicles')}
            className="h-[60px] flex-1 rounded-[18px] border border-[#DCE6F2] bg-white text-[11px] font-black uppercase tracking-[0.14em] text-[#64748B] transition-all active:scale-[0.98]"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="app-edit-vehicle"
            disabled={!hasChanges}
            className="h-[60px] flex-[2] rounded-[18px] bg-[#2563EB] text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Update Vehicle
          </button>
        </div>
      </div>

      {/* Delete modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-6 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-[360px] rounded-[32px] border border-[#E5E7EB] bg-white p-7 shadow-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[26px] bg-red-50 text-red-500 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
              <Trash2 size={30} strokeWidth={2.5} />
            </div>

            <h3 className="mb-3 text-center text-[24px] font-black tracking-tight text-[#0F172A]">
              Archive Car?
            </h3>

            <p className="mb-8 px-2 text-center text-[14px] font-medium leading-relaxed text-[#64748B]">
              Removing <strong className="text-[#0F172A]">"{vehicle.plate}"</strong>{' '}
              will pause all related community reports.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="h-[56px] w-full rounded-[18px] bg-red-500 text-[14px] font-black text-white transition-all active:scale-95"
              >
                Archive Vehicle
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="h-[56px] w-full rounded-[18px] border border-[#DCE6F2] bg-white text-[14px] font-black text-[#64748B] transition-all active:scale-95"
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
    className={`group flex items-center gap-4 rounded-[22px] border p-4 transition-all active:scale-[0.98] ${
      uploaded
        ? 'border-emerald-200 bg-emerald-50 shadow-[0_8px_20px_rgba(15,23,42,0.04)]'
        : 'border-[#DCE6F2] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]'
    }`}
  >
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
        uploaded
          ? 'border-transparent bg-emerald-500 text-white'
          : 'border-[#DCE6F2] bg-[#F8FBFF] text-[#64748B]'
      }`}
    >
      {icon}
    </div>

    <div className="min-w-0 flex-1 text-left">
      <span
        className={`block truncate text-[14px] font-black ${
          uploaded ? 'text-emerald-600' : 'text-[#0F172A]'
        }`}
      >
        {label}
      </span>
      <span
        className={`block text-[10px] font-black uppercase tracking-[0.14em] ${
          uploaded ? 'text-emerald-500/80' : 'text-[#94A3B8]'
        }`}
      >
        {uploaded ? 'Verified' : 'Tap to Upload'}
      </span>
    </div>
  </button>
);

export default EditVehicle;