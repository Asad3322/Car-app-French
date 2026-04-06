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
    <div className="relative flex min-h-full flex-col bg-[#EEF3F8] sm:rounded-[40px] overflow-hidden">
      {/* soft bg */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(91,163,240,0.18),_transparent_34%)]" />
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-[#5BA3F0]/20 blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-32 w-32 rounded-full bg-white/70 blur-3xl" />

      {/* HEADER */}
      <div className="relative z-10 flex items-center justify-between px-5 pb-2 pt-5 sm:rounded-t-[40px]">
        <button
          onClick={() => navigate(-1)}
          className="-ml-2 rounded-full p-2 text-[#6B7A90] transition hover:bg-white/70 hover:text-[#1F2A37]"
        >
          <ChevronLeft size={24} />
        </button>

        <h1 className="text-xl font-black tracking-tight text-[#1F2A37]">
          Add Vehicle
        </h1>

        <div className="w-10" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6">
        {/* ICON */}
        <div className="mb-2 mt-2 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#5BA3F0] to-[#4A90E2] text-white shadow-[0_14px_30px_rgba(74,144,226,0.25)]">
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
            <label className="mb-2 ml-1 block text-sm font-black uppercase tracking-wider text-[#6B7A90]">
              Name of the vehicle
            </label>
            <input
              type="text"
              placeholder="e.g. My Civic, Work Truck"
              className="w-full rounded-[22px] border border-[#D9E5F1] bg-white px-4 py-4 font-semibold text-[#1F2A37] placeholder:text-[#9AA8BC] shadow-sm outline-none transition focus:border-[#5BA3F0] focus:ring-4 focus:ring-[#5BA3F0]/15"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* PLATE */}
          <div>
            <label className="mb-2 ml-1 block text-sm font-black uppercase tracking-wider text-[#6B7A90]">
              Licence Plate
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="e.g. ABC 1234"
                className={`w-full rounded-[22px] border bg-white px-4 py-4 font-mono font-bold uppercase tracking-wider text-[#1F2A37] placeholder:text-[#9AA8BC] shadow-sm outline-none transition focus:ring-4 ${
                  plateError
                    ? 'border-red-400 focus:ring-red-100'
                    : isPlateAvailable
                    ? 'border-emerald-400 focus:ring-emerald-100'
                    : 'border-[#D9E5F1] focus:border-[#5BA3F0] focus:ring-[#5BA3F0]/15'
                }`}
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
              />

              <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
                {isValidating && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#4A90E2] border-t-transparent" />
                )}
                {plateError && <AlertCircle size={18} className="text-red-500" />}
                {isPlateAvailable && !isValidating && (
                  <CheckCircle2 size={18} className="text-emerald-500" />
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
            <label className="mb-2 ml-1 block text-sm font-black uppercase tracking-wider text-[#6B7A90]">
              Vehicle Media
            </label>

            <button
              type="button"
              className="flex w-full flex-col items-center justify-center gap-2 rounded-[22px] border-2 border-dashed border-[#CFE0F2] bg-white px-6 py-7 text-[#6B7A90] shadow-sm transition hover:border-[#5BA3F0] hover:bg-[#F8FBFF] hover:text-[#4A90E2]"
            >
              <Camera size={32} />
              <div className="mt-2 text-center">
                <span className="block text-sm font-bold text-[#1F2A37]">
                  Add Photos
                </span>
                <span className="text-xs text-[#9AA8BC]">
                  Help the community identify it
                </span>
              </div>
            </button>
          </div>
        </form>
      </div>

      {/* BUTTON */}
      <footer className="relative z-10 mt-auto px-5 pb-6 pt-3">
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex h-[62px] w-full items-center justify-center gap-3 rounded-full border-b-4 border-[#E09E00] bg-[#F4B400] text-white shadow-[0_16px_30px_rgba(244,180,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(244,180,0,0.34)] disabled:opacity-50 disabled:grayscale"
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
            className="text-xs font-bold text-[#9AA8BC] transition hover:text-[#4A90E2]"
          >
            Contact Support Team
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AddVehicleOnboarding;