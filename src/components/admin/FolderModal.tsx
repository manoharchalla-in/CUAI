"use client";

import { useState, useEffect } from "react";
import { 
  FolderPlus, 
  Edit3, 
  X, 
  Check, 
  Loader2, 
  AlertCircle, 
  Lock,
  Unlock,
  Sparkles
} from "lucide-react";
import type { YearFolder } from "@/lib/db/schema";

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (folder: YearFolder) => void;
  folderToEdit?: YearFolder | null;
}

export default function FolderModal({
  isOpen,
  onClose,
  onSaved,
  folderToEdit = null,
}: FolderModalProps) {
  const isEditing = !!folderToEdit;

  const [name, setName] = useState("");
  const [yearLabel, setYearLabel] = useState("");
  const [description, setDescription] = useState("");
  const [isFormActive, setIsFormActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name || "");
      setYearLabel(folderToEdit.year_label || folderToEdit.name || "");
      setDescription(folderToEdit.description || "");
      setIsFormActive(folderToEdit.is_form_active === 1);
    } else {
      setName("");
      setYearLabel("");
      setDescription("");
      setIsFormActive(true);
    }
    setError("");
  }, [folderToEdit, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && (!yearLabel || yearLabel === name)) {
      setYearLabel(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Folder name is required");
      return;
    }

    try {
      setLoading(true);

      if (isEditing && folderToEdit) {
        // Edit Folder
        const res = await fetch(`/api/admin/folders/${folderToEdit.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            year_label: yearLabel.trim() || name.trim(),
            description: description.trim(),
            is_form_active: isFormActive ? 1 : 0
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update folder");

        onSaved(data.folder);
      } else {
        // Add New Folder
        const res = await fetch("/api/admin/folders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            year_label: yearLabel.trim() || name.trim(),
            description: description.trim() || `${name} Intake Records`,
            is_form_active: isFormActive ? 1 : 0
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create folder");

        onSaved(data.folder);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the folder");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-w-lg w-full overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-[#e3e4e8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0a66ff]/[0.08] text-[#0a66ff]">
              {isEditing ? <Edit3 className="w-4 h-4" /> : <FolderPlus className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
                {isEditing ? "Edit Academic Folder" : "Create New Academic Folder"}
              </h2>
              <p className="text-xs text-[#8a8a8e]">
                {isEditing 
                  ? `Update configuration for ${folderToEdit?.name}` 
                  : "New folder will inherit all standard registration form fields"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Folder Name */}
          <div>
            <label className="block font-semibold text-[#0a0a0a] mb-1.5">
              Folder Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. 5th Year / Diploma 1st Year / MBA 2026"
              className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 transition-all font-medium"
            />
          </div>

          {/* Academic Year Label */}
          <div>
            <label className="block font-semibold text-[#0a0a0a] mb-1.5">
              Display Label (Badge / Subtitle)
            </label>
            <input
              type="text"
              value={yearLabel}
              onChange={(e) => setYearLabel(e.target.value)}
              placeholder="e.g. 5th Year / Freshers Batch"
              className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 transition-all font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-[#0a0a0a] mb-1.5">
              Description / Batch Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Fifth Year specialized postgraduate and dissertation student records."
              className="w-full px-3.5 py-2 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 transition-all resize-none font-normal"
            />
          </div>

          {/* Accepting Records (Form Active) Toggle Switch */}
          <div className="p-4 rounded-xl bg-[#fafafc] border border-[#e3e4e8] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isFormActive ? (
                  <Unlock className="w-4 h-4 text-[#0a66ff]" />
                ) : (
                  <Lock className="w-4 h-4 text-[#8a8a8e]" />
                )}
                <span className="font-semibold text-[#0a0a0a] text-xs">
                  Accepting Records (Public Intake)
                </span>
              </div>

              {/* Interactive Toggle Switch */}
              <button
                type="button"
                onClick={() => setIsFormActive(!isFormActive)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                  isFormActive ? "bg-[#0a0a0a]" : "bg-[#e3e4e8]"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    isFormActive ? "translate-x-4.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <p className="text-[11px] text-[#8a8a8e]">
              {isFormActive ? (
                <span className="text-[#0a0a0a] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                  <span>Accepting Records: Public form is LIVE and accepting submissions.</span>
                </span>
              ) : (
                <span className="text-[#8a8a8e] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8a8a8e]" />
                  <span>Not Accepting Records: Public form is CLOSED and rejects submissions.</span>
                </span>
              )}
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[#e3e4e8] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold rounded-xl shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-9 px-5 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Folder...</span>
                </>
              ) : isEditing ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Create Folder</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
