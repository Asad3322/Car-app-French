import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../utils/store';
import {
  CheckCircle2,
  User,
  Phone,
  ArrowRight,
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
  const [selectedAvatar, setSelectedAvatar] = useState(
    user.profileImage || avatars[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateUsername = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Username is required';
    if (/\s/.test(value)) return 'Username cannot contain spaces';
    if (trimmed.length < 6) return 'Username must be at least 6 characters';
    const existing = ['asad5566', 'user123@', 'test@99'];
    if (existing.includes(trimmed)) return 'Username already exists';
    return '';
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setUser((prev) => ({
        ...prev,
        username,
        phone,
        profileImage: selectedAvatar,
        verifiedEmail: prev.email || prev.verifiedEmail,
      }));

      setIsSubmitting(false);
      navigate('/app/home');
    }, 1500);
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-charcoal px-6 pt-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-silicon-cyan/12 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/[0.04] blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-8 text-center">
        <div className="mx-auto mb-4 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-silicon-cyan/15 shadow-[0_0_30px_rgba(53,215,255,0.25)]">
            <Sparkles size={28} className="text-silicon-cyan" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-[28px] font-black uppercase tracking-[0.08em] text-white">
          Complete Profile
        </h1>

        <p className="mx-auto mt-3 max-w-[290px] text-[14px] font-medium leading-relaxed text-white/70">
          Set up your profile details before entering the app.
        </p>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto w-full max-w-sm flex-1">
        <div className="rounded-[36px] border border-white/10 bg-[#11161D]/95 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <form onSubmit={handleComplete} className="flex flex-col gap-7">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-[38px] bg-silicon-cyan/20 blur-2xl" />
                <div className="relative h-32 w-32 overflow-hidden rounded-[38px] border border-white/10 bg-[#0D1218] p-1.5 shadow-[0_10px_30px_rgba(53,215,255,0.12)]">
                  <img
                    src={selectedAvatar}
                    alt="Selected avatar"
                    className="h-full w-full rounded-[30px] object-cover"
                  />
                </div>

                <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#11161D] bg-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.35)]">
                  <CheckCircle2 size={18} strokeWidth={3} />
                </div>
              </div>

              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-silicon-cyan">
                Choose avatar
              </p>

              <div className="mt-1 flex gap-3">
                {avatars.map((avatar, idx) => {
                  const isActive = selectedAvatar === avatar;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative h-14 w-14 overflow-hidden rounded-[20px] border p-0.5 transition-all duration-300 ${
                        isActive
                          ? 'scale-110 border-silicon-cyan shadow-[0_0_20px_rgba(53,215,255,0.28)]'
                          : 'border-white/10 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={avatar}
                        alt={`Avatar ${idx + 1}`}
                        className="h-full w-full rounded-[16px] object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.18em] text-white/75">
                Username
              </label>

              <div className="group relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 transition-colors group-focus-within:text-silicon-cyan">
                  <User size={18} />
                </span>

                <input
                  type="text"
                  placeholder="e.g. roadwarrior99"
                  value={username}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    setUsername(rawValue);
                    setError(validateUsername(rawValue));
                  }}
                  className="h-[62px] w-full rounded-[22px] border border-white/10 bg-charcoal/80 pl-12 pr-4 text-[15px] font-medium text-white placeholder:text-white/35 outline-none transition-all focus:border-silicon-cyan focus:shadow-[0_0_0_1px_rgba(53,215,255,0.2),0_0_25px_rgba(53,215,255,0.08)]"
                  required
                />
              </div>

              {error ? (
                <p className="mt-2 ml-1 text-[11px] font-bold text-red-400">
                  {error}
                </p>
              ) : (
                <p className="mt-2 ml-1 text-[11px] text-white/55">
                  At least 6 characters and no spaces.
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.18em] text-white/75">
                Phone Number
              </label>

              <div className="group relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 transition-colors group-focus-within:text-silicon-cyan">
                  <Phone size={18} />
                </span>

                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-[62px] w-full rounded-[22px] border border-white/10 bg-charcoal/80 pl-12 pr-4 text-[15px] font-medium text-white placeholder:text-white/35 outline-none transition-all focus:border-silicon-cyan focus:shadow-[0_0_0_1px_rgba(53,215,255,0.2),0_0_25px_rgba(53,215,255,0.08)]"
                />
              </div>

              <p className="mt-2 ml-1 text-[11px] text-white/55">
                Optional, but useful for urgent incident alerts.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!username.trim() || isSubmitting || !!error}
              className="mt-2 flex h-[68px] w-full items-center justify-center gap-3 rounded-[24px] bg-gradient-to-r from-[#62D8FF] to-[#38C8F5] text-[15px] font-black uppercase tracking-[0.14em] text-charcoal shadow-[0_15px_35px_rgba(53,215,255,0.28)] transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-charcoal border-t-transparent" />
                  <span>Finalizing...</span>
                </>
              ) : (
                <>
                  <span>Enter App</span>
                  <ArrowRight size={18} strokeWidth={2.8} />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 pb-8 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
          Safe journey starts here
        </p>
      </footer>
    </div>
  );
};

export default CompleteProfile;