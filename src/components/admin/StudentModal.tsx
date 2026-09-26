"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save, User, Hash, BookOpen, GraduationCap, Mail, Phone, Code2, MapPin, Calendar, Heart, CreditCard, Briefcase, Bus, Home, Award, Trophy, Smile, Camera, Upload, Trash2 } from "lucide-react";
import type { StudentRecord } from "@/lib/db/schema";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<StudentRecord>) => Promise<void>;
  student?: StudentRecord | null;
  defaultYear?: string;
  defaultFolderId?: string;
}

export default function StudentModal({
  isOpen,
  onClose,
  onSave,
  student,
  defaultYear = "1st_year",
  defaultFolderId = "folder_1st_year",
}: StudentModalProps) {
  const [activeTab, setActiveTab] = useState<"student" | "address" | "academic" | "other">("student");

  const [formData, setFormData] = useState<Partial<StudentRecord>>({
    name: "",
    roll_number: "",
    profile_image: "",
    admission_type: "Convener (EAMCET / ECET)",
    dob: "",
    blood_group: "O+",
    aadhaar_no: "",
    father_name: "",
    father_occupation: "",
    mother_name: "",
    mother_occupation: "",
    reservation_category: "OC / General",
    mode_of_transport: "College Bus",
    accommodation_type: "Day Scholar (Living with Parents)",
    branch: "CSE",
    section: "A",
    year: defaultYear as any,
    folder_id: defaultFolderId,
    college: "",
    permanent_address: "",
    present_address: "",
    permanent_pincode: "",
    present_pincode: "",
    permanent_phone: "",
    present_phone: "",
    phone: "",
    email: "",
    ssc_marks: "",
    ssc_hall_ticket_no: "",
    intermediate_marks: "",
    intermediate_hall_ticket_no: "",
    previous_course: "",
    previous_max_marks: "",
    previous_marks_obtained: "",
    previous_sno: "",
    achievements: "",
    extracurricular: "",
    hobbies: "",
    sports: "",
    skills: "",
    address: "",
    profile_info: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (student) {
      setFormData({ ...student });
    } else {
      setFormData({
        name: "",
        roll_number: "",
        profile_image: "",
        admission_type: "Convener (EAMCET / ECET)",
        dob: "",
        blood_group: "O+",
        aadhaar_no: "",
        father_name: "",
        father_occupation: "",
        mother_name: "",
        mother_occupation: "",
        reservation_category: "OC / General",
        mode_of_transport: "College Bus",
        accommodation_type: "Day Scholar (Living with Parents)",
        branch: "CSE",
        section: "A",
        year: defaultYear as any,
        folder_id: defaultFolderId,
        college: "",
        permanent_address: "",
        present_address: "",
        permanent_pincode: "",
        present_pincode: "",
        permanent_phone: "",
        present_phone: "",
        phone: "",
        email: "",
        ssc_marks: "",
        ssc_hall_ticket_no: "",
        intermediate_marks: "",
        intermediate_hall_ticket_no: "",
        previous_course: "",
        previous_max_marks: "",
        previous_marks_obtained: "",
        previous_sno: "",
        achievements: "",
        extracurricular: "",
        hobbies: "",
        sports: "",
        skills: "",
        address: "",
        profile_info: "",
      });
    }
    setError("");
    setImageError("");
    setActiveTab("student");
  }, [student, defaultYear, defaultFolderId, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size <= 1MB (1,048,576 bytes)
    if (file.size > 1024 * 1024) {
      setImageError("Profile photo must be 1MB or less");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData((prev) => ({ ...prev, profile_image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageError("");
    setFormData((prev) => ({ ...prev, profile_image: "" }));
  };

  const handleYearChange = (newYear: string) => {
    const folderMap: Record<string, string> = {
      "1st_year": "folder_1st_year",
      "2nd_year": "folder_2nd_year",
      "3rd_year": "folder_3rd_year",
      "4th_year": "folder_4th_year",
    };
    setFormData((prev) => ({
      ...prev,
      year: newYear as any,
      folder_id: folderMap[newYear] || defaultFolderId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setImageError("");
    setLoading(true);

    try {
      if (!formData.name || !formData.roll_number || !formData.email) {
        throw new Error("Please fill in required fields (Name of the Student, Regd. No., Email)");
      }
      if (!formData.profile_image) {
        setActiveTab("student");
        setImageError("Student photograph is mandatory. Please upload a student photo.");
        throw new Error("Student photograph is mandatory. Please upload a student photo before saving.");
      }
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save student record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-[#e3e4e8] rounded-2xl w-full max-w-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e3e4e8] flex items-center justify-between flex-shrink-0 bg-white">
          <div>
            <h3 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
              {student ? `Edit Record: ${student.name}` : "Add Complete Student Record"}
            </h3>
            <p className="text-xs text-[#8a8a8e]">
              Fill all student details, family info, address, academic history and activities
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-[#e3e4e8] bg-[#fafafc] flex gap-2 flex-shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: "student", label: "1. Student Details", icon: User },
            { id: "address", label: "2. Address & Contact", icon: MapPin },
            { id: "academic", label: "3. Previous Academic", icon: GraduationCap },
            { id: "other", label: "4. Other Info & Skills", icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? "border-[#0a0a0a] text-[#0a0a0a]"
                    : "border-transparent text-[#8a8a8e] hover:text-[#0a0a0a]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 bg-white">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* TAB 1: STUDENT DETAILS */}
          {activeTab === "student" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Profile Photo Uploader */}
              <div className={`sm:col-span-2 p-3.5 rounded-xl border ${!formData.profile_image ? 'border-amber-300 bg-amber-50/30' : 'border-[#e3e4e8] bg-[#f9fafb]'} flex flex-col sm:flex-row items-center gap-4 transition-colors`}>
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white border border-[#e3e4e8] shadow-xs flex items-center justify-center shrink-0">
                  {formData.profile_image ? (
                    <img
                      src={formData.profile_image}
                      alt="Student Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-9 h-9 text-[#8a8a8e]" />
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#e3e4e8] hover:bg-[#f5f5f7] text-[#0a0a0a] text-xs font-semibold cursor-pointer shadow-xs transition-all">
                      <Camera className="w-3.5 h-3.5 text-[#0a66ff]" />
                      <span>{formData.profile_image ? "Change Photo" : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>

                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                      Mandatory *
                    </span>

                    {formData.profile_image && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-medium transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-[#8a8a8e]">
                    Passport / identity portrait photo (JPG, PNG, WebP). <strong>Max 1MB</strong>.
                  </p>

                  {imageError && (
                    <p className="text-[11px] text-rose-600 font-semibold">{imageError}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">
                  Name of the Student <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Sai Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">
                  Regd. No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.roll_number || ""}
                  onChange={(e) => handleChange("roll_number", e.target.value)}
                  placeholder="e.g. 23CSE001"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 font-mono transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">
                  Academic Year <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.year || "1st_year"}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] font-medium"
                >
                  <option value="1st_year">1st Year</option>
                  <option value="2nd_year">2nd Year</option>
                  <option value="3rd_year">3rd Year</option>
                  <option value="4th_year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">
                  Branch / Department <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.branch || ""}
                  onChange={(e) => handleChange("branch", e.target.value)}
                  placeholder="e.g. CSE, ECE, Mechanical"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Section</label>
                <input
                  type="text"
                  value={formData.section || ""}
                  onChange={(e) => handleChange("section", e.target.value)}
                  placeholder="e.g. A"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Type of Admission</label>
                <select
                  value={formData.admission_type || "Convener (EAMCET / ECET)"}
                  onChange={(e) => handleChange("admission_type", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] font-medium"
                >
                  <option value="Convener (EAMCET / ECET)">Convener (EAMCET / ECET)</option>
                  <option value="Management Quota">Management Quota</option>
                  <option value="NRI Quota">NRI Quota</option>
                  <option value="Lateral Entry">Lateral Entry</option>
                  <option value="Spot Admission">Spot Admission</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Date of Birth (dd/mm/yyyy)</label>
                <input
                  type="text"
                  value={formData.dob || ""}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  placeholder="15/08/2004"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Blood Group</label>
                <select
                  value={formData.blood_group || "O+"}
                  onChange={(e) => handleChange("blood_group", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] font-medium"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Aadhaar No.</label>
                <input
                  type="text"
                  value={formData.aadhaar_no || ""}
                  onChange={(e) => handleChange("aadhaar_no", e.target.value)}
                  placeholder="8765 4321 0987"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Reservation Category</label>
                <select
                  value={formData.reservation_category || "OC / General"}
                  onChange={(e) => handleChange("reservation_category", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] font-medium"
                >
                  <option value="OC / General">OC / General</option>
                  <option value="EWS">EWS</option>
                  <option value="BC-A">BC-A</option>
                  <option value="BC-B">BC-B</option>
                  <option value="BC-C">BC-C</option>
                  <option value="BC-D">BC-D</option>
                  <option value="BC-E">BC-E</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="Minority">Minority</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Father&apos;s Name</label>
                <input
                  type="text"
                  value={formData.father_name || ""}
                  onChange={(e) => handleChange("father_name", e.target.value)}
                  placeholder="e.g. Venkatesh Rao"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Father&apos;s Occupation</label>
                <input
                  type="text"
                  value={formData.father_occupation || ""}
                  onChange={(e) => handleChange("father_occupation", e.target.value)}
                  placeholder="e.g. Civil Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Mother&apos;s Name</label>
                <input
                  type="text"
                  value={formData.mother_name || ""}
                  onChange={(e) => handleChange("mother_name", e.target.value)}
                  placeholder="e.g. Lakshmi Rao"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Mother&apos;s Occupation</label>
                <input
                  type="text"
                  value={formData.mother_occupation || ""}
                  onChange={(e) => handleChange("mother_occupation", e.target.value)}
                  placeholder="e.g. Teacher"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Mode of Transport</label>
                <select
                  value={formData.mode_of_transport || "College Bus"}
                  onChange={(e) => handleChange("mode_of_transport", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] font-medium"
                >
                  <option value="College Bus">College Bus</option>
                  <option value="Self Transport (Two Wheeler)">Self Transport (Two Wheeler)</option>
                  <option value="Self Transport (Car)">Self Transport (Car)</option>
                  <option value="Public Bus / Train">Public Bus / Train</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Walk">Walk</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Type of Accommodation</label>
                <select
                  value={formData.accommodation_type || "Day Scholar (Living with Parents)"}
                  onChange={(e) => handleChange("accommodation_type", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] font-medium"
                >
                  <option value="Day Scholar (Living with Parents)">Day Scholar (Living with Parents)</option>
                  <option value="College Hostel">College Hostel</option>
                  <option value="Private Hostel / PG">Private Hostel / PG</option>
                  <option value="Living with Guardian / Relatives">Living with Guardian / Relatives</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: ADDRESS & CONTACT */}
          {activeTab === "address" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">
                  E-mail ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="sai@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 font-mono transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Permanent Address</label>
                <textarea
                  rows={2}
                  value={formData.permanent_address || ""}
                  onChange={(e) => handleChange("permanent_address", e.target.value)}
                  placeholder="Plot 42, Jubilee Hills, Hyderabad"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 resize-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Permanent PIN Code</label>
                <input
                  type="text"
                  value={formData.permanent_pincode || ""}
                  onChange={(e) => handleChange("permanent_pincode", e.target.value)}
                  placeholder="500033"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Permanent Phone No.</label>
                <input
                  type="tel"
                  value={formData.permanent_phone || ""}
                  onChange={(e) => handleChange("permanent_phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Present Address</label>
                <textarea
                  rows={2}
                  value={formData.present_address || ""}
                  onChange={(e) => handleChange("present_address", e.target.value)}
                  placeholder="Plot 42, Jubilee Hills, Hyderabad"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 resize-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Present PIN Code</label>
                <input
                  type="text"
                  value={formData.present_pincode || ""}
                  onChange={(e) => handleChange("present_pincode", e.target.value)}
                  placeholder="500033"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Present Phone No.</label>
                <input
                  type="tel"
                  value={formData.present_phone || ""}
                  onChange={(e) => handleChange("present_phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>
            </div>
          )}

          {/* TAB 3: ACADEMIC HISTORY / SSC & INTERMEDIATE */}
          {activeTab === "academic" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">SSC Marks</label>
                <input
                  type="text"
                  value={formData.ssc_marks || formData.previous_marks_obtained || ""}
                  onChange={(e) => handleChange("ssc_marks", e.target.value)}
                  placeholder="e.g. 580 / 600 or 9.8 GPA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">SSC Hall Ticket No.</label>
                <input
                  type="text"
                  value={formData.ssc_hall_ticket_no || formData.previous_sno || ""}
                  onChange={(e) => handleChange("ssc_hall_ticket_no", e.target.value)}
                  placeholder="e.g. 2022SSC9871"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Intermediate Marks</label>
                <input
                  type="text"
                  value={formData.intermediate_marks || formData.previous_marks_obtained || ""}
                  onChange={(e) => handleChange("intermediate_marks", e.target.value)}
                  placeholder="e.g. 978 / 1000 or 98%"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Intermediate Hall Ticket Number</label>
                <input
                  type="text"
                  value={formData.intermediate_hall_ticket_no || formData.previous_sno || ""}
                  onChange={(e) => handleChange("intermediate_hall_ticket_no", e.target.value)}
                  placeholder="e.g. 24INTER1102"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>
            </div>
          )}

          {/* TAB 4: OTHER INFORMATION & SKILLS */}
          {activeTab === "other" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Technical Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills || ""}
                  onChange={(e) => handleChange("skills", e.target.value)}
                  placeholder="e.g. Java, Python, Next.js, Cloud Computing"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Any Other Achievements</label>
                <textarea
                  rows={2}
                  value={formData.achievements || ""}
                  onChange={(e) => handleChange("achievements", e.target.value)}
                  placeholder="Winner of Smart India Hackathon 2025, 1st place in Coding Contest"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] resize-none transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Extra-curricular Activities</label>
                <textarea
                  rows={2}
                  value={formData.extracurricular || ""}
                  onChange={(e) => handleChange("extracurricular", e.target.value)}
                  placeholder="Robotics club member, technical fest coordinator"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] resize-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Hobbies</label>
                <input
                  type="text"
                  value={formData.hobbies || ""}
                  onChange={(e) => handleChange("hobbies", e.target.value)}
                  placeholder="Competitive Programming, Chess, Reading"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Sports Interested</label>
                <input
                  type="text"
                  value={formData.sports || ""}
                  onChange={(e) => handleChange("sports", e.target.value)}
                  placeholder="Cricket, Badminton, Table Tennis"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] transition-all font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Profile Bio / Summary</label>
                <textarea
                  rows={2}
                  value={formData.profile_info || ""}
                  onChange={(e) => handleChange("profile_info", e.target.value)}
                  placeholder="Brief summary profile..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] resize-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#e3e4e8] flex items-center justify-between">
            <div className="text-[11px] text-[#8a8a8e]">
              * Required fields: Name, Regd. No., Email
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-4 rounded-xl border border-[#e3e4e8] hover:bg-[#fafafc] text-[#0a0a0a] text-xs font-semibold shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="h-9 px-5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {student ? "Update Record" : "Save Record"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
