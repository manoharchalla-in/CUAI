"use client";

import { Sparkles, Loader2 } from "lucide-react";

export default function ResponseSkeleton() {
  return (
    <div className="w-full max-w-[820px] mx-auto my-3 p-5 sm:p-7 rounded-[22px] sm:rounded-[24px] bg-white border border-[#e5e5ea] shadow-[0_4px_24px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] transition-all animate-fade-in relative overflow-hidden">
      {/* Top subtle glossy inset sheen */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#e5e5ea]/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white flex items-center justify-center p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.16)] flex-shrink-0">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-[13px] font-bold text-[#0a0a0a]">
              CityApp AI
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#f0f0f3] text-[#636366] text-[10px] font-semibold border border-[#e5e5ea] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] animate-pulse" />
              Searching Records...
            </span>
          </div>
        </div>
      </div>

      {/* Shimmer Skeleton Body */}
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-[#f0f0f3] rounded-lg w-3/5" />
        
        {/* 2-Column Info Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4 pt-2">
          <div className="h-16 bg-[#f8f8fa] border border-[#e5e5ea]/80 rounded-xl p-3 space-y-2">
            <div className="h-2.5 bg-[#e5e5ea] rounded w-1/3" />
            <div className="h-3.5 bg-[#e5e5ea] rounded w-2/3" />
          </div>
          <div className="h-16 bg-[#f8f8fa] border border-[#e5e5ea]/80 rounded-xl p-3 space-y-2">
            <div className="h-2.5 bg-[#e5e5ea] rounded w-1/3" />
            <div className="h-3.5 bg-[#e5e5ea] rounded w-3/4" />
          </div>
          <div className="h-16 bg-[#f8f8fa] border border-[#e5e5ea]/80 rounded-xl p-3 space-y-2">
            <div className="h-2.5 bg-[#e5e5ea] rounded w-1/4" />
            <div className="h-3.5 bg-[#e5e5ea] rounded w-4/5" />
          </div>
          <div className="h-16 bg-[#f8f8fa] border border-[#e5e5ea]/80 rounded-xl p-3 space-y-2">
            <div className="h-2.5 bg-[#e5e5ea] rounded w-1/3" />
            <div className="h-3.5 bg-[#e5e5ea] rounded w-1/2" />
          </div>
        </div>

        <div className="h-3.5 bg-[#f0f0f3] rounded-lg w-4/5" />
        <div className="h-3.5 bg-[#f0f0f3] rounded-lg w-2/3" />
      </div>
    </div>
  );
}
