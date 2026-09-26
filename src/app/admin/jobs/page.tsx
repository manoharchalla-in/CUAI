"use client";

import { useState } from "react";
import { Zap, Activity, Clock, CheckCircle2, RefreshCw, Layers, AlertCircle, Play, Pause } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([
    { id: "job_101", name: "Vector Index Refresh (HNSW Embeddings)", type: "Vector Indexer", target: "All 4 Academic Folders", status: "Completed", duration: "1.2s", updated: "2 mins ago" },
    { id: "job_102", name: "Multi-Field Query Tokenizer Cache", type: "RAG Cache Sync", target: "student_records_db.json", status: "Active (Listening)", duration: "Continuous", updated: "Live" },
    { id: "job_103", name: "Dynamic Public Intake Form Validator", type: "Schema Ingestion", target: "4 Year Intake Forms", status: "Idle", duration: "320ms", updated: "15 mins ago" },
    { id: "job_104", name: "Zero-Hallucination Disambiguation Engine", type: "RAG Guardrail", target: "Chat Stream Pipeline", status: "Active (Listening)", duration: "Real-time", updated: "Live" },
    { id: "job_105", name: "Audit Log Compression & Analytics Sync", type: "Telemetry Sync", target: "search_logs table", status: "Completed", duration: "480ms", updated: "1 hour ago" },
  ]);

  const handleRunJob = (id: string) => {
    alert("Job triggered successfully! Pipeline synchronizing in background.");
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader
        title="Processing Jobs &amp; Workers"
        subtitle="Live state of asynchronous database ingestion, vector embedding workers, and RAG pipelines"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-[#0a0a0a] tracking-tight">Background Processing Pipelines</h1>
            <p className="text-xs text-[#8a8a8e] mt-0.5">Real-time pipeline monitoring and worker execution status</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-xs font-semibold text-[#0a0a0a] transition-all flex items-center gap-1.5 shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#8a8a8e]" />
              <span>Refresh Workers</span>
            </button>
          </div>
        </div>

        {/* Worker Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[130px]">
            <div className="text-[11.5px] font-semibold text-[#8a8a8e]">Active Workers</div>
            <div className="text-2xl font-bold text-[#0a0a0a] my-1 tracking-tight">2 Running</div>
            <div className="text-[11px] text-[#0a66ff] font-semibold">Continuous RAG Stream</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[130px]">
            <div className="text-[11.5px] font-semibold text-[#8a8a8e]">Queued Jobs</div>
            <div className="text-2xl font-bold text-[#0a0a0a] my-1 tracking-tight">0 Queued</div>
            <div className="text-[11px] text-[#8a8a8e]">Zero Processing Backlog</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[130px]">
            <div className="text-[11.5px] font-semibold text-[#8a8a8e]">Pipeline Health</div>
            <div className="text-2xl font-bold text-[#0a0a0a] my-1 tracking-tight">100% OK</div>
            <div className="text-[11px] text-[#0a0a0a] flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
              <span>All Workers Operational</span>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10.5px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Worker Pipeline Name</th>
                  <th className="py-3 px-4">Task Category</th>
                  <th className="py-3 px-4">Target Destination</th>
                  <th className="py-3 px-4">Execution Latency</th>
                  <th className="py-3 px-4">Worker Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] text-[#0a0a0a]">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#fafafc] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center flex-shrink-0">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-[#0a0a0a]">{job.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] font-mono text-[10.5px]">
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
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a]">
                        <span className={`w-1.5 h-1.5 rounded-full ${job.status.includes("Active") ? "bg-[#0a66ff]" : "bg-[#8a8a8e]"}`} />
                        <span>{job.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleRunJob(job.id)}
                        className="h-8 px-3 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
                      >
                        Trigger Run
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
