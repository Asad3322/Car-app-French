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
import { supabase } from '../../supabase';

const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_AVATAR =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';

type ProfileUser = {
  id: string;
  auth_user_id?: string;
  username?: string;
  name?: string;
  phone?: string;
  email?: string;
  profileImage?: string;
  avatar_url?: string;
  role?: string;
  isVehicleOwner?: boolean;
  is_vehicle_owner?: boolean;
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
  receiverId?: string;
  receiver_id?: string;
  plate?: string;
  licence_plate?: string;
};

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [vehicles, setVehicles] = useState<ProfileVehicle[]>([]);
  const [sentIncidents, setSentIncidents] = useState<ProfileIncident[]>([]);
  const [receivedIncidents, setReceivedIncidents] = useState<ProfileIncident[]>(
    []
  );
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
    let isMounted = true;

    const fetchProfileData = async () => {
      try {
        setIsLoading(true);

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          if (isMounted) {
            setUser(null);
            setVehicles([]);
            setSentIncidents([]);
            setReceivedIncidents([]);
          }
          return;
        }

        localStorage.setItem('token', session.access_token);

        const headers = {
          Authorization: `Bearer ${session.access_token}`,
        };

        const meRes = await fetch(`${API_URL}/api/auth/me`, {
          method: 'GET',
          headers,
        });

        const meResult = await meRes.json();

        if (!meRes.ok) {
          console.error('Profile /me fetch failed:', meResult);
          if (isMounted) {
            setUser(null);
          }
          return;
        }

        const authUser = meResult?.data?.auth;
        const profile = meResult?.data?.profile;

        const fallbackProfile: ProfileUser = {
          id: authUser?.id || '',
          auth_user_id: authUser?.id || '',
          email: authUser?.email || '',
          username:
            profile?.username ||
            profile?.name ||
            authUser?.email?.split('@')?.[0] ||
            'User',
          name:
            profile?.name ||
            profile?.username ||
            authUser?.email?.split('@')?.[0] ||
            'User',
          phone: authUser?.phone || '',
          avatar_url: DEFAULT_AVATAR,
          role: 'reporter',
          is_vehicle_owner: false,
        };

        if (isMounted) {
          setUser({
            ...fallbackProfile,
            ...(profile || {}),
            id: authUser?.id || profile?.auth_user_id || fallbackProfile.id,
            username:
              profile?.username ||
              profile?.name ||
              fallbackProfile.username ||
              'User',
            name:
              profile?.name ||
              profile?.username ||
              fallbackProfile.name ||
              'User',
            email: profile?.email || authUser?.email || '',
            phone: profile?.phone || authUser?.phone || '',
          });
        }

        const [vehiclesRes, sentRes, receivedRes] = await Promise.allSettled([
          fetch(`${API_URL}/api/vehicles`, {
            method: 'GET',
            headers,
          }),
          fetch(`${API_URL}/api/reports/sent`, {
            method: 'GET',
            headers,
          }),
          fetch(`${API_URL}/api/reports/received`, {
            method: 'GET',
            headers,
          }),
        ]);

        if (!isMounted) return;

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

        if (sentRes.status === 'fulfilled') {
          const response = sentRes.value;
          const result = await response.json();

          if (response.ok) {
            setSentIncidents(Array.isArray(result?.data) ? result.data : []);
          } else {
            console.error('Sent incidents fetch failed:', result);
            setSentIncidents([]);
          }
        } else {
          console.error('Sent incidents request error:', sentRes.reason);
          setSentIncidents([]);
        }

        if (receivedRes.status === 'fulfilled') {
          const response = receivedRes.value;
          const result = await response.json();

          if (response.ok) {
            setReceivedIncidents(Array.isArray(result?.data) ? result.data : []);
          } else {
            console.error('Received incidents fetch failed:', result);
            setReceivedIncidents([]);
          }
        } else {
          console.error('Received incidents request error:', receivedRes.reason);
          setReceivedIncidents([]);
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        if (isMounted) {
          setUser(null);
          setVehicles([]);
          setSentIncidents([]);
          setReceivedIncidents([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfileData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setVehicles([]);
        setSentIncidents([]);
        setReceivedIncidents([]);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const sentCount = sentIncidents.length;
  const receivedCount = receivedIncidents.length;

  const avatarSrc =
    !imageError && (user?.profileImage || user?.avatar_url)
      ? (user?.profileImage || user?.avatar_url)!
      : DEFAULT_AVATAR;

  const isOwner =
    user?.role === 'vehicle_owner' ||
    user?.isVehicleOwner ||
    user?.is_vehicle_owner;

  if (isLoading) {
    return (
      <div className="relative flex h-full flex-col overflow-hidden bg-[#D6E2EC] text-[#0B1A2B]">
        <div className="relative z-20 flex flex-1 items-center justify-center px-5">
          <p className="text-sm font-semibold text-[#6F8194]">
            Loading profile...
          </p>
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
                  {user?.username || user?.name || 'User'}
                </h2>

                <p className="text-[10px] uppercase tracking-[0.25em] text-[#2F93F6]">
                  Community Driver
                </p>

                {isOwner && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase text-emerald-600">
                    <ShieldCheck size={12} />
                    Verified Owner
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {isOwner ? (
                <div className="flex items-center gap-3 rounded-[18px] border bg-white px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4F0FC]">
                    <PhoneIcon size={14} className="text-[#2F93F6]" />
                  </div>
                  <p className="text-[13px] text-[#0B1A2B]">
                    {user?.phone || 'No phone'}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-[18px] border bg-white px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4F0FC]">
                    <Mail size={14} className="text-[#2F93F6]" />
                  </div>
                  <p className="text-[13px] text-[#0B1A2B]">
                    {user?.email || 'No email'}
                  </p>
                </div>
              )}
            </div>
          </section>

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