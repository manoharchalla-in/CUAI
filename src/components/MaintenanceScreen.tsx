"use client";

import { useState } from "react";
import { Wrench, RefreshCw, Clock } from "lucide-react";

interface MaintenanceScreenProps {
  title?: string;
  message?: string;
  estimatedEnd?: string;
  scope?: string;
  isAccountSpecific?: boolean;
  accountName?: string;
  role?: 'admin' | 'user' | 'superadmin';
  onRefresh?: () => void;
}

export default function MaintenanceScreen({
  title = "Scheduled System Maintenance",
  message = "The platform is currently undergoing scheduled infrastructure upgrades and system optimizations. Service will be restored shortly.",
  estimatedEnd,
  scope,
  isAccountSpecific = false,
  accountName,
  onRefresh,
}: MaintenanceScreenProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    } else {
      window.location.reload();
    }
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4 sm:p-6 text-[#0a0a0a] font-sans antialiased">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] p-8 sm:p-10 text-center flex flex-col items-center animate-scale-up relative overflow-hidden">
        {/* Animated Wrench / Badge */}
        <div className="w-14 h-14 rounded-2xl bg-[#0a0a0a] text-white flex items-center justify-center mb-5 shadow-xs">
          <Wrench className="w-6 h-6 animate-pulse" />
        </div>

        {/* Scope or Account Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-[11px] font-bold uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] animate-ping" />
          <span>
            {isAccountSpecific 
              ? `Account Notice: ${accountName || "Under Maintenance"}`
              : scope ? `Maintenance Active: ${scope}` : "Platform Maintenance"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-lg sm:text-xl font-bold text-[#0a0a0a] tracking-tight leading-snug">
          {title}
        </h1>

        {/* Message */}
        <p className="text-xs text-[#8a8a8e] leading-relaxed mt-2.5 max-w-sm">
          {message}
        </p>

        {/* Estimated Downtime */}
        {estimatedEnd && (
          <div className="mt-5 px-4 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-xs font-semibold text-[#0a0a0a] flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#0a0a0a] flex-shrink-0" />
            <span>Estimated Restoration: <strong>{estimatedEnd}</strong></span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-7 flex flex-col items-center gap-2.5 w-full">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full py-2.5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold transition-all shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Checking Status..." : "Check Status"}</span>
          </button>
        </div>

        <p className="text-[10px] text-[#8a8a8e] font-medium mt-6">
          CityApp Campus AI Core &bull; Secure Maintenance Lock
        </p>
      </div>
    </div>
  );
}
