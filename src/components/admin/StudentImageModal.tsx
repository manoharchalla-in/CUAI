"use client";

import { X, Download, User, ZoomIn } from "lucide-react";
import type { StudentRecord } from "@/lib/db/schema";

interface StudentImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord | null;
}

export default function StudentImageModal({
  isOpen,
  onClose,
  student,
}: StudentImageModalProps) {
  if (!isOpen || !student) return null;

  const imageSrc = student.profile_image;

  const handleDownload = () => {
    if (!imageSrc) return;

    if (imageSrc.startsWith("data:")) {
      const a = document.createElement("a");
      a.href = imageSrc;
      a.download = `${student.roll_number}_profile_photo.jpg`;
      a.click();
    } else {
      const a = document.createElement("a");
      a.href = imageSrc;
      a.download = `${student.roll_number}_profile_photo.jpg`;
      a.target = "_blank";
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-[#e3e4e8] rounded-2xl w-full max-w-lg shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e3e4e8] flex items-center justify-between bg-white">
          <div>
            <h3 className="text-base font-bold text-[#0a0a0a] tracking-tight">
              Student Photo: {student.roll_number}
            </h3>
            <p className="text-xs text-[#8a8a8e]">{student.name} • {student.branch}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image Preview Body */}
        <div className="p-6 bg-[#f5f5f7] flex items-center justify-center min-h-[320px]">
          {imageSrc ? (
            <div className="relative max-h-[440px] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[#e3e4e8] bg-white group">
              <img
                src={imageSrc}
                alt={`${student.name} photo`}
                className="max-h-[420px] max-w-full object-contain rounded-2xl transition-transform group-hover:scale-[1.02] duration-200"
              />
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-2xl border border-dashed border-[#e3e4e8] max-w-xs">
              <div className="w-16 h-16 rounded-full bg-[#f5f5f7] text-[#8a8a8e] flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8" />
              </div>
              <h4 className="text-xs font-bold text-[#0a0a0a]">No Photo Uploaded</h4>
              <p className="text-[11px] text-[#8a8a8e] mt-1">
                This student does not have a profile picture attached yet. You can upload one via Edit Student.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e3e4e8] bg-white flex items-center justify-between">
          <span className="text-xs text-[#8a8a8e]">
            Format: {imageSrc?.startsWith("data:image/png") ? "PNG" : "JPG / WebP"}
          </span>
          <div className="flex items-center gap-2">
            {imageSrc && (
              <button
                type="button"
                onClick={handleDownload}
                className="h-8 px-3.5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Photo</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3.5 rounded-xl bg-[#f5f5f7] hover:bg-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
