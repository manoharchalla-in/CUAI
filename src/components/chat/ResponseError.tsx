"use client";

import { AlertCircle, RotateCcw } from "lucide-react";

interface ResponseErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function ResponseError({
  message = "An error occurred while retrieving student records. Please try again.",
  onRetry,
}: ResponseErrorProps) {
  return (
    <div className="w-full max-w-[820px] mx-auto my-3 p-5 sm:p-7 rounded-[22px] sm:rounded-[24px] bg-white border border-[#e5e5ea] shadow-[0_4px_24px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] transition-all animate-fade-in relative overflow-hidden">
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#f8f8fa] border border-[#e5e5ea] flex items-center justify-center text-[#0a0a0a] flex-shrink-0 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-[#0a0a0a]" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-[13px] font-bold text-[#0a0a0a]">
            Query Encountered an Issue
          </h4>
          <p className="text-xs sm:text-[12.5px] text-[#636366] mt-1 leading-relaxed">
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3.5 h-8 px-3.5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Query</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
