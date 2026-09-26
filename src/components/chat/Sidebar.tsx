"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  SquarePen, 
  Search, 
  Trash2, 
  Check, 
  X, 
  MessageSquare,
  LogOut,
  Shield,
  Bot,
  Sparkles,
  SlidersHorizontal
} from "lucide-react";
import type { ChatSession } from "@/lib/db/schema";
import type { AuthUser } from "@/lib/auth";
import type { ChatTheme } from "./ChatSettingsModal";

export interface ChatBranding {
  college_name?: string;
  chatbot_title?: string;
  college_logo?: string;
  tagline?: string;
  assistant_badge?: string;
  theme_color?: string;
  footer_text?: string;
}

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
  onClearAllSessions: () => void;
  onOpenSettings?: () => void;
  onOpenClearConfirm?: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  theme?: ChatTheme;
  branding?: ChatBranding | null;
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onRenameSession,
  onDeleteSession,
  onClearAllSessions,
  onOpenSettings,
  onOpenClearConfirm,
  isOpenMobile,
  onCloseMobile,
  isCollapsed = false,
  theme = "transparent",
  branding,
}: SidebarProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me?role=user")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user" }),
      });
    } catch (e) {}
    router.push("/login");
    router.refresh();
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteSession(id);
  };

  if (isCollapsed) return null;

  const isDark = theme === "midnight_dark";

  const sidebarStyles = {
    transparent: "bg-white/45 backdrop-blur-2xl border-r border-black/[0.06] text-[#0a0a0a]",
    pure_light: "bg-[#fafafc] border-r border-[#e5e5ea] text-[#0a0a0a]",
    midnight_dark: "bg-[#101114] border-r border-white/10 text-white",
    cool_blue: "bg-[#f0f4fc]/90 backdrop-blur-2xl border-r border-blue-100 text-[#0a0a0a]",
    emerald: "bg-[#f0fdf4]/90 backdrop-blur-2xl border-r border-emerald-100 text-[#0a0a0a]",
    sunset: "bg-[#fff7ed]/90 backdrop-blur-2xl border-r border-orange-100 text-[#0a0a0a]",
  }[theme] || "bg-white/45 backdrop-blur-2xl border-r border-black/[0.06] text-[#0a0a0a]";

  const primaryPillStyles = {
    transparent: "bg-white/60 hover:bg-white/85 backdrop-blur-xl border border-white/80 text-[#0a0a0a] shadow-[0_2px_12px_rgba(0,0,0,0.04)] font-semibold",
    pure_light: "bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]",
    midnight_dark: "bg-gradient-to-b from-[#27272a] to-[#18181b] hover:from-[#3f3f46] hover:to-[#27272a] border border-white/10 text-white shadow-md",
    cool_blue: "bg-gradient-to-b from-[#0a66ff] to-[#0052cc] hover:from-[#0958dc] hover:to-[#0047b3] text-white shadow-[0_4px_16px_rgba(10,102,255,0.3)]",
    emerald: "bg-gradient-to-b from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white shadow-[0_4px_16px_rgba(5,150,105,0.3)]",
    sunset: "bg-gradient-to-b from-[#ea580c] to-[#c2410c] hover:from-[#c2410c] hover:to-[#9a3412] text-white shadow-[0_4px_16px_rgba(234,88,12,0.3)]",
  }[theme] || "bg-white/60 backdrop-blur-xl border border-white/80 text-[#0a0a0a]";

  const activeItemStyles = {
    transparent: "bg-white/80 backdrop-blur-xl border border-white/90 text-[#0a0a0a] font-semibold shadow-[0_2px_12px_rgba(0,0,0,0.05)]",
    pure_light: "bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.14)]",
    midnight_dark: "bg-white/15 text-white font-semibold border border-white/20 shadow-md",
    cool_blue: "bg-gradient-to-b from-[#0a66ff] to-[#0052cc] text-white font-semibold shadow-[0_4px_16px_rgba(10,102,255,0.25)]",
    emerald: "bg-gradient-to-b from-[#059669] to-[#047857] text-white font-semibold shadow-[0_4px_16px_rgba(5,150,105,0.25)]",
    sunset: "bg-gradient-to-b from-[#ea580c] to-[#c2410c] text-white font-semibold shadow-[0_4px_16px_rgba(234,88,12,0.25)]",
  }[theme] || "bg-white/80 text-[#0a0a0a]";

  const botIconStyles = {
    transparent: "bg-white/70 backdrop-blur-xl border border-white/80 text-[#0a0a0a] shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
    pure_light: "bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white shadow-[0_2px_8px_rgba(0,0,0,0.16)]",
    midnight_dark: "bg-gradient-to-b from-[#27272a] to-[#18181b] border border-white/10 text-white shadow-md",
    cool_blue: "bg-gradient-to-b from-[#0a66ff] to-[#0052cc] text-white shadow-[0_2px_8px_rgba(10,102,255,0.25)]",
    emerald: "bg-gradient-to-b from-[#059669] to-[#047857] text-white shadow-[0_2px_8px_rgba(5,150,105,0.25)]",
    sunset: "bg-gradient-to-b from-[#ea580c] to-[#c2410c] text-white shadow-[0_2px_8px_rgba(234,88,12,0.25)]",
  }[theme] || "bg-white/70 text-[#0a0a0a]";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-[260px] flex flex-col flex-shrink-0 transition-transform duration-200 ease-in-out select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${sidebarStyles} ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Header */}
        <div className={`p-4 pb-3 flex flex-col gap-3 border-b ${isDark ? "border-white/10" : "border-black/[0.06]"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs flex items-center justify-center flex-shrink-0 bg-white/70 backdrop-blur-md border border-white/80 p-0.5">
                <img
                  src={branding?.college_logo || "/logo.png"}
                  alt={branding?.chatbot_title || "Campus AI"}
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo.png";
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className={`font-bold text-xs tracking-tight block leading-tight truncate ${isDark ? "text-white" : "text-[#0a0a0a]"}`}>
                  {branding?.chatbot_title || branding?.college_name || "Campus AI"}
                </span>
                <span className="text-[10px] text-[#8a8a8e] font-medium truncate block">
                  {branding?.tagline || "Verified RAG Engine"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowSearchInput(!showSearchInput)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? "text-white/60 hover:text-white hover:bg-white/10" : "text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-black/5"
                }`}
                title="Search chats"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onCloseMobile}
                className={`p-1.5 rounded-lg md:hidden cursor-pointer ${
                  isDark ? "text-white/60 hover:text-white hover:bg-white/10" : "text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-black/5"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className={`w-full h-9 px-3.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${primaryPillStyles}`}
          >
            <SquarePen className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>

          {showSearchInput && (
            <div className="relative mt-1 animate-fade-in">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8e]" />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search history..."
                className={`w-full rounded-xl text-xs placeholder-[#8a8a8e] pl-8 pr-3 py-1.5 focus:outline-none border transition-all ${
                  isDark 
                    ? "bg-white/10 border-white/15 text-white focus:border-white/40" 
                    : "bg-white border-[#e5e5ea] text-[#0a0a0a] focus:border-[#0a0a0a]"
                }`}
              />
            </div>
          )}
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 pb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[#8a8a8e] uppercase tracking-wider">
              Conversations
            </span>
            {sessions.length > 0 && (
              <button
                type="button"
                onClick={onClearAllSessions}
                className="text-[10px] font-medium text-[#8a8a8e] hover:text-rose-600 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear all chat history"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {filteredSessions.length === 0 ? (
            <div className="px-3 py-8 text-xs text-[#8a8a8e] text-center font-sans">
              No previous chats
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onCloseMobile();
                  }}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                    isActive
                      ? activeItemStyles
                      : isDark
                        ? "text-white/70 hover:text-white hover:bg-white/10 border border-transparent"
                        : "text-[#636366] hover:text-[#0a0a0a] hover:bg-white/80 border border-transparent hover:border-black/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? (theme === "transparent" ? "text-[#0a0a0a]" : "text-white") : "text-[#8a8a8e]"}`} />
                    {isEditing ? (
                      <input
                        type="text"
                        autoFocus
                        value={editTitle}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveRename(session.id, e as any);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="bg-white text-[#0a0a0a] px-2 py-0.5 rounded border border-[#0a0a0a] text-xs w-full focus:outline-none font-sans"
                      />
                    ) : (
                      <span className="truncate">{session.title}</span>
                    )}
                  </div>

                  {/* Actions on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0">
                    {isEditing ? (
                      <button
                        type="button"
                        onClick={(e) => handleSaveRename(session.id, e)}
                        className="p-1 hover:text-emerald-500 text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleDelete(session.id, e)}
                        className={`p-1 transition-colors cursor-pointer ${isActive ? (theme === "transparent" ? "text-[#8a8a8e] hover:text-rose-600" : "text-white/60 hover:text-rose-400") : "text-[#8a8a8e] hover:text-rose-600"}`}
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Chat Controls & Tools Section */}
        <div className={`px-3 py-2 border-t space-y-1 ${isDark ? "border-white/10" : "border-black/[0.06]"}`}>
          <div className="px-2 py-1 text-[10px] font-bold text-[#8a8a8e] uppercase tracking-wider">
            Chat Controls
          </div>
          <button
            type="button"
            onClick={() => {
              onOpenSettings?.();
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              isDark 
                ? "text-white/80 hover:text-white hover:bg-white/10" 
                : "text-[#0a0a0a] hover:bg-white/80"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0a66ff]" />
            <span>Settings & Themes</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (onOpenClearConfirm) {
                onOpenClearConfirm();
              } else {
                onClearAllSessions();
              }
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              isDark
                ? "text-rose-400 hover:text-rose-300 hover:bg-rose-900/20"
                : "text-rose-600 hover:bg-rose-50/80"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear Conversation</span>
          </button>
        </div>

        {/* Bottom Profile & Sign Out */}
        <div className={`p-3 border-t space-y-2 ${isDark ? "bg-[#141518] border-white/10" : "bg-white/70 border-black/[0.06]"}`}>
          {currentUser?.role === 'admin' ? (
            <Link
              href="/admin/dashboard"
              className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors shadow-2xs ${
                isDark 
                  ? "bg-white/10 hover:bg-white/15 border-white/10 text-white" 
                  : "bg-white hover:bg-[#fafafc] border-black/[0.06] text-[#0a0a0a]"
              }`}
            >
              <span>Admin Panel</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                isDark ? "bg-white/20 text-white" : "bg-[#0a0a0a] text-white"
              }`}>ADMIN</span>
            </Link>
          ) : null}

          <div className={`flex items-center justify-between p-2 rounded-xl border ${
            isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-black/[0.06]"
          }`}>
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs ${botIconStyles}`}>
                {(currentUser?.name || currentUser?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-[#0a0a0a]"}`}>
                  {currentUser?.name || "Student User"}
                </div>
                <div className="text-[10px] text-[#8a8a8e] truncate">
                  {currentUser?.email || "Authenticated"}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-[#8a8a8e] hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
