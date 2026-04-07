import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Camera,
  FileText,
  UploadCloud,
  Plus,
  Image as ImageIcon,
  Shield,
} from 'lucide-react';
import { useStore } from '../../utils/store';

const AddVehicle = () => {
  const navigate = useNavigate();
  const { setVehicles } = useStore();
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const insuranceInputRef = useRef<HTMLInputElement | null>(null);

  const isFormValid = name.trim() !== '' && plate.trim() !== '';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setShowAddMenu(false);
  };

  const handleInsuranceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setShowAddMenu(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newVehicle = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      plate: plate.toUpperCase(),
      reportsCount: 0,
      image,
    };

    setVehicles((prev) => [...prev, newVehicle]);
    navigate('/app/vehicles');
  };

  return (
    <div className="relative flex h-full flex-col bg-[#F3F7FB] px-5 pt-8 pb-10 sm:px-6 sm:pt-10">
      {/* Soft atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
        <div className="absolute right-[-40px] top-24 h-[180px] w-[180px] rounded-full bg-[#D8EAFF]/35 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DCE6F2] bg-white text-[#0F172A] shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all active:scale-95"
          aria-label="Go back"
        >
          <ChevronLeft size={18} strokeWidth={3} />
        </button>

        <h1 className="text-[14px] font-black uppercase tracking-[0.14em] text-[#0F172A]">
          Add Vehicle
        </h1>

        <div className="w-11" />
      </header>

      <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto pb-36">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <form
            id="app-add-vehicle"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            {/* FORM */}
            <section className="rounded-[30px] border border-[#DCE6F2] bg-white/90 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <div className="flex flex-col gap-5">
                <div>
                  <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.15em] text-[#94A3B8]">
                    Vehicle Nickname
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. My Black Tesla"
                    className="h-[58px] w-full rounded-[20px] border border-[#DCE6F2] bg-[#F8FBFF] px-4 text-[15px] font-semibold text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#93C5FD] focus:bg-white focus:ring-4 focus:ring-[#DBEAFE]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.15em] text-[#94A3B8]">
                    Licence Plate
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ABC-1234"
                      className="h-[58px] w-full rounded-[20px] border border-[#DCE6F2] bg-[#F8FBFF] px-4 pr-12 text-[15px] font-black uppercase tracking-[0.18em] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#93C5FD] focus:bg-white focus:ring-4 focus:ring-[#DBEAFE]"
                      value={plate}
                      onChange={(e) => setPlate(e.target.value.toUpperCase())}
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                      <FileText size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* IMAGE SECTION */}
            <section className="rounded-[30px] border border-[#DCE6F2] bg-white/90 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-5">
              <div className="mb-3">
                <label className="ml-1 block text-[11px] font-black uppercase tracking-[0.15em] text-[#94A3B8]">
                  Vehicle Photo
                </label>
              </div>

              <div className="group relative overflow-hidden rounded-[24px] border border-[#DCE6F2] bg-[#F8FBFF] p-1 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-all">
                {image ? (
                  <div className="relative h-52 w-full overflow-hidden rounded-[20px]">
                    <img
                      src={image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.16)_100%)]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
                      <UploadCloud className="mb-2 text-white" size={32} />
                      <span className="text-xs font-black uppercase tracking-widest text-white">
                        Change Photo
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-52 w-full overflow-hidden rounded-[20px]">
                    <img
                      src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600"
                      alt="Default car"
                      className="h-full w-full object-cover opacity-40 grayscale transition-all duration-700 group-hover:opacity-55"
                    />
                    <div className="absolute inset-0 bg-white/10" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#DCE6F2] bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.10)]">
                        <Camera size={28} className="text-[#2563EB]" />
                      </div>
                      <div className="px-4 text-center">
                        <p className="text-[15px] font-black tracking-tight text-[#0F172A]">
                          Add a photo
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
                          Required for identification
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BOTTOM ACTION AREA */}
              <div className="relative mt-4 flex justify-end">
                {showAddMenu && (
                  <div className="absolute bottom-[72px] right-0 z-20 flex min-w-[180px] flex-col gap-2 rounded-[18px] border border-[#DCE6F2] bg-white/95 p-2 shadow-[0_16px_30px_rgba(15,23,42,0.16)] backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="flex items-center gap-3 rounded-[14px] px-3 py-3 text-left transition hover:bg-[#F3F7FB]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DBEAFE] text-[#2563EB]">
                        <ImageIcon size={18} />
                      </div>
                      <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#0F172A]">
                        Add Image
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => insuranceInputRef.current?.click()}
                      className="flex items-center gap-3 rounded-[14px] px-3 py-3 text-left transition hover:bg-[#F3F7FB]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0284C7]">
                        <Shield size={18} />
                      </div>
                      <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#0F172A]">
                        Add Insurance
                      </span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowAddMenu((prev) => !prev)}
                  className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#2563EB] text-white shadow-[0_16px_28px_rgba(37,99,235,0.35)] transition-all active:scale-95"
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
              </div>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              <input
                ref={insuranceInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleInsuranceUpload}
              />
            </section>
          </form>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-[#DCE6F2] bg-white/95 p-5 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl">
          <button
            type="submit"
            form="app-add-vehicle"
            disabled={!isFormValid}
            className="h-[60px] w-full rounded-[18px] bg-[#2563EB] text-[13px] font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Register Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;