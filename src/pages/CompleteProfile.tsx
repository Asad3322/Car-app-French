import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../utils/store';
import {
  User,
  Phone,
  Mail,
  ArrowRight,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const avatars = [
  'https://api.dicebear.com/9.x/fun-emoji/svg?seed=A',
  'https://api.dicebear.com/9.x/fun-emoji/svg?seed=B',
  'https://api.dicebear.com/9.x/fun-emoji/svg?seed=C',
  'https://api.dicebear.com/9.x/fun-emoji/svg?seed=D',
];

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useStore();

  const [username, setUsername] = useState(user.username || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email || '');
  const [selectedAvatar, setSelectedAvatar] = useState(
    user.profileImage || avatars[0]
  );
  const [primaryContact, setPrimaryContact] = useState<'email' | 'phone'>(
    'email'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setUser((prev) => ({
        ...prev,
        username,
        phone,
        email,
        profileImage: selectedAvatar,
        primaryContact,
      }));

      navigate('/app/home');
    }, 1200);
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-[#D6E2EC] text-[#0B1A2B]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#2F93F6]/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-5">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6F8194]">
            Welcome
          </p>
          <h1 className="text-[28px] font-black tracking-tight text-[#0B1A2B]">
            Complete Profile
          </h1>
        </div>

        <button
          onClick={() => navigate('/app/home')}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B8C9D6] bg-white text-[#6F8194] shadow-sm transition-all duration-200 hover:bg-[#F8FBFD] active:scale-95"
        >
          <X size={18} />
        </button>
      </header>

      <main className="relative z-10 flex flex-1 flex-col px-6 pb-8">
        <div className="flex flex-1 flex-col rounded-t-[34px] border border-[#B8C9D6] bg-[#EEF4F8] px-5 pt-6 pb-8 shadow-[0_16px_40px_rgba(70,106,140,0.12)]">
          <div className="mx-auto w-full max-w-[430px]">
            <section className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[#C5D6E3] bg-white shadow-[0_10px_24px_rgba(70,106,140,0.10)]">
                <Sparkles size={30} className="text-[#2F93F6]" />
              </div>

              <h2 className="text-[24px] font-black tracking-tight text-[#0B1A2B]">
                Set up your profile
              </h2>

              <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-6 text-[#6F8194]">
                Add your details and choose your emoji avatar before entering the
                app.
              </p>
            </section>

            <div className="rounded-[30px] border border-[#C5D6E3] bg-white p-5 shadow-[0_12px_28px_rgba(70,106,140,0.08)]">
              <form onSubmit={handleComplete} className="flex flex-col gap-5">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="h-24 w-24 overflow-hidden rounded-[28px] border border-[#D9E5F1] bg-[#F8FBFF] p-1.5 shadow-[0_14px_30px_rgba(70,106,140,0.10)]">
                      <img
                        src={selectedAvatar}
                        alt="Selected avatar"
                        className="h-full w-full rounded-[22px] object-cover"
                      />
                    </div>

                    <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white shadow-sm">
                      <CheckCircle2 size={14} strokeWidth={3} />
                    </div>
                  </div>

                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#6F8194]">
                    Choose Avatar
                  </p>

                  <div className="flex gap-3">
                    {avatars.map((avatar, idx) => {
                      const isActive = selectedAvatar === avatar;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar)}
                          className={`relative h-12 w-12 overflow-hidden rounded-[18px] border p-0.5 transition-all duration-200 ${
                            isActive
                              ? 'scale-110 border-[#2F93F6] bg-[#EAF4FF] shadow-[0_0_0_3px_rgba(47,147,246,0.12)]'
                              : 'border-[#D9E5F1] bg-[#F8FBFD] hover:scale-105'
                          }`}
                        >
                          <img
                            src={avatar}
                            alt={`Avatar ${idx + 1}`}
                            className="h-full w-full rounded-[14px] object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="mb-2 ml-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#6F8194]">
                    Username
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]">
                      <User size={16} />
                    </span>

                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="yourusername"
                      className="h-[56px] w-full rounded-[18px] border border-[#D9E5F1] bg-[#FCFEFF] pl-12 pr-4 text-[14px] font-medium text-[#0B1A2B] outline-none placeholder:text-[#9AA8BC] focus:border-[#2F93F6] focus:ring-2 focus:ring-[#2F93F6]/15"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 ml-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#6F8194]">
                    Email
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]">
                      <Mail size={16} />
                    </span>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="h-[56px] w-full rounded-[18px] border border-[#D9E5F1] bg-[#FCFEFF] pl-12 pr-4 text-[14px] font-medium text-[#0B1A2B] outline-none placeholder:text-[#9AA8BC] focus:border-[#2F93F6] focus:ring-2 focus:ring-[#2F93F6]/15"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 ml-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#6F8194]">
                    Phone
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]">
                      <Phone size={16} />
                    </span>

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="h-[56px] w-full rounded-[18px] border border-[#D9E5F1] bg-[#FCFEFF] pl-12 pr-4 text-[14px] font-medium text-[#0B1A2B] outline-none placeholder:text-[#9AA8BC] focus:border-[#2F93F6] focus:ring-2 focus:ring-[#2F93F6]/15"
                    />
                  </div>
                </div>

                {/* Primary Contact */}
                <div>
                  <label className="mb-2 ml-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#6F8194]">
                    Primary Contact
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPrimaryContact('email')}
                      className={`rounded-[16px] py-3 text-sm font-bold transition-all duration-200 ${
                        primaryContact === 'email'
                          ? 'bg-[#2F93F6] text-white shadow-[0_8px_18px_rgba(47,147,246,0.24)]'
                          : 'border border-[#D9E5F1] bg-[#F8FBFD] text-[#6F8194]'
                      }`}
                    >
                      Email
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrimaryContact('phone')}
                      className={`rounded-[16px] py-3 text-sm font-bold transition-all duration-200 ${
                        primaryContact === 'phone'
                          ? 'bg-[#2F93F6] text-white shadow-[0_8px_18px_rgba(47,147,246,0.24)]'
                          : 'border border-[#D9E5F1] bg-[#F8FBFD] text-[#6F8194]'
                      }`}
                    >
                      Phone
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/app/home')}
                    className="flex h-[56px] items-center justify-center rounded-[18px] border border-[#D9E5F1] bg-[#F8FBFD] text-[14px] font-bold text-[#6F8194] transition-all duration-200 hover:bg-white active:scale-[0.98]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!username.trim() || isSubmitting}
                    className="flex h-[56px] items-center justify-center gap-2 rounded-[18px] bg-[#2F93F6] text-[14px] font-black uppercase tracking-[0.04em] text-white shadow-[0_10px_20px_rgba(47,147,246,0.26)] transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Continue'}
                    {!isSubmitting && <ArrowRight size={16} />}
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-6 text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8EA1B3]">
                Safe journey starts here
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompleteProfile;