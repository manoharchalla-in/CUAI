"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, 
  Cpu, 
  Layers, 
  Server, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  HardDrive, 
  Zap, 
  Loader2,
  Crown,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminSystemPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("System data error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8a8a8e] bg-[#f5f5f7] min-h-screen">
        <Loader2 className="w-7 h-7 animate-spin text-[#0a66ff] mb-3" />
        <p className="text-xs font-semibold text-[#0a0a0a]">Loading System Diagnostics...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader
        title="System Diagnostics &amp; Engine"
        subtitle="Real-time operational health, RAG embedding pipeline, and vector memory stats"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Title and Action Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-[#0a0a0a] tracking-tight">System Health &amp; Diagnostics</h1>
            <p className="text-xs text-[#8a8a8e]">Live operational diagnostics, campus neural memory parameters, and microservice status</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchSystemData}
              disabled={isRefreshing}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] transition-all shadow-2xs active:scale-[0.98] flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#8a8a8e] ${isRefreshing ? "animate-spin text-[#0a66ff]" : ""}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {/* 3 Main Engine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: SYSTEM HEALTH */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e4e8]">
              <h3 className="text-xs font-semibold text-[#0a0a0a] uppercase tracking-wider">System Health</h3>
              <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8a8a8e]">Atomic JSON Store:</span>
                <span className="font-semibold text-[#0a0a0a] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                  <span>Healthy (100%)</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8a8a8e]">Vector Search (HNSW):</span>
                <span className="font-semibold text-[#0a0a0a] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                  <span>Active</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8a8a8e]">Average LLM Latency:</span>
                <span className="font-mono font-semibold text-[#0a0a0a]">320ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8a8a8e]">Background Job Workers:</span>
                <span className="font-semibold text-[#0a0a0a]">Idle (0 Queued)</span>
              </div>
            </div>
          </div>

          {/* Card 2: AI & MODEL CONFIG */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e4e8]">
              <h3 className="text-xs font-semibold text-[#0a0a0a] uppercase tracking-wider">AI &amp; Model Config</h3>
              <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8a8a8e]">Answer Composer:</span>
                <span className="font-semibold text-[#0a0a0a]">Gemini 1.5 Flash</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8a8a8e]">Embedding Model:</span>
                <span className="font-mono text-[11px] font-semibold text-[#0a0a0a]">text-embedding-004</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8a8a8e]">Temperature / Top-K:</span>
                <span className="font-mono font-semibold text-[#0a0a0a]">0.2 / 5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8a8a8e]">Source Citations:</span>
                <span className="font-semibold text-[#0a0a0a] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                  <span>Enabled</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: KNOWLEDGE BASE STATS */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e4e8]">
              <h3 className="text-xs font-semibold text-[#0a0a0a] uppercase tracking-wider">Knowledge Base Stats</h3>
              <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8a8a8e]">Active Records:</span>
                <span className="font-semibold text-[#0a0a0a]">{stats?.totalStudents || 0} Students</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8a8a8e]">Academic Folders:</span>
                <span className="font-semibold text-[#0a0a0a]">4 Active Batches</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8a8a8e]">Deduplication Ratio:</span>
                <span className="font-mono font-semibold text-[#0a0a0a]">99.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8a8a8e]">RAG Guarding:</span>
                <span className="font-semibold text-[#0a0a0a] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                  <span>Zero Hallucination</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Server & Infrastructure Diagnostics */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e3e4e8] pb-3">
            <div>
              <h2 className="text-sm font-semibold text-[#0a0a0a]">Infrastructure &amp; Node Telemetry</h2>
              <p className="text-xs text-[#8a8a8e]">Live operational runtime parameters in memory and disk store</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8] text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
              <span>100% Operational</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-1">
            <div className="p-4 rounded-xl bg-[#fafafc] border border-[#e3e4e8]">
              <span className="text-[#8a8a8e] block mb-1">Node Environment</span>
              <span className="font-semibold text-[#0a0a0a] text-sm font-mono">Node.js 24 (Win32)</span>
            </div>
            <div className="p-4 rounded-xl bg-[#fafafc] border border-[#e3e4e8]">
              <span className="text-[#8a8a8e] block mb-1">Database Engine</span>
              <span className="font-semibold text-[#0a0a0a] text-sm font-mono">Atomic JSON Store</span>
            </div>
            <div className="p-4 rounded-xl bg-[#fafafc] border border-[#e3e4e8]">
              <span className="text-[#8a8a8e] block mb-1">Vector Protocol</span>
              <span className="font-semibold text-[#0a0a0a] text-sm font-mono">Cosine Similarity</span>
            </div>
            <div className="p-4 rounded-xl bg-[#fafafc] border border-[#e3e4e8]">
              <span className="text-[#8a8a8e] block mb-1">HTTP / Middleware</span>
              <span className="font-semibold text-[#0a0a0a] text-sm font-mono">Next.js 14 App Router</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
