import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  CheckCircle2,
  Phone,
  Camera,
  Mail,
  Info,
} from "lucide-react";
import { supabase } from "../../supabase";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const EditProfile = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [currentProfileId, setCurrentProfileId] = useState("");
  const [authUserId, setAuthUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [isTyping, setIsTyping] = useState(false);
  const [isUnique, setIsUnique] = useState<boolean | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const defaultAvatar =
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky&backgroundColor=b6e3f4";

  const normalizeUsername = (value: string) => value.trim().toLowerCase();

  const getAuthHeaders = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token || localStorage.getItem("token");
    const ownerAccessToken =
      localStorage.getItem("ownerAccessToken") ||
      localStorage.getItem("ownerAccess");

    if (token) localStorage.setItem("token", token);

    const headers: Record<string, string> = {};

    if (ownerAccessToken) {
      headers["x-owner-access-token"] = ownerAccessToken;
    } else if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return { token, ownerAccessToken, headers };
  };

  const validateUsername = (value: string) => {
    const normalized = normalizeUsername(value);

    if (!normalized) return "Username is required";
    if (normalized.length < 3 || normalized.length > 20) {
      return "Username must be between 3 and 20 characters";
    }
    if (!/^[a-z0-9_.]+$/.test(normalized)) {
      return "Use only letters, numbers, underscore, and dot";
    }

    return "";
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);

        const { token, ownerAccessToken, headers } = await getAuthHeaders();

        if (!token && !ownerAccessToken) {
          navigate("/auth");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: "GET",
          headers,
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Edit profile /me failed:", result);
          navigate("/auth");
          return;
        }

        const authUser = result?.data?.auth;
        const profile = result?.data?.profile;

        if (profile) {
          const existingPhone = profile.phone || authUser?.phone || "";

          setCurrentProfileId(profile.id || "");
          setAuthUserId(profile.auth_user_id || authUser?.id || "");
          setUsername(profile.username || profile.name || "");
          setPhone(existingPhone);
          setVerifiedPhone(existingPhone);
          setOtpVerified(Boolean(existingPhone));
          setEmail(profile.email || authUser?.email || "");
          setProfileImage(profile.avatar_url || profile.profileImage || "");

          localStorage.setItem("user", JSON.stringify(profile));
          if (profile.id) localStorage.setItem("profileId", profile.id);
          if (profile.role) localStorage.setItem("role", profile.role);
        } else {
          setAuthUserId(authUser?.id || "");
          setEmail(authUser?.email || "");
        }
      } catch (error) {
        console.error("Load profile error:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [navigate]);

  useEffect(() => {
    const checkUsername = async () => {
      const validationMessage = validateUsername(username);

      if (!username.trim()) {
        setIsUnique(null);
        setUsernameError("");
        setIsTyping(false);
        return;
      }

      if (validationMessage) {
        setUsernameError(validationMessage);
        setIsUnique(false);
        setIsTyping(false);
        return;
      }

      try {
        const normalized = normalizeUsername(username);

        const { data, error } = await supabase
          .from("profiles")
          .select("id, auth_user_id, username")
          .ilike("username", normalized);

        if (error) throw error;

        const takenByAnotherUser = (data || []).some((item: any) => {
          const sameProfile = currentProfileId && item?.id === currentProfileId;
          const sameAuthUser = authUserId && item?.auth_user_id === authUserId;

          return !sameProfile && !sameAuthUser;
        });

        setUsernameError(
          takenByAnotherUser ? "This username is already taken" : "",
        );
        setIsUnique(!takenByAnotherUser);
      } catch (error) {
        console.error("Username check error:", error);
        setIsUnique(null);
        setUsernameError("");
      } finally {
        setIsTyping(false);
      }
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username, currentProfileId, authUserId]);

  const existingRole = localStorage.getItem("role") || "reporter";
  const isExistingOwner = existingRole === "vehicle_owner";

  const reporterPhoneChanged =
    !isExistingOwner && phone.trim() && phone.trim() !== verifiedPhone.trim();

  const isReporterPhoneValid =
    isExistingOwner || !phone.trim() || !reporterPhoneChanged || otpVerified;

  const isValid =
    username.trim().length >= 3 &&
    isUnique !== false &&
    !usernameError &&
    Boolean(email || phone) &&
    isReporterPhoneValid;

  const handleSendOtp = async () => {
    try {
      if (!phone.trim() || phone.trim().length < 5) {
        alert("Please enter a valid phone number");
        return;
      }

      setIsSendingOtp(true);

      const { headers } = await getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/api/auth/send-phone-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to send OTP");
      }

      setOtpSent(true);
      setOtpVerified(false);
      alert("OTP sent successfully");
    } catch (error: any) {
      console.error("Send OTP error:", error);
      alert(error?.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (!phone.trim() || otpCode.trim().length < 6) {
        alert("Please enter the 6-digit OTP");
        return;
      }

      setIsVerifyingOtp(true);

      const { headers } = await getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/api/auth/verify-phone-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({
          phone: phone.trim(),
          otp: otpCode.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to verify OTP");
      }

      const updatedProfile = result?.data?.profile;
      const verified = result?.data?.phone || phone.trim();

      setVerifiedPhone(verified);
      setPhone(verified);
      setOtpVerified(true);
      setOtpSent(false);
      setOtpCode("");

      if (updatedProfile) {
        localStorage.setItem("user", JSON.stringify(updatedProfile));
        if (updatedProfile.id) localStorage.setItem("profileId", updatedProfile.id);
        if (updatedProfile.role) localStorage.setItem("role", updatedProfile.role);
      }

      window.dispatchEvent(new Event("profileUpdated"));
      alert("Phone verified successfully");
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      alert(error?.message || "Failed to verify OTP");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      if (!isReporterPhoneValid) {
        alert("Please verify your phone number before saving");
      }
      return;
    }

    try {
      setIsSaving(true);

      const normalizedUsername = normalizeUsername(username);
      const validationMessage = validateUsername(username);

      if (validationMessage) {
        setUsernameError(validationMessage);
        setIsUnique(false);
        setIsSaving(false);
        return;
      }

      const { data: existingUsers, error: existingUsersError } = await supabase
        .from("profiles")
        .select("id, auth_user_id, username")
        .ilike("username", normalizedUsername);

      if (existingUsersError) throw existingUsersError;

      const takenByAnotherUser = (existingUsers || []).some((item: any) => {
        const sameProfile = currentProfileId && item?.id === currentProfileId;
        const sameAuthUser = authUserId && item?.auth_user_id === authUserId;

        return !sameProfile && !sameAuthUser;
      });

      if (takenByAnotherUser) {
        setUsernameError("This username is already taken");
        setIsUnique(false);
        setIsSaving(false);
        return;
      }

      const { token, ownerAccessToken, headers } = await getAuthHeaders();

      if (!token && !ownerAccessToken) {
        throw new Error("Missing authentication token");
      }

      const payload = {
        role: existingRole,
        verifiedPhone: isExistingOwner ? "" : verifiedPhone || "",
        vehicleId: isExistingOwner
          ? localStorage.getItem("vehicleId") || ""
          : "",
        name: normalizedUsername,
        username: normalizedUsername,
        email: email.trim() || "",
        phone: isExistingOwner ? phone.trim() || "" : verifiedPhone || "",
        profileImage: profileImage || "",
        avatar_url: profileImage || "",
        primaryContact: isExistingOwner ? "phone" : "email",
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/create-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update profile");
      }

      const updatedProfile = result?.data?.profile;

      if (updatedProfile) {
        const safeUpdatedProfile = {
          ...updatedProfile,
          username: updatedProfile.username || normalizedUsername,
          name: updatedProfile.name || normalizedUsername,
          profileImage:
            updatedProfile.profileImage ||
            updatedProfile.avatar_url ||
            profileImage ||
            "",
          avatar_url:
            updatedProfile.avatar_url ||
            updatedProfile.profileImage ||
            profileImage ||
            "",
        };

        localStorage.setItem("user", JSON.stringify(safeUpdatedProfile));

        if (safeUpdatedProfile.id) {
          localStorage.setItem("profileId", safeUpdatedProfile.id);
        }

        if (safeUpdatedProfile.role) {
          localStorage.setItem("role", safeUpdatedProfile.role);
        }

        window.dispatchEvent(new Event("profileUpdated"));
      }

      navigate("/app/profile");
    } catch (err: any) {
      console.error("Update profile error FULL:", err);

      if (
        err?.code === "23505" ||
        err?.message?.toLowerCase()?.includes("duplicate")
      ) {
        setUsernameError("This username is already taken");
        setIsUnique(false);
      } else {
        alert(err?.message || "Failed to update profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const uploadAvatarToSupabase = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `avatars/${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      const publicUrl = await uploadAvatarToSupabase(file);

      setProfileImage(publicUrl);
      window.dispatchEvent(new Event("profileUpdated"));
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      alert(error?.message || "Failed to upload avatar");
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
          type="button"
          onClick={() => navigate("/app/profile")}
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
        <form
          id="edit-profile"
          onSubmit={handleSave}
          className="flex flex-col gap-7"
        >
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

                  {isUnique !== null && !isTyping && !usernameError && (
                    <span
                      className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                        isUnique ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {isUnique ? (
                        <CheckCircle2 size={10} strokeWidth={3} />
                      ) : (
                        <Info size={10} strokeWidth={3} />
                      )}
                      {isUnique ? "Available" : "Taken"}
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

                {usernameError && (
                  <p className="mt-2 px-1 text-[11px] font-semibold text-red-500">
                    {usernameError}
                  </p>
                )}
              </div>

              {isExistingOwner && (
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
              )}
            </div>
          </section>

          <section className="rounded-[30px] border border-[#DCE6F2] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            {isExistingOwner ? (
              <>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#DCE6F2] bg-[#F8FBFF] text-[#2563EB] shadow-sm">
                    <Mail size={18} strokeWidth={2.5} />
                  </div>

                  <div>
                    <h3 className="text-[14px] font-black tracking-tight text-[#0F172A]">
                      Add Email
                    </h3>
                    <p className="mt-0.5 text-[12px] font-medium leading-relaxed text-[#64748B]">
                      Add your email to link your previous reports.
                    </p>
                  </div>
                </div>

                <input
                  type="email"
                  className="h-[56px] w-full rounded-[20px] border border-[#DCE6F2] bg-[#F8FBFF] px-4 text-[15px] font-semibold text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#93C5FD] focus:bg-white focus:ring-4 focus:ring-[#DBEAFE]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="driver@example.com"
                />
              </>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#DCE6F2] bg-[#F8FBFF] text-[#2563EB] shadow-sm">
                    <Phone size={18} strokeWidth={2.5} />
                  </div>

                  <div>
                    <h3 className="text-[14px] font-black tracking-tight text-[#0F172A]">
                      Add Phone Number
                    </h3>
                    <p className="mt-0.5 text-[12px] font-medium leading-relaxed text-[#64748B]">
                      Verify your phone to link previously registered vehicles.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="tel"
                    className="h-[56px] flex-1 rounded-[20px] border border-[#DCE6F2] bg-[#F8FBFF] px-4 text-[15px] font-semibold text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#93C5FD] focus:bg-white focus:ring-4 focus:ring-[#DBEAFE]"
                    placeholder="+33 6 12 34 56 78"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setOtpSent(false);
                      setOtpCode("");
                      setOtpVerified(false);
                    }}
                  />

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || !phone.trim() || phone.trim().length < 5}
                    className="h-[56px] rounded-[20px] bg-[#2563EB] px-5 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-[0_12px_24px_rgba(37,99,235,0.28)] transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSendingOtp ? "..." : "Send"}
                  </button>
                </div>

                {otpSent && !otpVerified && (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      className="h-[56px] flex-1 rounded-[20px] border border-[#DCE6F2] bg-[#F8FBFF] px-4 text-center text-[15px] font-black tracking-[0.35rem] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#86EFAC] focus:bg-white focus:ring-4 focus:ring-[#DCFCE7]"
                      placeholder="000000"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isVerifyingOtp || otpCode.trim().length < 6}
                      className="h-[56px] rounded-[20px] bg-emerald-500 px-5 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-[0_12px_24px_rgba(16,185,129,0.28)] transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isVerifyingOtp ? "..." : "Verify"}
                    </button>
                  </div>
                )}

                {otpVerified && (
                  <p className="mt-3 rounded-[18px] bg-emerald-50 px-4 py-3 text-[12px] font-black text-emerald-600">
                    Phone verified successfully
                  </p>
                )}

                {!isReporterPhoneValid && (
                  <p className="mt-3 text-[11px] font-semibold text-red-500">
                    Please verify this phone number before saving.
                  </p>
                )}
              </>
            )}
          </section>
        </form>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 border-t border-[#DCE6F2] bg-white/95 p-5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-sm gap-3">
          <button
            type="button"
            onClick={() => navigate("/app/profile")}
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
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;