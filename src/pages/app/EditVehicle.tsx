import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Camera, FileText, UploadCloud, Trash2, AlertCircle } from 'lucide-react';
import { useStore } from '../../utils/store';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, setVehicles } = useStore();
  
  const vehicle = vehicles.find(v => v.id === id);

  const [name, setName] = useState(vehicle?.name || '');
  const [image, setImage] = useState<string | undefined>(vehicle?.image);
  const [showModal, setShowModal] = useState(false);

  if (!vehicle) {
    return (
      <div className="flex flex-col h-full bg-appBg p-10 items-center justify-center text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[28px] flex items-center justify-center mb-6">
            <AlertCircle size={40} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Vehicle not found</h2>
        <button onClick={() => navigate('/app/vehicles')} className="text-blue-600 font-black uppercase tracking-widest text-[12px] hover:underline">Go Back</button>
      </div>
    );
  }

  const hasChanges = (name.trim() !== '' && name !== vehicle.name) || image !== vehicle.image;

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
    
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, name, image } : v));
    navigate('/app/vehicles');
  };

  const handleDelete = () => {
    setShowModal(false);
    setVehicles(prev => prev.filter(v => v.id !== id));
    navigate('/app/vehicles');
  };

  return (
    <div className="flex h-full flex-col bg-appBg px-6 pt-10 pb-10 relative">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/app/vehicles')}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-900 shadow-sm active:scale-95 transition-all"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
          Vehicle Details
        </h1>
        <button 
          onClick={() => setShowModal(true)} 
          className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500 border border-red-100 transition-all active:scale-95"
        >
          <Trash2 size={20} strokeWidth={2.5} />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-48 scrollbar-hide">
        <form id="app-edit-vehicle" onSubmit={handleSave} className="flex flex-col gap-8">
          
          {/* Photo Section */}
          <section>
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 mb-2 block">Vehicle Photo</label>
            <div className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-1 shadow-sm transition-all hover:border-blue-300">
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
                    <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-white border border-slate-100 shadow-sm">
                      <Camera size={28} className="text-blue-600" />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-[15px] font-black tracking-tight text-slate-900">Change photo</p>
                      <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-0.5 leading-relaxed">Identity verification</p>
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

          {/* Identifier (Read-only) */}
          <section className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Identification Plate</span>
            <div className="w-full max-w-[240px] bg-white px-6 py-4 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-center">
                <span className="text-3xl font-mono font-black text-slate-900 tracking-[0.3em] uppercase">
                {vehicle.plate}
                </span>
            </div>
          </section>

          {/* Nickname */}
          <section>
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 mb-2 block">Nickname</label>
            <input 
              type="text" 
              className="waze-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nickname"
            />
          </section>

          {/* Documents */}
          <section>
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 mb-4 block">Linked Documents</label>
            <div className="flex flex-col gap-4">
              <DocumentRow label="Registration Cert" icon={<FileText size={18} />} uploaded />
              <DocumentRow label="Insurance Doc" icon={<UploadCloud size={18} />} />
            </div>
          </section>
        </form>
      </div>

      {/* Action FAB Container */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-appBg/90 p-6 backdrop-blur-xl border-t border-appBorder">
        <div className="mx-auto max-w-md flex gap-3">
          <button 
            type="button"
            onClick={() => navigate('/app/vehicles')}
            className="flex-1 h-[64px] rounded-[24px] font-black uppercase tracking-widest text-[12px] text-slate-400 border border-slate-200 bg-white shadow-sm active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="app-edit-vehicle"
            disabled={!hasChanges}
            className="flex-[2] waze-btn-primary h-[64px] shadow-lg disabled:grayscale disabled:opacity-50"
          >
            Update Vehicle
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
          <div className="bg-white w-full max-w-[340px] rounded-[40px] p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Trash2 size={32} strokeWidth={2.5} />
            </div>
            
            <h3 className="text-2xl font-black text-center text-slate-900 mb-3 tracking-tight">Archive Car?</h3>
            <p className="text-center text-slate-500 text-[14px] mb-8 font-bold leading-relaxed px-2">
              Removing <strong className="text-slate-900">"{vehicle.plate}"</strong> will pause all related community reports.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleDelete}
                className="w-full h-[60px] rounded-[22px] font-black text-[15px] bg-red-500 text-white shadow-lg active:scale-95 transition-all"
              >
                Archive Vehicle
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="w-full h-[60px] rounded-[22px] font-black text-[15px] text-slate-400 border-2 border-slate-100 bg-transparent active:scale-95 transition-all"
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

const DocumentRow = ({ label, icon, uploaded = false }: { label: string, icon: React.ReactNode, uploaded?: boolean }) => (
  <button type="button" className={`group flex items-center gap-4 p-5 rounded-[24px] border transition-all active:scale-[0.98] ${
    uploaded ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-white border-slate-200 shadow-sm'
  }`}>
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
      uploaded ? 'bg-emerald-500 text-white border-transparent' : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:text-blue-600'
    }`}>
      {icon}
    </div>
    <div className="flex-1 text-left min-w-0">
      <span className={`block text-[14px] font-black truncate ${uploaded ? 'text-emerald-700' : 'text-slate-900'}`}>{label}</span>
      <span className={`block text-[10px] font-bold uppercase tracking-widest ${uploaded ? 'text-emerald-600/60' : 'text-slate-400'}`}>
        {uploaded ? 'Verified' : 'Tap to Upload'}
      </span>
    </div>
  </button>
);

export default EditVehicle;
