import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Phone, Camera, ShieldCheck, Mail, Info } from 'lucide-react';
import { useStore } from '../../utils/store';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  
  const [username, setUsername] = useState(user.username || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email || '');
  const [profileImage, setProfileImage] = useState(user.profileImage || '');
  
  const [isTyping, setIsTyping] = useState(false);
  const [isUnique, setIsUnique] = useState<boolean | null>(null);

  // Phone Verification State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(user.isPhoneVerified);

  const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky&backgroundColor=b6e3f4';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
      if (username.length >= 3) {
        setIsUnique(username.toLowerCase() !== 'admin');
      } else {
        setIsUnique(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const isValid = username.length >= 3 && isUnique !== false && (email || phone);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    setUser(prev => ({
      ...prev,
      username,
      phone,
      email,
      profileImage: profileImage || prev.profileImage,
      isPhoneVerified: phoneVerified,
      isVehicleOwner: phoneVerified || prev.isVehicleOwner,
      verifiedPhone: phoneVerified ? phone : prev.verifiedPhone,
    }));
    
    navigate('/app/profile');
  };

  const handleSendOtp = () => {
    if (!phone || phone.length < 5) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (!otpCode || otpCode.length < 6) return;
    setIsVerifyingOtp(true);
    
    setTimeout(() => {
      setPhoneVerified(true);
      setIsVerifyingOtp(false);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white px-6 pt-10 pb-10 relative">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/app/profile')}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 border border-appBorder text-appText shadow-sm active:scale-95 transition-all"
        >
          <ChevronLeft size={18} strokeWidth={3} />
        </button>
        <h1 className="text-sm font-black tracking-tight text-appText uppercase tracking-widest">
            Personal Details
        </h1>
        <div className="w-11"></div>
      </header>

      <div className="flex-1 overflow-y-auto pb-48 scrollbar-hide">
        <form id="edit-profile" onSubmit={handleSave} className="flex flex-col gap-8">
          
          {/* Avatar Section - Waze Playful Style */}
          <section className="flex flex-col items-center">
            <div className="group relative">
              <div className="h-32 w-32 overflow-hidden rounded-[44px] border-4 border-white bg-slate-50 shadow-xl p-1 transition-transform group-hover:scale-105 active:scale-95">
                <img 
                  src={profileImage || user.profileImage || defaultAvatar} 
                  alt="Avatar" 
                  className="h-full w-full rounded-[38px] object-cover" 
                />
              </div>
              <label className="absolute -bottom-1 -right-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-2xl border-4 border-white hover:scale-110 active:scale-90 transition-all">
                <Camera size={18} strokeWidth={2.5} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-appTextSecondary/40">Change Profile Photo</p>
          </section>

          {/* Form Fields */}
          <section className="flex flex-col gap-6">
            <div>
              <div className="mb-2 flex items-center justify-between px-1">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-appTextSecondary/40">Username</label>
                {isUnique !== null && !isTyping && (
                  <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${isUnique ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isUnique ? <CheckCircle2 size={10} strokeWidth={3} /> : <Info size={10} strokeWidth={3} />}
                    {isUnique ? 'Available' : 'Taken'}
                  </span>
                )}
              </div>
              <input 
                type="text" 
                className="waze-input font-bold rounded-[22px]"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setIsTyping(true);
                }}
                placeholder="How others see you"
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-appTextSecondary/40 ml-1 mb-2 block">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  className="waze-input font-bold pl-12 rounded-[22px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="driver@example.com"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-appTextSecondary/30">
                  <Mail size={18} />
                </div>
              </div>
            </div>
          </section>

          {/* Verification Card */}
          <section className="rounded-[40px] border-2 border-appBorder bg-slate-50 p-8 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl text-primary shadow-sm border border-appBorder">
                    <Phone size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-black tracking-tight text-appText">Phone Verification</h3>
              </div>
              <p className="text-[12px] font-bold text-appTextSecondary/60 mb-6 leading-relaxed">Required for real-time notifications on your registered vehicles.</p>
              
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input 
                    type="tel" 
                    className="waze-input flex-1 h-[56px] font-bold"
                    placeholder="+33 6 12 34 56 78"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneVerified(false);
                      setOtpSent(false);
                    }}
                    disabled={phoneVerified}
                  />
                  {!phoneVerified && !otpSent && (
                    <button 
                      type="button"
                      onClick={handleSendOtp}
                      disabled={phone.length < 5}
                      className="bg-primary text-white rounded-2xl h-[56px] px-6 text-[10px] font-black uppercase tracking-widest shadow-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                    >
                      Send
                    </button>
                  )}
                </div>

                {otpSent && !phoneVerified && (
                  <div className="animate-in fade-in slide-in-from-top-2 flex flex-col gap-3 pt-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-appTextSecondary/40 ml-2">Enter 6-digit Code</p>
                    <div className="flex gap-2">
                        <input 
                          type="text" 
                          className="waze-input flex-1 tracking-[0.5rem] h-[56px] font-black text-center rounded-[22px]"
                          placeholder="000000"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                        />
                      <button 
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otpCode.length < 6 || isVerifyingOtp}
                        className="bg-emerald-500 text-white rounded-2xl h-[56px] px-6 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 translate-y-[-1px]"
                      >
                        {isVerifyingOtp ? '...' : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}

                {phoneVerified && (
                  <div className="flex items-center gap-4 rounded-3xl bg-white border-2 border-emerald-500/20 p-5 shadow-sm transition-all duration-500 ease-out scale-100 opacity-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                      <ShieldCheck size={20} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-appText">Phone Verified</p>
                      <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-[0.15em]">Registered for alerts</p>
                    </div>
                  </div>
                )}
              </div>
          </section>
        </form>
      </div>

      {/* Absolute Save Button - Corrected for desktop frame */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-white/95 p-6 backdrop-blur-xl border-t border-appBorder">
        <div className="mx-auto max-w-sm flex gap-3">
          <button 
            type="button"
            onClick={() => navigate('/app/profile')}
            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] text-appTextSecondary/40 border-2 border-appBorder bg-white"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="edit-profile"
            disabled={!isValid}
            className="flex-[2] waze-btn-primary h-14 text-xs shadow-xl disabled:opacity-50 disabled:grayscale"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
