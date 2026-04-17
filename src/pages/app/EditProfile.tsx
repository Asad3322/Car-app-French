import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  CheckCircle2,
  Phone,
  Camera,
  ShieldCheck,
  Mail,
  Info,
} from 'lucide-react';
import { supabase } from '../../supabase';

const EditProfile = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const [isTyping, setIsTyping] = useState(false);
  const [isUnique, setIsUnique] = useState<boolean | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const defaultAvatar =
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky&backgroundColor=b6e3f4';

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);

        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
          navigate('/auth');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', authUser.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (profile) {
          setUsername(profile.username || profile.name || '');
          setPhone(profile.phone || '');
          setEmail(profile.email || authUser.email || '');
          setProfileImage(profile.avatar_url || '');
          setPhoneVerified(
            Boolean(profile.is_vehicle_owner || profile.isVehicleOwner)
          );
        } else {
          setEmail(authUser.email || '');
        }
      } catch (error) {
        console.error('Load profile error:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
      if (username.trim().length >= 3) {
        setIsUnique(username.trim().toLowerCase() !== 'admin');
      } else {
        setIsUnique(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const isValid =
    username.trim().length >= 3 && isUnique !== false && (email || phone);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setIsSaving(true);

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          name: username.trim(),
          phone: phone.trim() || null,
          email: email.trim() || authUser.email || null,
          avatar_url: profileImage || null,
          is_vehicle_owner: phoneVerified,
          updated_at: new Date().toISOString(),
        })
        .eq('auth_user_id', authUser.id);

      if (error) {
        throw error;
      }

      navigate('/app/profile');
    } catch (err: any) {
      console.error('Update profile error:', err);
      alert(err?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
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

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FBFF] px-6">
        <div className="rounded-[24px] border border-[#DCE6F2] bg-white px-6 py-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#6B7A90]">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-[#F8FBFF] px-5 pt-10 pb-10">
      <header className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/app/profile')}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DCE6F2] bg-white text-[#0F172A] shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all active:scale-95"
        >
          <ChevronLeft size={18} strokeWidth={3} />
        </button>

        <h1 className="text-[12px] font-black uppercase tracking-[0.22em] text-[#0F172A]">
          Personal Details
        </h1>

        <div className="w-11" />
      </header>

      <div className="scrollbar-hide flex-1 overflow-y-auto pb-44">
        <form id="edit-profile" onSubmit={handleSave} className="flex flex-col gap-7">
          <section className="flex flex-col items-center pt-1">
            <div className="group relative">
              <div className="h-32 w-32 overflow-hidden rounded-[40px] border border-[#E2EAF3] bg-white p-1.5 shadow-[0_18px_40px_rgba(15,23,42,0.10)] transition-transform duration-300 group-hover:scale-[1.02]">
                <img
                  src={profileImage || defaultAvatar}
                  alt="Avatar"
                  className="h-full w-full rounded-[34px] object-cover"
                />
              </div>

              <label className="absolute -bottom-1 -right-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-4 border-[#F8FBFF] bg-[#2563EB] text-white shadow-[0_14px_28px_rgba(37,99,235,0.35)] transition-all hover:scale-105 active:scale-95">
                <Camera size={18} strokeWidth={2.5} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8]">
              Change Profile Photo
            </p>
          </section>

          <section className="rounded-[28px] border border-[#DCE6F2] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-5">
              <div>
                <div className="mb-2 flex items-center justify-between px-1">
                  <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#94A3B8]">
                    Username
                  </label>

                  {isUnique !== null && !isTyping && (
                    <span
                      className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                        isUnique ? 'text-emerald-500' : 'text-red-500'
                      }`}
                    >
                      {isUnique ? (
                        <CheckCircle2 size={10} strokeWidth={3} />
                      ) : (
                        <Info size={10} strokeWidth={3} />
                      )}
                      {isUnique ? 'Available' : 'Taken'}
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  className="h-[58px] w-full rounded-[20px] border border-[#DCE6F2] bg-[#F8FBFF] px-4 text-[15px] font-semibold text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#93C5FD] focus:bg-white focus:ring-4 focus:ring-[#DBEAFE]"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setIsTyping(true);
                  }}
                  placeholder="How others see you"
                />
              </div>

              <div>
                <label className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-[0.18em] text-[#94A3B8]">
                  Email Address
                </label>

                <div className="relative">
                  <input
                    type="email"
                    className="h-[58px] w-full rounded-[20px] border border-[#DCE6F2] bg-[#F8FBFF] pl-12 pr-4 text-[15px] font-semibold text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#93C5FD] focus:bg-white focus:ring-4 focus:ring-[#DBEAFE]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@example.com"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                    <Mail size={18} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-[#DCE6F2] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#DCE6F2] bg-[#F8FBFF] text-[#2563EB] shadow-sm">
                <Phone size={18} strokeWidth={2.5} />
              </div>

              <div>
                <h3 className="text-[14px] font-black tracking-tight text-[#0F172A]">
                  Phone Verification
                </h3>
                <p className="mt-0.5 text-[12px] font-medium leading-relaxed text-[#64748B]">
                  Required for real-time vehicle notifications.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  type="tel"
                  className="h-[56px] flex-1 rounded-[20px] border border-[#DCE6F2] bg-[#F8FBFF] px-4 text-[15px] font-semibold text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#93C5FD] focus:bg-white focus:ring-4 focus:ring-[#DBEAFE] disabled:opacity-70"
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
                    className="h-[56px] rounded-[20px] bg-[#2563EB] px-5 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-[0_12px_24px_rgba(37,99,235,0.28)] transition-all active:scale-95 disabled:opacity-50"
                  >
                    Send
                  </button>
                )}
              </div>

              {otpSent && !phoneVerified && (
                <div className="animate-in fade-in slide-in-from-top-2 flex flex-col gap-3 pt-1">
                  <p className="ml-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#94A3B8]">
                    Enter 6-digit Code
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="h-[56px] flex-1 rounded-[20px] border border-[#DCE6F2] bg-[#F8FBFF] px-4 text-center text-[15px] font-black tracking-[0.45rem] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#86EFAC] focus:bg-white focus:ring-4 focus:ring-[#DCFCE7]"
                      placeholder="000000"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpCode.length < 6 || isVerifyingOtp}
                      className="h-[56px] rounded-[20px] bg-emerald-500 px-5 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-[0_12px_24px_rgba(16,185,129,0.28)] transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isVerifyingOtp ? '...' : 'Verify'}
                    </button>
                  </div>
                </div>
              )}

              {phoneVerified && (
                <div className="flex items-center gap-4 rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_10px_20px_rgba(16,185,129,0.25)]">
                    <ShieldCheck size={20} strokeWidth={3} />
                  </div>

                  <div>
                    <p className="text-[14px] font-black text-[#0F172A]">
                      Phone Verified
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-600">
                      Registered for alerts
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </form>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 border-t border-[#DCE6F2] bg-white/95 p-5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-sm gap-3">
          <button
            type="button"
            onClick={() => navigate('/app/profile')}
            className="h-14 flex-1 rounded-[18px] border border-[#DCE6F2] bg-white text-[10px] font-black uppercase tracking-[0.16em] text-[#64748B] transition-all active:scale-[0.98]"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="edit-profile"
            disabled={!isValid || isSaving}
            className="h-14 flex-[2] rounded-[18px] bg-[#2563EB] px-5 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;