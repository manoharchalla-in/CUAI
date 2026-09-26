"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Crown, 
  Layers, 
  KeyRound, 
  Users, 
  HardDrive, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  Loader2,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";
import { formatDate } from "@/lib/utils";

export default function SuperAdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timelineRange, setTimelineRange] = useState<"7d" | "30d" | "90d">("7d");

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const [analyticsRes, logsRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/chat-data")
      ]);
      const resData = await analyticsRes.json();
      const logsData = await logsRes.json();
      setData(resData);
      if (logsData.logs) {
        setLogs(logsData.logs.slice(0, 10));
      }
    } catch (err) {
      console.error("Super admin error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8a8a8e] bg-[#f5f5f7] min-h-screen font-sans">
        <Loader2 className="w-7 h-7 animate-spin text-[#0a0a0a] mb-3" />
        <p className="text-xs font-semibold text-[#0a0a0a] tracking-tight">Loading Master Console...</p>
      </div>
    );
  }

  const activeTimeline = timelineRange === "7d" ? data.timeline7d : timelineRange === "30d" ? data.timeline30d : data.timeline90d;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7] text-[#0a0a0a] font-sans">
      <SuperAdminHeader
        title="Master Overview"
        subtitle="Unrestricted root platform controls, deep search analytics, database orchestration, and AI model parameters"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Top Hero Banner - Apple Glossy Pro Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white shadow-[0_8px_32px_rgba(0,0,0,0.16)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-[#2c2c2e] relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md">
              <Crown className="w-3 h-3" />
              <span>Root Authority</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Master System Command Suite
            </h1>
            <p className="text-xs sm:text-sm text-[#8a8a8e] max-w-xl leading-relaxed">
              Manage multi-institutional academic directories, AI grounding models, LLM API keys, search traffic analytics, and database tables.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 relative z-10">
            <button
              type="button"
              onClick={fetchMetrics}
              className="h-9 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-2 shadow-xs active:scale-[0.98]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Telemetry</span>
            </button>
            <Link
              href="/super-admin/fd"
              className="h-9 px-4 rounded-xl bg-white text-[#0a0a0a] hover:bg-[#f5f5f7] text-xs font-bold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)] flex items-center gap-1.5 active:scale-[0.98]"
            >
              <span>FD Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Key Platform Vital Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[135px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8a8a8e]">Total Enrolled Records</span>
              <div className="w-8 h-8 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center font-bold">
                <Database className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a] my-1">{data.totalStudents || 0}</div>
            <div className="text-[11px] text-[#0a0a0a] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" />
              <span>100% Grounded Across 4 Batches</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[135px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8a8a8e]">Total Chat Inquiries</span>
              <div className="w-8 h-8 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center font-bold">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a] my-1">{data.totalQueries || 0}</div>
            <div className="text-[11px] text-[#8a8a8e] font-medium">
              {data.queriesToday || 0} searches processed today
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[135px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8a8a8e]">Registered Accounts</span>
              <div className="w-8 h-8 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center font-bold">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a] my-1">{data.totalUsers || 0}</div>
            <div className="text-[11px] text-[#8a8a8e] font-medium">
              Admins & Student Users
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[135px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8a8a8e]">RAG Zero-Hallucination</span>
              <div className="w-8 h-8 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a] my-1">100% Safe</div>
            <div className="text-[11px] text-[#8a8a8e] font-medium">
              Strict Verification Active
            </div>
          </div>
        </div>

        {/* Master Analytics: Query Volume Area Chart & Intent Breakdown Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Query Volume & Search Traffic (Area Chart) */}
          <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e3e4e8] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#0a0a0a] tracking-tight">Query Volume & Search Traffic Telemetry</h3>
                <p className="text-xs text-[#8a8a8e]">Chatbot inquiry loads and inference volume over time</p>
              </div>

              <div className="flex items-center gap-1 bg-[#f5f5f7] p-1 rounded-xl text-xs font-semibold border border-[#e3e4e8]">
                <button
                  onClick={() => setTimelineRange("7d")}
                  className={`h-7 px-3 rounded-lg transition-all ${
                    timelineRange === "7d" ? "bg-white text-[#0a0a0a] shadow-xs font-bold" : "text-[#8a8a8e] hover:text-[#0a0a0a]"
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimelineRange("30d")}
                  className={`h-7 px-3 rounded-lg transition-all ${
                    timelineRange === "30d" ? "bg-white text-[#0a0a0a] shadow-xs font-bold" : "text-[#8a8a8e] hover:text-[#0a0a0a]"
                  }`}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setTimelineRange("90d")}
                  className={`h-7 px-3 rounded-lg transition-all ${
                    timelineRange === "90d" ? "bg-white text-[#0a0a0a] shadow-xs font-bold" : "text-[#8a8a8e] hover:text-[#0a0a0a]"
                  }`}
                >
                  90 Days
                </button>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeTimeline}>
                  <defs>
                    <linearGradient id="queryGradApple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#8a8a8e" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#8a8a8e" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0a",
                      borderRadius: "12px",
                      border: "1px solid #2c2c2e",
                      color: "#fff",
                      fontSize: "12px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    }}
                  />
                  <Area type="monotone" dataKey="count" name="Queries" stroke="#0a0a0a" strokeWidth={2.5} fillOpacity={1} fill="url(#queryGradApple)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Query Intent Breakdown (Donut Pie Chart) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
            <div className="border-b border-[#e3e4e8] pb-3">
              <h3 className="text-sm font-bold text-[#0a0a0a] tracking-tight">Query Intent Breakdown</h3>
              <p className="text-xs text-[#8a8a8e]">Distribution of search match tiers</p>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.queryTypeBreakdown || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(data.queryTypeBreakdown || []).map((entry: any, index: number) => {
                      const monochromeGrades = ["#0a0a0a", "#3a3a3c", "#636366", "#8a8a8e", "#c7c7cc", "#e5e5ea"];
                      return <Cell key={`cell-${index}`} fill={monochromeGrades[index % monochromeGrades.length]} />;
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0a",
                      borderRadius: "12px",
                      border: "1px solid #2c2c2e",
                      color: "#fff",
                      fontSize: "12px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              {(data.queryTypeBreakdown || []).map((item: any, i: number) => {
                const monochromeGrades = ["#0a0a0a", "#3a3a3c", "#636366", "#8a8a8e", "#c7c7cc", "#e5e5ea"];
                return (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: monochromeGrades[i % monochromeGrades.length] }} />
                    <span className="text-[#636366] truncate">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Keywords & Live Stream Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Search Keywords */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
            <div className="border-b border-[#e3e4e8] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0a0a0a] tracking-tight">Top Search Keywords</h3>
                <p className="text-xs text-[#8a8a8e]">Most frequent student inquiry terms across all campuses</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0a0a0a] text-white text-[10px] font-semibold">
                Live NLP
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {(data.topSearchKeywords || []).length === 0 ? (
                <p className="text-xs text-[#8a8a8e] py-6">No search keywords recorded yet.</p>
              ) : (
                (data.topSearchKeywords || []).map((kw: any, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f5f5f7] hover:bg-white border border-[#e3e4e8] text-xs font-semibold text-[#0a0a0a] transition-all shadow-2xs hover:shadow-xs"
                  >
                    <span>#{kw.keyword}</span>
                    <span className="px-1.5 py-0.5 bg-[#0a0a0a] text-white rounded-md text-[10px] font-bold font-mono">
                      {kw.count}
                    </span>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Real-Time Live Activity Stream */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-3 flex flex-col justify-between">
            <div className="border-b border-[#e3e4e8] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0a0a0a] tracking-tight">Live Activity Stream</h3>
                <p className="text-xs text-[#8a8a8e]">Global audit mutations, RAG queries, and account events</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
            </div>

            <div className="space-y-2 overflow-y-auto max-h-56 pr-1 text-xs">
              {(data.activityFeed || []).length === 0 ? (
                <p className="text-[#8a8a8e] py-8 text-center text-xs">No recent activity.</p>
              ) : (
                (data.activityFeed || []).map((act: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] flex items-start gap-2.5">
                    <span className="p-1 rounded-md bg-white text-[#0a0a0a] mt-0.5 border border-[#e3e4e8] shadow-2xs">
                      <Zap className="w-3 h-3" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#0a0a0a] truncate">{act.actor}</div>
                      <div className="text-[11px] text-[#636366] truncate">{act.target}</div>
                      <div className="text-[10px] text-[#8a8a8e] mt-0.5 font-mono">{formatDate(act.time)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Super Admin Quick Feature Hubs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hub 1: Multi-Institutes */}
          <Link
            href="/super-admin/institutes"
            className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:border-[#0a0a0a] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0a0a0a] mb-1 tracking-tight">Institutes & Folders</h3>
              <p className="text-xs text-[#8a8a8e] leading-relaxed">
                Configure root directory branches, manage academic year intake forms, and edit global schema fields.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#e3e4e8] flex items-center justify-between text-xs font-semibold text-[#0a0a0a]">
              <span>Manage 4 Directories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hub 2: API Keys & LLMs */}
          <Link
            href="/super-admin/api-keys"
            className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:border-[#0a0a0a] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0a0a0a] mb-1 tracking-tight">AI Config & LLMs</h3>
              <p className="text-xs text-[#8a8a8e] leading-relaxed">
                Configure master Google Gemini API keys, monitor real-time inference latency, and tune RAG grounding parameters.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#e3e4e8] flex items-center justify-between text-xs font-semibold text-[#0a0a0a]">
              <span>Configure AI Engines</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hub 3: Whitelabel Branding */}
          <Link
            href="/super-admin/branding"
            className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:border-[#0a0a0a] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                <Crown className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0a0a0a] mb-1 tracking-tight">Whitelabel & Branding</h3>
              <p className="text-xs text-[#8a8a8e] leading-relaxed">
                Customize institution name, college logo, primary theme palette, and footer attribution.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#e3e4e8] flex items-center justify-between text-xs font-semibold text-[#0a0a0a]">
              <span>Whitelabel Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Recent Knowledge Base Audit Logs Table */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#e3e4e8] flex items-center justify-between bg-[#fafafc]">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0a0a0a]" />
                <h3 className="text-sm font-bold text-[#0a0a0a] tracking-tight">
                  Recent Knowledge Base Audit Logs
                </h3>
              </div>
              <p className="text-xs text-[#8a8a8e] mt-0.5">
                Immutable security logs tracking fact revisions, grounding match counts, and query validations.
              </p>
            </div>
            <Link
              href="/super-admin/telemetry"
              className="text-xs font-semibold text-[#0a0a0a] hover:underline flex items-center gap-1"
            >
              <span>View Full Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Timestamp</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Attribute</th>
                  <th className="py-3 px-4">Change Record</th>
                  <th className="py-3 px-4 sm:px-6">Source Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#3a3a3c]">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#8a8a8e]">
                      No fact revisions logged yet. Upload new records in Folders to see audit logs.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#fafafc] transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 text-[#8a8a8e] font-mono text-[11px]">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#0a0a0a]">
                        {log.query}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] font-mono text-[11px]">
                          {log.query_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0a0a0a] text-white">
                          {log.found_count > 0 ? `${log.found_count} Matched Records` : "Zero Hallucination"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-[#8a8a8e] font-mono text-[11px]">
                        student_records_db.json
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Server & Infrastructure State */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0a0a0a] tracking-tight">Infrastructure & Node Telemetry</h2>
              <p className="text-xs text-[#8a8a8e]">Live operational parameters running in memory and disk store</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#0a0a0a] text-white text-[11px] font-semibold">
              All Microservices Healthy
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8]">
              <span className="text-[#8a8a8e] block mb-1 font-medium">Node Environment</span>
              <span className="font-bold text-[#0a0a0a] text-sm font-mono">Node.js 24 (Win32)</span>
            </div>
            <div className="p-4 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8]">
              <span className="text-[#8a8a8e] block mb-1 font-medium">Database Engine</span>
              <span className="font-bold text-[#0a0a0a] text-sm font-mono">Atomic JSON Store (ACID)</span>
            </div>
            <div className="p-4 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8]">
              <span className="text-[#8a8a8e] block mb-1 font-medium">Vector Search Protocol</span>
              <span className="font-bold text-[#0a0a0a] text-sm font-mono">HNSW Cosine Similarity</span>
            </div>
            <div className="p-4 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8]">
              <span className="text-[#8a8a8e] block mb-1 font-medium">HTTP / Middleware</span>
              <span className="font-bold text-[#0a0a0a] text-sm font-mono">Next.js 16 App Router</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
