import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../utils/store';
import {
  Edit3,
  Mail,
  Phone as PhoneIcon,
  ShieldAlert,
  ShieldCheck,
  Navigation,
  FileText,
  CarFront,
  Settings,
  ChevronRight,
  Globe,
  Plus,
} from 'lucide-react';

const DEFAULT_AVATAR =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';

const Profile = () => {
  const navigate = useNavigate();
  const { user, vehicles, incidents } = useStore();

  const [language, setLanguage] = useState(
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
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#AFC0CF] bg-[#F3F8FC] text-[#2F93F6] shadow-[0_8px_24px_rgba(31,84,133,0.18)] transition-all duration-200 active:scale-95"
          >
            <Settings size={18} className="text-[#2F93F6]" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 top-14 z-[70] w-44 rounded-[22px] border border-[#B8C9D7] bg-[#F3F8FC] p-2 shadow-[0_18px_40px_rgba(41,75,110,0.16)]">
              {['EN', 'FR'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`mb-1 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-[13px] font-semibold transition-all duration-200 last:mb-0 ${
                    language === lang
                      ? 'bg-[#DDEBFA] text-[#2F93F6]'
                      : 'text-[#4F6478] hover:bg-[#EAF2F8]'
                  }`}
                >
                  <span>{lang === 'EN' ? 'English' : 'Français'}</span>
                  <Globe size={15} className="shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-20 flex-1 overflow-y-auto px-6 pb-32">
        <div className="flex flex-col gap-5">
          {/* Hero Profile Card */}
          <section className="relative overflow-hidden rounded-[34px] border border-[#B6C8D8] bg-[#EEF4F8] p-5 shadow-[0_14px_30px_rgba(70,106,140,0.10)]">
            <button
              onClick={() => navigate('/app/profile/edit')}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#C5D4E0] bg-white text-[#2F93F6] transition-all duration-200 active:scale-95"
            >
              <Edit3 size={16} className="text-[#2F93F6]" />
            </button>

            <div className="relative z-10 flex items-start gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[28px] border border-[#C7D7E3] bg-white ring-4 ring-[#E4EDF4]">
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={() => setImageError(true)}
                />
              </div>

              <div className="min-w-0 flex-1 pr-10 pt-1">
                <h2 className="truncate text-[22px] font-extrabold tracking-tight text-[#0B1A2B]">
                  {user.username || 'Cool Driver'}
                </h2>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2F93F6]">
                  Safety Pioneer
                </p>

                {user.isVehicleOwner && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                    <ShieldCheck size={13} />
                    Verified Owner
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10 mt-5 grid gap-3">
              <div className="flex items-center gap-3 rounded-[20px] border border-[#C6D5E1] bg-white px-4 py-3">
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

              <div className="flex items-center gap-3 rounded-[20px] border border-[#C6D5E1] bg-white px-4 py-3">
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

          {/* Stats / Quick Actions */}
          <section className="grid grid-cols-2 gap-4">
            <button
              onClick={() =>
                navigate('/app/incidents', { state: { filter: 'sent' } })
              }
              className="group rounded-[28px] border border-[#B9CBDA] bg-[#EEF4F8] p-5 text-left shadow-[0_12px_24px_rgba(70,106,140,0.08)] transition-all duration-200 hover:bg-[#F4F8FB] active:scale-[0.98]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E2EFFF]">
                <Navigation size={20} className="text-[#2F93F6]" />
              </div>

              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#708294]">
                My Sent
              </p>
              <p className="mt-1 text-[22px] font-extrabold text-[#0B1A2B]">
                {sentCount}
              </p>
              <p className="mt-1 text-xs text-[#6F8194]">Reports submitted</p>
            </button>

            <button
              onClick={() =>
                navigate('/app/incidents', { state: { filter: 'received' } })
              }
              className="group rounded-[28px] border border-[#B9CBDA] bg-[#EEF4F8] p-5 text-left shadow-[0_12px_24px_rgba(70,106,140,0.08)] transition-all duration-200 hover:bg-[#F4F8FB] active:scale-[0.98]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E2EFFF]">
                <FileText size={20} className="text-[#2F93F6]" />
              </div>

              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#708294]">
                Received
              </p>
              <p className="mt-1 text-[22px] font-extrabold text-[#0B1A2B]">
                {receivedCount}
              </p>
              <p className="mt-1 text-xs text-[#6F8194]">Owner notifications</p>
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

            <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
              {vehicles.length === 0 ? (
                <button
                  onClick={() => navigate('/app/vehicles/add')}
                  className="flex min-w-[180px] flex-col items-center justify-center rounded-[26px] border border-dashed border-[#BDD0DE] bg-white px-5 py-8 text-center transition-all duration-200 hover:bg-[#F8FBFD] active:scale-[0.98]"
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
                vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => navigate(`/app/vehicles/${v.id}/edit`)}
                    className="min-w-[185px] rounded-[26px] border border-[#C2D2DF] bg-white p-4 text-left transition-all duration-200 hover:bg-[#F8FBFD] active:scale-[0.98]"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0FC]">
                      <CarFront size={20} className="text-[#2F93F6]" />
                    </div>

                    <p className="truncate text-[16px] font-bold text-[#0B1A2B]">
                      {v.name}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#718396]">
                      {v.plate}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>

          {/* Preferences */}
          <section className="rounded-[30px] border border-[#B9CBDA] bg-[#EEF4F8] p-5 shadow-[0_14px_26px_rgba(70,106,140,0.08)]">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E4F0FC]">
                <Globe size={18} className="text-[#2F93F6]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#708294]">
                  Preferences
                </p>
                <h3 className="text-[16px] font-bold text-[#0B1A2B]">
                  App Language
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-[22px] border border-[#C6D5E1] bg-white px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-[#0B1A2B]">
                  Current language
                </p>
                <p className="mt-1 text-xs text-[#6F8194]">
                  {language === 'EN' ? 'English' : 'Français'}
                </p>
              </div>

              <button
                onClick={() => setShowLangMenu((prev) => !prev)}
                className="rounded-full bg-[#E4F0FC] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2F93F6] transition-all active:scale-95"
              >
                Change
              </button>
            </div>
          </section>

          {/* Support */}
          <section className="pb-4 pt-1">
            <button
              onClick={() => (window.location.href = 'mailto:support@carapp.com')}
              className="flex w-full items-center justify-between rounded-[26px] border border-[#B9CBDA] bg-[#EEF4F8] px-5 py-4 text-left shadow-[0_12px_24px_rgba(70,106,140,0.08)] transition-all duration-200 hover:bg-[#F4F8FB] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF0F0]">
                  <ShieldAlert size={18} className="text-[#E35D5D]" />
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