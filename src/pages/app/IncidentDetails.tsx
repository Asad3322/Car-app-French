import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ShieldCheck,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  AlertTriangle,
  Calendar,
  Info,
} from "lucide-react";

import en from "../../i18n/en";
import fr from "../../i18n/fr";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const DEFAULT_CAR_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=900";

const translations = {
  en,
  fr,
};

const getLanguage = (): keyof typeof translations => {
  const savedLanguage = localStorage.getItem("language");

  if (savedLanguage === "en" || savedLanguage === "fr") {
    return savedLanguage;
  }

  return "fr";
};

const buildAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  const ownerAccessToken = localStorage.getItem("ownerAccessToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (ownerAccessToken) {
    headers["x-owner-access-token"] = ownerAccessToken;
  }

  return headers;
};

const IncidentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const pageState = location.state as { group?: "sent" | "received" } | null;

  const isReceivedView =
    pageState?.group === "received" ||
    localStorage.getItem("role") === "vehicle_owner" ||
    Boolean(localStorage.getItem("ownerAccessToken"));

  const language = getLanguage();
  const t = translations[language].incidentDetails;

  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [feedbackType, setFeedbackType] = useState<"thanks" | "bad" | null>(
    null,
  );

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE_URL}/api/reports/${id}`, {
          headers: buildAuthHeaders(),
        });

        const result = await res.json();

        console.log("Single incident:", result);

        if (!res.ok) {
          setIncident(null);
          return;
        }

        setIncident(result.data);
      } catch (err) {
        console.error("Single incident fetch error:", err);
        setIncident(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [id]);

  const updateStatus = async (status: "seen" | "resolved") => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/${id}/status`, {
        method: "PATCH",
        headers: buildAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      const result = await res.json();

      console.log("Status update response:", result);

      if (!res.ok) {
        console.error("Status update failed:", result);
        return;
      }

      setIncident(result.data);
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const thankReporter = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/${id}/thank`, {
        method: "PATCH",
        headers: buildAuthHeaders(),
      });

      const result = await res.json();

      console.log("Thank reporter response:", result);

      if (!res.ok) {
        console.error("Thank reporter failed:", result);
        return;
      }

      setIncident(result.data);
      setFeedbackType("thanks");
    } catch (error) {
      console.error("Thank reporter error:", error);
    }
  };

  const reportBadReport = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/${id}/bad-report`, {
        method: "PATCH",
        headers: buildAuthHeaders(),
      });

      const result = await res.json();

      console.log("Bad report response:", result);

      if (!res.ok) {
        console.error("Bad report failed:", result);
        return;
      }

      setIncident(result.data);
      setFeedbackType("bad");
    } catch (error) {
      console.error("Bad report error:", error);
    }
  };

  const getFirstImageFromValue = (value: any): string => {
    if (!value) return "";

    if (Array.isArray(value)) {
      return value[0] || "";
    }

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (!trimmed) return "";

      if (trimmed.startsWith("http")) {
        return trimmed;
      }

      try {
        const parsed = JSON.parse(trimmed);

        if (Array.isArray(parsed)) {
          return parsed[0] || "";
        }

        if (typeof parsed === "string") {
          return parsed;
        }
      } catch (err) {
        console.error("Image parse error:", err);
      }
    }

    return "";
  };

  const image =
    getFirstImageFromValue(incident?.medias) ||
    getFirstImageFromValue(incident?.mediaUrls) ||
    getFirstImageFromValue(incident?.media) ||
    getFirstImageFromValue(incident?.images) ||
    incident?.image ||
    incident?.vehicleImage ||
    DEFAULT_CAR_IMAGE;

  const urgencyLabel =
    incident?.urgency === "urgent"
      ? t.urgent
      : incident?.urgency === "medium"
        ? t.medium
        : incident?.urgency === "not_urgent"
          ? t.notUrgent
          : t.report;

  const statusLabel = incident?.status || "reported";

  const isUrgent = incident?.urgency === "urgent";

  if (loading) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center bg-[#F3F7FB] px-6 py-10 text-center">
        <h2 className="text-[20px] font-black text-[#0F172A]">
          {t.loadingReport}
        </h2>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center bg-[#F3F7FB] px-6 py-10 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-10 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-red-100 blur-3xl" />
        </div>

        <div className="relative z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-[28px] bg-red-50 text-red-500 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <Info size={34} />
        </div>

        <h2 className="relative z-10 text-[24px] font-black tracking-tight text-[#0F172A]">
          {t.reportNotFound}
        </h2>

        <button
          onClick={() => {
            if (isReceivedView) {
              navigate("/app/incidents", {
                replace: true,
                state: { group: "received" },
              });
              return;
            }

            navigate("/app/history", {
              replace: true,
              state: { filter: "sent" },
            });
          }}
          className="relative z-10 mt-5 rounded-[16px] bg-[#111827] px-5 py-3 text-[12px] font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)] transition-all active:scale-95"
        >
          {t.goBack}
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-[#F3F7FB] font-sans">
      {feedbackType && (
        <div className="animate-in fade-in slide-in-from-top-4 absolute left-1/2 top-5 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-5 py-3 text-[#1D4ED8] shadow-[0_12px_28px_rgba(37,99,235,0.14)] duration-300">
          <ShieldCheck size={18} />

          <span className="text-[10px] font-black uppercase tracking-[0.16em]">
            {feedbackType === "thanks" ? t.thanksSent : t.reportFlagged}
          </span>
        </div>
      )}

      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#E6EDF5] bg-[#F3F7FB]/95 px-5 py-4 backdrop-blur-xl">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCE6F2] bg-white text-[#0F172A] shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition-all active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>

        <h1 className="text-[13px] font-black uppercase tracking-[0.14em] text-[#0F172A]">
          {t.reportDetails}
        </h1>

        <div className="w-10" />
      </header>

      <div className="scrollbar-hide flex-1 overflow-y-auto bg-[#F3F7FB] pb-32">
        <div className="relative aspect-video w-full overflow-hidden bg-[#EAF1F8]">
          <img
            src={image}
            alt={t.reportedCarEvidence}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_CAR_IMAGE;
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] shadow-lg ${
                isUrgent ? "bg-red-500 text-white" : "bg-[#2563EB] text-white"
              }`}
            >
              {isUrgent ? <AlertTriangle size={14} /> : <Clock size={14} />}

              {urgencyLabel}
            </div>

            <div className="rounded-full bg-emerald-500 px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-lg">
              {statusLabel}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 bg-[#F3F7FB] px-5 py-6">
          <section className="rounded-[28px] border border-[#DCE6F2] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="rounded-[20px] border border-[#DCE6F2] bg-[#F8FBFF] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <span className="font-mono text-[18px] font-black tracking-[0.18em] text-[#0F172A]">
                    {incident.licence_plate || ""}
                  </span>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <Sparkles
                      size={12}
                      className="text-[#2563EB]"
                      strokeWidth={3}
                    />

                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#2563EB]">
                      {t.incident}
                    </span>
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#94A3B8]">
                    {t.licencePlate}
                  </p>

                  <p className="text-[12px] font-black text-[#0F172A]">
                    {incident.plate_registered
                      ? t.registeredVehicle
                      : t.unregisteredVehicle}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1">
                <div className="flex items-center gap-4 rounded-[22px] border border-[#E6EDF5] bg-[#F8FBFF] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#2563EB]">
                    <Calendar size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
                      {t.dateTime}
                    </p>

                    <p className="truncate text-[13px] font-black text-[#0F172A]">
                      {incident.created_at
                        ? new Date(incident.created_at).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : t.notAvailable}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <label className="mb-3 ml-2 block text-[10px] font-black uppercase tracking-[0.16em] text-[#94A3B8]">
              {t.incidentDescription}
            </label>

            <div className="rounded-[28px] border border-[#DCE6F2] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
              <p className="text-[15px] font-medium leading-7 text-[#475569]">
                “{incident.description || ""}”
              </p>
            </div>
          </section>

          {isReceivedView && (
            <section className="rounded-[28px] border border-[#DCE6F2] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
              <label className="mb-4 block text-[10px] font-black uppercase tracking-[0.16em] text-[#94A3B8]">
                Status Actions
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={
                    incident.status === "seen" || incident.status === "resolved"
                  }
                  onClick={() => updateStatus("seen")}
                  className="min-h-[54px] rounded-[18px] bg-violet-600 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:bg-slate-300 active:scale-[0.97]"
                >
                  Mark as Seen
                </button>

                <button
                  type="button"
                  disabled={incident.status === "resolved"}
                  onClick={() => updateStatus("resolved")}
                  className="min-h-[54px] rounded-[18px] bg-emerald-600 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:bg-slate-300 active:scale-[0.97]"
                >
                  Mark as Resolved
                </button>
              </div>
            </section>
          )}

          <section className="relative overflow-hidden rounded-[28px] border border-[#DCE6F2] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#DBEAFE] blur-3xl" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
                  <Sparkles size={16} />
                </div>

                <h3 className="text-[11px] font-black uppercase tracking-[0.14em] text-[#0F172A]">
                  {t.assistantTip}
                </h3>
              </div>

              <p className="text-[14px] leading-7 text-[#64748B]">
                {t.assistantMessage}
              </p>

              <div className="mt-6 border-t border-[#E6EDF5] pt-5">
                <div className="mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#94A3B8]">
                    {t.quickFeedback}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={thankReporter}
                    className={`flex min-h-[54px] items-center justify-center gap-2 rounded-[18px] border px-4 text-[11px] font-black uppercase tracking-[0.12em] transition-all active:scale-[0.97] ${
                      feedbackType === "thanks"
                        ? "border-[#2563EB] bg-[#2563EB] text-white shadow-[0_10px_20px_rgba(37,99,235,0.20)]"
                        : "border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]"
                    }`}
                  >
                    <ThumbsUp size={16} />
                    {t.sayThanks}
                  </button>

                  <button
                    type="button"
                    onClick={reportBadReport}
                    className={`flex min-h-[54px] items-center justify-center gap-2 rounded-[18px] border px-4 text-[11px] font-black uppercase tracking-[0.12em] transition-all active:scale-[0.97] ${
                      feedbackType === "bad"
                        ? "border-red-500 bg-red-500 text-white shadow-[0_10px_20px_rgba(239,68,68,0.18)]"
                        : "border-red-200 bg-red-50 text-red-500"
                    }`}
                  >
                    <ThumbsDown size={16} />
                    {t.badReport}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-1 flex items-center justify-center">
            <div className="rounded-full border border-[#DCE6F2] bg-white px-5 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#94A3B8] shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
              {t.communityVerifiedReport}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
