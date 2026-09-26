"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Copy, 
  Check, 
  Settings, 
  Plus, 
  RefreshCw, 
  Loader2, 
  Search, 
  ChevronRight,
  MoreVertical,
  FolderOpen,
  Crown,
  FolderPlus,
  Edit3,
  Unlock,
  Lock,
  Trash2,
  Download
} from "lucide-react";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";
import FormConfigModal from "@/components/admin/FormConfigModal";
import StudentModal from "@/components/admin/StudentModal";
import FolderModal from "@/components/admin/FolderModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import type { YearFolder, StudentRecord } from "@/lib/db/schema";
import { downloadParentFolderZip, downloadMasterAllFoldersZip } from "@/lib/zip-export";

/* Apple Glossy Pro Graphite / Dark Titanium 3D Folder Graphic */
function AppleGlossyProFolder({ className = "w-32 h-26" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 124 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="appleBackGradSuper" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2c2c2e" />
          <stop offset="100%" stopColor="#1c1c1e" />
        </linearGradient>

        <linearGradient id="appleFrontGradSuper" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a3a3c" />
          <stop offset="30%" stopColor="#2c2c2e" />
          <stop offset="100%" stopColor="#121214" />
        </linearGradient>

        <linearGradient id="appleHighlightSuper" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
        </linearGradient>

        <filter id="appleGlowShadowSuper" x="-15%" y="-10%" width="130%" height="145%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.25"/>
        </filter>
      </defs>

      <path 
        d="M14 16C14 11.5817 17.5817 8 22 8H48C51.3137 8 54.3444 10.0416 55.5836 13.1147L58.4164 20.8853C59.6556 23.9584 62.6863 26 66 26H104C108.418 26 112 29.5817 112 34V76C112 80.4183 108.418 84 104 84H22C17.5817 84 14 80.4183 14 76V16Z" 
        fill="url(#appleBackGradSuper)" 
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
        filter="url(#appleGlowShadowSuper)" 
        fill="url(#appleFrontGradSuper)" 
      />

      <rect 
        x="12" 
        y="29" 
        width="100" 
        height="1.5" 
        rx="0.75" 
        fill="url(#appleHighlightSuper)" 
      />
    </svg>
  );
}

