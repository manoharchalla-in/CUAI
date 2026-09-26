"use client";

import { ReactNode } from "react";

interface InformationFieldProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  isFullWidth?: boolean;
}

export default function InformationField({
  label,
  value,
  icon,
  isFullWidth = false,
}: InformationFieldProps) {
  return (
    <div
      className={`p-3 sm:p-3.5 rounded-xl bg-[#f8f8fa] hover:bg-[#f3f3f6] border border-[#e5e5ea]/80 hover:border-[#0a0a0a]/15 transition-all flex flex-col justify-between group ${
        isFullWidth ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-1.5 mb-1">
        <span className="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-wider text-[#8a8a8e] select-none truncate">
          {label}
        </span>
        {icon && <span className="text-[#8a8a8e] opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>}
      </div>
      <div className="text-xs sm:text-[13px] font-semibold text-[#0a0a0a] leading-relaxed break-words font-sans">
        {value}
      </div>
    </div>
  );
}
