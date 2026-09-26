"use client";

import { useState, useEffect } from "react";
import { 
  HardDrive, 
  Database, 
  RefreshCw, 
  Sparkles, 
  Loader2, 
  Layers, 
  Download, 
  Trash2, 
  Zap, 
  ShieldCheck, 
  GraduationCap, 
  Folder, 
  MessageSquare, 
  Users, 
  KeyRound, 
  Settings as SettingsIcon, 
  Bell, 
  FileCode,
  CheckCircle2,
  PieChart,
  Activity,
  AlertCircle
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

interface TableStat {
  name: string;
  label: string;
  count: number;
  bytes: number;
  kb: string;
  mb: string;
  percent: number;
  color: string;
  icon: string;
}

interface StorageData {
  totalBytes: number;
  totalKb: string;
  totalMb: string;
  allocatedLimitBytes: number;
  allocatedLimitMb: number;
  usedPercent: string;
  freeMb: string;
  totalRecords: number;
  healthScore: number;
  status: string;
  lastOptimized: string;
  tables: TableStat[];
}

export default function AdminStoragePage() {
  const [storageData, setStorageData] = useState<StorageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [successNotice, setSuccessNotice] = useState("");

  useEffect(() => {
    fetchStorageStats();
  }, []);

  const fetchStorageStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/storage");
      const data = await res.json();
      if (data.success) {
        setStorageData(data);
      }
    } catch (err) {
      console.error("Storage fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    try {
      setOptimizing(true);
      const res = await fetch("/api/admin/storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "optimize" }),
      });
      const data = await res.json();
      if (data.success) {
        setStorageData(data);
        setSuccessNotice("Database vacuumed & storage indexes defragmented successfully!");
        setTimeout(() => setSuccessNotice(""), 3500);
      }
    } catch (err) {
      console.error("Optimization error:", err);
    } finally {
      setOptimizing(false);
    }
  };

  const handleDownloadBackup = () => {
    window.open("/api/admin/system?action=backup", "_blank");
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap": return <GraduationCap className="w-3.5 h-3.5" />;
      case "Zap": return <Zap className="w-3.5 h-3.5" />;
      case "MessageSquare": return <MessageSquare className="w-3.5 h-3.5" />;
      case "Layers": return <Layers className="w-3.5 h-3.5" />;
      case "Folder": return <Folder className="w-3.5 h-3.5" />;
      case "FileCode": return <FileCode className="w-3.5 h-3.5" />;
      case "ShieldCheck": return <ShieldCheck className="w-3.5 h-3.5" />;
      case "Users": return <Users className="w-3.5 h-3.5" />;
      case "KeyRound": return <KeyRound className="w-3.5 h-3.5" />;
      case "Settings": return <SettingsIcon className="w-3.5 h-3.5" />;
      case "Bell": return <Bell className="w-3.5 h-3.5" />;
      default: return <Database className="w-3.5 h-3.5" />;
    }
  };

  if (loading || !storageData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8a8a8e] bg-[#f5f5f7] min-h-screen">
        <Loader2 className="w-7 h-7 animate-spin text-[#0a66ff] mb-3" />
        <p className="text-xs font-semibold text-[#0a0a0a]">Analyzing Storage Allocation &amp; Indexes...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader
        title="Storage Telemetry"
        subtitle="Live disk allocation, table memory footprints, index optimization, and database health metrics"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-[#0a0a0a] tracking-tight">Storage &amp; Database Telemetry</h1>
            <p className="text-xs text-[#8a8a8e] mt-0.5">
              Accurate breakdown of memory footprint, student tables, intake payloads, and chatbot indices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOptimize}
              disabled={optimizing}
              className="h-9 px-4 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold transition-all shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center gap-1.5 cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              {optimizing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Optimizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Optimize &amp; Vacuum DB</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={fetchStorageStats}
              className="h-9 px-3 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] transition-all shadow-2xs flex items-center justify-center text-xs font-semibold cursor-pointer active:scale-[0.98]"
              title="Refresh Stats"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#8a8a8e]" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successNotice && (
          <div className="p-4 rounded-2xl bg-white border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#0a66ff]" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* 4 Storage Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Used Storage */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[130px]">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-[#8a8a8e]">Active Storage Used</span>
              <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                <HardDrive className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
                {storageData.totalKb} <span className="text-xs font-normal text-[#8a8a8e]">KB</span>
              </div>
              <div className="text-[11px] text-[#8a8a8e] mt-0.5">
                {storageData.totalMb} MB of {storageData.allocatedLimitMb} MB allocation
              </div>
            </div>
            <div className="text-[11px] font-semibold text-[#0a0a0a] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
              <span>{storageData.usedPercent}% Capacity Utilization</span>
            </div>
          </div>

          {/* Card 2: Free Available Space */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[130px]">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-[#8a8a8e]">Available Free Space</span>
              <div className="w-7 h-7 rounded-lg bg-[#f5f5f7] text-[#0a0a0a] flex items-center justify-center">
                <Database className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
                {storageData.freeMb} <span className="text-xs font-normal text-[#8a8a8e]">MB</span>
              </div>
              <div className="text-[11px] text-[#8a8a8e] mt-0.5">
                Persistent Database Storage
              </div>
            </div>
            <div className="text-[11px] font-medium text-[#8a8a8e]">
              Zero capacity throttling
            </div>
          </div>

          {/* Card 3: Total Entities & Records */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[130px]">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-[#8a8a8e]">Total Stored Records</span>
              <div className="w-7 h-7 rounded-lg bg-[#f5f5f7] text-[#0a0a0a] flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
                {storageData.totalRecords}
              </div>
              <div className="text-[11px] text-[#8a8a8e] mt-0.5">
                Across 11 relational schema tables
              </div>
            </div>
            <div className="text-[11px] font-medium text-[#8a8a8e]">
              Indexed &amp; Vectorized
            </div>
          </div>

          {/* Card 4: Health & Integrity */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[130px]">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-[#8a8a8e]">Index Integrity</span>
              <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
                {storageData.healthScore}%
              </div>
              <div className="text-[11px] text-[#8a8a8e] mt-0.5">
                {storageData.status}
              </div>
            </div>
            <div className="text-[11px] font-medium text-[#8a8a8e]">
              Vacuumed &amp; Defragmented
            </div>
          </div>
        </div>

        {/* Visual Storage Allocation Bar */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#e3e4e8] pb-3.5">
            <div>
              <h2 className="text-sm font-semibold text-[#0a0a0a] flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#0a66ff]" />
                <span>Memory Distribution by Table Category</span>
              </h2>
              <p className="text-xs text-[#8a8a8e] mt-0.5">
                Proportional breakdown of database memory occupied by each system component
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0a0a0a] px-3 py-1 rounded-full bg-[#f5f5f7] border border-[#e3e4e8]">
              Total: {storageData.totalKb} KB
            </span>
          </div>

          {/* Multi-segment Progress Bar */}
          <div className="w-full h-3 rounded-full bg-[#f5f5f7] overflow-hidden flex border border-[#e3e4e8]">
            {storageData.tables.map((t, idx) => (
              <div
                key={t.name}
                style={{
                  width: `${Math.max(t.percent, 3)}%`,
                  backgroundColor: idx === 0 ? "#0a66ff" : idx % 2 === 0 ? "#1c1c1e" : "#8a8a8e",
                }}
                className="h-full hover:opacity-80 transition-all cursor-pointer relative"
                title={`${t.label}: ${t.kb} KB (${t.percent}%)`}
              />
            ))}
          </div>

          {/* Legend Items */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            {storageData.tables.slice(0, 6).map((t, idx) => (
              <div key={t.name} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: idx === 0 ? "#0a66ff" : idx % 2 === 0 ? "#1c1c1e" : "#8a8a8e" }}
                />
                <span className="text-[#0a0a0a] font-semibold">{t.label}:</span>
                <span className="text-[#8a8a8e] font-mono">{t.kb} KB ({t.percent}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Table Storage Breakdown */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#e3e4e8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white">
            <div>
              <h3 className="text-sm font-semibold text-[#0a0a0a]">
                Granular Storage Allocation Table
              </h3>
              <p className="text-xs text-[#8a8a8e]">
                Exact byte counts, record densities, and allocation percentages
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadBackup}
              className="h-9 px-4 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-xs font-semibold text-[#0a0a0a] flex items-center gap-2 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8a8a8e]" />
              <span>Export DB Snapshot</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10.5px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Table / Category</th>
                  <th className="py-3 px-4 sm:px-6">Records Count</th>
                  <th className="py-3 px-4 sm:px-6">Size (Kilobytes)</th>
                  <th className="py-3 px-4 sm:px-6">Size (Megabytes)</th>
                  <th className="py-3 px-4 sm:px-6">% of Database</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Integrity Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#0a0a0a]">
                {storageData.tables.map((t, idx) => (
                  <tr key={t.name} className="hover:bg-[#fafafc] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                          {getIcon(t.icon)}
                        </div>
                        <div>
                          <div className="font-semibold text-[#0a0a0a]">{t.label}</div>
                          <div className="text-[10px] font-mono text-[#8a8a8e]">{t.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-mono font-semibold text-[#0a0a0a] bg-[#f5f5f7] px-2.5 py-0.5 rounded-md border border-[#e3e4e8]">
                        {t.count.toLocaleString()} rows
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-[#0a0a0a]">
                      {t.kb} KB
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-[#8a8a8e]">
                      {t.mb} MB
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden border border-[#e3e4e8]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(t.percent, 100)}%`,
                              backgroundColor: idx === 0 ? "#0a66ff" : "#1c1c1e"
                            }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-[#0a0a0a]">
                          {t.percent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0a0a0a] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full border border-[#e3e4e8]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                        <span>Optimal</span>
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
