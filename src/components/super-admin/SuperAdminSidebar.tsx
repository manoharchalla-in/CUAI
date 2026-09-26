"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Crown, 
  Layers, 
  KeyRound, 
  Users, 
  HardDrive, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  MessageSquare, 
  Zap, 
  Palette, 
  GraduationCap, 
  Wrench, 
  Database,
  Cloud,
  X
} from "lucide-react";

interface SuperAdminSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function SuperAdminSidebar({ isOpenMobile = false, onCloseMobile }: SuperAdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Master Overview", href: "/super-admin/dashboard", icon: Crown },
    { label: "Supabase Cloud", href: "/super-admin/supabase", icon: Cloud },
    { label: "Maintenance Mode", href: "/super-admin/maintenance", icon: Wrench },
    { label: "Storage & DB", href: "/super-admin/storage", icon: HardDrive },
    { label: "Institutes & Folders", href: "/super-admin/institutes", icon: Layers },
    { label: "Students", href: "/super-admin/students", icon: GraduationCap },
    { label: "FD Telemetry", href: "/super-admin/fd", icon: Zap },
    { label: "All Users", href: "/super-admin/users", icon: Users },
    { label: "Chat Sessions", href: "/super-admin/chat-sessions", icon: MessageSquare },
    { label: "Processing Jobs", href: "/super-admin/jobs", icon: Zap },
    { label: "AI Config & LLMs", href: "/super-admin/api-keys", icon: Cpu },
    { label: "Whitelabel & Branding", href: "/super-admin/branding", icon: Palette },
    { label: "Logins & Access", href: "/super-admin/logins", icon: KeyRound },
    { label: "Database Backups", href: "/super-admin/database", icon: Database },
    { label: "Security & Firewall", href: "/super-admin/security", icon: ShieldAlert },
    { label: "Live Telemetry", href: "/super-admin/telemetry", icon: Activity },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-[240px] xl:w-[250px] h-screen bg-[#fafafc]/95 backdrop-blur-xl text-[#0a0a0a] border-r border-[#e3e4e8] flex flex-col flex-shrink-0 select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-transform duration-200 ease-in-out overflow-hidden ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Super Admin Tag & Logo */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#e3e4e8] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0a0a0a] text-white flex items-center justify-center font-bold shadow-xs flex-shrink-0">
              <Crown className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-[11px] font-bold text-[#0a0a0a] tracking-tight uppercase leading-none">
                Super Admin
              </h2>
              <p className="text-[10px] text-[#8a8a8e] font-medium tracking-tight mt-0.5">Root Console</p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded-md text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-white lg:hidden transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Links - Fitted to 100vh without vertical scrollbar */}
        <div className="flex-1 px-2.5 py-2.5 flex flex-col justify-between overflow-hidden">
          <div className="space-y-0.5">
            <div className="px-2 pb-1 text-[9px] font-bold text-[#8a8a8e] uppercase tracking-wider">
              Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/super-admin/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`h-[30px] flex items-center gap-2.5 px-2.5 rounded-lg text-[11.5px] transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
                      : "text-[#636366] hover:text-[#0a0a0a] hover:bg-white hover:shadow-[0_2px_6px_rgba(0,0,0,0.03)] hover:translate-x-0.5 border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-white" : "text-[#8a8a8e]"}`} />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#e3e4e8] px-2 flex items-center justify-between text-[10px] text-[#8a8a8e] font-mono">
            <span>v2.4 Pro</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" />
              Secure
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
