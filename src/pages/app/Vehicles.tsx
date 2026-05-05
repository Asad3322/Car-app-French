import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CarFront, ChevronRight, AlertCircle } from "lucide-react";
import { supabase } from "../../supabase";

const API_URL = import.meta.env.VITE_API_URL;

const FALLBACK_VEHICLE_IMAGE =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=400";

type RawVehicle = {
  id?: string;
  vehicle_name?: string;
  vehicleName?: string;
  name?: string;
  licence_plate?: string;
  license_plate?: string;
  plate?: string;
  reports_count?: number;
  reportsCount?: number;
  image?: string;
  vehicle_media?: unknown;
  vehicleMediaUrls?: unknown;
};

type VehicleCardItem = {
  id: string;
  name: string;
  plate: string;
  reportsCount: number;
  image: string;
  vehicle_media: string[];
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
  vehicles?: unknown;
};

const cleanUrl = (url: unknown): string => {
  if (typeof url !== "string") return "";
  return url.trim().replace(/^"+|"+$/g, "").replace(/\\\//g, "/");
};

const parseVehicleMedia = (media: unknown): string[] => {
  if (!media) return [];

  if (Array.isArray(media)) {
    return media.map(cleanUrl).filter((item) => item.startsWith("http"));
  }

  if (typeof media === "string") {
    const cleaned = cleanUrl(media);
    if (!cleaned) return [];

    try {
      const parsed: unknown = JSON.parse(cleaned);

      if (Array.isArray(parsed)) {
        return parsed.map(cleanUrl).filter((item) => item.startsWith("http"));
      }

      const parsedUrl = cleanUrl(parsed);
      return parsedUrl.startsWith("http") ? [parsedUrl] : [];
    } catch {
      return cleaned.startsWith("http") ? [cleaned] : [];
    }
  }

  return [];
};

const getVehicleImage = (vehicle: RawVehicle): string => {
  const media = parseVehicleMedia(vehicle.vehicle_media);
  if (media.length > 0) return media[0];

  const legacyMedia = parseVehicleMedia(vehicle.vehicleMediaUrls);
  if (legacyMedia.length > 0) return legacyMedia[0];

  const image = cleanUrl(vehicle.image);
  if (image.startsWith("http")) return image;

  return FALLBACK_VEHICLE_IMAGE;
};

const extractVehiclesArray = (result: ApiResponse | RawVehicle[] | unknown): RawVehicle[] => {
  if (!result) return [];

  if (Array.isArray(result)) return result as RawVehicle[];

  const response = result as ApiResponse;

  if (Array.isArray(response.data)) return response.data as RawVehicle[];
  if (Array.isArray(response.vehicles)) return response.vehicles as RawVehicle[];

  const nestedData = response.data as ApiResponse | undefined;

  if (Array.isArray(nestedData?.vehicles)) return nestedData.vehicles as RawVehicle[];
  if (Array.isArray(nestedData?.data)) return nestedData.data as RawVehicle[];

  return [];
};

const normalizeVehicle = (vehicle: RawVehicle): VehicleCardItem => {
  const media = parseVehicleMedia(vehicle.vehicle_media);
  const legacyMedia = parseVehicleMedia(vehicle.vehicleMediaUrls);
  const image = media[0] || legacyMedia[0] || getVehicleImage(vehicle);

  return {
    id: String(vehicle.id || ""),
    name:
      vehicle.vehicle_name ||
      vehicle.vehicleName ||
      vehicle.name ||
      "Unnamed Vehicle",
    plate:
      vehicle.licence_plate ||
      vehicle.license_plate ||
      vehicle.plate ||
      "",
    reportsCount: Number(vehicle.reports_count ?? vehicle.reportsCount ?? 0),
    image,
    vehicle_media: media.length > 0 ? media : image ? [image] : [],
  };
};

const Vehicles = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<VehicleCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);

        if (!API_URL) {
          throw new Error("VITE_API_URL is missing");
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          throw new Error("No valid session found");
        }

        localStorage.setItem("token", session.access_token);

        const response = await fetch(`${API_URL}/api/vehicles`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        });

        const result: ApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch vehicles");
        }

        const normalizedVehicles = extractVehiclesArray(result)
          .map(normalizeVehicle)
          .filter((vehicle) => vehicle.id);

        setVehicles(normalizedVehicles);
      } catch (error) {
        console.error("Fetch vehicles error:", error);
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="relative flex h-full flex-col bg-transparent px-5 pt-10 pb-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
        <div className="absolute right-[-40px] top-24 h-[180px] w-[180px] rounded-full bg-[#D8EAFF]/35 blur-3xl" />
      </div>

      <header className="relative z-10 mb-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#94A3B8]">
              Garage
            </p>

            <h1 className="mt-2 text-[28px] font-black tracking-tight text-[#0F172A]">
              My Vehicles
            </h1>

            <p className="mt-1 text-[13px] font-medium text-[#64748B]">
              Manage your cars and receive alerts.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 pt-1">
            <button
              onClick={() => navigate("/app/vehicles/add")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D8E3F0] bg-white text-[#7E8CA3] shadow-[0_12px_26px_rgba(15,23,42,0.12)] transition-all hover:scale-[1.03] hover:text-[#3B82F6] active:scale-95"
              aria-label="Add vehicle"
              type="button"
            >
              <Plus size={19} strokeWidth={3} />
            </button>

            <div className="rounded-full border border-[#D8E3F0] bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#8A98AE] shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
              {vehicles.length} Total
            </div>
          </div>
        </div>
      </header>

      <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto pb-36">
        {isLoading ? (
          <div className="mt-10 flex flex-col gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex animate-pulse flex-col gap-4 rounded-[28px] border border-[#DCE6F2] bg-[#F7FAFD]/96 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="h-20 w-24 rounded-[20px] bg-[#E5EDF6]" />
                  <div className="flex-1">
                    <div className="h-5 w-32 rounded bg-[#E5EDF6]" />
                    <div className="mt-3 h-7 w-24 rounded bg-[#E5EDF6]" />
                  </div>
                </div>
                <div className="h-4 w-28 rounded bg-[#E5EDF6]" />
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[32px] border border-white/70 bg-white/85 p-12 text-center shadow-[0_14px_34px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[26px] bg-[#EEF4FA] text-[#94A3B8] shadow-inner">
              <CarFront size={34} />
            </div>

            <h2 className="text-lg font-black text-[#0F172A]">
              No vehicles yet
            </h2>

            <p className="mt-2 text-sm font-medium leading-relaxed text-[#64748B]">
              Add your vehicle to start receiving
              <br />
              real-time community alerts.
            </p>

            <button
              onClick={() => navigate("/app/vehicles/add")}
              className="mt-6 inline-flex items-center justify-center rounded-[18px] bg-[#111827] px-5 py-3 text-[12px] font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              type="button"
            >
              Add Vehicle
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onClick={() => navigate(`/app/vehicles/${vehicle.id}/edit`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const VehicleCard = ({
  vehicle,
  onClick,
}: {
  vehicle: VehicleCardItem;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full cursor-pointer flex-col gap-4 rounded-[28px] border border-[#DCE6F2] bg-[#F7FAFD]/96 p-5 text-left shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_18px_36px_rgba(15,23,42,0.12)] active:scale-[0.985]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-[#E5EDF6] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <img
            src={vehicle.image}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={vehicle.name || "Vehicle"}
            referrerPolicy="no-referrer"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_VEHICLE_IMAGE;
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[18px] font-black tracking-tight text-[#0F172A]">
              {vehicle.name}
            </h3>

            {vehicle.reportsCount > 0 && (
              <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-400" />
            )}
          </div>

          <div className="mt-2">
            <span className="inline-flex rounded-lg border border-[#D9E4F1] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#64748B] shadow-sm">
              {vehicle.plate}
            </span>
          </div>
        </div>

        <div className="text-[#A3AFBF] transition-colors group-hover:text-[#3B82F6]">
          <ChevronRight size={19} strokeWidth={2.5} />
        </div>
      </div>

      {vehicle.reportsCount > 0 && (
        <div className="flex items-center gap-2 border-t border-[#E6EDF5] pt-4">
          <div className="rounded-lg bg-red-50 p-1.5 text-red-400">
            <AlertCircle size={14} />
          </div>

          <p className="text-[11px] font-semibold text-[#64748B]">
            {vehicle.reportsCount} active alerts
          </p>
        </div>
      )}
    </button>
  );
};

export default Vehicles;