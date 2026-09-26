"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  Upload, 
  Download, 
  Settings, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowLeft, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Lock,
  Unlock,
  MoreVertical,
  LayoutGrid,
  List,
  Eye,
  FileText,
  Image as ImageIcon,
  BarChart3,
  User,
  Crown
} from "lucide-react";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";
import StudentModal from "@/components/admin/StudentModal";
import FormConfigModal from "@/components/admin/FormConfigModal";
import ImportModal from "@/components/admin/ImportModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import FolderModal from "@/components/admin/FolderModal";
import StudentDetailsPreviewModal from "@/components/admin/StudentDetailsPreviewModal";
import StudentImageModal from "@/components/admin/StudentImageModal";
import StudentMarksModal from "@/components/admin/StudentMarksModal";
import type { YearFolder, StudentRecord } from "@/lib/db/schema";
import { formatDate, formatYearLabel } from "@/lib/utils";
import { 
  downloadSingleStudentZip, 
  downloadParentFolderZip, 
  downloadSelectedStudentsZip 
} from "@/lib/zip-export";

/* Apple 3D-Style Glossy Dark Titanium Student Folder Graphic */
function AppleGlossyProStudentFolder({ 
  rollNumber, 
  hasPhoto = false,
  className = "w-28 h-22" 
}: { 
  rollNumber: string; 
  hasPhoto?: boolean;
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 124 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="studentBackGradSuper" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2c2c2e" />
          <stop offset="100%" stopColor="#1c1c1e" />
        </linearGradient>

        <linearGradient id="studentFrontGradSuper" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a3a3c" />
          <stop offset="30%" stopColor="#2c2c2e" />
          <stop offset="100%" stopColor="#121214" />
        </linearGradient>

        <linearGradient id="studentHighlightSuper" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
        </linearGradient>

        <filter id="studentGlowShadowSuper" x="-15%" y="-10%" width="130%" height="145%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.22"/>
        </filter>
      </defs>

      {/* Back tab */}
      <path 
        d="M14 16C14 11.5817 17.5817 8 22 8H48C51.3137 8 54.3444 10.0416 55.5836 13.1147L58.4164 20.8853C59.6556 23.9584 62.6863 26 66 26H104C108.418 26 112 29.5817 112 34V76C112 80.4183 108.418 84 104 84H22C17.5817 84 14 80.4183 14 76V16Z" 
        fill="url(#studentBackGradSuper)" 
      />

      {/* 3 Internal Document Files Sticking Out */}
      <g>
        {/* Document 3 (Marks) */}
        <rect x="36" y="10" width="56" height="30" rx="3" fill="#e5e5ea" stroke="#d1d1d6" strokeWidth="0.8" />
        {/* Document 2 (Image) */}
        <rect x="32" y="12" width="60" height="32" rx="3.5" fill="#f2f2f7" stroke="#e3e4e8" strokeWidth="0.8" />
        {/* Document 1 (Details) */}
        <rect x="28" y="14" width="68" height="34" rx="4" fill="#ffffff" stroke="#e3e4e8" strokeWidth="1" />
        {/* Document Header Line */}
        <rect x="36" y="19" width="30" height="3" rx="1.5" fill="#0a0a0a" />
        <rect x="36" y="24" width="40" height="2" rx="1" fill="#c7c7cc" />
      </g>

      {/* Front Folder Face */}
      <rect 
        x="10" 
        y="28" 
        width="104" 
        height="56" 
        rx="10" 
        filter="url(#studentGlowShadowSuper)" 
        fill="url(#studentFrontGradSuper)" 
      />

      {/* Top Glossy Sheen Highlight */}
      <rect 
        x="12" 
        y="29" 
        width="100" 
        height="1.5" 
        rx="0.75" 
        fill="url(#studentHighlightSuper)" 
      />

      {/* Roll Number Plaque Badge on Front */}
      <g>
        <rect x="20" y="46" width="84" height="24" rx="6" fill="#1c1c1e" stroke="#3a3a3c" strokeWidth="1" />
        <text 
          x="62" 
          y="62" 
          fill="#ffffff" 
          fontSize="10.5" 
          fontWeight="700" 
          fontFamily="ui-monospace, monospace" 
          textAnchor="middle"
          letterSpacing="0.05em"
        >
          {rollNumber.length > 10 ? `${rollNumber.substring(0, 9)}…` : rollNumber}
        </text>
      </g>
    </svg>
  );
}

