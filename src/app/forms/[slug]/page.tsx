"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Send, 
  ArrowRight, 
  Lock,
  User,
  Hash,
  BookOpen,
  GraduationCap,
  Mail,
  Phone,
  Code2,
  MapPin,
  FileText,
  Calendar,
  Heart,
  CreditCard,
  Briefcase,
  Bus,
  Home,
  Award,
  Trophy,
  Smile,
  Bot,
  Zap,
  Camera,
  Trash2
} from "lucide-react";

interface FormField {
  id: string;
  section_name?: string;
  field_name: string;
  field_label: string;
  field_type: string;
  is_required: number;
  options_json?: string;
  display_order: number;
}

interface FolderInfo {
  id: string;
  name: string;
  slug: string;
  year_label: string;
  description: string;
  is_form_active: number;
}

export default function StudentFormPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [folder, setFolder] = useState<FolderInfo | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedStudent, setSubmittedStudent] = useState<any | null>(null);
  const [isMaintenanceBlocked, setIsMaintenanceBlocked] = useState(false);
  const [maintenanceInfo, setMaintenanceInfo] = useState<any>(null);

  // Auto-Save and Telemetry states
  const [sessionId, setSessionId] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [firstFieldTime, setFirstFieldTime] = useState<string | null>(null);
  const [firstFieldName, setFirstFieldName] = useState<string | null>(null);
  const [lastFieldTime, setLastFieldTime] = useState<string | null>(null);
  const [lastFieldName, setLastFieldName] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<Array<{ field: string; timestamp: string; elapsed_sec: number }>>([]);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [photoError, setPhotoError] = useState("");

  // Initialize session and collect client telemetry
  useEffect(() => {
    const existingSession = sessionStorage.getItem(`form_session_${slug}`);
    const currentSession = existingSession || `fd_sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    sessionStorage.setItem(`form_session_${slug}`, currentSession);
    setSessionId(currentSession);

    if (typeof window !== "undefined") {
      const ua = navigator.userAgent;
      let browser = "Chrome";
      if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
      else if (ua.includes("Edg")) browser = "Edge";

      let os = "Windows 11";
      if (ua.includes("Mac")) os = "macOS";
      else if (ua.includes("iPhone")) os = "iOS";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("Linux")) os = "Linux";

      const width = window.screen.width;
      const height = window.screen.height;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || width < 640;
      const isTablet = /iPad|Tablet/i.test(ua) || (width >= 640 && width < 1024);
      const deviceType = isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop";

      setTelemetry({
        browser,
        browser_version: "128.0",
        os,
        os_version: "64-bit",
        device_type: deviceType,
        screen_resolution: `${width}x${height}`,
        hardware_concurrency: navigator.hardwareConcurrency || 8,
        device_memory: "8 GB",
        touch_support: navigator.maxTouchPoints > 0,
        language: navigator.language || "en-US",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
        user_agent: ua
      });
    }
  }, [slug]);

  useEffect(() => {
    fetchFormData();
  }, [slug]);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/forms/${slug}`);
      const data = await res.json();

      if (data.is_maintenance || data.maintenance_mode || res.status === 503 || data.maintenance) {
        setIsMaintenanceBlocked(true);
        setMaintenanceInfo(data.maintenance || {
          title: "Intake Registration Under Maintenance",
          message: data.error || "The student registration system is temporarily undergoing scheduled maintenance."
        });
        return;
      }

      if (data.folder) {
        setFolder(data.folder);
      }
      if (data.fields) {
        setFields(data.fields);
        const initialData: Record<string, any> = {
          college: "",
          branch: "CSE"
        };
        data.fields.forEach((f: FormField) => {
          if (initialData[f.field_name] === undefined) {
            initialData[f.field_name] = "";
          }
        });
        setFormData(initialData);
      }
    } catch (err) {
      console.error("Error loading form:", err);
      setError("Failed to load registration form.");
    } finally {
      setLoading(false);
    }
  };

  // Background Auto-Save debounced listener
  useEffect(() => {
    if (!sessionId || !slug || Object.keys(formData).length <= 2) return;

    const timer = setTimeout(async () => {
      try {
        setAutoSaveStatus("saving");
        await fetch("/api/admin/fd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            folderSlug: slug,
            formData,
            status: "draft",
            firstFieldTime,
            firstFieldName,
            lastFieldTime,
            lastFieldName,
            timeline,
            telemetry
          })
        });
        setAutoSaveStatus("saved");
      } catch (err) {
        console.error("Auto-save sync failed:", err);
        setAutoSaveStatus("idle");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData, sessionId, slug, firstFieldTime, firstFieldName, lastFieldTime, lastFieldName, timeline, telemetry]);

  const handleChange = (fieldName: string, value: any) => {
    const nowIso = new Date().toISOString();

    if (!firstFieldTime) {
      setFirstFieldTime(nowIso);
      setFirstFieldName(fieldName);
    }
    setLastFieldTime(nowIso);
    setLastFieldName(fieldName);

    const elapsed = firstFieldTime 
      ? Math.round((new Date(nowIso).getTime() - new Date(firstFieldTime).getTime()) / 1000)
      : 0;

    setTimeline((prev) => [
      ...prev,
      { field: fieldName, timestamp: nowIso, elapsed_sec: elapsed }
    ]);

    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleCopyPresentToPermanent = () => {
    setFormData((prev) => ({
      ...prev,
      permanent_address: prev.present_address || "",
      permanent_pincode: prev.present_pincode || "",
      permanent_phone: prev.present_phone || "",
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setPhotoError("Student photo must be 1MB or less");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({ ...prev, profile_image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoError("");
    setFormData((prev) => {
      const copy = { ...prev };
      delete copy.profile_image;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPhotoError("");

    if (!formData.profile_image) {
      setPhotoError("Student photograph is mandatory. Please upload your passport/identity photo.");
      setError("Student photograph is required. Please upload your photo before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const nowIso = new Date().toISOString();
      const payload = {
        ...formData,
        _session_id: sessionId,
        _first_field_time: firstFieldTime || nowIso,
        _first_field_name: firstFieldName || "name",
        _last_field_time: lastFieldTime || nowIso,
        _last_field_name: lastFieldName || "skills",
        _timeline: timeline,
        _telemetry: telemetry
      };

      const res = await fetch(`/api/forms/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmittedStudent(data.student);
      sessionStorage.removeItem(`form_session_${slug}`);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldIcon = (name: string) => {
    switch (name) {
      case "name": return <User className="w-3.5 h-3.5" />;
      case "roll_number": return <Hash className="w-3.5 h-3.5" />;
      case "branch": return <BookOpen className="w-3.5 h-3.5" />;
      case "college": return <GraduationCap className="w-3.5 h-3.5" />;
      case "dob": return <Calendar className="w-3.5 h-3.5" />;
      case "blood_group": return <Heart className="w-3.5 h-3.5" />;
      case "aadhaar_no": return <CreditCard className="w-3.5 h-3.5" />;
      case "father_name":
      case "mother_name": return <User className="w-3.5 h-3.5" />;
      case "father_occupation":
      case "mother_occupation": return <Briefcase className="w-3.5 h-3.5" />;
      case "mode_of_transport": return <Bus className="w-3.5 h-3.5" />;
      case "accommodation_type": return <Home className="w-3.5 h-3.5" />;
      case "email": return <Mail className="w-3.5 h-3.5" />;
      case "permanent_phone":
      case "present_phone":
      case "phone": return <Phone className="w-3.5 h-3.5" />;
      case "permanent_address":
      case "present_address":
      case "address": return <MapPin className="w-3.5 h-3.5" />;
      case "achievements": return <Award className="w-3.5 h-3.5" />;
      case "sports": return <Trophy className="w-3.5 h-3.5" />;
      case "hobbies": return <Smile className="w-3.5 h-3.5" />;
      case "skills": return <Code2 className="w-3.5 h-3.5" />;
      case "ssc_marks":
      case "intermediate_marks": return <GraduationCap className="w-3.5 h-3.5" />;
      case "ssc_hall_ticket_no":
      case "intermediate_hall_ticket_no": return <Hash className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-[#64748B]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563EB] mb-3" />
        <p className="text-xs font-semibold text-[#0F172A]">Loading registration form...</p>
      </div>
    );
  }

  if (isMaintenanceBlocked && maintenanceInfo) {
    return (
      <MaintenanceScreen
        title={maintenanceInfo.title || "Intake Registration Under Maintenance"}
        message={maintenanceInfo.message || "The student registration system is temporarily undergoing scheduled maintenance."}
        estimatedEnd={maintenanceInfo.estimatedEnd}
        scope="Student Registration Forms"
        onRefresh={fetchFormData}
      />
    );
  }

  if (folder && folder.is_form_active === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl border border-[#E2E8F0] text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Form Closed</h2>
          <p className="text-xs text-[#64748B] mb-6">
            The registration form for <strong>{folder.year_label}</strong> is currently disabled by administration.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-white transition-all shadow-xs"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    { title: "Student Details", icon: User, color: "text-[#2563EB]" },
    { title: "Address Details", icon: MapPin, color: "text-[#2563EB]" },
    { title: "Contact", icon: Mail, color: "text-[#2563EB]" },
    { title: "Previous Academic Record", icon: GraduationCap, color: "text-[#2563EB]" },
    { title: "Other Information", icon: FileText, color: "text-[#2563EB]" },
  ];

  const folderDisplayName = folder?.year_label || folder?.name || "1st Year";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Simplified Header Showing Logo & Folder Name */}
        <div className="text-center pt-2 pb-2 flex flex-col items-center gap-2.5">
          <img src="/logo.png" alt="CityApp AI" className="w-12 h-12 rounded-xl object-cover shadow-xs mx-auto border border-[#E2E8F0]" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              {folderDisplayName}
            </h1>
          </div>
        </div>

        {/* Progress & Live Cloud Sync Status Bar */}
        {!submittedStudent && (
          <div className="bg-white px-4 sm:px-5 py-3 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-[#64748B] font-medium">
                {autoSaveStatus === "saving" ? "☁ Syncing..." : "✓ Auto-save active"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#0F172A]">
                {Math.min(100, Math.round(((Object.keys(formData).filter(k => formData[k] && String(formData[k]).trim() !== "").length) / Math.max(fields.length, 1)) * 100))}% Completed
              </span>
              <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, Math.round(((Object.keys(formData).filter(k => formData[k] && String(formData[k]).trim() !== "").length) / Math.max(fields.length, 1)) * 100))}%` 
                  }} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Success Confirmation Card */}
        {submittedStudent ? (
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E2E8F0] shadow-xs text-center animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-[#0F172A] mb-6">Student Registered Successfully!</h2>

            <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E2E8F0] text-left max-w-xl mx-auto mb-6 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">Name of the Student:</span>
                <span className="text-[#0F172A] font-bold">{submittedStudent.name}</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">Regd. No.:</span>
                <span className="text-[#2563EB] font-mono font-bold">{submittedStudent.roll_number}</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">Year &amp; Department:</span>
                <span className="text-[#0F172A] font-medium">{folderDisplayName} — {submittedStudent.branch}</span>
              </div>
              {submittedStudent.blood_group && (
                <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                  <span className="text-[#64748B]">Blood Group:</span>
                  <span className="text-rose-600 font-bold">{submittedStudent.blood_group}</span>
                </div>
              )}
              {submittedStudent.email && (
                <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                  <span className="text-[#64748B]">E-mail ID:</span>
                  <span className="text-[#0F172A] font-mono">{submittedStudent.email}</span>
                </div>
              )}
              {submittedStudent.skills && (
                <div className="flex justify-between pt-1">
                  <span className="text-[#64748B]">Technical Skills:</span>
                  <span className="text-[#0F172A] font-medium">{submittedStudent.skills}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmittedStudent(null);
                  const reset: Record<string, any> = { college: "", branch: "CSE" };
                  fields.forEach((f) => {
                    if (reset[f.field_name] === undefined) reset[f.field_name] = "";
                  });
                  setFormData(reset);
                }}
                className="h-10 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                Submit Another Response
              </button>
            </div>
          </div>
        ) : (
          /* Clean White Form Container */
          <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-6">

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {sections.map((sec, secIdx) => {
                const SecIcon = sec.icon;
                const sectionFields = fields.filter((f) => (f.section_name || "Student Details") === sec.title);

                if (sectionFields.length === 0) return null;

                return (
                  <div key={secIdx} className="space-y-4 pt-1">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                      <h3 className="text-xs font-bold text-[#0F172A] flex items-center gap-2 uppercase tracking-wider">
                        <SecIcon className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>{sec.title}</span>
                      </h3>

                      {sec.title === "Address Details" && (
                        <button
                          type="button"
                          onClick={handleCopyPresentToPermanent}
                          className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                        >
                          Same as Present Address
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {sec.title === "Student Details" && (
                        <div className="sm:col-span-2 p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center gap-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 shadow-xs">
                            {formData.profile_image ? (
                              <img
                                src={formData.profile_image}
                                alt="Student Photo"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-7 h-7 text-[#94A3B8]" />
                            )}
                          </div>

                          <div className="flex-1 text-center sm:text-left space-y-1">
                            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#0F172A] text-xs font-semibold cursor-pointer shadow-xs transition-all">
                                <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
                                <span>{formData.profile_image ? "Change Photo" : "Upload Student Photo *"}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handlePhotoUpload}
                                  className="hidden"
                                />
                              </label>

                              {formData.profile_image ? (
                                <button
                                  type="button"
                                  onClick={handleRemovePhoto}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-medium transition-all"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Remove</span>
                                </button>
                              ) : (
                                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                                  Mandatory *
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-[#64748B]">
                              Upload student passport/identity photo (JPG, PNG, WebP). <strong>Max 1MB • Required</strong>.
                            </p>

                            {photoError && (
                              <p className="text-[11px] text-rose-600 font-semibold">{photoError}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {sectionFields.map((field) => {
                        const isTextarea = field.field_type === "textarea";
                        const isSelect = field.field_type === "select";

                        return (
                          <div
                            key={field.id}
                            className={isTextarea ? "sm:col-span-2" : "col-span-1"}
                          >
                            <label className="block text-xs font-semibold text-[#334155] mb-1.5 flex items-center gap-1.5">
                              <span className="text-[#94A3B8]">{getFieldIcon(field.field_name)}</span>
                              <span>{field.field_label}</span>
                              {field.is_required === 1 && (
                                <span className="text-rose-500 font-bold">*</span>
                              )}
                            </label>

                            {isTextarea ? (
                              <textarea
                                rows={2}
                                required={field.is_required === 1}
                                value={formData[field.field_name] || ""}
                                onChange={(e) => handleChange(field.field_name, e.target.value)}
                                placeholder={`Enter ${field.field_label.toLowerCase()}...`}
                                className="block w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] placeholder-[#94A3B8] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 resize-none font-medium transition-colors"
                              />
                            ) : isSelect ? (
                              <select
                                required={field.is_required === 1}
                                value={formData[field.field_name] || ""}
                                onChange={(e) => handleChange(field.field_name, e.target.value)}
                                className="block w-full h-10 px-3.5 bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 font-medium transition-colors"
                              >
                                <option value="">Select option...</option>
                                {JSON.parse(field.options_json || "[]").map((opt: string) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={field.field_type}
                                required={field.is_required === 1}
                                value={formData[field.field_name] || ""}
                                onChange={(e) => handleChange(field.field_name, e.target.value)}
                                placeholder={`Enter ${field.field_label.toLowerCase()}...`}
                                className="block w-full h-10 px-3.5 bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] placeholder-[#94A3B8] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 font-medium transition-colors"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t border-[#E2E8F0]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 px-6 rounded-xl font-bold text-xs bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting to {folderDisplayName}...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Student Record</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
