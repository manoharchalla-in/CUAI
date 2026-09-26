"use client";

import { Sparkles, Bot, ShieldCheck } from "lucide-react";
import ResponseActions from "./ResponseActions";

interface ResponseHeaderProps {
  content: string;
  onRegenerate?: () => void;
  isStreaming?: boolean;
}

export default function ResponseHeader({
  content,
  onRegenerate,
  isStreaming = false,
}: ResponseHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#e5e5ea]/80 select-none">
      {/* Left: AI Avatar & Model Details */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-white/70 backdrop-blur-md border border-white/80 text-[#0a0a0a] flex items-center justify-center p-0.5 shadow-xs flex-shrink-0">
          <img
            src="/logo.png"
            alt="AI"
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-[13px] font-bold text-[#0a0a0a] tracking-tight">
            CityApp AI
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f0f0f3] text-[#636366] text-[10px] font-semibold border border-[#e5e5ea]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" />
            Grounded RAG
          </span>
        </div>
      </div>

      {/* Right: Minimal Actions Toolbar */}
      <ResponseActions
        content={content}
        onRegenerate={onRegenerate}
        isStreaming={isStreaming}
      />
    </div>
  );
}
