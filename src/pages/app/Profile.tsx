import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit3,
  Mail,
  Phone as PhoneIcon,
  ShieldCheck,
  Navigation,
  FileText,
  ChevronRight,
  Globe,
  Plus,
  CarFront,
  Sparkles,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_AVATAR =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';

type ProfileUser = {
  id: string;
  username?: string;
  name?: string;
  phone?: string;
  email?: string;
  profileImage?: string;
  isVehicleOwner?: boolean;
};

type ProfileVehicle = {
  id: string;
  name?: string;
  vehicle_name?: string;
  plate?: string;
  licence_plate?: string;
};

type ProfileIncident = {
  id: string;
  reporterId?: string;
  reporter_id?: string;
  plate?: string;
  licence_plate?: string;
};

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [vehicles, setVehicles] = useState<ProfileVehicle[]>([]);
  const [incidents, setIncidents] = useState<ProfileIncident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [, setLanguage] = useState(
    () => localStorage.getItem('app_language') || 'EN'
  );
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
    setShowLangMenu(false);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem('token') || '';

        if (!token) {
          setUser(null);
          setVehicles([]);
          setIncidents([]);
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [profileRes, vehiclesRes, incidentsRes] = await Promise.allSettled([
          fetch(`${API_URL}/api/profile/me`, {
            method: 'GET',
            headers,
          }),
          fetch(`${API_URL}/api/vehicles`, {
            method: 'GET',
            headers,
          }),
          fetch(`${API_URL}/api/incidents`, {
            method: 'GET',
            headers,
          }),
        ]);

        // Profile
        if (profileRes.status === 'fulfilled') {
          const response = profileRes.value;
          const result = await response.json();

          if (response.ok) {
            setUser(result?.data || null);
          } else {
            console.error('Profile fetch failed:', result);
            setUser(null);
          }
        } else {
          console.error('Profile request error:', profileRes.reason);
          setUser(null);
        }

        // Vehicles
        if (vehiclesRes.status === 'fulfilled') {
          const response = vehiclesRes.value;
          const result = await response.json();

          if (response.ok) {
            setVehicles(Array.isArray(result?.data) ? result.data : []);
          } else {
            console.error('Vehicles fetch failed:', result);
            setVehicles([]);
          }
        } else {
          console.error('Vehicles request error:', vehiclesRes.reason);
          setVehicles([]);
        }

        // Incidents
        if (incidentsRes.status === 'fulfilled') {
          const response = incidentsRes.value;
          const result = await response.json();

          if (response.ok) {
            setIncidents(Array.isArray(result?.data) ? result.data : []);
          } else {
            console.error('Incidents fetch failed:', result);
            setIncidents([]);
          }
        } else {
          console.error('Incidents request error:', incidentsRes.reason);
          setIncidents([]);
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        setUser(null);
        setVehicles([]);
        setIncidents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const sentCount = user
    ? incidents.filter(
        (i) => (i.reporterId || i.reporter_id) === user.id
      ).length
    : 0;

  const receivedCount = incidents.filter((i) =>
    vehicles.some(
      (v) =>
        (v.plate || v.licence_plate || '').toUpperCase() ===
        (i.plate || i.licence_plate || '').toUpperCase()
    )
  ).length;

  const avatarSrc =
    !imageError && user?.profileImage ? user.profileImage : DEFAULT_AVATAR;

  if (isLoading) {
    return (
      <div className="relative flex h-full flex-col overflow-hidden bg-[#D6E2EC] text-[#0B1A2B]">
        <div className="relative z-20 flex flex-1 items-center justify-center px-5">
          <p className="text-sm font-semibold text-[#6F8194]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative flex h-full flex-col overflow-hidden bg-[#D6E2EC] text-[#0B1A2B]">
        <div className="relative z-20 flex flex-1 flex-col items-center justify-center px-5 text-center">
          <h2 className="text-xl font-black">Profile not found</h2>
          <p className="mt-2 text-sm text-[#6F8194]">
            Please sign in again to load your account.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="mt-5 rounded-[18px] bg-[#2F93F6] px-5 py-3 text-sm font-bold text-white"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#D6E2EC] text-[#0B1A2B]">
      {/* Header */}
      <div className="relative z-30 flex items-center justify-between px-6 pt-8 pb-5">
        <div>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-[#6F8194]">
            Account
          </p>
          <h1 className="text-[24px] font-black uppercase italic tracking-tight text-[#0B1A2B]">
            Profile
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowLangMenu((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#AFC0CF] bg-[#F3F8FC] shadow-[0_6px_14px_rgba(47,147,246,0.10)] active:scale-95"
          >
            <Globe size={16} className="text-[#2F93F6]" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 top-14 z-[70] w-40 rounded-[18px] border border-[#C7D7E4] bg-[#F3F8FC] p-2 shadow-[0_16px_32px_rgba(43,78,112,0.14)]">
              {['EN', 'FR'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#35506B] hover:bg-[#E7F0F8]"
                >
                  {lang === 'EN' ? 'English' : 'Français'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-20 flex-1 overflow-y-auto px-5 pb-28">
        <div className="flex flex-col gap-4">
          {/* Profile Card */}
          <section className="relative rounded-[28px] border border-[#BDD0DE] bg-[#EEF4F8] p-4 shadow-[0_10px_22px_rgba(70,106,140,0.10)]">
            <button
              onClick={() => navigate('/app/profile/edit')}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#C5D4E0] bg-white shadow-[0_6px_14px_rgba(47,147,246,0.14)] active:scale-95"
            >
              <Edit3 size={14} className="text-[#2F93F6]" />
            </button>

            <div className="flex gap-3">
              <img
                src={avatarSrc}
                alt="Profile"
                className="h-20 w-20 rounded-[20px] border border-[#C7D7E3] bg-white object-cover"
                onError={() => setImageError(true)}
              />

              <div className="flex-1 pt-1">
                <h2 className="text-[20px] font-extrabold text-[#0B1A2B]">
                  {user?.username || user?.name || ''}
                </h2>

                <p className="text-[10px] uppercase tracking-[0.25em] text-[#2F93F6]">
                  Community Driver
                </p>

                {user?.isVehicleOwner && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase text-emerald-600">
                    <ShieldCheck size={12} />
                    Verified
                  </div>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 rounded-[18px] border bg-white px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4F0FC]">
                  <PhoneIcon size={14} className="text-[#2F93F6]" />
                </div>
                <p className="text-[13px] text-[#0B1A2B]">
                  {user?.phone ?? ''}
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-[18px] border bg-white px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4F0FC]">
                  <Mail size={14} className="text-[#2F93F6]" />
                </div>
                <p className="text-[13px] text-[#0B1A2B]">
                  {user?.email ?? ''}
                </p>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-[24px] border bg-[#EEF4F8] p-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4D9EF2]">
                <Navigation size={18} className="text-white" />
              </div>
              <p className="text-[20px] font-black">{sentCount}</p>
              <p className="text-[10px] text-[#6F8194]">Sent</p>
            </div>

            <div className="rounded-[24px] border bg-[#EEF4F8] p-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4D9EF2]">
                <FileText size={18} className="text-white" />
              </div>
              <p className="text-[20px] font-black">{receivedCount}</p>
              <p className="text-[10px] text-[#6F8194]">Received</p>
            </div>
          </section>

          {/* Garage */}
          <section className="rounded-[26px] border bg-[#EEF4F8] p-4">
            <div className="mb-3 flex justify-between">
              <h3 className="text-[16px] font-bold">Vehicles</h3>
              <button onClick={() => navigate('/app/vehicles')}>
                <ChevronRight size={16} />
              </button>
            </div>

            {vehicles.length === 0 ? (
              <button
                onClick={() => navigate('/app/vehicles/add')}
                className="flex w-full flex-col items-center py-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E4F0FC]">
                  <Plus size={20} className="text-[#2F93F6]" />
                </div>
                <p className="mt-2 text-sm font-bold">Add Vehicle</p>
              </button>
            ) : (
              vehicles.map((v) => (
                <div key={v.id} className="flex justify-between py-2">
                  <div className="flex items-center gap-2">
                    <CarFront size={16} />
                    <p>{v.name || v.vehicle_name || ''}</p>
                  </div>
                  <ChevronRight size={16} />
                </div>
              ))
            )}
          </section>

          {/* Support */}
          <button className="flex items-center justify-between rounded-[22px] border bg-[#EEF4F8] px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span className="text-sm font-bold">Support</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;