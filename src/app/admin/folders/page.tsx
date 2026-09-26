"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Copy, 
  Check, 
  Settings, 
  Plus, 
  ArrowRight, 
  RefreshCw, 
  Loader2, 
  Search, 
  ChevronRight,
  MoreVertical,
  ExternalLink,
  FolderOpen,
  FolderPlus,
  Edit3,
  Unlock,
  Lock,
  CheckCircle2,
  Sparkles,
  Upload,
  Download,
  Trash2,
  Eye
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import FormConfigModal from "@/components/admin/FormConfigModal";
import StudentModal from "@/components/admin/StudentModal";
import FolderModal from "@/components/admin/FolderModal";
import ImportModal from "@/components/admin/ImportModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import type { YearFolder, StudentRecord } from "@/lib/db/schema";
import { downloadParentFolderZip, downloadMasterAllFoldersZip } from "@/lib/zip-export";

/* Apple 3D-Style Glossy Dark Titanium Folder Graphic */
function AppleGlossyProFolder({ className = "w-32 h-26" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 124 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="appleBackGradAdmin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2c2c2e" />
          <stop offset="100%" stopColor="#1c1c1e" />
        </linearGradient>

        <linearGradient id="appleFrontGradAdmin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a3a3c" />
          <stop offset="30%" stopColor="#2c2c2e" />
          <stop offset="100%" stopColor="#121214" />
        </linearGradient>

        <linearGradient id="appleHighlightAdmin" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
        </linearGradient>

        <filter id="appleGlowShadowAdmin" x="-15%" y="-10%" width="130%" height="145%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.25"/>
        </filter>
      </defs>

      <path 
        d="M14 16C14 11.5817 17.5817 8 22 8H48C51.3137 8 54.3444 10.0416 55.5836 13.1147L58.4164 20.8853C59.6556 23.9584 62.6863 26 66 26H104C108.418 26 112 29.5817 112 34V76C112 80.4183 108.418 84 104 84H22C17.5817 84 14 80.4183 14 76V16Z" 
        fill="url(#appleBackGradAdmin)" 
      />

      <g>
        <rect x="28" y="14" width="70" height="34" rx="4" fill="#ffffff" stroke="#e3e4e8" strokeWidth="1" />
        <rect x="38" y="20" width="34" height="4.5" rx="2.25" fill="#8a8a8e" />
      </g>

      <rect 
        x="10" 
        y="28" 
        width="104" 
        height="56" 
        rx="10" 
        filter="url(#appleGlowShadowAdmin)" 
        fill="url(#appleFrontGradAdmin)" 
      />

      <rect 
        x="12" 
        y="29" 
        width="100" 
        height="1.5" 
        rx="0.75" 
        fill="url(#appleHighlightAdmin)" 
      />
    </svg>
  );
}

