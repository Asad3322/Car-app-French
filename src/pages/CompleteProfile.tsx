import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserProfile } from "../services/authService";
import { supabase } from "../supabase";

const CompleteProfile = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState<"reporter" | "vehicle_owner">("reporter");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = role === "vehicle_owner";

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedRole = localStorage.getItem("role") || "reporter";
        const storedPhone = localStorage.getItem("verifiedPhone") || "";
        const storedVehicleId = localStorage.getItem("vehicleId") || "";

        setRole(storedRole as any);
        setPhone(storedPhone);
        setVehicleId(storedVehicleId);

        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData?.session) {
          const { data } = await supabase.auth.getUser();

          if (data?.user?.email) {
            setEmail(data.user.email);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Username required");
      return;
    }

    if (isOwner && !phone) {
      alert("Phone required");
      return;
    }

    if (!isOwner && !email) {
      alert("Email required");
      return;
    }

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
      });

      // ✅ FINAL OWNER FLOW FIX
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
      console.error(err);
      alert(err.message || "Error saving profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEF3F8]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Complete Profile</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 mb-3"
        />

        {!isOwner && (
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 mb-3"
          />
        )}

        <input
          placeholder="Phone"
          value={phone}
          readOnly={isOwner}
          className="w-full border p-2 mb-3"
        />

        <button
          disabled={submitting}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {submitting ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;