export default function SuperAdminFolderDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [folder, setFolder] = useState<YearFolder | null>(null);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 50;

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [viewMode, setViewMode] = useState<"folders" | "table">("folders");
  const [openStudentMenuId, setOpenStudentMenuId] = useState<string | null>(null);

  // Multi-selection for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkBranch, setBulkBranch] = useState("CSE");
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentRecord | null>(null);
  const [isFormConfigOpen, setIsFormConfigOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isDeleteFolderOpen, setIsDeleteFolderOpen] = useState(false);
  const [isDeletingFolder, setIsDeletingFolder] = useState(false);

  // Quick Preview Modals
  const [previewingDetailsStudent, setPreviewingDetailsStudent] = useState<StudentRecord | null>(null);
  const [previewingImageStudent, setPreviewingImageStudent] = useState<StudentRecord | null>(null);
  const [previewingMarksStudent, setPreviewingMarksStudent] = useState<StudentRecord | null>(null);

  // ZIP Download States
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipProgressText, setZipProgressText] = useState("");

  useEffect(() => {
    if (slug) {
      fetchFolderDetails();
    }
  }, [slug]);

  useEffect(() => {
    if (folder) {
      fetchStudents();
    }
  }, [folder, search, page]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenStudentMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchFolderDetails = async () => {
    try {
      const res = await fetch(`/api/admin/folders/${slug}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Folder not found");
      setFolder(data.folder);
    } catch (err) {
      console.error("Error fetching folder:", err);
    }
  };

  const fetchStudents = async () => {
    if (!folder) return;
    try {
      setLoading(true);
      const query = new URLSearchParams({
        folderId: folder.id,
        search,
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/admin/students?${query.toString()}`);
      const data = await res.json();
      setStudents(data.records || []);
      setTotal(data.total || 0);
      setSelectedIds([]);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAcceptingRecords = async () => {
    if (!folder) return;
    try {
      setIsTogglingStatus(true);
      const nextActive = folder.is_form_active === 1 ? 0 : 1;
      const res = await fetch(`/api/admin/folders/${folder.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_form_active: nextActive }),
      });
      const data = await res.json();
      if (data.success && data.folder) {
        setFolder(data.folder);
      }
    } catch (err) {
      console.error("Error toggling folder status:", err);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/forms/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveStudent = async (studentData: any) => {
    const isEdit = !!editingStudent;
    const url = isEdit ? `/api/admin/students/${editingStudent.id}` : "/api/admin/students";
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      ...studentData,
      folder_id: folder?.id || "folder_1st_year",
      year: slug.replace("-", "_"),
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to save student");
    }

    setIsAddModalOpen(false);
    setEditingStudent(null);
    fetchStudents();
    fetchFolderDetails();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    try {
      const res = await fetch(`/api/admin/students/${deletingStudent.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingStudent(null);
        fetchStudents();
        fetchFolderDetails();
      }
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const handleDeleteFolderConfirm = async () => {
    if (!folder) return;
    try {
      setIsDeletingFolder(true);
      const res = await fetch(`/api/admin/folders/${folder.slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsDeleteFolderOpen(false);
        router.push("/super-admin/institutes");
      }
    } catch (err) {
      console.error("Error deleting folder:", err);
    } finally {
      setIsDeletingFolder(false);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExportSelected = () => {
    const targetStudents = selectedIds.length > 0 
      ? students.filter((s) => selectedIds.includes(s.id))
      : students;

    if (targetStudents.length === 0) return;

    const headers = [
      "Roll Number",
      "Name",
      "Year",
      "Branch",
      "Section",
      "Admission Type",
      "Date of Birth",
      "Blood Group",
      "Aadhaar No",
      "Email",
      "Phone",
      "Father Name",
      "Mother Name",
      "Permanent Address",
      "Present Address",
      "Previous Course",
      "Marks Obtained",
      "Max Marks",
      "Skills",
    ];

    const csvRows = [headers.join(",")];

    for (const s of targetStudents) {
      const row = [
        `"${s.roll_number || ""}"`,
        `"${(s.name || "").replace(/"/g, '""')}"`,
        `"${s.year || ""}"`,
        `"${(s.branch || "").replace(/"/g, '""')}"`,
        `"${s.section || ""}"`,
        `"${s.admission_type || ""}"`,
        `"${s.dob || ""}"`,
        `"${s.blood_group || ""}"`,
        `"${s.aadhaar_no || ""}"`,
        `"${s.email || ""}"`,
        `"${s.phone || ""}"`,
        `"${(s.father_name || "").replace(/"/g, '""')}"`,
        `"${(s.mother_name || "").replace(/"/g, '""')}"`,
        `"${(s.permanent_address || "").replace(/"/g, '""')}"`,
        `"${(s.present_address || "").replace(/"/g, '""')}"`,
        `"${(s.previous_course || "").replace(/"/g, '""')}"`,
        `"${s.previous_marks_obtained || ""}"`,
        `"${s.previous_max_marks || ""}"`,
        `"${(s.skills || "").replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}_students_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadFolderZip = async () => {
    if (!folder) return;
    try {
      setIsDownloadingZip(true);
      setZipProgressText("Fetching all students...");
      const res = await fetch(`/api/admin/students?folderId=${folder.id}&limit=5000`);
      const data = await res.json();
      const allStudents: StudentRecord[] = data.records || [];
      if (allStudents.length === 0) {
        alert(`No student records found in ${folder.name || folder.year_label}`);
        return;
      }
      setZipProgressText(`Packaging ${allStudents.length} student folders...`);
      await downloadParentFolderZip(folder, allStudents, (pct, current, total) => {
        setZipProgressText(`Compressing: ${pct}% (${current}/${total})`);
      });
    } catch (err: any) {
      console.error("ZIP Download Error:", err);
      alert("Failed to create ZIP: " + (err.message || "Unknown error"));
    } finally {
      setIsDownloadingZip(false);
      setZipProgressText("");
    }
  };

  const handleDownloadStudentZip = async (student: StudentRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await downloadSingleStudentZip(student);
    } catch (err: any) {
      console.error("Student ZIP error:", err);
      alert("Failed to download student ZIP: " + (err.message || "Unknown error"));
    }
  };

  const handleDownloadSelectedZip = async () => {
    if (!folder) return;
    const targetStudents = selectedIds.length > 0 
      ? students.filter((s) => selectedIds.includes(s.id))
      : students;

    if (targetStudents.length === 0) {
      alert("No students selected to export.");
      return;
    }

    try {
      setIsDownloadingZip(true);
      setZipProgressText(`Packaging ${targetStudents.length} student folders...`);
      await downloadSelectedStudentsZip(folder, targetStudents, (pct, current, total) => {
        setZipProgressText(`Compressing: ${pct}% (${current}/${total})`);
      });
    } catch (err: any) {
      alert("Failed to download selected ZIP: " + (err.message || "Unknown error"));
    } finally {
      setIsDownloadingZip(false);
      setZipProgressText("");
    }
  };

  const isFormActive = folder?.is_form_active === 1;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7] text-[#0a0a0a] font-sans">
      <SuperAdminHeader
        title={folder?.year_label || folder?.name || "Master Folder Workspace"}
        subtitle="Global root directory roster, schema fields configuration, and student record hierarchy"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#8a8a8e]">
          <Link href="/super-admin/institutes" className="hover:text-[#0a0a0a] transition-colors flex items-center gap-1.5">
            <span>📁</span>
            <span>Master Root Directories</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-[#0a0a0a]">{folder?.name || folder?.year_label || "1st Year"}</span>
        </div>

        {/* Top Control Bar with Pro Action Toolbar */}
        <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          {/* Left: Folder Identity & Intake Status Switch */}
          <div className="flex items-center gap-3.5 min-w-0">
            <Link
              href="/super-admin/institutes"
              className="w-10 h-10 rounded-xl bg-[#f5f5f7] hover:bg-white border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center transition-all duration-200 shadow-2xs active:scale-[0.98] flex-shrink-0 cursor-pointer"
              title="Back to all folders"
            >
              <ArrowLeft className="w-4 h-4 text-[#0a0a0a]" />
            </Link>
            
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0a0a0a] tracking-tight">
                  {folder?.name || folder?.year_label || "Academic Year Batch"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
                  {slug}
                </span>

                {/* Compact Intake Live Status Toggle Pill */}
                <button
                  type="button"
                  onClick={handleToggleAcceptingRecords}
                  disabled={isTogglingStatus}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-xs font-semibold text-[#0a0a0a] shadow-2xs transition-all cursor-pointer disabled:opacity-60"
                  title="Click to toggle intake form accepting status"
                >
                  <span className={`w-2 h-2 rounded-full ${isFormActive ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
                  <span className="text-[11px]">{isTogglingStatus ? "Updating..." : isFormActive ? "Public Form Live" : "Intake Closed"}</span>
                  <span className={`relative inline-flex h-3.5 w-6 items-center rounded-full transition-colors ml-0.5 ${
                    isFormActive ? "bg-[#0a0a0a]" : "bg-[#e3e4e8]"
                  }`}>
                    <span className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                      isFormActive ? "translate-x-2.5" : "translate-x-0.5"
                    }`} />
                  </span>
                </button>
              </div>

              <p className="text-xs text-[#8a8a8e] truncate">{folder?.description || "Student intake roster and dedicated directory"}</p>
            </div>
          </div>

          {/* Right: Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-start xl:justify-end">
            <button
              type="button"
              onClick={() => setIsFolderModalOpen(true)}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#0a0a0a]" />
              <span>Edit Folder</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteFolderOpen(true)}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-rose-50 border border-[#e3e4e8] hover:border-rose-200 text-rose-600 text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
              title="Permanently delete this folder"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Delete Folder</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#0a66ff]" /> : <Copy className="w-3.5 h-3.5 text-[#8a8a8e]" />}
              <span>{copied ? "Copied!" : "Form Link"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFormConfigOpen(true)}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#8a8a8e]" />
              <span>Configure Fields</span>
            </button>

            <button
              type="button"
              onClick={() => setIsImportOpen(true)}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#8a8a8e]" />
              <span>Import CSV</span>
            </button>

            {/* Main ZIP Download Button for Parent Folder + All Child Folders */}
            <button
              type="button"
              onClick={handleDownloadFolderZip}
              disabled={isDownloadingZip}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              title="Download entire parent folder containing all child student folders and data"
            >
              {isDownloadingZip ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0a66ff]" />
                  <span>{zipProgressText || "Archiving..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#0a66ff]" />
                  <span>Download ZIP</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingStudent(null);
                setIsAddModalOpen(true);
              }}
              className="h-9 px-4 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Student</span>
            </button>
          </div>
        </div>

        {/* Main Directory Workspace View */}
        <div className="space-y-4">
          {/* Sub-header Controls */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8e]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students by roll number, name..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl focus:outline-none focus:bg-white focus:border-[#0a0a0a] font-sans"
              />
            </div>

            {/* View Mode & Selection Toolbar */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 mr-2">
                  <span className="text-xs font-semibold text-[#0a0a0a] bg-[#f5f5f7] px-2.5 py-1 rounded-lg border border-[#e3e4e8]">
                    {selectedIds.length} Selected
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsBulkDeleteModalOpen(true)}
                    className="h-8 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}

              {/* View Toggle */}
              <div className="flex items-center bg-[#f5f5f7] p-0.5 rounded-xl border border-[#e3e4e8]">
                <button
                  type="button"
                  onClick={() => setViewMode("folders")}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === "folders"
                      ? "bg-white text-[#0a0a0a] shadow-xs"
                      : "text-[#8a8a8e] hover:text-[#0a0a0a]"
                  }`}
                  title="Folder Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Folders</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-white text-[#0a0a0a] shadow-xs"
                      : "text-[#8a8a8e] hover:text-[#0a0a0a]"
                  }`}
                  title="Table View"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Table</span>
                </button>
              </div>

              {/* Export CSV Button */}
              <button
                type="button"
                onClick={handleExportSelected}
                className="h-9 px-3 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] font-semibold text-xs text-[#0a0a0a] flex items-center gap-1.5 shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
                title="Export CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#8a8a8e]" />
                <span className="hidden sm:inline">CSV</span>
              </button>

              {/* ZIP Download Button for Selected / Batch */}
              <button
                type="button"
                onClick={handleDownloadSelectedZip}
                disabled={isDownloadingZip}
                className="h-9 px-3 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] font-semibold text-xs text-[#0a0a0a] flex items-center gap-1.5 shadow-2xs active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                title="Download ZIP for selected / batch students"
              >
                <Download className="w-3.5 h-3.5 text-[#0a66ff]" />
                <span className="hidden sm:inline">ZIP {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}</span>
              </button>
            </div>
          </div>

          {/* Loading State with Skeleton Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#e3e4e8] p-5 flex flex-col items-center justify-between min-h-[220px]">
                  <div className="w-24 h-18 bg-slate-100 rounded-xl mb-4" />
                  <div className="w-full space-y-2">
                    <div className="h-4 bg-slate-100 rounded-md w-3/4 mx-auto" />
                    <div className="h-3 bg-slate-100 rounded-md w-1/2 mx-auto" />
                  </div>
                  <div className="w-full pt-3 border-t border-slate-100 flex justify-between items-center mt-4">
                    <div className="h-4 bg-slate-100 rounded w-16" />
                    <div className="h-4 bg-slate-100 rounded w-12" />
                  </div>
                </div>
              ))}
            </div>
          ) : students.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-[#e3e4e8] text-center text-[#8a8a8e]">
              <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center mx-auto mb-3 text-xl">
                📁
              </div>
              <h3 className="text-sm font-bold text-[#0a0a0a]">No Students in this Folder</h3>
              <p className="text-xs text-[#8a8a8e] mt-1 mb-4">
                Add students manually or share the Public Form link to collect submissions.
              </p>
              <button
                type="button"
                onClick={() => {
                  setEditingStudent(null);
                  setIsAddModalOpen(true);
                }}
                className="h-8 px-4 rounded-xl bg-[#0a0a0a] text-white text-xs font-semibold shadow-xs"
              >
                + Add First Student
              </button>
            </div>
          ) : viewMode === "folders" ? (
            /* ============================================================ */
            /* FOLDER GRID VIEW: Apple-Style Student Folder Cards */
            /* ============================================================ */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {students.map((student) => {
                const isMenuOpen = openStudentMenuId === student.id;
                const studentFolderUrl = `/super-admin/institutes/${slug}/${student.roll_number || student.id}`;

                return (
                  <div
                    key={student.id}
                    className={`bg-white rounded-2xl border border-[#e3e4e8] hover:border-[#0a0a0a] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col justify-between relative group ${
                      isMenuOpen ? "z-50 overflow-visible" : "overflow-hidden"
                    }`}
                  >
                    {/* Three-Dot Options Dropdown */}
                    <div className="absolute top-3 right-3 z-30">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenStudentMenuId(isMenuOpen ? null : student.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#f5f5f7] text-[#8a8a8e] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                        title="Student Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {isMenuOpen && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 mt-1 w-48 bg-white border border-[#e3e4e8] rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.15)] z-50 py-1 text-[11.5px] animate-scale-in ring-1 ring-black/5"
                        >
                          <Link
                            href={studentFolderUrl}
                            className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#0a66ff]" />
                            <span>Open Folder</span>
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenStudentMenuId(null);
                              setEditingStudent(student);
                              setIsAddModalOpen(true);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenStudentMenuId(null);
                              setPreviewingDetailsStudent(student);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Preview Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenStudentMenuId(null);
                              setPreviewingImageStudent(student);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Preview Photo</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenStudentMenuId(null);
                              setPreviewingMarksStudent(student);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                          >
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>Preview Marks</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenStudentMenuId(null);
                              handleDownloadStudentZip(student, e);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                          >
                            <Download className="w-3.5 h-3.5 text-[#0a66ff]" />
                            <span>Download ZIP</span>
                          </button>

                          <div className="h-px bg-[#e3e4e8] my-0.5" />

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenStudentMenuId(null);
                              setDeletingStudent(student);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Record</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Clickable Card Body */}
                    <Link
                      href={studentFolderUrl}
                      className="p-5 flex flex-col items-center text-center cursor-pointer flex-1"
                    >
                      {/* 3D Student Folder Graphic */}
                      <div className="my-2 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                        <AppleGlossyProStudentFolder 
                          rollNumber={student.roll_number} 
                          hasPhoto={!!student.profile_image}
                        />
                      </div>

                      {/* Student Name */}
                      <h4 className="text-sm font-bold text-[#0a0a0a] tracking-tight mt-1 truncate w-full" title={student.name}>
                        {student.name}
                      </h4>

                      {/* Branch & Year Label */}
                      <p className="text-[11px] text-[#8a8a8e] truncate w-full mt-0.5">
                        {student.branch} {student.section ? `• Sec ${student.section}` : ""}
                      </p>
                    </Link>

                    {/* 3 Direct Document Files Indicator Row */}
                    <div className="px-3.5 py-2.5 bg-[#fafafc] border-t border-[#e3e4e8] flex items-center justify-between text-[10px] font-semibold text-[#8a8a8e]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewingDetailsStudent(student);
                        }}
                        className="hover:text-[#0a0a0a] flex items-center gap-1 hover:underline cursor-pointer"
                        title="View Details File"
                      >
                        <FileText className="w-3 h-3 text-[#0a0a0a]" />
                        <span>Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewingImageStudent(student);
                        }}
                        className="hover:text-[#0a0a0a] flex items-center gap-1 hover:underline cursor-pointer"
                        title="View Photo File"
                      >
                        <ImageIcon className="w-3 h-3 text-[#0a0a0a]" />
                        <span>Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewingMarksStudent(student);
                        }}
                        className="hover:text-[#0a0a0a] flex items-center gap-1 hover:underline cursor-pointer"
                        title="View Marks File"
                      >
                        <BarChart3 className="w-3 h-3 text-[#0a0a0a]" />
                        <span>Marks</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ============================================================ */
            /* TABLE VIEW: Structured Grid with Checkboxes */
            /* ============================================================ */
            <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#fafafc] border-b border-[#e3e4e8] text-[11px] font-bold text-[#8a8a8e] uppercase tracking-wider">
                      <th className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={students.length > 0 && selectedIds.length === students.length}
                          onChange={handleToggleSelectAll}
                          className="rounded border-[#e3e4e8] text-[#0a0a0a] focus:ring-[#0a0a0a]"
                        />
                      </th>
                      <th className="p-3">Roll Number</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Branch &amp; Sec</th>
                      <th className="p-3">Email &amp; Phone</th>
                      <th className="p-3">Admission</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e4e8]">
                    {students.map((student) => {
                      const isSelected = selectedIds.includes(student.id);
                      const studentFolderUrl = `/super-admin/institutes/${slug}/${student.roll_number || student.id}`;

                      return (
                        <tr
                          key={student.id}
                          className={`hover:bg-[#fafafc] transition-colors ${
                            isSelected ? "bg-[#f5f5f7]" : ""
                          }`}
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleRow(student.id)}
                              className="rounded border-[#e3e4e8] text-[#0a0a0a] focus:ring-[#0a0a0a]"
                            />
                          </td>
                          <td className="p-3 font-mono font-bold text-[#0a0a0a]">
                            <Link href={studentFolderUrl} className="hover:underline flex items-center gap-1.5">
                              <span>📁</span>
                              <span>{student.roll_number}</span>
                            </Link>
                          </td>
                          <td className="p-3 font-semibold text-[#0a0a0a]">
                            <div className="flex items-center gap-2">
                              {student.profile_image ? (
                                <img
                                  src={student.profile_image}
                                  alt=""
                                  className="w-6 h-6 rounded-full object-cover border border-[#e3e4e8]"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center text-[10px] text-[#8a8a8e]">
                                  {student.name.charAt(0)}
                                </div>
                              )}
                              <span>{student.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-[#636366]">
                            {student.branch} {student.section ? `(${student.section})` : ""}
                          </td>
                          <td className="p-3 text-[#8a8a8e]">
                            <div>{student.email || "-"}</div>
                            <div className="text-[10px]">{student.phone || "-"}</div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
                              {student.admission_type || "Regular"}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={studentFolderUrl}
                                className="p-1.5 text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] rounded-lg transition-colors"
                                title="Open Folder"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                type="button"
                                onClick={(e) => handleDownloadStudentZip(student, e)}
                                className="p-1.5 text-[#8a8a8e] hover:text-[#0a66ff] hover:bg-[#f5f5f7] rounded-lg transition-colors"
                                title="Download Student ZIP Folder"
                              >
                                <Download className="w-3.5 h-3.5 text-[#0a66ff]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingStudent(student);
                                  setIsAddModalOpen(true);
                                }}
                                className="p-1.5 text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingStudent(student)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Floating Multi-Select Action Dock */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-[#0a0a0a]/90 dark:bg-black/95 text-white backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center gap-2 pr-3 border-r border-white/15 text-xs font-semibold text-slate-200">
              <span className="w-5 h-5 rounded-full bg-[#0a66ff] text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                {selectedIds.length}
              </span>
              <span>Selected</span>
            </div>
            <button
              type="button"
              onClick={handleDownloadSelectedZip}
              disabled={isDownloadingZip}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a66ff] hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingZip ? zipProgressText || "Compressing..." : `Download ZIP (${selectedIds.length})`}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-semibold rounded-xl border border-red-500/30 transition-all cursor-pointer active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-[#8a8a8e] hover:text-white px-2 py-1 transition-colors cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        )}
      </main>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        student={editingStudent}
        defaultFolderId={folder?.id || ""}
        defaultYear={slug.replace("-", "_")}
      />

      {/* Edit Folder Details Modal */}
      {folder && (
        <FolderModal
          isOpen={isFolderModalOpen}
          onClose={() => setIsFolderModalOpen(false)}
          onSaved={() => {
            fetchFolderDetails();
            fetchStudents();
          }}
          folderToEdit={folder}
        />
      )}

      {/* Delete Single Student Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student Record?"
        description={`Are you sure you want to delete ${deletingStudent?.name} (${deletingStudent?.roll_number})? This action cannot be undone.`}
      />

      {/* Delete Full Folder Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteFolderOpen}
        onClose={() => setIsDeleteFolderOpen(false)}
        onConfirm={handleDeleteFolderConfirm}
        loading={isDeletingFolder}
        title={`Delete Folder "${folder?.name}"?`}
        description={`Are you sure you want to permanently delete this folder and all associated ${total} student records? This action is irreversible.`}
      />

      {/* Configure Fields Modal */}
      {folder && (
        <FormConfigModal
          isOpen={isFormConfigOpen}
          onClose={() => setIsFormConfigOpen(false)}
          folderSlug={folder.slug}
          folderName={folder.name}
        />
      )}

      {/* Import CSV Modal */}
      {folder && (
        <ImportModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          folderId={folder.id}
          folderName={folder.name}
          onSuccess={() => {
            fetchStudents();
            fetchFolderDetails();
          }}
        />
      )}

      {/* Quick Details Preview Modal */}
      {previewingDetailsStudent && (
        <StudentDetailsPreviewModal
          isOpen={!!previewingDetailsStudent}
          onClose={() => setPreviewingDetailsStudent(null)}
          student={previewingDetailsStudent}
        />
      )}

      {/* Quick Photo Preview Modal */}
      {previewingImageStudent && (
        <StudentImageModal
          isOpen={!!previewingImageStudent}
          onClose={() => setPreviewingImageStudent(null)}
          student={previewingImageStudent}
        />
      )}

      {/* Quick Marks Preview Modal */}
      {previewingMarksStudent && (
        <StudentMarksModal
          isOpen={!!previewingMarksStudent}
          onClose={() => setPreviewingMarksStudent(null)}
          student={previewingMarksStudent}
        />
      )}
    </div>
  );
}
