"use client";

import { Crown, Shield, Bot, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SuperAdminHeaderProps {
  title?: string;
  subtitle?: string;
  onOpenMobileNav?: () => void;
}

export default function SuperAdminHeader({ title, subtitle, onOpenMobileNav }: SuperAdminHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "superadmin" }),
      });
    } catch (e) {}
    router.push("/super-admin/login");
    router.refresh();
  };

  return (
    <header className="h-14 border-b border-[#e3e4e8] bg-white/80 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-shrink-0 z-30 sticky top-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileNav && (
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="p-1.5 rounded-lg text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] lg:hidden transition-colors"
            title="Open navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="w-7 h-7 rounded-lg bg-[#0a0a0a] text-white flex items-center justify-center font-bold shadow-xs flex-shrink-0">
          <Crown className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs sm:text-sm font-bold text-[#0a0a0a] tracking-tight truncate">
            Master Super Admin
          </span>
          {title && (
            <span className="hidden md:inline-flex text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
              {title}
            </span>
          )}
        </div>
      </div>

      {/* Status Badges & Quick Switches */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a0a0a] text-white text-[10px] font-semibold shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>Root Active</span>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white hover:bg-[#0a0a0a] hover:text-white border border-[#e3e4e8] hover:border-[#0a0a0a] text-[#0a0a0a] text-xs font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-[0.98] cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
