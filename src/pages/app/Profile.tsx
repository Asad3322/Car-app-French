import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../utils/store';
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

const DEFAULT_AVATAR =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';

const Profile = () => {
  const navigate = useNavigate();
  const { user, vehicles, incidents } = useStore();

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

  const sentCount = incidents.filter((i) => i.reporterId === user.id).length;
  const receivedCount = incidents.filter((i) =>
    vehicles.some((v) => v.plate === i.plate)
  ).length;

  const avatarSrc =
    !imageError && user.profileImage ? user.profileImage : DEFAULT_AVATAR;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#D6E2EC] text-[#0B1A2B]">
      {/* Header */}
      <div className="relative z-30 flex items-center justify-between px-6 pt-8 pb-5">
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.28em] text-[#6F8194]">
            Account
          </p>
          <h1 className="text-[28px] font-black uppercase italic tracking-tight text-[#0B1A2B]">
            Profile
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowLangMenu((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#AFC0CF] bg-[#F3F8FC] shadow-[0_8px_20px_rgba(47,147,246,0.10)] transition-all duration-200 active:scale-95"
          >
            <Globe size={18} className="text-[#2F93F6]" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 top-14 z-[70] w-44 rounded-[22px] border border-[#C7D7E4] bg-[#F3F8FC] p-2 shadow-[0_16px_32px_rgba(43,78,112,0.14)]">
              {['EN', 'FR'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[#35506B] transition-all hover:bg-[#E7F0F8]"
                >
                  {lang === 'EN' ? 'English' : 'Français'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-20 flex-1 overflow-y-auto px-6 pb-32">
        <div className="flex flex-col gap-5">
          {/* Profile Card */}
          <section className="relative overflow-hidden rounded-[34px] border border-[#BDD0DE] bg-[#EEF4F8] p-5 shadow-[0_14px_30px_rgba(70,106,140,0.10)]">
            <button
              onClick={() => navigate('/app/profile/edit')}
              className="absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-[#C5D4E0] bg-white shadow-[0_8px_20px_rgba(47,147,246,0.14)] transition-all duration-200 active:scale-95"
            >
              <Edit3 size={16} className="text-[#2F93F6]" />
            </button>

            <div className="flex gap-4">
              <img
                src={avatarSrc}
                alt="Profile"
                className="h-24 w-24 rounded-[26px] border border-[#C7D7E3] bg-white object-cover ring-4 ring-[#E4EDF4]"
                onError={() => setImageError(true)}
              />

              <div className="min-w-0 flex-1 pr-10 pt-1">
                <h2 className="truncate text-[24px] font-extrabold tracking-tight text-[#0B1A2B]">
                  {user.username || 'User'}
                </h2>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2F93F6]">
                  Community Driver
                </p>

                {user.isVehicleOwner && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                    <ShieldCheck size={13} />
                    Verified Owner
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-[20px] border border-[#C6D5E1] bg-white px-4 py-3 shadow-[0_6px_16px_rgba(70,106,140,0.06)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4F0FC]">
                  <PhoneIcon size={16} className="text-[#2F93F6]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7B8D9F]">
                    Phone
                  </p>
                  <p className="truncate text-[14px] font-medium text-[#0B1A2B]">
                    {user.phone || 'No phone'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-[20px] border border-[#C6D5E1] bg-white px-4 py-3 shadow-[0_6px_16px_rgba(70,106,140,0.06)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4F0FC]">
                  <Mail size={16} className="text-[#2F93F6]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7B8D9F]">
                    Email
                  </p>
                  <p className="truncate text-[14px] font-medium text-[#0B1A2B]">
                    {user.email || 'No email'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Sent / Received */}
          <section className="grid grid-cols-2 gap-4">
            <button
              onClick={() =>
                navigate('/app/incidents', { state: { filter: 'sent' } })
              }
              className="group relative overflow-hidden rounded-[28px] border border-[#B9CBDA] bg-[#EEF4F8] p-5 text-left shadow-[0_12px_24px_rgba(70,106,140,0.08)] transition-all duration-200 hover:bg-[#F4F8FB] active:scale-[0.98]"
            >
              <div className="absolute right-[-12px] top-[-12px] h-24 w-24 rounded-full bg-[#DCEBFA] opacity-80" />
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4D9EF2] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                  <Navigation size={20} className="text-white" />
                </div>

                <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#7B8D9F]">
                  Sent
                </p>
                <p className="mt-2 text-[30px] font-black leading-none text-[#0B1A2B]">
                  {sentCount}
                </p>
                <p className="mt-2 text-xs font-medium text-[#6F8194]">
                  Reports submitted
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                navigate('/app/incidents', { state: { filter: 'received' } })
              }
              className="group relative overflow-hidden rounded-[28px] border border-[#B9CBDA] bg-[#EEF4F8] p-5 text-left shadow-[0_12px_24px_rgba(70,106,140,0.08)] transition-all duration-200 hover:bg-[#F4F8FB] active:scale-[0.98]"
            >
              <div className="absolute right-[-12px] top-[-12px] h-24 w-24 rounded-full bg-[#DCEBFA] opacity-80" />
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4D9EF2] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                  <FileText size={20} className="text-white" />
                </div>

                <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#7B8D9F]">
                  Received
                </p>
                <p className="mt-2 text-[30px] font-black leading-none text-[#0B1A2B]">
                  {receivedCount}
                </p>
                <p className="mt-2 text-xs font-medium text-[#6F8194]">
                  Owner notifications
                </p>
              </div>
            </button>
          </section>

          {/* Garage */}
          <section className="rounded-[30px] border border-[#B9CBDA] bg-[#EEF4F8] p-5 shadow-[0_14px_26px_rgba(70,106,140,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#708294]">
                  My Garage
                </p>
                <h3 className="mt-1 text-[18px] font-bold text-[#0B1A2B]">
                  Vehicles
                </h3>
              </div>

              <button
                onClick={() => navigate('/app/vehicles')}
                className="inline-flex items-center gap-1 rounded-full border border-[#BFD8F5] bg-[#E5F0FC] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F93F6] transition-all active:scale-95"
              >
                Manage
                <ChevronRight size={14} />
              </button>
            </div>

            {vehicles.length === 0 ? (
              <button
                onClick={() => navigate('/app/vehicles/add')}
                className="flex w-full flex-col items-center justify-center rounded-[26px] border border-dashed border-[#BDD0DE] bg-white px-5 py-8 text-center transition-all duration-200 hover:bg-[#F8FBFD] active:scale-[0.98]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E4F0FC]">
                  <Plus size={24} className="text-[#2F93F6]" />
                </div>
                <p className="mt-4 text-sm font-bold text-[#0B1A2B]">
                  Add Vehicle
                </p>
                <p className="mt-1 text-xs text-[#718396]">
                  Register your first car
                </p>
              </button>
            ) : (
              <div className="space-y-3">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => navigate(`/app/vehicles/${v.id}/edit`)}
                    className="flex w-full items-center justify-between rounded-[22px] border border-[#C6D5E1] bg-white px-4 py-4 text-left shadow-[0_6px_16px_rgba(70,106,140,0.06)] transition-all duration-200 hover:bg-[#F8FBFD] active:scale-[0.99]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E4F0FC]">
                        <CarFront size={18} className="text-[#2F93F6]" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-bold text-[#0B1A2B]">
                          {v.name}
                        </p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#718396]">
                          {v.plate}
                        </p>
                      </div>
                    </div>

                    <ChevronRight size={18} className="text-[#7C8FA2]" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Support */}
          <section className="pb-4 pt-1">
            <button
              onClick={() => (window.location.href = 'mailto:support@carapp.com')}
              className="flex w-full items-center justify-between rounded-[26px] border border-[#B9CBDA] bg-[#EEF4F8] px-5 py-4 text-left shadow-[0_12px_24px_rgba(70,106,140,0.08)] transition-all duration-200 hover:bg-[#F4F8FB] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E4F0FC]">
                  <Sparkles size={18} className="text-[#2F93F6]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0B1A2B]">
                    Support Helpdesk
                  </p>
                  <p className="text-xs text-[#6F8194]">
                    Contact the CARAPP support team
                  </p>
                </div>
              </div>

              <ChevronRight size={18} className="text-[#7C8FA2]" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;