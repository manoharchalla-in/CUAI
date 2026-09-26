"use client";

import { ReactNode } from "react";
import { 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  Layers, 
  User, 
  Award,
  Phone,
  Calendar,
  Building,
  CheckCircle2
} from "lucide-react";

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  badge?: string;
}

export default function SectionHeader({ title, icon, badge }: SectionHeaderProps) {
  // Clean emoji if present in markdown title
  const cleanTitle = title.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim();

  const getSectionIcon = () => {
    if (icon) return icon;
    const lower = title.toLowerCase();
    if (lower.includes("student") || lower.includes("personal") || lower.includes("profile")) {
      return <GraduationCap className="w-4 h-4 text-[#0a0a0a]" />;
    }
    if (lower.includes("address") || lower.includes("contact") || lower.includes("location")) {
      return <MapPin className="w-4 h-4 text-[#0a0a0a]" />;
    }
    if (lower.includes("academic") || lower.includes("record") || lower.includes("education") || lower.includes("marks")) {
      return <BookOpen className="w-4 h-4 text-[#0a0a0a]" />;
    }
    if (lower.includes("skill") || lower.includes("interest") || lower.includes("other") || lower.includes("activit")) {
      return <Sparkles className="w-4 h-4 text-[#0a0a0a]" />;
    }
    return <Layers className="w-4 h-4 text-[#0a0a0a]" />;
  };

  return (
    <div className="mt-5 mb-2.5 pt-3 border-t border-[#e5e5ea]/80 first:mt-1 first:pt-0 first:border-0 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-lg bg-[#f0f0f3] border border-[#e5e5ea] flex items-center justify-center text-[#0a0a0a] shadow-2xs">
          {getSectionIcon()}
        </span>
        <h3 className="text-xs sm:text-[13.5px] font-bold text-[#0a0a0a] tracking-tight">
          {cleanTitle || title}
        </h3>
      </div>

      {badge && (
        <span className="px-2 py-0.5 rounded-full bg-[#f0f0f3] text-[#636366] text-[10px] font-medium border border-[#e5e5ea]">
          {badge}
        </span>
      )}
    </div>
  );
}
