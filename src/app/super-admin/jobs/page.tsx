"use client";

import { useState } from "react";
import { 
  Zap, 
  Activity, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Play, 
  Pause,
  Server,
  Database
} from "lucide-react";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";

export default function SuperAdminJobsPage() {
  const [jobs, setJobs] = useState([
    { id: "job_101", name: "Vector Index Refresh (HNSW Embeddings)", type: "Vector Indexer", target: "All 4 Academic Folders", status: "Completed", duration: "1.2s", updated: "2 mins ago" },
    { id: "job_102", name: "Multi-Field Query Tokenizer Cache", type: "RAG Cache Sync", target: "student_records_db.json", status: "Active (Listening)", duration: "Continuous", updated: "Live" },
    { id: "job_103", name: "Dynamic Public Intake Form Validator", type: "Schema Ingestion", target: "4 Year Intake Forms", status: "Idle", duration: "320ms", updated: "15 mins ago" },
    { id: "job_104", name: "Zero-Hallucination Disambiguation Engine", type: "RAG Guardrail", target: "Chat Stream Pipeline", status: "Active (Listening)", duration: "Real-time", updated: "Live" },
    { id: "job_105", name: "Audit Log Compression & Analytics Sync", type: "Telemetry Sync", target: "search_logs table", status: "Completed", duration: "480ms", updated: "1 hour ago" },
  ]);

  const [runningJobId, setRunningJobId] = useState<string | null>(null);

  const handleRunJob = (id: string) => {
    setRunningJobId(id);
    setTimeout(() => {
      setRunningJobId(null);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <SuperAdminHeader
        title="Processing Pipelines & Workers"
        subtitle="Super admin oversight of asynchronous database ingestion, embedding background workers, and tokenizers"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
                <Zap className="w-4 h-4" />
              </span>
              <h1 className="text-xl font-bold text-[#0a0a0a] tracking-tight">
                Master Processing Pipelines & Worker Queue
              </h1>
            </div>
            <p className="text-xs text-[#8a8a8e] mt-1">
              Super admin oversight of asynchronous database ingestion, embedding background workers, and tokenizers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="h-9 px-4 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-xs font-semibold text-[#0a0a0a] transition-all flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-[0.98] cursor-pointer w-fit"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#8a8a8e]" />
            <span>Refresh Pipeline</span>
          </button>
        </div>

        {/* Worker Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[130px]">
            <div className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Active Workers</div>
            <div className="text-3xl font-bold text-[#0a0a0a] tracking-tight my-1">2 Running</div>
            <div className="text-[11px] text-[#0a0a0a] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" />
              Continuous RAG Stream
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[130px]">
            <div className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Queued Jobs</div>
            <div className="text-3xl font-bold text-[#0a0a0a] tracking-tight my-1">0 Queued</div>
            <div className="text-[11px] text-[#8a8a8e] font-medium">Zero Processing Backlog</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[130px]">
            <div className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Pipeline Health</div>
            <div className="text-3xl font-bold text-[#0a0a0a] tracking-tight my-1">100% OK</div>
            <div className="text-[11px] text-[#8a8a8e] font-medium">All Workers Operational</div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Worker Pipeline Name</th>
                  <th className="py-3 px-4">Task Category</th>
                  <th className="py-3 px-4">Target Destination</th>
                  <th className="py-3 px-4">Execution Latency</th>
                  <th className="py-3 px-4">Worker Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#0a0a0a]">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#fafafc] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center text-[#0a0a0a]">
                          <Zap className="w-3.5 h-3.5" />
                        </span>
                        <span className="font-bold text-[#0a0a0a]">{job.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] font-mono text-[10px]">
                        {job.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#8a8a8e] font-mono text-[11px]">
                      {job.target}
                    </td>
                    <td className="py-3.5 px-4 text-[#8a8a8e] font-mono">
                      {job.duration}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        job.status.includes("Active")
                          ? "bg-[#0a0a0a] text-white"
                          : "bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${job.status.includes("Active") ? "bg-white" : "bg-[#8a8a8e]"}`} />
                        <span>{job.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        type="button"
                        disabled={runningJobId === job.id}
                        onClick={() => handleRunJob(job.id)}
                        className="h-8 px-3 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-[11px] font-semibold transition-all shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                      >
                        {runningJobId === job.id ? "Running..." : "Trigger Run"}
                      </button>
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