export default function SuperAdminInstitutesPage() {
  const [folders, setFolders] = useState<YearFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [openMenuFolderId, setOpenMenuFolderId] = useState<string | null>(null);

  const [selectedFolderForForm, setSelectedFolderForForm] = useState<YearFolder | null>(null);
  const [selectedFolderForAdd, setSelectedFolderForAdd] = useState<YearFolder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<YearFolder | null>(null);
  const [isDeletingFolder, setIsDeletingFolder] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<YearFolder | null>(null);
  const [togglingFolderSlug, setTogglingFolderSlug] = useState<string | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipProgressText, setZipProgressText] = useState("");

  useEffect(() => {
    fetchFolders();
  }, []);

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

  const handleDeleteFolderConfirm = async () => {
    if (!folderToDelete) return;
    try {
      setIsDeletingFolder(true);
      const res = await fetch(`/api/admin/folders/${folderToDelete.slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFolderToDelete(null);
        fetchFolders();
      }
    } catch (err) {
      console.error("Error deleting folder:", err);
    } finally {
      setIsDeletingFolder(false);
    }
  };

  const handleCopyLink = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/forms/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleToggleAcceptingRecords = async (folder: YearFolder, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setTogglingFolderSlug(folder.slug);
      const nextStatus = folder.is_form_active === 1 ? 0 : 1;
      const res = await fetch(`/api/admin/folders/${folder.slug}/form-config`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_form_active: nextStatus }),
      });
      if (res.ok) {
        setFolders((prev) =>
          prev.map((f) => (f.slug === folder.slug ? { ...f, is_form_active: nextStatus } : f))
        );
      }
    } catch (err) {
      console.error("Error toggling folder form status:", err);
    } finally {
      setTogglingFolderSlug(null);
    }
  };

  const handleSaveStudent = async (studentData: any) => {
    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to add student");
    }
    setSelectedFolderForAdd(null);
    fetchFolders();
  };

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.year_label?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudents = folders.reduce((acc, f) => acc + (f.student_count || 0), 0);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8a8a8e] bg-[#f5f5f7] min-h-screen font-sans">
        <Loader2 className="w-7 h-7 animate-spin text-[#0a0a0a] mb-3" />
        <p className="text-xs font-semibold text-[#0a0a0a]">Loading Directories...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7] text-[#0a0a0a] font-sans">
      <SuperAdminHeader
        title="Multi-Institute & Folders"
        subtitle="Global root directories, academic batch intake controls, schema fields, and registration URLs"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Top Control Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Breadcrumb */}
          <div className="flex items-center gap-2 h-9 px-3 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-xs font-bold text-[#0a0a0a] w-full sm:w-auto">
            <span>📁</span>
            <span>Master Root Directories</span>
            <span className="text-[#8a8a8e] font-normal">({folders.length} Batches • {totalStudents} Students)</span>
          </div>

          {/* Right Actions: Search, Add Folder & Refresh */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8e]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search year folders..."
                className="w-full h-9 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] pl-10 pr-3 focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 font-medium transition-all"
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
              className="h-9 w-9 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] transition-all shadow-2xs flex items-center justify-center shrink-0 active:scale-[0.98]"
              title="Refresh Folders"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Academic Year Folders Grid - 4 in a Line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
          {filteredFolders.map((folder) => {
            const isMenuOpen = openMenuFolderId === folder.id;
            const isCopied = copiedSlug === folder.slug;
            const isFormActive = folder.is_form_active === 1;

            return (
              <div
                key={folder.id}
                className={`bg-white rounded-2xl border border-[#e3e4e8] hover:border-[#0a0a0a] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between relative group ${
                  isMenuOpen ? "z-50 overflow-visible" : "overflow-hidden"
                }`}
              >
                {/* 3-Dots Action Dropdown */}
                <div className="absolute top-3 right-3 z-30">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuFolderId(isMenuOpen ? null : folder.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-[#f5f5f7] text-[#8a8a8e] hover:text-[#0a0a0a] transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isMenuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-1 w-52 bg-white border border-[#e3e4e8] rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.15)] z-50 py-1 text-[11.5px] animate-scale-up ring-1 ring-black/5"
                    >
                      <Link
                        href={`/super-admin/institutes/${folder.slug}`}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#f5f5f7] text-[#0a0a0a] font-semibold"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-[#0a0a0a]" />
                        <span>Open Folder Roster</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuFolderId(null);
                          setFolderToEdit(folder);
                          setIsFolderModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#f5f5f7] text-[#0a0a0a] font-semibold text-left"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#0a0a0a]" />
                        <span>Edit Folder Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleToggleAcceptingRecords(folder, e)}
                        disabled={togglingFolderSlug === folder.slug}
                        className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#f5f5f7] text-[#0a0a0a] font-semibold text-left border-y border-[#e3e4e8]"
                      >
                        <span className="flex items-center gap-2">
                          {isFormActive ? (
                            <Unlock className="w-3.5 h-3.5 text-[#0a0a0a]" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-[#8a8a8e]" />
                          )}
                          <span>Accepting Records</span>
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isFormActive ? "bg-[#0a0a0a] text-white" : "bg-[#f5f5f7] text-[#8a8a8e]"
                        }`}>
                          {togglingFolderSlug === folder.slug ? "..." : isFormActive ? "ON" : "OFF"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuFolderId(null);
                          setSelectedFolderForAdd(folder);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#f5f5f7] text-[#0a0a0a] font-semibold text-left"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#0a0a0a]" />
                        <span>Add Student</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuFolderId(null);
                          setSelectedFolderForForm(folder);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#f5f5f7] text-[#0a0a0a] font-semibold text-left"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#0a0a0a]" />
                        <span>Configure Fields</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          handleDownloadFolderZip(folder, e);
                          setOpenMenuFolderId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#f5f5f7] text-[#0a0a0a] font-semibold text-left"
                      >
                        <Download className="w-3.5 h-3.5 text-[#0a66ff]" />
                        <span>Download Folder ZIP</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          setOpenMenuFolderId(null);
                          handleCopyLink(folder.slug, e);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#f5f5f7] text-[#0a0a0a] font-semibold text-left border-t border-[#e3e4e8]"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#8a8a8e]" />
                        <span>Copy Public Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuFolderId(null);
                          setFolderToDelete(folder);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-rose-50 text-rose-600 font-semibold text-left border-t border-[#e3e4e8] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete Folder</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Clickable Card Body */}
                <Link
                  href={`/super-admin/institutes/${folder.slug}`}
                  className="p-4 sm:p-5 flex flex-col items-center text-center cursor-pointer flex-1"
                >
                  {/* Folder Graphic */}
                  <div className="my-1 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                    <AppleGlossyProFolder className="w-28 h-22 sm:w-30 sm:h-24 lg:w-32 lg:h-26" />
                  </div>

                  {/* Folder Title */}
                  <h3 className="text-sm sm:text-base font-bold text-[#0a0a0a] tracking-tight mt-2 truncate w-full" title={folder.name}>
                    {folder.name}
                  </h3>

                  {/* Count & Status */}
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <span className="text-[11px] sm:text-xs font-medium text-[#8a8a8e]">
                      {folder.student_count || 0} Students • {folder.year_label}
                    </span>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border bg-[#f5f5f7] text-[#0a0a0a] border-[#e3e4e8] inline-flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isFormActive ? "bg-[#0a0a0a]" : "bg-[#8a8a8e]"}`} />
                      <span>{isFormActive ? "Accepting Records" : "Form Paused"}</span>
                    </span>
                  </div>
                </Link>

                {/* Card Footer Actions */}
                <div className="p-2.5 bg-[#fafafc] border-t border-[#e3e4e8] flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(folder.slug, e)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#8a8a8e] hover:text-[#0a0a0a] px-2 py-1 rounded-lg hover:bg-white transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#0a0a0a]" />
                        <span className="text-[#0a0a0a]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/super-admin/institutes/${folder.slug}`}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#0a0a0a] hover:underline px-2 py-1 rounded-lg hover:bg-white transition-colors"
                  >
                    <span>Manage Roster</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add / Edit Folder Modal */}
      <FolderModal
        isOpen={isFolderModalOpen}
        folderToEdit={folderToEdit}
        onClose={() => {
          setIsFolderModalOpen(false);
          setFolderToEdit(null);
        }}
        onSaved={() => {
          fetchFolders();
        }}
      />

      {/* Form Configuration Modal */}
      {selectedFolderForForm && (
        <FormConfigModal
          isOpen={!!selectedFolderForForm}
          onClose={() => setSelectedFolderForForm(null)}
          folderName={selectedFolderForForm.name}
          folderSlug={selectedFolderForForm.slug}
        />
      )}

      {/* Add Student Modal */}
      {selectedFolderForAdd && (
        <StudentModal
          isOpen={!!selectedFolderForAdd}
          onClose={() => setSelectedFolderForAdd(null)}
          onSave={handleSaveStudent}
          defaultFolderId={selectedFolderForAdd.id}
          defaultYear={selectedFolderForAdd.slug}
        />
      )}

      {/* Delete Folder Modal */}
      <DeleteConfirmModal
        isOpen={!!folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onConfirm={handleDeleteFolderConfirm}
        loading={isDeletingFolder}
        title={`Delete Folder "${folderToDelete?.name || folderToDelete?.year_label}"?`}
        description="Are you sure you want to permanently delete this folder? All student records, admissions data, and configurations in this directory will be removed across both Super Admin and Campus Admin portals."
      />
    </div>
  );
}
