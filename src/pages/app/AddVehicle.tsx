import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Camera,
  FileText,
  Plus,
  Image as ImageIcon,
  Shield,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const MAX_VEHICLE_IMAGES = 4;

const AddVehicle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isOnboardingFlow = location.pathname === '/vehicle/add';

  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const insuranceInputRef = useRef<HTMLInputElement | null>(null);
  const addMenuRef = useRef<HTMLDivElement | null>(null);

  const isFormValid = name.trim() !== '' && plate.trim() !== '' && images.length > 0;
  const canAddMoreImages = images.length < MAX_VEHICLE_IMAGES;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        showAddMenu &&
        addMenuRef.current &&
        !addMenuRef.current.contains(event.target as Node)
      ) {
        setShowAddMenu(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showAddMenu]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) {
      setShowAddMenu(false);
      return;
    }

    const remainingSlots = MAX_VEHICLE_IMAGES - images.length;

    if (remainingSlots <= 0) {
      alert(`You can add maximum ${MAX_VEHICLE_IMAGES} vehicle images`);
      setShowAddMenu(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
      return;
    }

    const filesToAdd = selectedFiles.slice(0, remainingSlots);
    const previewsToAdd = filesToAdd.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...filesToAdd]);
    setImagePreviews((prev) => [...prev, ...previewsToAdd]);

    setShowAddMenu(false);

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleInsuranceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setShowAddMenu(false);
      return;
    }

    setInsuranceFile(file);
    setShowAddMenu(false);

    if (insuranceInputRef.current) {
      insuranceInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImagePreviews((prev) => {
      const urlToRemove = prev[indexToRemove];
      if (urlToRemove) URL.revokeObjectURL(urlToRemove);
      return prev.filter((_, index) => index !== indexToRemove);
    });

    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleOpenImagePicker = () => {
    if (!canAddMoreImages) {
      alert(`You can add maximum ${MAX_VEHICLE_IMAGES} vehicle images`);
      return;
    }

    imageInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append('vehicleName', name.trim());
      formData.append('licencePlate', plate.trim().toUpperCase());

      images.forEach((file) => {
        formData.append('vehicleMedia', file);
      });

      if (insuranceFile) {
        formData.append('insuranceDocument', insuranceFile);
      }

      const token = localStorage.getItem('token');

      const endpoint = isOnboardingFlow
        ? `${API_BASE_URL}/api/vehicles/onboarding`
        : `${API_BASE_URL}/api/vehicles`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          ...(!isOnboardingFlow && token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const result = await response.json();

      console.log('Vehicle API endpoint:', endpoint);
      console.log('Vehicle API response:', result);

      if (!response.ok) {
        console.error('Backend validation errors:', result.errors);

        const validationMessage =
          Array.isArray(result.errors) && result.errors.length > 0
            ? result.errors.join(', ')
            : result.message || 'Failed to register vehicle';

        throw new Error(validationMessage);
      }

      const savedVehicleId = result?.data?.id;

      if (!savedVehicleId) {
        throw new Error('Vehicle registered but backend did not return vehicle ID');
      }

      localStorage.setItem('vehicleId', savedVehicleId);
      localStorage.setItem('role', 'vehicle_owner');

      if (isOnboardingFlow) {
        navigate('/verify', {
          state: {
            mode: 'owner',
            vehicleId: savedVehicleId,
          },
        });
        return;
      }

      navigate('/app/vehicles', { replace: true });
    } catch (error: any) {
      console.error('Add vehicle error:', error);

      if (error?.message?.includes('Failed to fetch')) {
        alert('Backend not reachable. Check API URL or backend deployment.');
      } else {
        alert(error.message || 'Failed to register vehicle');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col bg-[#F3F7FB] px-5 pt-8 pb-10 sm:px-6 sm:pt-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
        <div className="absolute right-[-40px] top-24 h-[180px] w-[180px] rounded-full bg-[#D8EAFF]/35 blur-3xl" />
      </div>

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

            <section className="rounded-[30px] border border-[#DCE6F2] bg-white/90 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="ml-1 block text-[11px] font-black uppercase tracking-[0.15em] text-[#94A3B8]">
                  Vehicle Photo
                </label>

                {images.length > 0 && (
                  <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#2563EB]">
                    {images.length}/{MAX_VEHICLE_IMAGES}
                  </span>
                )}
              </div>

              <div
                onClick={() => {
                  if (images.length === 0) {
                    handleOpenImagePicker();
                  }
                }}
                className={`group relative overflow-hidden rounded-[24px] border border-[#DCE6F2] bg-[#F8FBFF] p-1 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-all ${
                  images.length === 0 ? 'cursor-pointer' : ''
                }`}
              >
                {imagePreviews.length > 0 ? (
                  <div className="relative h-52 w-full overflow-hidden rounded-[20px]">
                    <img
                      src={imagePreviews[0]}
                      alt="Main vehicle preview"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.20)_100%)]" />

                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#2563EB] shadow-sm">
                      Main Photo
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(0);
                      }}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm transition active:scale-95"
                      aria-label="Remove main image"
                    >
                      ×
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto">
                      {imagePreviews.map((preview, index) => (
                        <button
                          key={preview}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            if (index === 0) return;

                            setImages((prev) => {
                              const next = [...prev];
                              const selected = next[index];
                              next.splice(index, 1);
                              next.unshift(selected);
                              return next;
                            });

                            setImagePreviews((prev) => {
                              const next = [...prev];
                              const selected = next[index];
                              next.splice(index, 1);
                              next.unshift(selected);
                              return next;
                            });
                          }}
                          className={`h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 ${
                            index === 0 ? 'border-[#2563EB]' : 'border-white'
                          } bg-white shadow-sm`}
                          aria-label={`Vehicle image ${index + 1}`}
                        >
                          <img
                            src={preview}
                            alt={`Vehicle preview ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
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

              <div ref={addMenuRef} className="relative mt-4 flex justify-end">
                {showAddMenu && (
                  <div className="absolute bottom-[72px] right-0 z-20 flex min-w-[180px] flex-col gap-2 rounded-[18px] border border-[#DCE6F2] bg-white/95 p-2 shadow-[0_16px_30px_rgba(15,23,42,0.16)] backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={handleOpenImagePicker}
                      disabled={!canAddMoreImages}
                      className="flex items-center gap-3 rounded-[14px] px-3 py-3 text-left transition hover:bg-[#F3F7FB] disabled:cursor-not-allowed disabled:opacity-50"
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
                  aria-label="Open add options"
                >
                  <Plus
                    size={24}
                    strokeWidth={3}
                    className={`transition-transform duration-200 ${showAddMenu ? 'rotate-45' : 'rotate-0'}`}
                  />
                </button>
              </div>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
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

      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-[#DCE6F2] bg-white/95 p-5 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl">
          <button
            type="submit"
            form="app-add-vehicle"
            disabled={!isFormValid || isSubmitting}
            className="h-[60px] w-full rounded-[18px] bg-[#2563EB] text-[13px] font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? 'Registering...' : 'Register Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;