import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  HelpCircle,
  Camera,
  UploadCloud,
  Car,
} from "lucide-react";
import type { Urgency } from "../utils/types";

const ReportDetails = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [description, setDescription] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("Medium Urgency");
  const [plate, setPlate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiUses, setAiUses] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [mediaCount, setMediaCount] = useState(0);

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);

  const [mediaPreview, setMediaPreview] = useState<string[]>([]);

  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const insuranceInputRef = useRef<HTMLInputElement | null>(null);

  const mapUrgencyToApi = (
    value: Urgency,
  ): "urgent" | "medium" | "not_urgent" => {
    if (value === "Urgent") return "urgent";
    if (value === "Not Urgent") return "not_urgent";
    return "medium";
  };

  const handleAiOptimize = async () => {
    if (!description.trim() || aiUses >= 3 || isOptimizing) return;

    try {
      setIsOptimizing(true);

      if (!originalDescription.trim()) {
        setOriginalDescription(description.trim());
      }

      const response = await fetch(`${API_URL}/api/ai/generate-description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description.trim(),
          mode: "incident_optimization",
          language: "fr",
        }),
      });

      const result = await response.json();

      console.log("AI optimize response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to optimize description");
      }

      const optimizedText =
        result?.data?.description ||
        result?.data?.optimizedDescription ||
        result?.description ||
        "";

      if (!optimizedText.trim()) {
        throw new Error("No optimized text returned from AI");
      }

      setDescription(optimizedText.trim());
      setAiUses((prev) => prev + 1);
    } catch (error: any) {
      console.error("AI optimize error:", error);
      alert(error.message || "Failed to optimize description");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);

    setMediaFiles(files);
    setMediaCount(files.length);

    setMediaPreview((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });

    const previews = files.map((file) => URL.createObjectURL(file));
    setMediaPreview(previews);
  };

  const handleInsuranceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setInsuranceFile(file);
    setHasInsurance(!!file);
  };

  const handlePhotosClick = () => {
    mediaInputRef.current?.click();
  };

  const handleInsuranceClick = () => {
    insuranceInputRef.current?.click();
  };

  const sendReport = async () => {
    if (!plate.trim()) {
      alert("Licence plate is required");
      return;
    }

    if (description.trim().length < 5) {
      alert("Description must be at least 5 characters");
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("licencePlate", plate.trim().toUpperCase());
      formData.append("urgency", mapUrgencyToApi(urgency));
      formData.append("description", description.trim());
      formData.append(
        "originalDescription",
        originalDescription.trim() || description.trim(),
      );
      formData.append(
        "aiOptimized",
        String(
          !!originalDescription.trim() &&
            originalDescription.trim() !== description.trim(),
        ),
      );
      formData.append("aiUses", String(aiUses));

      mediaFiles.forEach((file) => {
        formData.append("medias", file);
      });

      if (insuranceFile) {
        formData.append("insuranceCertificate", insuranceFile);
      }

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/reports`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const result = await response.json();

      console.log("Report API response:", result);

      if (!response.ok) {
        console.error("Backend validation errors:", result.errors);
        throw new Error(result.message || "Failed to submit report");
      }

      navigate("/success");
    } catch (error: any) {
      console.error("Submit report error:", error);
      alert(error.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#EEF3F8] px-6 pb-36 pt-8">
      <header className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#6B7A90] transition hover:bg-white"
        >
          <ChevronLeft size={24} />
        </button>

        <h1 className="text-[16px] font-black uppercase tracking-[0.05em] text-[#1F2A37]">
          REPORT INCIDENT
        </h1>

        <a
          href="mailto:contact@carappdomainname?subject=Support%20Request"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#6B7A90] transition hover:bg-white"
        >
          <HelpCircle size={20} />
        </a>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <section>
          <label className="mb-2 ml-1 block text-[10px] font-black uppercase tracking-widest text-[#6B7A90]">
            Licence Plate
          </label>

          <div className="flex items-center rounded-full border border-[#D9E5F1] bg-white px-5 py-4 shadow-sm">
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="ABC 1234"
              className="w-full bg-transparent text-[16px] font-bold text-[#1F2A37] outline-none placeholder:text-[#9AA8BC]"
            />
            <Car size={20} className="ml-3 text-[#9AA8BC]" />
          </div>
        </section>

        <section>
          <label className="mb-2 ml-1 block text-[10px] font-black uppercase tracking-widest text-[#6B7A90]">
            Urgency Level
          </label>

          <div className="flex rounded-full bg-white p-1 shadow-sm">
            {(["Urgent", "Medium Urgency", "Not Urgent"] as Urgency[]).map(
              (level) => {
                const active = urgency === level;

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={`flex-1 rounded-full py-3 text-[10px] font-black uppercase transition ${
                      active ? "bg-[#4A90E2] text-white" : "text-[#6B7A90]"
                    }`}
                  >
                    {level === "Medium Urgency"
                      ? "MEDIUM"
                      : level.toUpperCase()}
                  </button>
                );
              },
            )}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#6B7A90]">
              Incident Description
            </label>

            <button
              type="button"
              onClick={handleAiOptimize}
              disabled={!description || aiUses >= 3 || isOptimizing}
              className="rounded-full border border-[#CFE0F2] bg-white px-3 py-1 text-[10px] font-bold text-[#4A90E2] transition disabled:opacity-50"
            >
              {isOptimizing ? "Optimizing..." : "AI Optimize"}
            </button>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe what happened..."
            className="w-full resize-none rounded-[22px] border border-[#D9E5F1] bg-white p-4 text-[15px] font-medium leading-relaxed text-[#1F2A37] outline-none shadow-sm placeholder:text-[#9AA8BC]"
          />

          {description.trim().length > 0 && description.trim().length < 5 && (
            <p className="mt-2 text-[12px] font-bold text-red-500">
              Description must be at least 5 characters long
            </p>
          )}

          <p className="mt-3 text-[13px] font-extrabold text-[#E5533D]">
            ⚠️ BE SPECIFIC
          </p>

          <p className="mt-1 text-[13px] font-bold text-[#1F2A37]">
            📸 ADD PROOF
          </p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <PhotoCard
            onClick={handlePhotosClick}
            previews={mediaPreview}
            mediaCount={mediaCount}
          />

          <ActionCard
            label={insuranceFile ? insuranceFile.name : "Insurance Certificate"}
            subLabel={insuranceFile ? "Selected" : "Optional"}
            icon={<UploadCloud size={22} />}
            active={hasInsurance}
            onClick={handleInsuranceClick}
          />
        </div>

        <input
          ref={mediaInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleMediaUpload}
        />

        <input
          ref={insuranceInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleInsuranceUpload}
        />

        <button
          type="button"
          onClick={sendReport}
          disabled={
            !plate.trim() || description.trim().length < 5 || isSubmitting
          }
          className="mt-3 flex h-[60px] w-full items-center justify-center rounded-full border-b-4 border-[#E09E00] bg-[#F4B400] text-[15px] font-black uppercase tracking-[0.06em] text-white shadow-md transition disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );
};

type PhotoCardProps = {
  previews: string[];
  mediaCount: number;
  onClick: () => void;
};

const PhotoCard = ({ previews, mediaCount, onClick }: PhotoCardProps) => {
  const hasImages = previews.length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[140px] flex-col items-center justify-center rounded-[22px] border p-5 transition ${
        hasImages
          ? "border-[#4A90E2] bg-[#4A90E2]/10"
          : "border-[#D9E5F1] bg-white"
      }`}
    >
      {hasImages ? (
        <>
          <div className="mb-3 grid w-full grid-cols-2 gap-2">
            {previews.slice(0, 4).map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`preview-${index}`}
                className="h-[42px] w-full rounded-lg object-cover"
              />
            ))}
          </div>

          <span className="text-center text-xs font-bold text-[#1F2A37]">
            {mediaCount} Photo{mediaCount > 1 ? "s" : ""} Selected
          </span>
        </>
      ) : (
        <>
          <div className="mb-3 text-[#4A90E2]">
            <Camera size={22} />
          </div>

          <span className="text-center text-xs font-bold text-[#1F2A37]">
            Add Photos
          </span>
        </>
      )}
    </button>
  );
};

type ActionCardProps = {
  label: string;
  subLabel?: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
};

const ActionCard = ({
  label,
  subLabel,
  icon,
  active,
  onClick,
}: ActionCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[140px] flex-col items-center justify-center rounded-[22px] border p-5 transition ${
        active
          ? "border-[#4A90E2] bg-[#4A90E2]/10"
          : "border-[#D9E5F1] bg-white"
      }`}
    >
      <div className="mb-3 text-[#4A90E2]">{icon}</div>

      <span className="text-center text-xs font-bold text-[#1F2A37]">
        {label}
      </span>

      {subLabel && (
        <span className="mt-1 text-[10px] font-medium text-[#9AA8BC]">
          {subLabel}
        </span>
      )}
    </button>
  );
};

export default ReportDetails;