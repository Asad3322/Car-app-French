import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserProfile } from "../services/authService";
import { supabase } from "../supabase";
import {
  User,
  Mail,
  ArrowRight,
  X,
  CheckCircle2,
  Sparkles,
  Phone,
} from "lucide-react";

const avatars = [
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=A",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=B",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=C",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=D",
];

type AuthUserShape = {
  id: string;
  email?: string | null;
  phone?: string | null;
};

type FlowRole = "reporter" | "vehicle_owner";

const normalizeUsername = (value: string): string => value.trim().toLowerCase();

const validateUsername = (value: string): string => {
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

const CompleteProfile = () => {
  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState<AuthUserShape | null>(null);
  const [role, setRole] = useState<FlowRole>("reporter");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [usernameError, setUsernameError] = useState("");

  const isOwner = role === "vehicle_owner";

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoadingUser(true);

        const storedRole =
          (localStorage.getItem("role") as FlowRole | null) || "reporter";
        const storedVerifiedPhone = localStorage.getItem("verifiedPhone") || "";
        const storedVehicleId = localStorage.getItem("vehicleId") || "";

        setRole(storedRole);
        setVehicleId(storedVehicleId);

        const { data: sessionData } = await supabase.auth.getSession();

        let user: any = null;

        if (sessionData?.session) {
          const res = await supabase.auth.getUser();
          user = res.data.user;
        }

        if (user) {
          setAuthUser({
            id: user.id,
            email: user.email || "",
            phone: user.phone || "",
          });

          setEmail(user.email || "");
          setPhone(
            storedRole === "vehicle_owner"
              ? storedVerifiedPhone
              : user.phone || ""
          );

          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("auth_user_id", user.id)
            .maybeSingle();

          if (profile) {
            setUsername(profile.username || profile.name || "");
            setPhone(profile.phone || storedVerifiedPhone || user.phone || "");
            setEmail(profile.email || user.email || "");
            setSelectedAvatar(profile.avatar_url || avatars[0]);
          }

          return;
        }

        if (storedRole === "vehicle_owner" && storedVerifiedPhone) {
          setPhone(storedVerifiedPhone);
          setEmail("");
          setAuthUser(null);
          return;
        }

        navigate("/auth", { replace: true });
      } catch (err) {
        console.error("Load auth user error:", err);
        navigate("/auth", { replace: true });
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, [navigate]);

  useEffect(() => {
    const normalized = normalizeUsername(username);
    const validationMessage = validateUsername(username);

    if (!normalized) {
      setUsernameError("");
      setIsUsernameAvailable(null);
      setIsCheckingUsername(false);
      return;
    }

    if (validationMessage) {
      setUsernameError(validationMessage);
      setIsUsernameAvailable(false);
      setIsCheckingUsername(false);
      return;
    }

    setUsernameError("");
    setIsCheckingUsername(true);

    const timer = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, auth_user_id, username")
          .ilike("username", normalized);

        if (error) throw error;

        const takenByAnotherUser = (data || []).some((item: any) => {
          const profileOwnerId = item?.auth_user_id || item?.id;
          return authUser?.id ? profileOwnerId !== authUser.id : true;
        });

        setIsUsernameAvailable(!takenByAnotherUser);
      } catch (err) {
        console.error("Username check error:", err);
        setIsUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, authUser]);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedUsername = normalizeUsername(username);
    const validationMessage = validateUsername(username);

    if (validationMessage) {
      setUsernameError(validationMessage);
      return;
    }

    if (isOwner && !phone.trim()) {
      alert("Verified phone number is required");
      return;
    }

    if (!isOwner && !email.trim()) {
      alert("Email is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, auth_user_id, username")
        .ilike("username", normalizedUsername);

      if (error) throw error;

      const takenByAnotherUser = (data || []).some((item: any) => {
        const profileOwnerId = item?.auth_user_id || item?.id;
        return authUser?.id ? profileOwnerId !== authUser.id : true;
      });

      if (takenByAnotherUser) {
        setUsernameError("This username is already taken");
        setIsUsernameAvailable(false);
        setIsSubmitting(false);
        return;
      }

      await saveUserProfile({
        name: normalizedUsername,
        username: normalizedUsername,
        email: isOwner ? "" : email,
        phone: isOwner ? phone : "",
        primaryContact: isOwner ? "phone" : "email",
        profileImage: selectedAvatar,
        role,
        verifiedPhone: isOwner ? phone : "",
        vehicleId: isOwner ? vehicleId : "",
      });

      const storedRole = localStorage.getItem("role");
      const storedPhone = localStorage.getItem("verifiedPhone");
      const storedVehicleId = localStorage.getItem("vehicleId");

      const isOwnerFlow =
        role === "vehicle_owner" ||
        storedRole === "vehicle_owner" ||
        !!storedPhone ||
        !!storedVehicleId;

      if (isOwnerFlow) {
        localStorage.setItem("ownerAccess", "true");
        localStorage.setItem("role", "vehicle_owner");
        localStorage.removeItem("verifiedPhone");
        localStorage.removeItem("vehicleId");
      }

      navigate("/app/vehicles", { replace: true });
    } catch (err: any) {
      console.error("Save profile error:", err);

      if (
        err?.code === "23505" ||
        err?.message?.toLowerCase()?.includes("duplicate")
      ) {
        setUsernameError("This username is already taken");
        setIsUsernameAvailable(false);
      } else {
        alert(err?.message || "Failed to save profile");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="relative flex min-h-[100svh] w-full items-center justify-center bg-[#D6E2EC] text-[#0B1A2B]">
        <p className="text-sm font-semibold text-[#6F8194]">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[100svh] w-full flex-col bg-[#D6E2EC] text-[#0B1A2B]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#2F93F6]/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

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
          onClick={() => navigate("/app/vehicles", { replace: true })}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B8C9D6] bg-white text-[#6F8194] shadow-sm hover:bg-[#F8FBFD]"
        >
          <X size={18} />
        </button>
      </header>

      <main className="relative z-10 flex flex-1 flex-col px-4 pb-6">
        <div className="flex flex-1 flex-col rounded-t-[30px] border border-[#B8C9D6] bg-[#EEF4F8] px-4 pt-5 pb-6 shadow">
          <div className="mx-auto w-full max-w-[440px]">
            <section className="mb-5 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border bg-white shadow">
                <Sparkles size={30} className="text-[#2F93F6]" />
              </div>

              <h2 className="text-[24px] font-black">Set up your profile</h2>

              <p className="mt-2 text-[14px] text-[#6F8194]">
                {isOwner
                  ? "Your vehicle was saved. Now complete your owner profile to receive incident notifications."
                  : "Add your details and choose your emoji avatar before entering the app."}
              </p>
            </section>

            <form onSubmit={handleComplete} className="flex flex-col gap-4">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="h-28 w-28 rounded-[30px] border border-[#D9E5F1] bg-[#F8FBFF] p-1.5">
                    <img
                      src={selectedAvatar}
                      alt="Selected avatar"
                      className="h-full w-full rounded-[24px] object-cover"
                    />
                  </div>

                  <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white">
                    <CheckCircle2 size={15} />
                  </div>
                </div>

                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F8194]">
                  Choose Avatar
                </p>

                <div className="flex gap-3">
                  {avatars.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`h-14 w-14 rounded-[18px] border p-0.5 transition-all ${
                        selectedAvatar === avatar
                          ? "border-[#2F93F6] bg-[#EAF4FF]"
                          : "border-[#D9E5F1] bg-white"
                      }`}
                    >
                      <img
                        src={avatar}
                        alt={`Avatar ${idx + 1}`}
                        className="h-full w-full rounded-[14px] object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#6F8194]">
                  Username
                </label>
                <div className="relative mt-2">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]"
                    size={17}
                  />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-[58px] w-full rounded-[20px] border border-[#D9E5F1] bg-white pl-12 pr-4 text-[15px] text-[#0B1A2B] outline-none placeholder:text-[#9AA8BC] focus:border-[#2F93F6] focus:ring-2 focus:ring-[#2F93F6]/15"
                    placeholder="asad_112"
                  />
                </div>

                {username.trim() !== "" && (
                  <p
                    className={`mt-2 text-[11px] font-semibold ${
                      usernameError
                        ? "text-red-500"
                        : isCheckingUsername
                        ? "text-[#6F8194]"
                        : isUsernameAvailable
                        ? "text-emerald-600"
                        : "text-[#6F8194]"
                    }`}
                  >
                    {usernameError
                      ? usernameError
                      : isCheckingUsername
                      ? "Checking username..."
                      : isUsernameAvailable
                      ? "Username is available"
                      : ""}
                  </p>
                )}
              </div>

              {!isOwner && (
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#6F8194]">
                    Email
                  </label>
                  <div className="relative mt-2">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]"
                      size={17}
                    />
                    <input
                      value={email}
                      readOnly
                      placeholder="Login email"
                      className="h-[58px] w-full rounded-[20px] border border-[#D9E5F1] bg-[#F8FBFD] pl-12 pr-4 text-[15px] text-[#0B1A2B] outline-none"
                    />
                  </div>
                </div>
              )}

              {isOwner && (
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#6F8194]">
                    Phone Number
                  </label>
                  <div className="relative mt-2">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA8BC]"
                      size={17}
                    />
                    <input
                      value={phone}
                      readOnly
                      placeholder="+33 6 12 34 56 78"
                      className="h-[58px] w-full rounded-[20px] border border-[#D9E5F1] bg-[#F8FBFD] pl-12 pr-4 text-[15px] text-[#0B1A2B] outline-none"
                    />
                  </div>

                  <p className="mt-2 text-[11px] font-semibold text-[#6F8194]">
                    Verified phone number is required for owner flow.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  !username.trim() ||
                  !!usernameError ||
                  isCheckingUsername ||
                  isUsernameAvailable === false ||
                  isSubmitting
                }
                className="mt-2 flex h-[58px] items-center justify-center gap-2 rounded-[20px] bg-[#2F93F6] text-[15px] font-medium text-white shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Continue"}
                {!isSubmitting && <ArrowRight size={17} />}
              </button>
            </form>

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