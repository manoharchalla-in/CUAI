"use client";

import { useState, useEffect } from "react";
import { Database, Search, RefreshCw, MessageSquare, Clock, Filter, Loader2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { formatDate } from "@/lib/utils";

export default function AdminChatDataPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchChatData();
  }, []);

  const fetchChatData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/chat-data");
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Error fetching chat data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.query.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === "all" || (filterType === "found" ? log.found_count > 0 : log.found_count === 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader
        title="Chat Search &amp; Audit Logs"
        subtitle="Real-time audit trail of all chatbot inquiries and RAG retrievals"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#0a0a0a] tracking-tight">Live Query Stream</h2>
            <p className="text-xs text-[#8a8a8e] mt-0.5">Total {logs.length} logged student inquiries</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchChatData}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-xs font-semibold text-[#0a0a0a] transition-all flex items-center gap-1.5 shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#8a8a8e]" />
              <span>Refresh Logs</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8e]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by query string..."
              className="w-full h-9 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] pl-9 pr-4 focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-8 px-3 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-xs font-medium text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff]"
            >
              <option value="all">All Queries</option>
              <option value="found">Successful Matches</option>
              <option value="failed">Zero Matches (Failed)</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10.5px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">User Query</th>
                  <th className="py-3 px-4">Query Type</th>
                  <th className="py-3 px-4">Matches Found</th>
                  <th className="py-3 px-4 sm:px-6">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#0a0a0a]">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-[#8a8a8e]">
                      <Loader2 className="w-6 h-6 animate-spin text-[#0a66ff] mx-auto mb-2" />
                      Loading logs...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-[#8a8a8e]">
                      No matching search logs found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#fafafc] transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#0a0a0a]">
                        &quot;{log.query}&quot;
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#8a8a8e]">
                        <span className="bg-[#f5f5f7] px-2 py-0.5 rounded-md border border-[#e3e4e8] text-[10.5px]">
                          {log.query_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a]`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${log.found_count > 0 ? "bg-[#0a66ff]" : "bg-[#8a8a8e]"}`} />
                          <span>{log.found_count > 0 ? `${log.found_count} records` : "0 (Unknown Student)"}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-[#8a8a8e] font-mono text-[11px]">
                        {formatDate(log.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
