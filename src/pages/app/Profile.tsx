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
    <div className="flex h-full flex-col bg-charcoal px-6 pt-10 pb-10 text-white">
      {/* Header */}
      <div className="relative z-40 mb-8 flex items-center justify-between px-1">
        <h1 className="text-[24px] font-black uppercase italic tracking-tight">
          Profile
        </h1>

        <div className="relative">
          <button
            onClick={() => setShowLangMenu((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 backdrop-blur-xl transition-all active:scale-95"
          >
            <Settings size={20} />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 top-12 z-[70] w-40 rounded-[20px] border border-white/10 bg-[#0B1420]/95 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              {['EN', 'FR'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`mb-1 w-full rounded-xl px-3 py-3 text-left text-[12px] font-bold transition-all last:mb-0 ${
                    language === lang
                      ? 'bg-white/10 text-[#62D8FF]'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  {lang === 'EN' ? 'English' : 'Français'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto pb-32">
        <div className="flex flex-col gap-8">
          {/* Profile Card */}
          <section className="relative rounded-[36px] border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
            <button
              onClick={() => navigate('/app/profile/edit')}
              className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all active:scale-95"
            >
              <Edit3 size={16} />
            </button>

            <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-[28px] border border-white/10 bg-white/10">
              <img
                src={avatarSrc}
                alt="Profile"
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>

            <h2 className="text-lg font-bold text-white">
              {user.username || 'Cool Driver'}
            </h2>
            <p className="text-[10px] uppercase text-white/50">Safety Pioneer</p>

            <div className="mt-4 space-y-2 text-[12px] text-white/60">
              <p className="flex items-center justify-center gap-2">
                <PhoneIcon size={14} />
                {user.phone || 'No phone'}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Mail size={14} />
                {user.email || 'No email'}
              </p>
            </div>

            {user.isVehicleOwner && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] uppercase tracking-wide text-emerald-300">
                <ShieldCheck size={14} />
                Verified Owner
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-2 gap-4">
            <button
              onClick={() =>
                navigate('/app/incidents', { state: { filter: 'sent' } })
              }
              className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-left backdrop-blur-xl transition-all active:scale-95"
            >
              <Navigation className="mb-2 text-[#62D8FF]" size={20} />
              <p className="text-sm font-bold text-white">My Sent</p>
              <p className="text-xs text-white/50">{sentCount} reports</p>
            </button>

            <button
              onClick={() =>
                navigate('/app/incidents', { state: { filter: 'received' } })
              }
              className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-left backdrop-blur-xl transition-all active:scale-95"
            >
              <FileText className="mb-2 text-[#62D8FF]" size={20} />
              <p className="text-sm font-bold text-white">Received</p>
              <p className="text-xs text-white/50">{receivedCount} reports</p>
            </button>
          </section>

          {/* Vehicles */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wide text-white/50">
                My Garage
              </span>
              <button
                onClick={() => navigate('/app/vehicles')}
                className="text-xs font-medium text-[#62D8FF]"
              >
                Manage
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {vehicles.length === 0 ? (
                <button
                  onClick={() => navigate('/app/vehicles/add')}
                  className="flex min-w-[150px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-white/50"
                >
                  <CarFront size={28} />
                  <p className="mt-2 text-xs">Add Vehicle</p>
                </button>
              ) : (
                vehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => navigate(`/app/vehicles/${v.id}/edit`)}
                    className="min-w-[140px] rounded-[24px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl"
                  >
                    <p className="text-sm font-bold text-white">{v.name}</p>
                    <p className="text-xs text-white/50">{v.plate}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Support */}
          <section className="border-t border-white/10 pt-6">
            <button
              onClick={() => (window.location.href = 'mailto:support@carapp.com')}
              className="flex items-center justify-center gap-2 text-xs text-white/60"
            >
              <ShieldAlert size={16} />
              Support Helpdesk
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;