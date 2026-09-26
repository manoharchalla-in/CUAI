"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Image as ImageIcon, 
  BarChart3, 
  Download, 
  Eye, 
  Edit3, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  Folder,
  ShieldCheck,
  ExternalLink,
  Crown
} from "lucide-react";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";
import StudentModal from "@/components/admin/StudentModal";
import StudentDetailsPreviewModal from "@/components/admin/StudentDetailsPreviewModal";
import StudentImageModal from "@/components/admin/StudentImageModal";
import StudentMarksModal from "@/components/admin/StudentMarksModal";
import type { StudentRecord, YearFolder } from "@/lib/db/schema";
import { formatYearLabel } from "@/lib/utils";
import { downloadSingleStudentZip } from "@/lib/zip-export";

export default function SuperAdminStudentFolderPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const studentId = params?.studentId as string;
  const router = useRouter();

  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [folder, setFolder] = useState<YearFolder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewDetailsOpen, setIsPreviewDetailsOpen] = useState(false);
  const [isPreviewImageOpen, setIsPreviewImageOpen] = useState(false);
  const [isPreviewMarksOpen, setIsPreviewMarksOpen] = useState(false);

  useEffect(() => {
    if (studentId && slug) {
      loadStudentAndFolder();
    }
  }, [studentId, slug]);

  const loadStudentAndFolder = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Fetch Folder
      const fRes = await fetch(`/api/admin/folders/${slug}`);
      const fData = await fRes.json();
      if (fData.folder) {
        setFolder(fData.folder);
      }

      // 2. Fetch Student
      const sRes = await fetch(`/api/admin/students/${studentId}`);
      const sData = await sRes.json();
      if (!sRes.ok || !sData.student) {
        throw new Error(sData.error || "Student record not found");
      }
      setStudent(sData.student);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load student record");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStudent = async (updatedData: Partial<StudentRecord>) => {
    if (!student) return;
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update record");
      if (data.student) {
        setStudent(data.student);
      }
      setIsEditModalOpen(false);
    } catch (err: any) {
      throw new Error(err.message || "Failed to save");
    }
  };

  // Quick download helper for details
  const handleDownloadDetails = () => {
    if (!student) return;
    const formatted = `
STUDENT DETAILS RECORD: ${student.roll_number}
Name: ${student.name}
Roll: ${student.roll_number}
Year: ${formatYearLabel(student.year)}
Branch: ${student.branch} ${student.section ? `(Sec ${student.section})` : ""}
Email: ${student.email}
Phone: ${student.phone || student.permanent_phone || "N/A"}
Blood Group: ${student.blood_group || "N/A"}
DOB: ${student.dob || "N/A"}
Aadhaar: ${student.aadhaar_no || "N/A"}
Father: ${student.father_name || "N/A"} (${student.father_occupation || ""})
Mother: ${student.mother_name || "N/A"} (${student.mother_occupation || ""})
Address: ${student.permanent_address || student.present_address || "N/A"}
Skills: ${student.skills || "N/A"}
Achievements: ${student.achievements || "N/A"}
    `.trim();

    const blob = new Blob([formatted], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.roll_number}_details.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Quick download helper for image
  const handleDownloadImage = () => {
    if (!student?.profile_image) return;
    const a = document.createElement("a");
    a.href = student.profile_image;
    a.download = `${student.roll_number}_photo.jpg`;
    if (!student.profile_image.startsWith("data:")) {
      a.target = "_blank";
    }
    a.click();
  };

  // Quick download helper for marks
  const handleDownloadMarks = () => {
    if (!student) return;
    const formatted = `
ACADEMIC MARKS STATEMENT: ${student.roll_number}
Student Name: ${student.name}
Course: ${student.previous_course || "Intermediate / Secondary"}
Marks Obtained: ${student.previous_marks_obtained || "N/A"} / ${student.previous_max_marks || "1000"}
Hall Ticket / S.No: ${student.previous_sno || "N/A"}
Admission: ${student.admission_type || "Convener"}
    `.trim();

    const blob = new Blob([formatted], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.roll_number}_marks.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    if (!student) return;
    try {
      setIsDownloadingZip(true);
      await downloadSingleStudentZip(student);
    } catch (err: any) {
      console.error(err);
      alert("Failed to download ZIP: " + (err.message || "Unknown error"));
    } finally {
      setIsDownloadingZip(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8a8a8e] bg-[#f5f5f7] min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a0a0a] mb-3" />
        <p className="text-xs font-semibold text-[#0a0a0a]">Opening Student Folder...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8a8a8e] bg-[#f5f5f7] min-h-screen px-4">
        <div className="bg-white p-8 rounded-2xl border border-[#e3e4e8] max-w-md w-full text-center shadow-xs">
          <h3 className="text-base font-bold text-[#0a0a0a] mb-2">Student Folder Not Found</h3>
          <p className="text-xs text-[#8a8a8e] mb-6">{error || "Could not retrieve student details"}</p>
          <Link
            href={`/super-admin/institutes/${slug}`}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-[#0a0a0a] text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to {folder?.year_label || "Year Folder"}</span>
          </Link>
        </div>
      </div>
    );
  }

  const marksObtained = parseFloat(student.previous_marks_obtained || "0");
  const maxMarks = parseFloat(student.previous_max_marks || "0");
  const percentage = maxMarks > 0 ? ((marksObtained / maxMarks) * 100).toFixed(1) : null;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7] text-[#0a0a0a] font-sans">
      <SuperAdminHeader
        title={student.roll_number}
        subtitle={`Master Student Directory • ${student.name} (${student.branch})`}
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Breadcrumbs Navigation */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#8a8a8e]">
          <Link href="/super-admin/institutes" className="hover:text-[#0a0a0a] transition-colors flex items-center gap-1.5">
            <span>📁</span>
            <span>Master Root Directories</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/super-admin/institutes/${slug}`} className="hover:text-[#0a0a0a] transition-colors">
            {folder?.name || folder?.year_label || "1st Year"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-[#0a0a0a] font-mono">{student.roll_number}</span>
        </div>

        {/* Top Control Bar */}
        <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              href={`/super-admin/institutes/${slug}`}
              className="w-9 h-9 rounded-xl bg-[#f5f5f7] hover:bg-[#e3e4e8] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center transition-all shadow-2xs active:scale-[0.98]"
              title="Back to parent folder"
            >
              <ArrowLeft className="w-4 h-4 text-[#0a0a0a]" />
            </Link>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0a0a0a] tracking-tight font-mono">
                  {student.roll_number}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
                  {student.name}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0a66ff]/[0.08] text-[#0a66ff] border border-[#0a66ff]/20 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                  Verified RAG Grounded
                </span>
              </div>
              <p className="text-xs text-[#8a8a8e] mt-1 font-medium">
                {student.branch} {student.section ? `• Section ${student.section}` : ""} • {formatYearLabel(student.year)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isDownloadingZip}
              className="h-9 px-4 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98] disabled:opacity-60"
              title="Download entire student folder archive (details, marks, photo, html)"
            >
              {isDownloadingZip ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0a66ff]" />
                  <span>Archiving...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#0a66ff]" />
                  <span>Download Folder ZIP</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="h-9 px-4 rounded-xl bg-[#f5f5f7] hover:bg-[#e3e4e8] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Student</span>
            </button>

            <Link
              href="/chat"
              className="h-9 px-4 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all flex items-center gap-1.5 active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Chatbot</span>
            </Link>
          </div>
        </div>

        {/* 3 Main Record Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* CARD 1: STUDENT DETAILS */}
          <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col justify-between overflow-hidden group">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                  📄
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] uppercase tracking-wider">
                  20+ Fields
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#0a0a0a] tracking-tight">Student Details</h3>
                <p className="text-xs text-[#8a8a8e] mt-0.5">Personal, Address, Contact &amp; Extracurricular Record</p>
              </div>

              {/* Quick Field Highlights */}
              <div className="bg-[#fafafc] p-3.5 rounded-xl border border-[#e3e4e8] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8a8a8e]">Student Name:</span>
                  <span className="font-semibold text-[#0a0a0a]">{student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8a8e]">Blood Group:</span>
                  <span className="font-semibold text-rose-600">{student.blood_group || "O+"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8a8e]">Email ID:</span>
                  <span className="font-mono text-[11px] text-[#0a0a0a] truncate max-w-[140px]">{student.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8a8e]">Primary Phone:</span>
                  <span className="font-mono text-[11px] text-[#0a0a0a]">{student.phone || student.permanent_phone || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-3.5 border-t border-[#e3e4e8] bg-[#fafafc] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewDetailsOpen(true)}
                className="h-8 px-3.5 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Eye className="w-3.5 h-3.5 text-[#0a66ff]" />
                <span>Preview 👁</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadDetails}
                className="h-8 px-3.5 rounded-xl bg-[#0a0a0a] hover:bg-[#2c2c2e] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ↓</span>
              </button>
            </div>
          </div>

          {/* CARD 2: STUDENT IMAGE */}
          <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col justify-between overflow-hidden group">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                  🖼
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] uppercase tracking-wider">
                  JPG / PNG
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#0a0a0a] tracking-tight">Student Image</h3>
                <p className="text-xs text-[#8a8a8e] mt-0.5">Identity photograph attached to knowledge base</p>
              </div>

              {/* Photo Preview Container */}
              <div className="h-32 rounded-xl bg-[#fafafc] border border-[#e3e4e8] flex items-center justify-center overflow-hidden relative">
                {student.profile_image ? (
                  <img
                    src={student.profile_image}
                    alt={student.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#8a8a8e] text-xs">
                    <User className="w-8 h-8 mb-1" />
                    <span>No photo uploaded</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-3.5 border-t border-[#e3e4e8] bg-[#fafafc] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewImageOpen(true)}
                className="h-8 px-3.5 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Eye className="w-3.5 h-3.5 text-[#0a66ff]" />
                <span>Preview 👁</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={!student.profile_image}
                className="h-8 px-3.5 rounded-xl bg-[#0a0a0a] hover:bg-[#2c2c2e] disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ↓</span>
              </button>
            </div>
          </div>

          {/* CARD 3: MARKS */}
          <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col justify-between overflow-hidden group">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                  📊
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-[#fafafc] border border-[#e3e4e8] text-emerald-700 uppercase tracking-wider">
                  Academic Record
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#0a0a0a] tracking-tight">Academic Marks</h3>
                <p className="text-xs text-[#8a8a8e] mt-0.5">Prior education, GPA, Hall Ticket &amp; Entrance rank</p>
              </div>

              {/* Marks Highlights */}
              <div className="bg-[#fafafc] p-3.5 rounded-xl border border-[#e3e4e8] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8a8a8e]">SSC Marks:</span>
                  <span className="font-semibold text-[#0a0a0a]">{student.ssc_marks || student.previous_marks_obtained || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8a8e]">SSC Hall Ticket:</span>
                  <span className="font-mono text-[11px] text-[#0a0a0a]">{student.ssc_hall_ticket_no || student.previous_sno || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8a8e]">Inter Marks:</span>
                  <span className="font-bold text-[#0a66ff]">{student.intermediate_marks || student.previous_marks_obtained || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8a8e]">Inter Hall Ticket:</span>
                  <span className="font-mono text-[11px] text-[#0a0a0a]">{student.intermediate_hall_ticket_no || student.previous_sno || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-3.5 border-t border-[#e3e4e8] bg-[#fafafc] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewMarksOpen(true)}
                className="h-8 px-3.5 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Eye className="w-3.5 h-3.5 text-[#0a66ff]" />
                <span>Preview 👁</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadMarks}
                className="h-8 px-3.5 rounded-xl bg-[#0a0a0a] hover:bg-[#2c2c2e] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ↓</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Student Modal */}
      <StudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveStudent}
        student={student}
        defaultFolderId={folder?.id || ""}
        defaultYear={slug.replace("-", "_")}
      />

      {/* Quick Details Preview Modal */}
      <StudentDetailsPreviewModal
        isOpen={isPreviewDetailsOpen}
        onClose={() => setIsPreviewDetailsOpen(false)}
        student={student}
      />

      {/* Quick Photo Preview Modal */}
      <StudentImageModal
        isOpen={isPreviewImageOpen}
        onClose={() => setIsPreviewImageOpen(false)}
        student={student}
      />

      {/* Quick Marks Preview Modal */}
      <StudentMarksModal
        isOpen={isPreviewMarksOpen}
        onClose={() => setIsPreviewMarksOpen(false)}
        student={student}
      />
    </div>
  );
}
