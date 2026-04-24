import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserProfile } from "../services/authService";
import { User, Mail, ArrowRight, X, Phone } from "lucide-react";

const avatars = [
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=A",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=B",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=C",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=D",
];

const CompleteProfile = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState<"reporter" | "vehicle_owner">("reporter");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = role === "vehicle_owner";

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "reporter";
    const storedPhone = localStorage.getItem("verifiedPhone") || "";
    const storedVehicleId = localStorage.getItem("vehicleId") || "";

    setRole(storedRole as any);
    setPhone(storedPhone);
    setVehicleId(storedVehicleId);

    setLoading(false);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!username.trim()) return alert("Username required");

    setSubmitting(true);

    try {
      await saveUserProfile({
        name: username,
        username,
        email: isOwner ? "" : email,
        phone,
        role,
        verifiedPhone: isOwner ? phone : "",
        vehicleId: isOwner ? vehicleId : "",
        profileImage: selectedAvatar,
      });

      // ✅ owner flow fix
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
      }

      navigate("/app/vehicles", { replace: true });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#D6E2EC] flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Complete Profile</h1>
        <button onClick={() => navigate("/app/vehicles")}>
          <X />
        </button>
      </div>

      {/* CONTENT */}
      <form
        onSubmit={handleSubmit}
        className="bg-white m-4 p-6 rounded-3xl flex flex-col gap-4"
      >
        {/* AVATAR */}
        <div className="flex gap-3 justify-center">
          {avatars.map((a, i) => (
            <img
              key={i}
              src={a}
              onClick={() => setSelectedAvatar(a)}
              className={`w-14 h-14 rounded-xl cursor-pointer border ${
                selectedAvatar === a ? "border-blue-500" : ""
              }`}
            />
          ))}
        </div>

        {/* USERNAME */}
        <div className="relative">
          <User className="absolute left-3 top-4 text-gray-400" size={18} />
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10 w-full border p-3 rounded-xl"
          />
        </div>

        {/* EMAIL */}
        {!isOwner && (
          <div className="relative">
            <Mail className="absolute left-3 top-4 text-gray-400" size={18} />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full border p-3 rounded-xl"
            />
          </div>
        )}

        {/* PHONE */}
        <div className="relative">
          <Phone className="absolute left-3 top-4 text-gray-400" size={18} />
          <input
            value={phone}
            readOnly={isOwner}
            className="pl-10 w-full border p-3 rounded-xl bg-gray-100"
          />
        </div>

        {/* BUTTON */}
        <button className="bg-blue-500 text-white p-3 rounded-xl flex justify-center items-center gap-2">
          {submitting ? "Saving..." : "Continue"}
          {!submitting && <ArrowRight size={16} />}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
