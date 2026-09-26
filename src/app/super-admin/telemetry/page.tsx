"use client";

import { useState } from "react";
import { 
  Activity, 
  Cpu, 
  Zap, 
  Terminal, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowUpRight, 
  Layers, 
  FileText,
  RotateCcw
} from "lucide-react";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";

interface QueryLog {
  id: string;
  timestamp: string;
  userQuery: string;
  folderGrounding: string;
  matchedChunks: number;
  confidenceScore: number;
  totalTokens: number;
  latencyMs: number;
  model: string;
  status: "Success" | "Grounding Fallback" | "Cache Hit";
}

export default function TelemetryPage() {
  const [selectedLog, setSelectedLog] = useState<QueryLog | null>(null);
  const [filter, setFilter] = useState("");

  const logs: QueryLog[] = [
    {
      id: "tel-101",
      timestamp: "12 seconds ago",
      userQuery: "Tell me the attendance and exam dates for 3rd Year CSE students",
      folderGrounding: "3rd Year Folder (10 Records)",
      matchedChunks: 4,
      confidenceScore: 0.94,
      totalTokens: 612,
      latencyMs: 340,
      model: "Gemini 1.5 Flash",
      status: "Success",
    },
    {
      id: "tel-102",
      timestamp: "1 min ago",
      userQuery: "What is the fee payment deadline for 1st year B.Tech intake?",
      folderGrounding: "1st Year Folder (8 Records)",
      matchedChunks: 3,
      confidenceScore: 0.91,
      totalTokens: 480,
      latencyMs: 290,
      model: "Gemini 1.5 Flash",
      status: "Success",
    },
    {
      id: "tel-103",
      timestamp: "3 mins ago",
      userQuery: "Can I apply for hostel room in campus block B?",
      folderGrounding: "Campus Policies & Intake Hub",
      matchedChunks: 2,
      confidenceScore: 0.88,
      totalTokens: 390,
      latencyMs: 270,
      model: "Gemini 1.5 Flash",
      status: "Success",
    },
    {
      id: "tel-104",
      timestamp: "8 mins ago",
      userQuery: "Tell me the contact number of university vice chancellor",
      folderGrounding: "Admin Directory",
      matchedChunks: 1,
      confidenceScore: 0.65,
      totalTokens: 210,
      latencyMs: 310,
      model: "Gemini 1.5 Flash",
      status: "Grounding Fallback",
    },
  ];

  const filteredLogs = logs.filter(
    (l) =>
      l.userQuery.toLowerCase().includes(filter.toLowerCase()) ||
      l.folderGrounding.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <SuperAdminHeader
        title="Live LLM Telemetry & Profiler"
        subtitle="Real-time inference profiling, chunk grounding metrics, token consumption, and response latencies"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
                <Activity className="w-4 h-4" />
              </span>
              <h1 className="text-xl font-bold text-[#0a0a0a] tracking-tight">
                Live LLM Telemetry & RAG Query Inspector
              </h1>
            </div>
            <p className="text-xs text-[#8a8a8e] mt-1">
              Real-time inference profiling, chunk grounding metrics, token consumption, and response latencies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#0a0a0a] bg-white border border-[#e3e4e8] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
              Telemetry Stream Live
            </span>
          </div>
        </div>

        {/* Live System Performance Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[120px]">
            <span className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">P95 Inference Latency</span>
            <div className="text-3xl font-bold text-[#0a0a0a] tracking-tight my-1">340 ms</div>
            <div className="text-[11px] text-[#0a0a0a] font-semibold">Optimal response speed</div>
          </div>

          <div className="p-5 bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[120px]">
            <span className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Grounding Precision</span>
            <div className="text-3xl font-bold text-[#0a0a0a] tracking-tight my-1">94.8%</div>
            <div className="text-[11px] text-[#8a8a8e]">Average Cosine Score 0.91</div>
          </div>

          <div className="p-5 bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[120px]">
            <span className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Node Memory</span>
            <div className="text-3xl font-bold text-[#0a0a0a] tracking-tight my-1">142 MB</div>
            <div className="text-[11px] text-[#8a8a8e]">Heap limit: 2048 MB</div>
          </div>

          <div className="p-5 bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[120px]">
            <span className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Query Success</span>
            <div className="text-3xl font-bold text-[#0a0a0a] tracking-tight my-1">99.4%</div>
            <div className="text-[11px] text-[#8a8a8e]">0 fatal crashes</div>
          </div>
        </div>

        {/* Query Stream Inspector */}
        <div className="bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#e3e4e8] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#fafafc]">
            <div>
              <h2 className="text-sm font-bold text-[#0a0a0a]">Inference Query Trace Log</h2>
              <p className="text-xs text-[#8a8a8e] mt-0.5">
                Click any log entry to inspect full prompt context, chunk scores, and token breakdown.
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8e]" />
              <input
                type="text"
                placeholder="Search traces..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full h-9 pl-9 pr-3.5 text-xs bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-[#0a0a0a] placeholder-[#8a8a8e] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Timestamp</th>
                  <th className="py-3 px-4">User Prompt</th>
                  <th className="py-3 px-4">Grounding Source</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Tokens</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#0a0a0a]">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`cursor-pointer transition-colors ${
                      selectedLog?.id === log.id ? "bg-[#f5f5f7]" : "hover:bg-[#fafafc]"
                    }`}
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-[#8a8a8e]">{log.timestamp}</td>
                    <td className="py-3.5 px-4 font-bold text-[#0a0a0a] max-w-xs truncate">
                      {log.userQuery}
                    </td>
                    <td className="py-3.5 px-4 text-[#8a8a8e]">{log.folderGrounding}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0a0a0a]">
                      {(log.confidenceScore * 100).toFixed(0)}%
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#8a8a8e]">{log.latencyMs}ms</td>
                    <td className="py-3.5 px-4 font-mono text-[#8a8a8e]">{log.totalTokens} tok</td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        log.status === "Success"
                          ? "bg-[#0a0a0a] text-white"
                          : "bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${log.status === "Success" ? "bg-white" : "bg-[#8a8a8e]"}`} />
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
