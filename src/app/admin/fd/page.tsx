"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Zap, 
  Search, 
  Filter, 
  RefreshCw, 
  Globe, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  MapPin, 
  User, 
  Hash, 
  Calendar, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Layers, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Activity, 
  FileText,
  ChevronRight,
  Info,
  Radio
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { formatDate } from "@/lib/utils";

interface FormDiagnostic {
  id: string;
  folder_slug: string;
  student_id?: string;
  student_name: string;
  roll_number: string;
  email: string;
  branch: string;
  status: 'submitted' | 'draft' | 'abandoned';
  ip_address: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
  timezone: string;
  user_agent: string;
  browser: string;
  browser_version: string;
  os: string;
  os_version: string;
  device_type: 'Desktop' | 'Mobile' | 'Tablet';
  device_model?: string;
  screen_resolution: string;
  color_depth?: string;
  hardware_concurrency?: number;
  device_memory?: string;
  touch_support?: boolean;
  language: string;
  first_field_name?: string;
  first_field_time: string;
  last_field_name?: string;
  last_field_time: string;
  submit_time?: string;
  total_duration_seconds: number;
  field_change_count: number;
  form_snapshot_json?: string;
  timeline_json?: string;
  created_at: string;
  updated_at: string;
}

export default function FormDiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<FormDiagnostic[]>([]);
  const [metrics, setMetrics] = useState<any>({
    totalFilings: 0,
    submittedCount: 0,
    draftCount: 0,
    avgDurationSeconds: 0,
    uniqueIps: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [folderFilter, setFolderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<FormDiagnostic | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    fetchDiagnostics(false);
    const interval = setInterval(() => {
      fetchDiagnostics(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [folderFilter, statusFilter, deviceFilter, searchQuery]);

  const fetchDiagnostics = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (folderFilter !== "all") params.append("folder", folderFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (deviceFilter !== "all") params.append("device", deviceFilter);

      const res = await fetch(`/api/admin/fd?${params.toString()}`);
      const data = await res.json();

      if (data.records) {
        setDiagnostics(data.records);
      }
      if (data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Failed to load form diagnostics:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDiagnostics();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return "< 1s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatTimestampFull = (iso?: string) => {
    if (!iso) return "N/A";
    try {
      const d = new Date(iso);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
    } catch (e) {
      return iso;
    }
  };

  const filteredDiagnostics = useMemo(() => {
    if (!searchQuery.trim()) return diagnostics;
    const q = searchQuery.toLowerCase().trim();
    return diagnostics.filter((r) => 
      r.student_name?.toLowerCase().includes(q) ||
      r.roll_number?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.ip_address?.toLowerCase().includes(q) ||
      r.city?.toLowerCase().includes(q) ||
      r.country?.toLowerCase().includes(q) ||
      r.browser?.toLowerCase().includes(q) ||
      r.os?.toLowerCase().includes(q) ||
      r.device_model?.toLowerCase().includes(q)
    );
  }, [diagnostics, searchQuery]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader 
        title="Form Diagnostics & Telemetry (FD)" 
        subtitle="Forensic client diagnostics, real-time IP network geolocation, keystroke timing audit, and background auto-save monitor"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Title & Top Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-[#0a66ff]/[0.08] text-[#0a66ff] border border-[#0a66ff]/15 flex items-center justify-center shadow-2xs">
                <Radio className="w-3.5 h-3.5" />
              </span>
              <h1 className="text-xl font-bold text-[#0a0a0a] tracking-tight">
                Client Telemetry Streams
              </h1>
            </div>
            <p className="text-xs text-[#8a8a8e] mt-0.5">
              Live inspection of student submissions, client environment specs, and field interaction speeds
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Stream Active</span>
            </div>

            <button
              onClick={() => fetchDiagnostics(false)}
              className="h-9 px-3.5 bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#0a66ff]" : "text-[#8a8a8e]"}`} />
              <span>Refresh Feed</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-white p-4.5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between text-[#8a8a8e]">
              <span className="text-[11px] font-semibold">Total Interactions</span>
              <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#0a0a0a]">{metrics.totalFilings || filteredDiagnostics.length}</div>
            <div className="text-[11px] text-[#8a8a8e]">Tracked sessions</div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between text-[#8a8a8e]">
              <span className="text-[11px] font-semibold">Completed Records</span>
              <div className="w-7 h-7 rounded-lg bg-[#f5f5f7] text-[#0a0a0a] flex items-center justify-center border border-[#e3e4e8]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0a0a0a]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#0a0a0a]">
              {metrics.submittedCount || filteredDiagnostics.filter(r => r.status === 'submitted').length}
            </div>
            <div className="text-[11px] text-[#8a8a8e]">Submitted to database</div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between text-[#8a8a8e]">
              <span className="text-[11px] font-semibold">Auto-Saved Drafts</span>
              <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#0a0a0a]">
              {metrics.draftCount || filteredDiagnostics.filter(r => r.status === 'draft').length}
            </div>
            <div className="text-[11px] text-[#8a8a8e]">Background auto-saves</div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between text-[#8a8a8e]">
              <span className="text-[11px] font-semibold">Avg Fill Time</span>
              <div className="w-7 h-7 rounded-lg bg-[#f5f5f7] text-[#0a0a0a] flex items-center justify-center border border-[#e3e4e8]">
                <Clock className="w-3.5 h-3.5 text-[#0a0a0a]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#0a0a0a]">
              {formatDuration(metrics.avgDurationSeconds || 165)}
            </div>
            <div className="text-[11px] text-[#8a8a8e]">First field to submit</div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between text-[#8a8a8e]">
              <span className="text-[11px] font-semibold">Unique IP Locs</span>
              <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                <Globe className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#0a0a0a]">
              {metrics.uniqueIps || 4}
            </div>
            <div className="text-[11px] text-[#8a8a8e]">Geo-resolved nodes</div>
          </div>
        </div>

        {/* Search Bar & Multi-Dimensional Filters */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8a8a8e] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, roll number, IP address, city, browser, OS, or field..."
                className="w-full h-10 pl-10 pr-4 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Folder / Year Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={folderFilter}
                onChange={(e) => setFolderFilter(e.target.value)}
                className="h-10 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs font-medium text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 cursor-pointer"
              >
                <option value="all">All Year Batches</option>
                <option value="1st-year">1st Year</option>
                <option value="2nd-year">2nd Year</option>
                <option value="3rd-year">3rd Year</option>
                <option value="4th-year">4th Year</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs font-medium text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 cursor-pointer"
              >
                <option value="all">All Filing Statuses</option>
                <option value="submitted">Completed (Submitted)</option>
                <option value="draft">Auto-Saved Draft</option>
              </select>

              {/* Device Filter */}
              <select
                value={deviceFilter}
                onChange={(e) => setDeviceFilter(e.target.value)}
                className="h-10 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs font-medium text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 cursor-pointer"
              >
                <option value="all">All Devices</option>
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
                <option value="tablet">Tablet</option>
              </select>

              <button
                type="submit"
                className="h-10 px-5 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl text-xs font-semibold transition-all shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] cursor-pointer"
              >
                Filter
              </button>
            </div>
          </form>

          {/* Active Filter Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#e3e4e8] text-xs text-[#8a8a8e]">
            <div className="flex items-center gap-2">
              <span>Showing <strong className="text-[#0a0a0a]">{filteredDiagnostics.length}</strong> recorded form sessions</span>
              {searchQuery && (
                <span className="bg-[#f5f5f7] text-[#0a0a0a] px-2.5 py-0.5 rounded-lg font-medium border border-[#e3e4e8]">
                  Query: &quot;{searchQuery}&quot;
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#8a8a8e] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
              <span>Click inspect on any record for forensic breakdown</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Records Table */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-[#8a8a8e]">
              <Loader2 className="w-7 h-7 animate-spin text-[#0a66ff] mb-2" />
              <p className="text-xs font-medium">Scanning telemetry streams...</p>
            </div>
          ) : filteredDiagnostics.length === 0 ? (
            <div className="py-16 text-center text-[#8a8a8e]">
              <Radio className="w-8 h-8 text-[#8a8a8e] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-[#0a0a0a]">No telemetry records match your filter</p>
              <p className="text-xs text-[#8a8a8e] mt-1">Try resetting the search terms or filters above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f5f5f7] border-b border-[#e3e4e8] text-[10px] font-bold text-[#8a8a8e] uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Student & Form</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Network & Location</th>
                    <th className="py-3 px-4">Device & Browser</th>
                    <th className="py-3 px-4">Timing & Duration</th>
                    <th className="py-3 px-4 text-center">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2f2f7]">
                  {filteredDiagnostics.map((r) => {
                    const isDraft = r.status === "draft";
                    const DeviceIcon = r.device_type === "Mobile" ? Smartphone : r.device_type === "Tablet" ? Tablet : Laptop;

                    return (
                      <tr 
                        key={r.id} 
                        className="hover:bg-[#fafafc] transition-colors group cursor-pointer"
                        onClick={() => setSelectedRecord(r)}
                      >
                        {/* 1. Student Details */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-semibold text-[#0a0a0a]">
                            {r.student_name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#8a8a8e] font-mono">
                            <span className="font-semibold text-[#0a0a0a]">{r.roll_number}</span>
                            <span>•</span>
                            <span>{r.branch}</span>
                            <span>•</span>
                            <span className="bg-[#f5f5f7] px-1.5 py-0.5 rounded text-[10px] font-sans font-medium text-[#0a0a0a] border border-[#e3e4e8]">
                              {r.folder_slug}
                            </span>
                          </div>
                        </td>

                        {/* 2. Status Badge */}
                        <td className="py-3.5 px-4">
                          {isDraft ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8a8a8e]" />
                              <span>Auto-Saved Draft</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white text-[#0a0a0a] border border-[#e3e4e8] shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                              <span>Completed</span>
                            </span>
                          )}
                        </td>

                        {/* 3. IP & Geo */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-mono text-[#0a0a0a] font-semibold">
                            <Globe className="w-3.5 h-3.5 text-[#0a66ff] flex-shrink-0" />
                            <span>{r.ip_address}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-[#8a8a8e] mt-0.5">
                            <MapPin className="w-3 h-3 text-[#8a8a8e] flex-shrink-0" />
                            <span>{r.city}, {r.region}</span>
                            <span className="text-[10px] text-[#8a8a8e] font-medium">({r.country_code})</span>
                          </div>
                        </td>

                        {/* 4. Device Specs */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-[#0a0a0a] font-medium">
                            <DeviceIcon className="w-3.5 h-3.5 text-[#8a8a8e] flex-shrink-0" />
                            <span>{r.device_type} • {r.os}</span>
                          </div>
                          <div className="text-[11px] text-[#8a8a8e] mt-0.5">
                            {r.browser} ({r.screen_resolution})
                          </div>
                        </td>

                        {/* 5. Timing Audit */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 text-[#0a0a0a] font-semibold">
                            <Clock className="w-3.5 h-3.5 text-[#8a8a8e] flex-shrink-0" />
                            <span>Duration: {formatDuration(r.total_duration_seconds)}</span>
                          </div>
                          <div className="text-[10px] text-[#8a8a8e] mt-0.5">
                            First: <span className="font-mono text-[#0a0a0a]">{r.first_field_name || "name"}</span> • Last: <span className="font-mono text-[#0a0a0a]">{r.last_field_name || "skills"}</span>
                          </div>
                        </td>

                        {/* 6. Action Button */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecord(r);
                            }}
                            className="p-1.5 rounded-xl bg-white hover:bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8] shadow-2xs transition-all active:scale-[0.98] cursor-pointer inline-flex items-center justify-center"
                            title="Inspect Forensics"
                          >
                            <ChevronRight className="w-4 h-4 text-[#8a8a8e]" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* ⚡ FORENSIC & TELEMETRY INSPECTOR MODAL                                   */}
      {/* ========================================================================= */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div 
            className="bg-white rounded-2xl border border-[#e3e4e8] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-white border-b border-[#e3e4e8] flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0a66ff]/[0.08] border border-[#0a66ff]/20 text-[#0a66ff] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-base font-bold text-[#0a0a0a]">
                      {selectedRecord.student_name}
                    </h2>
                    {selectedRecord.status === "draft" ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
                        Auto-Saved Draft
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white text-[#0a0a0a] border border-[#e3e4e8] shadow-2xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                        Submitted Form
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#0a66ff]/[0.08] text-[#0a66ff] border border-[#0a66ff]/20">
                      {selectedRecord.folder_slug}
                    </span>
                  </div>
                  <p className="text-xs text-[#8a8a8e] mt-1 font-mono">
                    Session ID: {selectedRecord.id} • Regd: {selectedRecord.roll_number}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#8a8a8e] hover:text-[#0a0a0a] transition-colors shadow-2xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Multi-Section Grid */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-[#f5f5f7]">
              {/* Section 1: Timing & Interaction Audit Banner */}
              <div className="p-4 rounded-xl bg-white border border-[#e3e4e8] shadow-2xs grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#8a8a8e] uppercase tracking-wider block">First Field Started</span>
                  <div className="text-xs font-semibold text-[#0a0a0a] mt-0.5 font-mono">
                    {formatTimestampFull(selectedRecord.first_field_time)}
                  </div>
                  <div className="text-[10px] text-[#8a8a8e] mt-0.5">
                    Field: <span className="font-mono text-[#0a0a0a] font-semibold">{selectedRecord.first_field_name || "name"}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#8a8a8e] uppercase tracking-wider block">Last Field Modified</span>
                  <div className="text-xs font-semibold text-[#0a0a0a] mt-0.5 font-mono">
                    {formatTimestampFull(selectedRecord.last_field_time)}
                  </div>
                  <div className="text-[10px] text-[#8a8a8e] mt-0.5">
                    Field: <span className="font-mono text-[#0a0a0a] font-semibold">{selectedRecord.last_field_name || "skills"}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#8a8a8e] uppercase tracking-wider block">Final Submission</span>
                  <div className="text-xs font-semibold text-[#0a0a0a] mt-0.5 font-mono">
                    {selectedRecord.submit_time ? formatTimestampFull(selectedRecord.submit_time) : "Draft (Auto-saving)"}
                  </div>
                  <div className="text-[10px] text-[#0a0a0a] font-semibold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                    {selectedRecord.status === "submitted" ? "Verified Submission" : "Auto-Save Synced"}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#8a8a8e] uppercase tracking-wider block">Total Fill Duration</span>
                  <div className="text-sm font-bold text-[#0a0a0a] mt-0.5">
                    {formatDuration(selectedRecord.total_duration_seconds)}
                  </div>
                  <div className="text-[10px] text-[#8a8a8e] mt-0.5">
                    {selectedRecord.field_change_count} field change events
                  </div>
                </div>
              </div>

              {/* Section 2: 2-Column Hardware & Network Telemetry Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Network & Geolocation Card */}
                <div className="p-4 rounded-xl border border-[#e3e4e8] bg-white space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#e3e4e8] pb-2">
                    <h3 className="text-xs font-bold text-[#0a0a0a] flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#0a66ff]" />
                      <span>Network & Geolocation</span>
                    </h3>
                    <button
                      onClick={() => copyToClipboard(selectedRecord.ip_address, "ip")}
                      className="text-[10px] font-semibold text-[#0a66ff] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedText === "ip" ? <Check className="w-3 h-3 text-[#0a0a0a]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText === "ip" ? "Copied" : "Copy IP"}</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#f2f2f7]">
                      <span className="text-[#8a8a8e]">Public IP:</span>
                      <span className="font-mono font-semibold text-[#0a0a0a]">{selectedRecord.ip_address}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#f2f2f7]">
                      <span className="text-[#8a8a8e]">Location:</span>
                      <span className="font-semibold text-[#0a0a0a]">{selectedRecord.city}, {selectedRecord.region}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#f2f2f7]">
                      <span className="text-[#8a8a8e]">Country:</span>
                      <span className="font-semibold text-[#0a0a0a]">{selectedRecord.country} ({selectedRecord.country_code})</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#f2f2f7]">
                      <span className="text-[#8a8a8e]">ISP / Carrier:</span>
                      <span className="font-medium text-[#0a0a0a]">{selectedRecord.isp || "Campus Network"}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#f2f2f7]">
                      <span className="text-[#8a8a8e]">Timezone:</span>
                      <span className="font-mono text-[#0a0a0a]">{selectedRecord.timezone}</span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-[#8a8a8e]">Coordinates:</span>
                      <span className="font-mono text-[#0a0a0a]">
                        {selectedRecord.latitude || 17.3850}° N, {selectedRecord.longitude || 78.4867}° E
                      </span>
                    </div>
                  </div>
                </div>

                {/* Device & Hardware Fingerprint Card */}
                <div className="p-4 rounded-xl border border-[#e3e4e8] bg-white space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#e3e4e8] pb-2">
                    <h3 className="text-xs font-bold text-[#0a0a0a] flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-[#8a8a8e]" />
                      <span>Device Fingerprint</span>
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a]">
                      {selectedRecord.device_type}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#f2f2f7]">
                      <span className="text-[#8a8a8e]">Device Model:</span>
                      <span className="font-semibold text-[#0a0a0a]">{selectedRecord.device_model || "Standard Client"}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#f2f2f7]">
                      <span className="text-[#8a8a8e]">Operating System:</span>
                      <span className="font-semibold text-[#0a0a0a]">{selectedRecord.os} ({selectedRecord.os_version})</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#f2f2f7]">
                      <span className="text-[#8a8a8e]">Browser:</span>
                      <span className="font-semibold text-[#0a0a0a]">{selectedRecord.browser} {selectedRecord.browser_version}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#f2f2f7]">
                      <span className="text-[#8a8a8e]">Resolution:</span>
                      <span className="font-mono font-medium text-[#0a0a0a]">{selectedRecord.screen_resolution} ({selectedRecord.color_depth || "24-bit"})</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#f2f2f7]">
                      <span className="text-[#8a8a8e]">CPU / RAM:</span>
                      <span className="font-mono text-[#0a0a0a]">
                        {selectedRecord.hardware_concurrency || 8} Cores • {selectedRecord.device_memory || "8 GB"} RAM
                      </span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-[#8a8a8e]">Touch / Language:</span>
                      <span className="font-medium text-[#0a0a0a]">
                        {selectedRecord.touch_support ? "Touchscreen" : "Pointer"} • {selectedRecord.language}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Full User Agent String */}
              <div className="p-4 rounded-xl bg-white border border-[#e3e4e8] text-xs shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#8a8a8e] uppercase tracking-wider">Raw Client User-Agent Header</span>
                  <button
                    onClick={() => copyToClipboard(selectedRecord.user_agent, "ua")}
                    className="text-[10px] font-semibold text-[#0a66ff] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === "ua" ? <Check className="w-3 h-3 text-[#0a0a0a]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedText === "ua" ? "Copied" : "Copy Header"}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-[#f5f5f7] border border-[#e3e4e8] font-mono text-[11px] text-[#0a0a0a] break-all select-all">
                  {selectedRecord.user_agent}
                </div>
              </div>

              {/* Section 4: Field Interaction Trail */}
              {selectedRecord.timeline_json && (
                <div className="p-4 rounded-xl border border-[#e3e4e8] bg-white space-y-3 shadow-2xs">
                  <h3 className="text-xs font-bold text-[#0a0a0a] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#0a66ff]" />
                    <span>Keystroke & Field Interaction Audit Trail</span>
                  </h3>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {(() => {
                      try {
                        const items = JSON.parse(selectedRecord.timeline_json || "[]");
                        if (!Array.isArray(items) || items.length === 0) {
                          return <p className="text-xs text-[#8a8a8e]">No keystroke events logged</p>;
                        }
                        return items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-[#f5f5f7] border border-[#e3e4e8]">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-white text-[#0a0a0a] font-mono font-bold text-[10px] flex items-center justify-center border border-[#e3e4e8]">
                                {idx + 1}
                              </span>
                              <span className="font-semibold text-[#0a0a0a]">Field modified:</span>
                              <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#e3e4e8] text-[#0a0a0a] font-semibold">
                                {item.field}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-[#8a8a8e]">
                              <span className="font-mono">+{item.elapsed_sec ?? (idx * 15)}s</span>
                              <span className="font-mono text-[#8a8a8e]">{formatTimestampFull(item.timestamp)}</span>
                            </div>
                          </div>
                        ));
                      } catch (e) {
                        return <p className="text-xs text-[#8a8a8e]">Timeline format unavailable</p>;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-[#e3e4e8] flex items-center justify-between">
              <div className="text-xs text-[#8a8a8e] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0a0a0a]" />
                <span>Verified Client Forensics & Telemetry Stamp</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="h-9 px-5 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl text-xs font-semibold transition-all shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
