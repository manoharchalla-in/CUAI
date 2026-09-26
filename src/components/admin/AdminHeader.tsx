"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  AlertCircle, 
  Info, 
  Check, 
  X,
  ExternalLink,
  LogOut,
  Sparkles,
  KeyRound,
  Menu
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  currentUser?: AuthUser | null;
  onOpenMobileNav?: () => void;
}

export default function AdminHeader({ title, subtitle, onOpenMobileNav }: AdminHeaderProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "all" }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {}
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin" }),
      });
    } catch (e) {}
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="h-14 border-b border-[#e3e4e8] bg-white/80 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-30 sticky top-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Brand & Page Indicator */}
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileNav && (
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="p-1.5 rounded-xl text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] lg:hidden cursor-pointer"
            title="Open navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs sm:text-sm font-bold text-[#0a0a0a] tracking-tight truncate">
            Campus Admin
          </span>
          {title && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
              {title}
            </span>
          )}
        </div>
      </div>

      {/* Action Badges: Notifications, Chatbot & Sign Out */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Notification Icon Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`w-8 h-8 rounded-xl bg-white border border-[#e3e4e8] text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#fafafc] flex items-center justify-center transition-all shadow-2xs cursor-pointer relative ${
              isNotifOpen ? "ring-2 ring-[#0a66ff]/20 border-[#0a66ff]" : ""
            }`}
            title="System Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#0a66ff] text-white rounded-full text-[8.5px] font-bold flex items-center justify-center shadow-xs">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown Popover */}
          {isNotifOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-2 w-80 sm:w-88 bg-white/95 backdrop-blur-2xl border border-[#e3e4e8] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] z-50 overflow-hidden animate-scale-in"
            >
              <div className="p-3.5 border-b border-[#e3e4e8] flex items-center justify-between bg-[#fafafc]">
                <div className="flex items-center gap-2 font-bold text-xs text-[#0a0a0a]">
                  <Bell className="w-3.5 h-3.5 text-[#0a66ff]" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#0a66ff]/[0.08] text-[#0a66ff] text-[9.5px] font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[10.5px] font-semibold text-[#0a66ff] hover:underline transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#f2f2f7] text-xs">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-[#8a8a8e] text-xs">
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 transition-colors ${
                        n.read ? "bg-white" : "bg-[#fafafc]"
                      } hover:bg-[#f5f5f7] flex items-start gap-2.5`}
                    >
                      <div className="w-6 h-6 rounded-lg bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center text-[#0a0a0a] flex-shrink-0 mt-0.5">
                        <Info className="w-3 h-3 text-[#0a66ff]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#0a0a0a] text-[11.5px]">{n.title}</div>
                        <div className="text-[#8a8a8e] text-[10.5px] leading-relaxed mt-0.5">{n.message}</div>
                        <div className="text-[9.5px] text-[#8a8a8e] font-mono mt-1">{formatDate(n.created_at)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chatbot Shortcut */}
        <Link
          href="/chat"
          className="h-8 px-3 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          title="Open Chatbot"
        >
          <span>Chatbot</span>
          <ExternalLink className="w-3 h-3 text-[#8a8a8e]" />
        </Link>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="h-8 px-3 rounded-xl bg-white hover:bg-rose-50 border border-[#e3e4e8] hover:border-rose-200 text-[#636366] hover:text-rose-600 text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
        >
          <LogOut className="w-3 h-3" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
