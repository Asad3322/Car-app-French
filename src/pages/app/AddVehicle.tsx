import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, FileText, UploadCloud } from 'lucide-react';
import { useStore } from '../../utils/store';

const AddVehicle = () => {
  const navigate = useNavigate();
  const { setVehicles } = useStore();
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);

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
    <div className="relative flex h-full flex-col bg-[#050B14] px-6 pt-10 pb-28 text-white">
      <header className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition active:scale-95"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>

        <h1 className="text-lg font-black uppercase tracking-tight text-white">
          Add Vehicle
        </h1>

        <div className="w-11" />
      </header>

      <div className="flex-1 overflow-y-auto pb-6 scrollbar-hide">
        <form id="app-add-vehicle" onSubmit={handleSubmit} className="flex flex-col gap-8">
          <section>
            <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.15em] text-white/60">
              Vehicle Photo
            </label>

            <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-1 shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all hover:border-cyan-400/40">
              {image ? (
                <div className="relative h-48 w-full overflow-hidden rounded-[30px]">
                  <img src={image} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                    <UploadCloud className="mb-2 text-white" size={32} />
                    <span className="text-xs font-black uppercase tracking-widest text-white">
                      Change Photo
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative h-48 w-full overflow-hidden rounded-[30px]">
                  <img
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600"
                    alt="Default car"
                    className="h-full w-full object-cover opacity-35 grayscale transition-all duration-700 group-hover:opacity-55"
                  />
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[24px] border border-white/15 bg-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                      <Camera size={28} className="text-cyan-300" />
                    </div>
                    <div className="px-4 text-center">
                      <p className="text-[15px] font-black tracking-tight text-white">
                        Add a photo
                      </p>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-white/60">
                        Required for identification
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

          <section className="flex flex-col gap-6">
            <div>
              <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.15em] text-white/60">
                Vehicle Nickname
              </label>
              <input
                type="text"
                placeholder="e.g. My Black Tesla"
                className="h-[60px] w-full rounded-[20px] border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/35 outline-none transition-all focus:border-cyan-400/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-400/10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.15em] text-white/60">
                Licence Plate
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ABC-1234"
                  className="h-[60px] w-full rounded-[20px] border border-white/10 bg-white/5 px-4 pr-12 font-mono uppercase tracking-widest text-white placeholder:text-white/35 outline-none transition-all focus:border-cyan-400/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-400/10"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35">
                  <FileText size={18} />
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#050B14]/90 p-6 backdrop-blur-xl">
        <button
          type="submit"
          form="app-add-vehicle"
          disabled={!isFormValid}
          className="h-[64px] w-full rounded-[22px] bg-gradient-to-r from-cyan-400 to-blue-500 text-lg font-black text-white shadow-[0_14px_30px_rgba(34,211,238,0.25)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Register Vehicle
        </button>
      </div>
    </div>
  );
};

export default AddVehicle;