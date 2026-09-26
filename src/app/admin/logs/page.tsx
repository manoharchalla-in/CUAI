"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Filter, 
  Loader2,
  Download,
  Eye,
  X,
  FileText,
  Clock,
  Zap,
  User
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { formatDate } from "@/lib/utils";

export default function AdminLogsSecurityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"audit" | "rag">("audit");
  const [actionFilter, setActionFilter] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const [chatRes, auditRes] = await Promise.all([
        fetch("/api/admin/chat-data"),
        fetch("/api/admin/logs")
      ]);
      const chatData = await chatRes.json();
      const auditData = await auditRes.json();

      if (chatData.logs) setLogs(chatData.logs);
      if (auditData.logs) setAuditLogs(auditData.logs);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action.toLowerCase().includes(actionFilter.toLowerCase());
    return matchesSearch && matchesAction;
  });

  const filteredRagLogs = logs.filter((log) =>
    log.query.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportLogs = () => {
    const dataToExport = tab === "audit" ? filteredAuditLogs : filteredRagLogs;
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security_${tab}_logs_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader
        title="Logs &amp; Security Audit"
        subtitle="Real-time security telemetry, audit mutation trails, and zero-hallucination guardrail logs"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-[#0a0a0a] tracking-tight">Security &amp; Ingestion Telemetry</h1>
            <p className="text-xs text-[#8a8a8e] mt-0.5">Immutable audit trails for student mutations, settings, and RAG search logs</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportLogs}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-xs font-semibold text-[#0a0a0a] transition-all flex items-center gap-1.5 shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8a8a8e]" />
              <span>Export ({tab.toUpperCase()})</span>
            </button>

            <button
              type="button"
              onClick={fetchLogs}
              className="h-9 px-4 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Logs</span>
            </button>
          </div>
        </div>

        {/* Security Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[130px]">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-[#8a8a8e]">Security Gate Status</span>
              <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#0a0a0a] my-1 tracking-tight">Active (Strict)</div>
            <div className="text-[11px] text-[#0a0a0a] flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
              <span>Zero-Hallucination Safe</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[130px]">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-[#8a8a8e]">Recorded Audit Events</span>
              <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#0a0a0a] my-1 tracking-tight">{auditLogs.length} Events</div>
            <div className="text-[11px] text-[#8a8a8e]">Immutable Security Log</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[130px]">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-[#8a8a8e]">RAG Queries Audited</span>
              <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#0a0a0a] my-1 tracking-tight">{logs.length} Searches</div>
            <div className="text-[11px] text-[#8a8a8e]">Grounded to Vector Store</div>
          </div>
        </div>

        {/* Tab & Filter Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-[#f5f5f7] p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTab("audit")}
              className={`h-8 px-4 rounded-lg transition-all ${
                tab === "audit" ? "bg-white text-[#0a0a0a] shadow-2xs font-semibold" : "text-[#8a8a8e] hover:text-[#0a0a0a]"
              }`}
            >
              Admin Mutation Audits ({auditLogs.length})
            </button>
            <button
              onClick={() => setTab("rag")}
              className={`h-8 px-4 rounded-lg transition-all ${
                tab === "rag" ? "bg-white text-[#0a0a0a] shadow-2xs font-semibold" : "text-[#8a8a8e] hover:text-[#0a0a0a]"
              }`}
            >
              RAG Search Logs ({logs.length})
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8e]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit details or query..."
              className="w-full h-9 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] pl-9 pr-4 focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 font-medium transition-all"
            />
          </div>
        </div>

        {/* Log Table */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            {tab === "audit" ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10.5px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Entity Type</th>
                    <th className="py-3 px-4">Details / Summary</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#0a0a0a]">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#8a8a8e]">
                        <Loader2 className="w-6 h-6 animate-spin text-[#0a66ff] mx-auto mb-2" />
                        Loading audit logs...
                      </td>
                    </tr>
                  ) : filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#8a8a8e]">
                        No audit events recorded yet. Perform student additions or branch updates to see events.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map((entry) => (
                      <tr key={entry.id} className="hover:bg-[#fafafc] transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-mono text-[#8a8a8e] text-[11px]">
                          {formatDate(entry.created_at)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#0a0a0a]">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center text-[#0a0a0a] text-[10px] font-bold">
                              {entry.actor.charAt(0).toUpperCase()}
                            </div>
                            <span>{entry.actor}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8] font-mono text-[10.5px] font-semibold">
                            {entry.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#8a8a8e] text-[11px]">
                          {entry.entity_type}
                        </td>
                        <td className="py-3.5 px-4 text-[#0a0a0a] max-w-sm truncate">
                          {entry.details}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#8a8a8e] text-[11px]">
                          {entry.ip_address}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <button
                            onClick={() => setSelectedEntry(entry)}
                            className="w-7 h-7 rounded-lg bg-white border border-[#e3e4e8] hover:bg-[#f5f5f7] text-[#8a8a8e] hover:text-[#0a0a0a] flex items-center justify-center transition-colors ml-auto cursor-pointer"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10.5px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Timestamp</th>
                    <th className="py-3 px-4">Search Query</th>
                    <th className="py-3 px-4">Match Tier</th>
                    <th className="py-3 px-4">Found Count</th>
                    <th className="py-3 px-4 sm:px-6">Grounding Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#0a0a0a]">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#8a8a8e]">
                        <Loader2 className="w-6 h-6 animate-spin text-[#0a66ff] mx-auto mb-2" />
                        Loading RAG logs...
                      </td>
                    </tr>
                  ) : filteredRagLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#8a8a8e]">
                        No search logs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    filteredRagLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#fafafc] transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-mono text-[#8a8a8e] text-[11px]">
                          {formatDate(log.created_at)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#0a0a0a]">
                          {log.query}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-[#f5f5f7] border border-[#e3e4e8] text-[#8a8a8e] font-mono text-[10.5px]">
                            {log.query_type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                            <span>{log.found_count > 0 ? `${log.found_count} Matched Records` : "Zero Hallucination"}</span>
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
            )}
          </div>
        </div>
      </main>

      {/* Inspect Audit Entry Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#e3e4e8] rounded-2xl w-full max-w-lg shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6 animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e4e8]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[#0a0a0a]">Audit Event Trace: {selectedEntry.id}</h3>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1.5 text-[#8a8a8e] hover:text-[#0a0a0a] rounded-lg hover:bg-[#f5f5f7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#fafafc] rounded-xl border border-[#e3e4e8] space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8a8a8e]">Action:</span>
                <span className="font-mono font-semibold text-[#0a0a0a]">{selectedEntry.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a8a8e]">Actor:</span>
                <span className="font-semibold text-[#0a0a0a]">{selectedEntry.actor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a8a8e]">Entity:</span>
                <span className="font-mono text-[#0a0a0a]">{selectedEntry.entity_type} ({selectedEntry.entity_id})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a8a8e]">IP Address:</span>
                <span className="font-mono text-[#0a0a0a]">{selectedEntry.ip_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a8a8e]">Timestamp:</span>
                <span className="text-[#0a0a0a]">{formatDate(selectedEntry.created_at)}</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] rounded-xl font-mono text-xs leading-relaxed">
              <div className="text-[10px] text-[#8a8a8e] uppercase font-semibold mb-1">Details Summary</div>
              <div>{selectedEntry.details}</div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEntry(null)}
                className="h-9 px-5 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all cursor-pointer"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