export default function AdminFoldersPage() {
  const [folders, setFolders] = useState<YearFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [openMenuFolderId, setOpenMenuFolderId] = useState<string | null>(null);

  // Modals state
  const [selectedFolderForForm, setSelectedFolderForForm] = useState<YearFolder | null>(null);
  const [selectedFolderForAdd, setSelectedFolderForAdd] = useState<YearFolder | null>(null);
  const [selectedFolderForImport, setSelectedFolderForImport] = useState<YearFolder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<YearFolder | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<YearFolder | null>(null);
  const [togglingFolderSlug, setTogglingFolderSlug] = useState<string | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipProgressText, setZipProgressText] = useState("");

  useEffect(() => {
    fetchFolders();
  }, []);

  // Close popup menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuFolderId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/folders");
      const data = await res.json();
      if (data.folders) {
        setFolders(data.folders);
      }
    } catch (err) {
      console.error("Error fetching folders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAcceptingRecords = async (folder: YearFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setTogglingFolderSlug(folder.slug);
      const nextActive = folder.is_form_active === 1 ? 0 : 1;

      const res = await fetch(`/api/admin/folders/${folder.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_form_active: nextActive }),
      });

      const data = await res.json();
      if (data.success && data.folder) {
        setFolders((prev) =>
          prev.map((f) => (f.id === folder.id ? { ...f, is_form_active: nextActive } : f))
        );
      }
    } catch (err) {
      console.error("Error toggling folder status:", err);
    } finally {
      setTogglingFolderSlug(null);
    }
  };

  const handleCopyLink = (slug: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/forms/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleSaveStudent = async (studentData: any) => {
    const payload = {
      ...studentData,
      folder_id: selectedFolderForAdd?.id || "folder_1st_year",
      year: selectedFolderForAdd?.slug?.replace("-", "_") || "1st_year",
    };

    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to add student");
    }
    setSelectedFolderForAdd(null);
    fetchFolders();
  };

  const handleExportFolderStudents = async (folder: YearFolder, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/students?folderId=${folder.id}&limit=500`);
      const data = await res.json();
      const students: StudentRecord[] = data.records || [];

      if (students.length === 0) {
        alert(`No students registered in ${folder.name} yet.`);
        return;
      }

      const headers = [
        "Roll Number",
        "Name",
        "Year",
        "Branch",
        "Section",
        "Admission Type",
        "DOB",
        "Blood Group",
        "Email",
        "Phone",
        "Skills",
      ];
      const rows = [headers.join(",")];
      for (const s of students) {
        rows.push([
          `"${s.roll_number || ""}"`,
          `"${(s.name || "").replace(/"/g, '""')}"`,
          `"${s.year || ""}"`,
          `"${(s.branch || "").replace(/"/g, '""')}"`,
          `"${s.section || ""}"`,
          `"${s.admission_type || ""}"`,
          `"${s.dob || ""}"`,
          `"${s.blood_group || ""}"`,
          `"${s.email || ""}"`,
          `"${s.phone || ""}"`,
          `"${(s.skills || "").replace(/"/g, '""')}"`,
        ].join(","));
      }

      const blob = new Blob([rows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${folder.slug}_students_export.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const handleDownloadFolderZip = async (folder: YearFolder, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setIsDownloadingZip(true);
      setZipProgressText(`Loading ${folder.name || folder.year_label}...`);
      const res = await fetch(`/api/admin/students?folderId=${folder.id}&limit=5000`);
      const data = await res.json();
      const students: StudentRecord[] = data.records || [];
      if (students.length === 0) {
        alert(`No students found in ${folder.name || folder.year_label}`);
        return;
      }
      setZipProgressText(`Archiving ${students.length} student folders...`);
      await downloadParentFolderZip(folder, students, (pct, cur, total) => {
        setZipProgressText(`Compressing: ${pct}% (${cur}/${total})`);
      });
    } catch (err: any) {
      console.error("ZIP export error:", err);
      alert("Failed to export folder ZIP: " + (err.message || "Unknown error"));
    } finally {
      setIsDownloadingZip(false);
      setZipProgressText("");
    }
  };

  const handleDownloadAllFoldersZip = async () => {
    if (folders.length === 0) return;
    try {
      setIsDownloadingZip(true);
      setZipProgressText("Gathering all folder records...");
      
      const folderGroups: { folder: YearFolder; students: StudentRecord[] }[] = [];
      for (const folder of folders) {
        const res = await fetch(`/api/admin/students?folderId=${folder.id}&limit=5000`);
        const data = await res.json();
        folderGroups.push({
          folder,
          students: data.records || []
        });
      }

      setZipProgressText("Building Master ZIP archive...");
      await downloadMasterAllFoldersZip(folderGroups, (pct, folderName) => {
        setZipProgressText(`Archiving ${folderName}... (${pct}%)`);
      });
    } catch (err: any) {
      console.error("Master ZIP error:", err);
      alert("Failed to generate master archive: " + (err.message || "Unknown error"));
    } finally {
      setIsDownloadingZip(false);
      setZipProgressText("");
    }
  };

  const handleDeleteFolderConfirm = async () => {
    if (!folderToDelete) return;
    try {
      const res = await fetch(`/api/admin/folders/${folderToDelete.slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFolderToDelete(null);
        fetchFolders();
      }
    } catch (err) {
      console.error("Delete folder error:", err);
    }
  };

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.year_label?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudents = folders.reduce((acc, f) => acc + (f.student_count || 0), 0);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8a8a8e] bg-[#f5f5f7] min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a0a0a] mb-3" />
        <p className="text-xs font-semibold text-[#0a0a0a]">Loading Parent Folders...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader
        title="Year Folders"
        subtitle="Manage student academic directories, parent folders, and intake registration"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Top Control Bar with Breadcrumb */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Breadcrumb: All Folders */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#0a0a0a]">
            <span>📁</span>
            <span>All Folders</span>
            <span className="text-[#8a8a8e] font-normal font-mono">
              ({folders.length} Parent Batches • {totalStudents} Students)
            </span>
          </div>

          {/* Right Actions: Search, Add Folder & Refresh */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8e]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search year folders..."
                className="w-full h-9 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] pl-9 pr-3 focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 font-medium transition-all"
              />
            </div>

            <button
              type="button"
              onClick={handleDownloadAllFoldersZip}
              disabled={isDownloadingZip}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 shrink-0 active:scale-[0.98] cursor-pointer disabled:opacity-60"
              title="Download Master ZIP containing all academic batches and all student data"
            >
              {isDownloadingZip ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0a66ff]" />
                  <span>{zipProgressText || "Archiving..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#0a66ff]" />
                  <span>Download All ZIP</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setFolderToEdit(null);
                setIsFolderModalOpen(true);
              }}
              className="h-9 px-4 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all flex items-center gap-1.5 shrink-0 active:scale-[0.98] cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ Add Folder</span>
            </button>

            <button
              onClick={fetchFolders}
              className="h-9 w-9 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] transition-all shadow-2xs flex items-center justify-center shrink-0 active:scale-[0.98] cursor-pointer"
              title="Refresh Folders"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#8a8a8e]" />
            </button>
          </div>
        </div>

        {/* Academic Year Folders Grid - 4 in a Line with Apple Glossy Folder Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
          {filteredFolders.map((folder) => {
            const isMenuOpen = openMenuFolderId === folder.id;
            const isCopied = copiedSlug === folder.slug;
            const isFormActive = folder.is_form_active === 1;

            return (
              <div
                key={folder.id}
                className={`bg-white rounded-2xl border border-[#e3e4e8] hover:border-[#0a0a0a] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col justify-between relative group ${
                  isMenuOpen ? "z-50 overflow-visible" : "overflow-hidden"
                }`}
              >
                {/* 3-Dots Action Dropdown Menu */}
                <div className="absolute top-3 right-3 z-30">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuFolderId(isMenuOpen ? null : folder.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-[#f5f5f7] text-[#8a8a8e] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                    title="Folder Actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isMenuOpen && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-1 w-52 bg-white border border-[#e3e4e8] rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.15)] z-50 py-1 text-[11.5px] animate-scale-in ring-1 ring-black/5"
                    >
                      <Link
                        href={`/admin/folders/${folder.slug}`}
                        className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#0a66ff]" />
                        <span>Open Folder</span>
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuFolderId(null);
                          setFolderToEdit(folder);
                          setIsFolderModalOpen(true);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Folder</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuFolderId(null);
                          setSelectedFolderForForm(folder);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Folder Settings</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          handleCopyLink(folder.slug, e);
                          setOpenMenuFolderId(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Form Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuFolderId(null);
                          setSelectedFolderForAdd(folder);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Student Manually</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuFolderId(null);
                          setSelectedFolderForImport(folder);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Import Students</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          handleExportFolderStudents(folder, e);
                          setOpenMenuFolderId(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Students (CSV)</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          handleDownloadFolderZip(folder, e);
                          setOpenMenuFolderId(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                      >
                        <Download className="w-3.5 h-3.5 text-[#0a66ff]" />
                        <span>Download Folder ZIP</span>
                      </button>

                      <div className="h-px bg-[#e3e4e8] my-0.5" />

                      <button
                        type="button"
                        onClick={(e) => {
                          handleToggleAcceptingRecords(folder, e);
                          setOpenMenuFolderId(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-[#f5f5f7] flex items-center gap-2 text-[#0a0a0a] font-medium"
                      >
                        {isFormActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        <span>{isFormActive ? "Pause Intake Form" : "Activate Intake Form"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuFolderId(null);
                          setFolderToDelete(folder);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Folder</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Main Folder Clickable Body */}
                <Link
                  href={`/admin/folders/${folder.slug}`}
                  className="p-5 flex flex-col items-center text-center cursor-pointer flex-1"
                >
                  <div className="my-2 transform transition-transform group-hover:scale-105 duration-200">
                    <AppleGlossyProFolder className="w-28 h-22 sm:w-32 sm:h-26 drop-shadow-md" />
                  </div>

                  <h3 className="font-bold text-sm text-[#0a0a0a] group-hover:text-[#0a66ff] transition-colors mt-2 leading-snug">
                    {folder.name}
                  </h3>

                  {/* Dynamically calculated student count */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-semibold text-[#0a0a0a] font-mono">
                      {folder.student_count || 0}
                    </span>
                    <span className="text-[11px] text-[#8a8a8e]">Enrolled Students</span>
                  </div>
                </Link>

                {/* Bottom Bar: Copy Link & Status Indicator */}
                <div className="px-3.5 py-2.5 bg-[#fafafc] border-t border-[#e3e4e8] flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(folder.slug, e)}
                    className="h-7 px-2.5 rounded-lg bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
                    title="Copy Public Intake Form URL"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-[#0a66ff]" /> : <Copy className="w-3 h-3 text-[#8a8a8e]" />}
                    <span>{isCopied ? "Copied!" : "Form Link"}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleToggleAcceptingRecords(folder, e)}
                      disabled={togglingFolderSlug === folder.slug}
                      className={`relative inline-flex h-4.5 w-8 items-center rounded-full transition-colors cursor-pointer ${
                        isFormActive ? "bg-[#0a0a0a]" : "bg-[#e3e4e8]"
                      }`}
                      title={isFormActive ? "Public form is accepting records" : "Public form is closed"}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          isFormActive ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <span className="text-[10.5px] font-medium text-[#8a8a8e]">
                      {isFormActive ? "Active" : "Paused"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODALS */}
      <FormConfigModal
        isOpen={!!selectedFolderForForm}
        onClose={() => setSelectedFolderForForm(null)}
        folderSlug={selectedFolderForForm?.slug || ""}
        folderName={selectedFolderForForm?.name || ""}
      />

      <StudentModal
        isOpen={!!selectedFolderForAdd}
        onClose={() => setSelectedFolderForAdd(null)}
        onSave={handleSaveStudent}
        defaultYear={selectedFolderForAdd?.slug?.replace("-", "_") || "1st_year"}
        defaultFolderId={selectedFolderForAdd?.id || "folder_1st_year"}
      />

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        folderToEdit={folderToEdit}
        onSaved={() => fetchFolders()}
      />

      <ImportModal
        isOpen={!!selectedFolderForImport}
        onClose={() => setSelectedFolderForImport(null)}
        folderId={selectedFolderForImport?.id}
        folderName={selectedFolderForImport?.name}
        onSuccess={() => fetchFolders()}
      />

      <DeleteConfirmModal
        isOpen={!!folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onConfirm={handleDeleteFolderConfirm}
        title="Delete Academic Folder"
        description={`Are you sure you want to delete the folder "${folderToDelete?.name}"? All associated student configurations will be removed.`}
      />
    </div>
  );
}
