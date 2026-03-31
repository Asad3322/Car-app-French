import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Car, AlertCircle, CheckCircle2 } from 'lucide-react';

const AddVehicleOnboarding = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [plateError, setPlateError] = useState('');
  const [isPlateAvailable, setIsPlateAvailable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (plate.length < 3) {
      setPlateError('');
      setIsPlateAvailable(false);
      return;
    }

    setIsValidating(true);
    const timer = setTimeout(() => {
      // Simulate API check
      if (plate === 'ABC 1234') {
        setPlateError('This plate is already registered');
        setIsPlateAvailable(false);
      } else {
        setPlateError('');
        setIsPlateAvailable(true);
      }
      setIsValidating(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [plate]);

  const isFormValid = name.trim() !== '' && plate.trim() !== '' && !plateError && isPlateAvailable && !isValidating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/auth?role=owner');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-public-bg relative pb-0 sm:rounded-[40px]">
      {/* Header */}
      <div className="flex items-center justify-between p-5 bg-public-surface shadow-sm z-10 sm:rounded-t-[40px]">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-public-border text-public-textSecondary transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-public-textPrimary tracking-tight">Add Vehicle</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Form Content */}
      <div className="flex-1 p-5 pb-32 mt-1 flex flex-col gap-6 overflow-y-auto">
        <div className="flex justify-center mb-4 mt-2">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary-dark shadow-inner">
            <Car size={36} />
          </div>
        </div>
        
        <form id="add-vehicle-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name */}
          <div>
            <label className="text-sm font-black mb-2 text-public-textSecondary uppercase tracking-wider block ml-1">Name of the vehicle</label>
            <input 
              type="text" 
              placeholder="e.g. My Civic, Work Truck" 
              className="w-full bg-public-bg border-2 border-public-border rounded-2xl px-4 py-4 font-bold text-public-textPrimary placeholder:text-public-textSecondary focus:outline-none focus:border-primary transition-all shadow-inner"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Licence Plate */}
          <div>
            <label className="text-sm font-black mb-2 text-public-textSecondary uppercase tracking-wider block ml-1">Licence Plate</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="e.g. ABC 1234" 
                className={`w-full bg-public-bg border-2 rounded-2xl px-4 py-4 font-bold text-public-textPrimary placeholder:text-public-textSecondary focus:outline-none transition-all shadow-inner font-mono uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal ${
                  plateError ? 'border-red-400 focus:border-red-500' : 
                  isPlateAvailable ? 'border-emerald-400 focus:border-emerald-500' : 'border-public-border focus:border-primary'
                }`}
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isValidating && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                {plateError && <AlertCircle size={18} className="text-red-500" />}
                {isPlateAvailable && !isValidating && <CheckCircle2 size={18} className="text-emerald-500" />}
              </div>
            </div>
            {plateError && <p className="mt-2 text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{plateError}</p>}
          </div>

          {/* Upload */}
          <div>
            <label className="text-sm font-black mb-2 text-public-textSecondary uppercase tracking-wider block ml-1">Vehicle Media</label>
            <button type="button" className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-public-border rounded-2xl bg-public-surface text-public-textSecondary hover:bg-public-bg hover:border-primary/50 hover:text-primary transition-colors w-full shadow-sm mt-1">
              <Camera size={32} />
              <div className="text-center mt-2">
                <span className="text-sm font-bold block text-public-textPrimary">Add Photos</span>
                <span className="text-xs font-medium opacity-60">Help the community identify it</span>
              </div>
            </button>
          </div>
        </form>
      </div>

      {/* Fixed bottom CTA */}
      <footer className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] z-50">
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="waze-btn-primary h-[64px] shadow-lg disabled:grayscale disabled:opacity-50 flex items-center justify-center gap-3 w-full"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            <span>{isSubmitting ? 'Registering...' : 'Register Vehicle'}</span>
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <a href="mailto:support@carapp.com" className="font-bold py-2 px-4 text-public-textSecondary hover:text-public-textPrimary transition-colors text-xs">
            Contact Support Team
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AddVehicleOnboarding;
