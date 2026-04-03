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

  const isFormValid =
    name.trim() !== '' &&
    plate.trim() !== '' &&
    !plateError &&
    isPlateAvailable &&
    !isValidating;

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
    <div className="relative flex min-h-full flex-col bg-[#081120] sm:rounded-[40px]">
      
      {/* HEADER */}
      <div className="z-10 flex items-center justify-between p-5 sm:rounded-t-[40px]">
        <button
          onClick={() => navigate(-1)}
          className="text-white/80 -ml-2 rounded-full p-2 transition hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft size={24} />
        </button>

        <h1 className="text-white text-xl font-black tracking-tight">
          Add Vehicle
        </h1>

        <div className="w-10" />
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6">

        {/* ICON */}
        <div className="mt-2 mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_10px_30px_rgba(34,211,238,0.35)]">
            <Car size={36} />
          </div>
        </div>

        <form
          id="add-vehicle-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* NAME */}
          <div>
            <label className="mb-2 ml-1 block text-sm font-black uppercase tracking-wider text-slate-400">
              Name of the vehicle
            </label>
            <input
              type="text"
              placeholder="e.g. My Civic, Work Truck"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 font-bold text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* PLATE */}
          <div>
            <label className="mb-2 ml-1 block text-sm font-black uppercase tracking-wider text-slate-400">
              Licence Plate
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="e.g. ABC 1234"
                className={`w-full rounded-2xl border px-4 py-4 font-mono font-bold uppercase tracking-wider text-white placeholder:text-slate-400 focus:outline-none ${
                  plateError
                    ? 'border-red-400'
                    : isPlateAvailable
                    ? 'border-emerald-400'
                    : 'border-white/10'
                } bg-white/5`}
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
              />

              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isValidating && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                )}
                {plateError && <AlertCircle size={18} className="text-red-500" />}
                {isPlateAvailable && !isValidating && (
                  <CheckCircle2 size={18} className="text-emerald-400" />
                )}
              </div>
            </div>

            {plateError && (
              <p className="mt-2 ml-1 text-[10px] font-black uppercase tracking-widest text-red-500">
                {plateError}
              </p>
            )}
          </div>

          {/* UPLOAD */}
          <div>
            <label className="mb-2 ml-1 block text-sm font-black uppercase tracking-wider text-slate-400">
              Vehicle Media
            </label>

            <button
              type="button"
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400"
            >
              <Camera size={32} />
              <div className="mt-2 text-center">
                <span className="block text-sm font-bold text-white">
                  Add Photos
                </span>
                <span className="text-xs opacity-70">
                  Help the community identify it
                </span>
              </div>
            </button>
          </div>
        </form>
      </div>

      {/* BUTTON */}
      <footer className="mt-auto px-5 pb-6 pt-3">
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex h-[64px] w-full items-center justify-center gap-3 rounded-[20px] bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 text-white shadow-[0_18px_40px_rgba(34,211,238,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(34,211,238,0.38)] disabled:opacity-50 disabled:grayscale"
          >
            {isSubmitting && (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            <span className="text-[15px] font-black">
              {isSubmitting ? 'Registering...' : 'Register Vehicle'}
            </span>
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <a
            href="mailto:support@carapp.com"
            className="text-xs font-bold text-slate-400 transition hover:text-cyan-400"
          >
            Contact Support Team
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AddVehicleOnboarding;