import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../utils/store';
import { CheckCircle2, User, Phone, ArrowRight, Sparkles } from 'lucide-react';

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
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateUsername = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "Username is required";
    if (/\s/.test(value)) return "Username cannot contain spaces";
    if (trimmed.length < 6) return "Username must be at least 6 characters";
    const existing = ["asad5566", "user123@", "test@99"];
    if (existing.includes(trimmed)) return "Username already exists";
    return "";
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate save
    setTimeout(() => {
      setUser(prev => ({
        ...prev,
        username,
        phone,
        profileImage: selectedAvatar,
        // Since they came from email verify, we prefill email
        verifiedEmail: prev.email || prev.verifiedEmail
      }));
      
      setIsSubmitting(false);
      navigate('/app/home');
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col bg-appBg px-6 pt-12 sm:rounded-[40px] relative overflow-hidden">
      {/* Visual background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-40 -mr-20 -mt-20"></div>

      <header className="mb-10 text-center relative z-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[24px] bg-blue-600 text-white shadow-lg">
          <Sparkles size={32} />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-appText uppercase">
          Welcome!
        </h1>
        <p className="mt-2 text-[15px] font-bold text-appTextSecondary">
          Let's set up your profile to get started.
        </p>
      </header>

      <main className="flex-1 max-w-sm mx-auto w-full relative z-10">
        <form onSubmit={handleComplete} className="flex flex-col gap-8">
          
          {/* Avatar Selector */}
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="h-28 w-28 overflow-hidden rounded-[36px] border-4 border-appSurface bg-appBg shadow-waze p-1 transition-transform hover:scale-105">
                <img 
                  src={selectedAvatar} 
                  alt="Selected avatar" 
                  className="h-full w-full rounded-[28px] object-cover" 
                />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg border-2 border-white">
                <CheckCircle2 size={16} strokeWidth={3} />
              </div>
            </div>
            
            <div className="flex gap-3">
              {avatars.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`h-12 w-12 overflow-hidden rounded-2xl border-2 transition-all p-0.5 ${
                    selectedAvatar === avatar ? 'border-blue-600 scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={avatar} alt="Avatar option" className="h-full w-full rounded-[10px] object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-appTextSecondary ml-1 mb-2 block">
                Display Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-appTextSecondary/50">
                  <User size={18} />
                </span>
                <input 
                  type="text" 
                  placeholder="e.g. RoadWarrior" 
                  className="waze-input pl-12 h-[60px]"
                  value={username}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    setUsername(val);
                    setError(validateUsername(val));
                  }}
                  required
                />
                {error && (
                  <p className="mt-1.5 text-[10px] font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
                    {error}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-appTextSecondary ml-1 mb-2 block">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-appTextSecondary/50">
                  <Phone size={18} />
                </span>
                <input 
                  type="tel" 
                  placeholder="+33 6 12 34 56 78" 
                  className="waze-input pl-12 h-[60px]"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <p className="mt-2 text-[10px] font-bold text-appTextSecondary opacity-60 ml-1">
                Used for urgent vehicle alerts later.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={!username.trim() || isSubmitting || !!error}
            className="w-full bg-primary text-white h-[68px] mt-4 flex items-center justify-center gap-3 rounded-[28px] shadow-xl disabled:grayscale disabled:opacity-50 font-black uppercase tracking-widest active:scale-95 transition-all text-[15px]"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            <span className="font-black">{isSubmitting ? 'Finalizing...' : 'Enter App'}</span>
            {!isSubmitting && <ArrowRight size={20} strokeWidth={2.5} />}
          </button>
        </form>
      </main>

      <footer className="mt-auto mb-10 text-center">
         <p className="text-[11px] font-black uppercase tracking-widest text-appTextSecondary/30">
           Safe journey starts here
         </p>
      </footer>
    </div>
  );
};

export default CompleteProfile;
