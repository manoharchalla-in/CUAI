"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Clock, User, Trash2, Search, ArrowRight, Loader2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import MessageItem from "@/components/chat/MessageItem";
import { formatDate } from "@/lib/utils";

export default function AdminChatHistoryPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/chat-data");
      const data = await res.json();
      if (data.sessions) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSession = async (id: string) => {
    setSelectedSessionId(id);
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/chat/sessions/${id}`);
      const data = await res.json();
      if (data.messages) {
        setSessionMessages(data.messages);
      }
    } catch (err) {
      console.error("Error loading session:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader
        title="Chat Sessions &amp; History Oversight"
        subtitle="Review chatbot conversations and student query transcripts"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[78vh]">
          {/* Sessions List */}
          <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#e3e4e8]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-semibold text-[#0a0a0a] tracking-tight">
                  Conversations ({sessions.length})
                </h3>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8e]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search session title..."
                  className="w-full h-9 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] pl-9 pr-3 focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
              {loading ? (
                <div className="text-center py-12 text-[#8a8a8e] text-xs">
                  <Loader2 className="w-5 h-5 animate-spin text-[#0a66ff] mx-auto mb-2" />
                  Loading conversations...
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="text-center py-12 text-[#8a8a8e] text-xs">
                  No chat sessions recorded yet.
                </div>
              ) : (
                filteredSessions.map((s) => {
                  const isActive = s.id === selectedSessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSession(s.id)}
                      className={`p-3 rounded-xl cursor-pointer text-xs transition-all ${
                        isActive
                          ? "bg-[#fafafc] border border-[#0a0a0a] text-[#0a0a0a] font-semibold shadow-2xs"
                          : "bg-white hover:bg-[#fafafc] border border-transparent hover:border-[#e3e4e8] text-[#0a0a0a]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="truncate flex-1 font-semibold">{s.title}</span>
                        <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-[#0a66ff]" : "text-[#8a8a8e]"}`} />
                      </div>
                      <div className="text-[10px] text-[#8a8a8e]">
                        {formatDate(s.updated_at || s.created_at)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Session Transcript Inspector */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#e3e4e8] flex items-center justify-between bg-white">
              <div>
                <h3 className="text-sm font-semibold text-[#0a0a0a] tracking-tight">Conversation Transcript</h3>
                <p className="text-xs text-[#8a8a8e] font-mono mt-0.5">
                  {selectedSessionId ? `Session ID: ${selectedSessionId}` : "Select a session from the list"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white custom-scrollbar">
              {!selectedSessionId ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#8a8a8e] text-xs py-12">
                  <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center mb-3">
                    <MessageSquare className="w-6 h-6 text-[#8a8a8e]" />
                  </div>
                  <p className="font-semibold text-[#0a0a0a]">No conversation selected</p>
                  <p className="text-[#8a8a8e] text-xs mt-1 max-w-sm">Click on any conversation from the list to inspect full messages and RAG details.</p>
                </div>
              ) : loadingMessages ? (
                <div className="h-full flex items-center justify-center text-[#8a8a8e] text-xs py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0a66ff] mb-2" />
                </div>
              ) : sessionMessages.length === 0 ? (
                <div className="text-center py-12 text-[#8a8a8e] text-xs">
                  No messages in this session.
                </div>
              ) : (
                sessionMessages.map((msg) => (
                  <MessageItem key={msg.id} message={msg} />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
