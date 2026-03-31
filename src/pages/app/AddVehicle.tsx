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
      image
    };

    setVehicles(prev => [...prev, newVehicle]);
    navigate('/app/vehicles');
  };

  return (
    <div className="flex h-full flex-col bg-appBg px-6 pt-10 pb-10 relative">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-appSurface border border-appBorder text-appText shadow-waze active:scale-95 transition-all"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <h1 className="text-lg font-black tracking-tight text-appText uppercase">
          Add Vehicle
        </h1>
        <div className="w-11"></div>
      </header>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto pb-48 scrollbar-hide">
        <form id="app-add-vehicle" onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* Main Photo Upload */}
          <section>
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-appTextSecondary ml-1 mb-2 block">Vehicle Photo</label>
            <div className="group relative overflow-hidden rounded-[32px] border border-appBorder bg-appSurface p-1 shadow-waze transition-all hover:border-blue-300">
              {image ? (
                <div className="relative h-48 w-full overflow-hidden rounded-[30px]">
                  <img src={image} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-[2px]">
                    <UploadCloud className="mb-2 text-white" size={32} />
                    <span className="text-xs font-black uppercase tracking-widest text-white">Change Photo</span>
                  </div>
                </div>
              ) : (
                <div className="relative h-48 w-full overflow-hidden rounded-[30px] group">
                   <img 
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600" 
                    alt="Default car" 
                    className="h-full w-full object-cover opacity-40 grayscale group-hover:opacity-60 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-700">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-appSurface border border-appBorder shadow-waze animate-bounce duration-1000">
                      <Camera size={28} className="text-blue-600" />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-[15px] font-black tracking-tight text-appText">Add a photo</p>
                      <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-0.5 leading-relaxed">Required for identification</p>
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

          {/* Core Info */}
          <section className="flex flex-col gap-6">
            <div>
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 mb-2 block">Vehicle Nickname</label>
              <input 
                type="text" 
                placeholder="e.g. My Black Tesla" 
                className="waze-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 mb-2 block">Licence Plate</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="ABC-1234" 
                  className="waze-input font-mono uppercase tracking-widest h-[60px]"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <FileText size={18} />
                </div>
              </div>
            </div>
          </section>

          {/* Documents Section */}
          <section>
             <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 mb-4 block">Verification Documents</label>
            <div className="flex flex-col gap-4">
              <DocumentUpload label="Ownership Document" icon={<FileText size={18} />} />
              <DocumentUpload label="Insurance Certificate" icon={<UploadCloud size={18} />} />
            </div>
          </section>
        </form>
      </div>

      {/* Fixed bottom Save FAB */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-appBg/90 p-6 backdrop-blur-xl border-t border-appBorder">
        <div className="mx-auto max-w-md">
          <button 
            type="submit" 
            form="app-add-vehicle"
            disabled={!isFormValid}
            className="waze-btn-primary h-[64px] w-full text-lg shadow-lg disabled:grayscale disabled:opacity-50"
          >
            Register Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

const DocumentUpload = ({ label, icon }: { label: string, icon: React.ReactNode }) => (
  <button type="button" className="group flex items-center gap-4 p-5 bg-appSurface rounded-[24px] border border-appBorder shadow-waze transition-all hover:border-blue-300 active:scale-[0.98]">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-appBg border border-appBorder text-appTextSecondary/40 group-hover:text-blue-600 transition-colors">
      {icon}
    </div>
    <div className="flex-1 text-left min-w-0">
      <span className="block text-[14px] font-black text-appText truncate">{label}</span>
      <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Tap to upload</span>
    </div>
  </button>
);

export default AddVehicle;
