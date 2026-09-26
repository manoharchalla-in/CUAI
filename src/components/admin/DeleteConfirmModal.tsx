"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  loading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-[#e3e4e8] rounded-2xl w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden p-6 animate-scale-up text-center">
        <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <h3 className="text-base font-semibold text-[#0a0a0a] mb-1.5 tracking-tight">{title}</h3>
        <p className="text-xs text-[#8a8a8e] mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-center gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="h-9 px-4 rounded-xl border border-[#e3e4e8] bg-white hover:bg-[#fafafc] text-[#0a0a0a] text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="h-9 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-[0_2px_6px_rgba(225,29,72,0.2)] flex items-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98] cursor-pointer"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
