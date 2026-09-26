"use client";

import { useState, useEffect, useRef } from "react";
import { 
  PanelLeft, 
  SquarePen, 
  RotateCw, 
  Trash2, 
  Loader2, 
  Sparkles,
  SlidersHorizontal,
  Palette
} from "lucide-react";
import Sidebar, { type ChatBranding } from "@/components/chat/Sidebar";
import MessageItem from "@/components/chat/MessageItem";
import Composer from "@/components/chat/Composer";
import ResponseEmpty from "@/components/chat/ResponseEmpty";
import ResponseSkeleton from "@/components/chat/ResponseSkeleton";
import ChatSettingsModal, { type ChatTheme } from "@/components/chat/ChatSettingsModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import type { ChatSession, ChatMessage } from "@/lib/db/schema";
import MaintenanceScreen from "@/components/MaintenanceScreen";

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMaintenanceBlocked, setIsMaintenanceBlocked] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState<any>(null);
  const [branding, setBranding] = useState<ChatBranding | null>(null);

  // Settings & Theme State (Default is "transparent")
  const [theme, setThemeState] = useState<ChatTheme>("transparent");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Load persisted theme if available, otherwise default to "transparent"
    try {
      const saved = localStorage.getItem("campus_ai_theme") as ChatTheme;
      if (saved) {
        setThemeState(saved);
      }
    } catch (e) {}

    // Fetch Institutional Branding
    fetch("/api/system/branding")
      .then((res) => res.json())
      .then((bData) => {
        if (bData && !bData.error) {
          setBranding(bData);
        }
      })
      .catch(() => {});

    const checkMaintenance = async () => {
      try {
        const maintRes = await fetch("/api/system/maintenance?scope=chatbot");
        const maintData = await maintRes.json();
        if (maintData.isBlocked) {
          setIsMaintenanceBlocked(true);
          setMaintenanceData(maintData);
          return true;
        } else {
          setIsMaintenanceBlocked(false);
          setMaintenanceData(null);
          return false;
        }
      } catch (e) {
        return false;
      }
    };

    async function loadChatData() {
      try {
        // 1. Check Maintenance Status
        const blocked = await checkMaintenance();
        if (blocked) {
          setIsInitialLoading(false);
          return;
        }

        // 2. Load Chat Sessions
        const res = await fetch("/api/chat/sessions");
        const data = await res.json();
        if (data.sessions && data.sessions.length > 0) {
          setSessions(data.sessions);
          setActiveSessionId(data.sessions[0].id);
          loadSessionMessages(data.sessions[0].id);
        } else {
          setSessions([]);
          setActiveSessionId(null);
          setMessages([]);
        }
      } catch (err) {
        console.error("Session load error:", err);
      } finally {
        setIsInitialLoading(false);
      }
    }

    loadChatData();

    // Periodically poll maintenance status every 8 seconds for instantaneous lockout/restore
    const maintInterval = setInterval(checkMaintenance, 8000);
    return () => clearInterval(maintInterval);
  }, []);

  const handleSelectTheme = (newTheme: ChatTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("campus_ai_theme", newTheme);
    } catch (e) {}
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    loadSessionMessages(sessionId);
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
  };

  const handleRenameSession = async (id: string, newTitle: string) => {
    try {
      const res = await fetch(`/api/chat/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        setSessions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
        );
      }
    } catch (err) {
      console.error("Rename error:", err);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      const res = await fetch(`/api/chat/sessions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const remaining = sessions.filter((s) => s.id !== id);
        setSessions(remaining);
        if (activeSessionId === id) {
          if (remaining.length > 0) {
            setActiveSessionId(remaining[0].id);
            loadSessionMessages(remaining[0].id);
          } else {
            handleNewChat();
          }
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleClearAllSessions = async () => {
    try {
      setIsClearing(true);
      await fetch("/api/chat/sessions", {
        method: "DELETE",
      });
      setSessions([]);
      setActiveSessionId(null);
      setMessages([]);
      setIsClearConfirmOpen(false);
    } catch (err) {
      console.error("Clear error:", err);
    } finally {
      setIsClearing(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const tempUserMsgId = `temp_u_${Date.now()}`;
    const optimisticUserMsg: ChatMessage = {
      id: tempUserMsgId,
      session_id: activeSessionId || "",
      role: "user",
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionId,
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process message");
      }

      if (!activeSessionId || activeSessionId !== data.sessionId) {
        setActiveSessionId(data.sessionId);
        const sessionsRes = await fetch("/api/chat/sessions");
        const sData = await sessionsRes.json();
        if (sData.sessions) setSessions(sData.sessions);
      }

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempUserMsgId);
        return [...withoutTemp, data.userMessage, data.assistantMessage];
      });
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        session_id: activeSessionId || "",
        role: "assistant",
        content: `Sorry, an error occurred while querying the records: ${err.message || "Unknown error"}`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  const handleEditMessage = (newContent: string) => {
    handleSendMessage(newContent);
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center text-[#8a8a8e]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a0a0a] mb-3" />
        <p className="text-xs font-semibold text-[#0a0a0a]">Initializing Campus AI...</p>
      </div>
    );
  }

  if (isMaintenanceBlocked && maintenanceData) {
    const globalSettings = maintenanceData.globalSettings || {};
    return (
      <MaintenanceScreen
        title={globalSettings.title || "Student AI Chatbot Under Maintenance"}
        message={
          maintenanceData.userMaintenance
            ? "Your student chatbot account is temporarily in maintenance mode. Please contact Administrator."
            : globalSettings.message || "The Chatbot platform is temporarily undergoing scheduled maintenance."
        }
        estimatedEnd={globalSettings.estimatedEnd}
        scope="Student Chatbot"
        isAccountSpecific={maintenanceData.userMaintenance}
        role="user"
        onRefresh={async () => {
          const res = await fetch("/api/system/maintenance?scope=chatbot");
          const data = await res.json();
          if (!data.isBlocked) {
            setIsMaintenanceBlocked(false);
            setMaintenanceData(null);
          }
        }}
      />
    );
  }

  // Dynamic Canvas Backgrounds based on Active Theme
  const canvasBgStyles = {
    transparent: "bg-gradient-to-br from-[#f8f9fa] via-[#eef2f6] to-[#f4f6f9]",
    pure_light: "bg-[#f5f5f7]",
    midnight_dark: "bg-[#0c0d0e] text-[#f2f2f7]",
    cool_blue: "bg-gradient-to-br from-[#e8f0fe] via-[#f0f4fc] to-[#e4eefb]",
    emerald: "bg-gradient-to-br from-[#ecfdf5] via-[#f2faf7] to-[#e6f7f0]",
    sunset: "bg-gradient-to-br from-[#fff7ed] via-[#fef2f2] to-[#fdf4ff]",
  }[theme] || "bg-gradient-to-br from-[#f8f9fa] via-[#eef2f6] to-[#f4f6f9]";

  const headerStyles = {
    transparent: "bg-white/50 backdrop-blur-2xl border-black/[0.06] text-[#0a0a0a]",
    pure_light: "bg-white/90 border-[#e5e5ea] text-[#0a0a0a]",
    midnight_dark: "bg-[#141518]/85 backdrop-blur-2xl border-white/10 text-white",
    cool_blue: "bg-white/60 backdrop-blur-2xl border-blue-100 text-[#0a0a0a]",
    emerald: "bg-white/60 backdrop-blur-2xl border-emerald-100 text-[#0a0a0a]",
    sunset: "bg-white/60 backdrop-blur-2xl border-orange-100 text-[#0a0a0a]",
  }[theme] || "bg-white/50 backdrop-blur-2xl border-black/[0.06] text-[#0a0a0a]";

  const isDark = theme === "midnight_dark";

  return (
    <div className={`flex h-[100dvh] min-h-[100dvh] max-h-[100dvh] w-full max-w-full overflow-hidden font-sans transition-colors duration-300 ${canvasBgStyles}`}>
      {/* Ambient background soft glow effects for transparent/color themes */}
      {theme === "transparent" && (
        <>
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#0a66ff]/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAllSessions}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenClearConfirm={() => setIsClearConfirmOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        theme={theme}
        branding={branding}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col h-full min-h-0 relative overflow-hidden w-full max-w-full">
        {/* Top Header Navbar */}
        <header className={`h-14 px-3 sm:px-5 flex items-center justify-between z-10 flex-shrink-0 border-b transition-colors safe-top ${headerStyles}`}>
          {/* Left Controls */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileSidebarOpen(true);
                } else {
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                }
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isDark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-[#636366] hover:text-[#0a0a0a] hover:bg-black/5"
              }`}
              title="Toggle sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNewChat}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isDark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-[#636366] hover:text-[#0a0a0a] hover:bg-black/5"
              }`}
              title="New chat"
            >
              <SquarePen className="w-4 h-4" />
            </button>
          </div>

          {/* Center Brand / Title (Mobile-optimized) */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold tracking-tight ${isDark ? "text-white" : "text-[#0a0a0a]"}`}>
              {branding?.chatbot_title || branding?.college_name || "Campus AI"}
            </span>
            <span className={`hidden sm:inline text-[10px] px-2 py-0.5 rounded-full font-medium ${
              isDark ? "bg-white/10 text-white/70" : "bg-black/[0.04] text-[#8a8a8e]"
            }`}>
              {branding?.assistant_badge || "Student Assistant"}
            </span>
          </div>

          {/* Right Controls: Refresh / Reset Chat */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleNewChat}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isDark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-[#636366] hover:text-[#0a0a0a] hover:bg-black/5"
              }`}
              title="Refresh / New Chat"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Message / Empty View Area */}
        {messages.length === 0 ? (
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center overflow-hidden w-full max-w-full px-3 sm:px-6">
            <ResponseEmpty
              onSelectPrompt={(p) => handleSendMessage(p)}
              logoUrl={branding?.college_logo || "/logo.png"}
              chatbotTitle={branding?.chatbot_title || "Campus AI"}
            />
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 w-full max-w-full">
            <div className="w-full max-w-[840px] mx-auto space-y-1">
              {messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  onRegenerate={handleRegenerate}
                  onEdit={handleEditMessage}
                  onOptionClick={(opt) => handleSendMessage(opt)}
                  theme={theme}
                />
              ))}

              {isLoading && <ResponseSkeleton />}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Bottom Composer Bar */}
        <div className="flex-shrink-0 pt-1 w-full max-w-full">
          <Composer
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            theme={theme}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <ChatSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={theme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Delete / Clear Chat Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={handleClearAllSessions}
        title="Clear Conversation History?"
        description="Are you sure you want to clear all messages and chat history? This action cannot be undone."
        loading={isClearing}
      />
    </div>
  );
}
