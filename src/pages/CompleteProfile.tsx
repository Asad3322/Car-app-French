import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../utils/store';
import {
  User,
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
    <div className="relative flex min-h-[100dvh] w-full flex-col bg-[#D6E2EC] text-[#0B1A2B]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#2F93F6]/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-7 pb-4">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6F8194]">
            Welcome
          </p>
          <h1 className="text-[26px] font-black tracking-tight text-[#0B1A2B]">
            Complete Profile
          </h1>
        </div>

        <button
          onClick={() => navigate('/app/home')}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B8C9D6] bg-white text-[#6F8194] shadow-sm hover:bg-[#F8FBFD]"
        >
          <X size={18} />
        </button>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-1 flex-col px-4 pb-6">
        <div className="flex flex-1 flex-col rounded-t-[30px] border border-[#B8C9D6] bg-[#EEF4F8] px-4 pt-5 pb-6 shadow">
          <div className="mx-auto w-full max-w-[440px]">

            {/* Top */}
            <section className="mb-5 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border bg-white shadow">
                <Sparkles size={30} className="text-[#2F93F6]" />
              </div>

              <h2 className="text-[24px] font-black">
                Set up your profile
              </h2>

              <p className="mt-2 text-[14px] text-[#6F8194]">
                Add your details and choose your emoji avatar before entering the app.
              </p>
            </section>

            {/* Card */}
            <div className="rounded-[28px] border bg-white px-4 py-5 shadow">
              <form onSubmit={handleComplete} className="flex flex-col gap-4">

                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="h-28 w-28 rounded-[30px] border bg-[#F8FBFF] p-1.5">
                      <img src={selectedAvatar} className="rounded-[24px]" />
                    </div>

                    <div className="absolute -bottom-1 -right-1 h-9 w-9 flex items-center justify-center rounded-full bg-emerald-500 text-white border-4 border-white">
                      <CheckCircle2 size={15} />
                    </div>
                  </div>

                  <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F8194]">
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
                          className={`h-14 w-14 rounded-[18px] border p-0.5 ${
                            isActive
                              ? 'border-[#2F93F6] bg-[#EAF4FF]'
                              : 'border-[#D9E5F1]'
                          }`}
                        >
                          <img src={avatar} className="rounded-[14px]" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#6F8194]">
                    Username
                  </label>
                  <div className="relative mt-2">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]" size={17}/>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-[58px] w-full rounded-[20px] border pl-12 pr-4"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#6F8194]">
                    Email
                  </label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]" size={17}/>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-[58px] w-full rounded-[20px] border pl-12 pr-4"
                    />
                  </div>
                </div>

                {/* Phone (UPDATED 🇫🇷) */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#6F8194]">
                    Phone
                  </label>

                  <div className="relative mt-2">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-semibold">
                      🇫🇷 +33
                    </div>

                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="6 12 34 56 78"
                      className="h-[58px] w-full rounded-[20px] border pl-20 pr-4"
                    />
                  </div>
                </div>

                {/* Primary Contact */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#6F8194]">
                    Primary Contact
                  </label>

                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setPrimaryContact('email')}
                      className={`h-[54px] rounded-[18px] ${
                        primaryContact === 'email'
                          ? 'bg-[#2F93F6] text-white'
                          : 'border'
                      }`}
                    >
                      Email
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrimaryContact('phone')}
                      className={`h-[54px] rounded-[18px] ${
                        primaryContact === 'phone'
                          ? 'bg-[#2F93F6] text-white'
                          : 'border'
                      }`}
                    >
                      Phone
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/app/home')}
                    className="h-[58px] rounded-[20px] border"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!username.trim() || isSubmitting}
                    className="h-[58px] rounded-[20px] bg-[#2F93F6] text-white flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Saving...' : 'Continue'}
                    {!isSubmitting && <ArrowRight size={17} />}
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-5 text-center text-[11px] text-[#8EA1B3]">
              Safe journey starts here
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompleteProfile;