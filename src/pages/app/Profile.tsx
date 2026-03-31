import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../utils/store';
import { 
  Edit3, 
  CheckCircle2, 
  Mail, 
  Phone as PhoneIcon, 
  ShieldAlert, 
  ArrowRight, 
  ShieldCheck, 
  Navigation,
  FileText,
  CarFront,
  Settings
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, vehicles, incidents } = useStore();

  const formatFrenchNumber = (num: string) => {
    if (!num) return '';

    let cleaned = num.replace(/\D/g, '');

    // remove Pakistan code if present
    if (cleaned.startsWith('92')) {
      cleaned = cleaned.slice(2);
    }

    // remove leading 0
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1);
    }

    cleaned = cleaned.slice(0, 9);

    return `+33 ${cleaned.slice(0,1)} ${cleaned.slice(1,3)} ${cleaned.slice(3,5)} ${cleaned.slice(5,7)} ${cleaned.slice(7,9)}`;
  };
  
  const [language, setLanguage] = useState(() => localStorage.getItem('app_language') || 'EN');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
    setShowLangMenu(false);
  };

  // Count reports for quick access badges
  const sentCount = incidents.filter(i => i.reporterId === user.id).length;
  const receivedCount = incidents.filter(i => vehicles.some(v => v.plate === i.plate)).length;

  return (
    <div className="flex h-full flex-col bg-appBg px-6 pt-10 pb-10">
      {/* Top Header */}
      <div className="flex items-center justify-between px-1 mb-8">
        <h1 className="text-[24px] font-black tracking-tight text-appText uppercase italic">
          Profile
        </h1>
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-appSurface border border-appBorder text-appTextSecondary shadow-waze transition-all active:scale-95"
          >
            <Settings size={20} strokeWidth={3} />
          </button>
          
          {showLangMenu && (
            <div className="absolute right-0 top-12 w-40 overflow-hidden rounded-[24px] border border-appBorder bg-appSurface p-1.5 shadow-waze z-50">
              {['EN', 'FR'].map((lang) => (
                <button 
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`flex w-full items-center justify-between rounded-2xl p-3 text-[12px] font-black transition-all ${
                    language === lang 
                      ? 'bg-primary text-white' 
                      : 'text-appTextSecondary hover:bg-appBg'
                  }`}
                >
                  {lang === 'EN' ? 'English' : 'Français'}
                  {language === lang && <CheckCircle2 size={14} strokeWidth={3} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto pb-32">
        <div className="flex flex-col gap-8">
          
          {/* Profile Card */}
          <section className="relative rounded-[40px] border-2 border-appBorder bg-appSurface p-8 shadow-waze text-center group">
            <button 
              onClick={() => navigate('/app/profile/edit')}
              className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-full bg-appBg text-appTextSecondary border border-appBorder hover:text-primary transition-all active:scale-90"
            >
              <Edit3 size={18} strokeWidth={3} />
            </button>

            <div className="mx-auto mb-6 h-28 w-28 overflow-hidden rounded-[40px] border-4 border-appSurface bg-appBg shadow-waze p-1">
              <img
                src={user.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                alt="Profile"
                className="h-full w-full object-cover rounded-[34px]"
              />
            </div>
            
            <h2 className="text-2xl font-black tracking-tight text-appText">{user.username || 'Cool Driver'}</h2>
            <p className="mt-1 text-[11px] font-black uppercase tracking-[0.2em] text-appTextSecondary">Safety Pioneer</p>
            
            <div className="mt-4 flex flex-col gap-1 text-[13px] font-bold text-appTextSecondary/60">
                <p className="flex items-center justify-center gap-1.5">
                    <PhoneIcon size={14} className="opacity-40" />
                    {user.phone ? formatFrenchNumber(user.phone) : 'No phone added'}
                </p>
                <p className="flex items-center justify-center gap-1.5">
                    <Mail size={14} className="opacity-40" />
                    {user.email || 'No email added'}
                </p>
            </div>

            {user.isVehicleOwner && (
              <div className="mt-6 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-100 py-2 px-5 rounded-full mx-auto w-fit text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={14} strokeWidth={3} />
                Verified Owner
              </div>
            )}
          </section>

          {/* Verification / Upgrade CTA */}
          {!user.isVehicleOwner && (
            <section className="bg-primary rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer" onClick={() => navigate('/app/profile/edit')}>
               <div className="absolute -right-4 -top-4 w-28 h-28 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
               <div className="relative z-10">
                  <h3 className="text-xl font-black tracking-tight mb-2">Register your vehicle</h3>
                  <p className="text-sm font-bold opacity-80 leading-relaxed max-w-[220px]">Get real-time alerts if something happens to your car.</p>
                  <button className="mt-6 bg-white text-primary px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg flex items-center gap-2">
                    Verify Now <ArrowRight size={14} strokeWidth={3} />
                  </button>
               </div>
            </section>
          )}

          {/* Quick Access Section */}
          <section>
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-appTextSecondary/40 ml-2 mb-4 block">
                Activity Hub
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/app/incidents', { state: { filter: 'sent' } })}
                className="group flex flex-col items-center justify-center gap-3 p-6 bg-appSurface rounded-[36px] border border-appBorder shadow-waze hover:border-primary/20 transition-all active:scale-95"
              >
                <div className="relative">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                        <Navigation size={20} strokeWidth={2.5} />
                    </div>
                    {sentCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                            {sentCount}
                        </span>
                    )}
                </div>
                <span className="text-[13px] font-black text-appText">My Sent</span>
              </button>

              <button 
                onClick={() => navigate('/app/incidents', { state: { filter: 'received' } })}
                className="group flex flex-col items-center justify-center gap-3 p-6 bg-appSurface rounded-[36px] border border-appBorder shadow-waze hover:border-primary/20 transition-all active:scale-95"
              >
                <div className="relative">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                        <FileText size={20} strokeWidth={2.5} />
                    </div>
                    {receivedCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                            {receivedCount}
                        </span>
                    )}
                </div>
                <span className="text-[13px] font-black text-appText">Received</span>
              </button>
            </div>
          </section>

          {/* My Vehicles Preview */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-appTextSecondary/40">
                    My Garage
                </label>
                <button onClick={() => navigate('/app/vehicles')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                    Manage All
                </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
              {vehicles.length === 0 ? (
                <button 
                    onClick={() => navigate('/app/vehicles/add')}
                    className="w-full p-8 border-2 border-dashed border-appBorder rounded-[40px] bg-appBg/50 flex flex-col items-center gap-3 active:bg-appBg transition-all"
                >
                    <CarFront size={32} className="text-appTextSecondary/20" />
                    <p className="text-[11px] font-bold text-appTextSecondary/60 uppercase tracking-widest text-center leading-relaxed">
                        Add your first vehicle<br/>to get alerts
                    </p>
                </button>
              ) : (
                vehicles.map(vehicle => (
                  <div 
                    key={vehicle.id} 
                    onClick={() => navigate(`/app/vehicles/${vehicle.id}/edit`)}
                    className="flex flex-col gap-3 min-w-[160px] p-4 bg-appSurface border border-appBorder rounded-[32px] shadow-waze hover:shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    <div className="h-28 w-full overflow-hidden rounded-[24px] bg-appBg border border-appBorder">
                        <img 
                            src={vehicle.image || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=200'}
                            className="h-full w-full object-cover"
                            alt="Vehicle Preview"
                        />
                    </div>
                    <div className="px-1 min-w-0">
                        <p className="text-[11px] font-black text-appText truncate">{vehicle.name}</p>
                        <p className="text-[10px] font-bold text-appTextSecondary/40 font-mono tracking-widest">{vehicle.plate}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>


          {/* Support and Policies */}
          <section className="mt-4 pt-8 border-t border-appBorder flex flex-col gap-4">
             <button 
                onClick={() => window.location.href = 'mailto:support@carapp.com'}
                className="flex items-center justify-center gap-2 rounded-[24px] py-4 px-6 text-[11px] font-black uppercase tracking-widest text-appTextSecondary/60 hover:text-appText transition-colors"
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
