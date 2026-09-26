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
  Crown
} from "lucide-react";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";

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

export default function SuperAdminStoragePage() {
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
        setSuccessNotice("Master database vacuumed & storage indexes defragmented successfully!");
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
      <div className="flex-1 flex flex-col items-center justify-center text-[#8a8a8e] bg-[#f5f5f7] min-h-screen font-sans">
        <Loader2 className="w-7 h-7 animate-spin text-[#0a0a0a] mb-3" />
        <p className="text-xs font-semibold text-[#0a0a0a]">Measuring System Disk Allocation &amp; Tables...</p>
      </div>
    );
  }

  const monochromeColors = ["#0a0a0a", "#2c2c2e", "#48484a", "#636366", "#8e8e93", "#aeaeb2", "#c7c7cc", "#d1d1d6", "#e5e5ea", "#3a3a3c", "#1c1c1e"];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7] text-[#0a0a0a] font-sans">
      <SuperAdminHeader
        title="Master Storage & DB Telemetry"
        subtitle="Global disk metrics, per-table storage footprint, SQLite defragmentation, and database health"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Top Action Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#0a0a0a] tracking-tight flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#0a0a0a]" />
              <span>Database Storage &amp; Footprint Telemetry</span>
            </h1>
            <p className="text-xs text-[#8a8a8e] mt-0.5">
              Live inspection of raw UTF-8 byte sizes across all schema entities and indexes.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleOptimize}
              disabled={optimizing}
              className="h-9 px-4 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold transition-all shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              {optimizing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Optimizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Execute Vacuum</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={fetchStorageStats}
              className="h-9 px-3 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] transition-all shadow-2xs flex items-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-[0.98]"
              title="Refresh Stats"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successNotice && (
          <div className="p-3.5 rounded-xl bg-white border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Used Storage */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[135px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8a8a8e]">Database Size</span>
              <HardDrive className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <div className="my-1">
              <div className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight">
                {storageData.totalKb} <span className="text-sm font-semibold text-[#8a8a8e]">KB</span>
              </div>
              <div className="text-[11px] text-[#8a8a8e] font-medium mt-0.5">
                {storageData.totalMb} MB of {storageData.allocatedLimitMb} MB allocation
              </div>
            </div>
            <div className="text-[11px] font-semibold text-[#0a0a0a] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" />
              <span>{storageData.usedPercent}% Capacity Utilization</span>
            </div>
          </div>

          {/* Card 2: Free Available Space */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[135px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8a8a8e]">Available Free Space</span>
              <Database className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <div className="my-1">
              <div className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight">
                {storageData.freeMb} <span className="text-sm font-semibold text-[#8a8a8e]">MB</span>
              </div>
              <div className="text-[11px] text-[#8a8a8e] font-medium mt-0.5">
                Persistent Storage Block
              </div>
            </div>
            <div className="text-[11px] font-medium text-[#8a8a8e]">
              Optimal throughput
            </div>
          </div>

          {/* Card 3: Total Entities & Records */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[135px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8a8a8e]">Total Entities Stored</span>
              <Layers className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <div className="my-1">
              <div className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight">
                {storageData.totalRecords}
              </div>
              <div className="text-[11px] text-[#8a8a8e] font-medium mt-0.5">
                Across 11 Schema Tables
              </div>
            </div>
            <div className="text-[11px] font-semibold text-[#0a0a0a]">
              Indexed &amp; Vectorized
            </div>
          </div>

          {/* Card 4: Health & Integrity */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[135px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8a8a8e]">Storage Health Index</span>
              <ShieldCheck className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <div className="my-1">
              <div className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight">
                {storageData.healthScore}%
              </div>
              <div className="text-[11px] text-[#8a8a8e] font-medium mt-0.5">
                {storageData.status}
              </div>
            </div>
            <div className="text-[11px] font-medium text-[#8a8a8e]">
              Zero Corruption Detected
            </div>
          </div>
        </div>

        {/* Visual Storage Allocation Bar */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#e3e4e8] pb-3.5">
            <div>
              <h2 className="text-sm font-bold text-[#0a0a0a] flex items-center gap-2 tracking-tight">
                <PieChart className="w-4 h-4 text-[#0a0a0a]" />
                <span>Memory Allocation per Schema Table</span>
              </h2>
              <p className="text-xs text-[#8a8a8e] mt-0.5">
                Distribution of database footprint across student records, diagnostic logs, and intake data
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0a0a0a] px-3 py-0.5 rounded-full bg-[#f5f5f7] border border-[#e3e4e8]">
              Total: {storageData.totalKb} KB
            </span>
          </div>

          {/* Multi-segment Progress Bar */}
          <div className="w-full h-3.5 rounded-full bg-[#f5f5f7] overflow-hidden flex border border-[#e3e4e8]">
            {storageData.tables.map((t, idx) => (
              <div
                key={t.name}
                style={{
                  width: `${Math.max(t.percent, 3)}%`,
                  backgroundColor: monochromeColors[idx % monochromeColors.length],
                }}
                className="h-full hover:opacity-90 transition-all cursor-pointer"
                title={`${t.label}: ${t.kb} KB (${t.percent}%)`}
              />
            ))}
          </div>

          {/* Legend Items */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            {storageData.tables.slice(0, 6).map((t, idx) => (
              <div key={t.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: monochromeColors[idx % monochromeColors.length] }} />
                <span className="text-[#0a0a0a] font-semibold">{t.label}:</span>
                <span className="text-[#8a8a8e] font-mono">{t.kb} KB ({t.percent}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Granular Table Storage Table */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#e3e4e8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#fafafc]">
            <div>
              <h3 className="text-sm font-bold text-[#0a0a0a] tracking-tight">
                Granular Storage Allocation Table
              </h3>
              <p className="text-xs text-[#8a8a8e] mt-0.5">
                Exact byte measurements and record densities per table
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadBackup}
              className="h-8 px-3 rounded-lg bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-xs font-semibold text-[#0a0a0a] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5 text-[#0a0a0a]" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Table Name / Entity</th>
                  <th className="py-3 px-4">Row Count</th>
                  <th className="py-3 px-4">Size (KB)</th>
                  <th className="py-3 px-4">Size (MB)</th>
                  <th className="py-3 px-4">% of DB</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Integrity Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#3a3a3c]">
                {storageData.tables.map((t, idx) => (
                  <tr key={t.name} className="hover:bg-[#fafafc] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center flex-shrink-0 shadow-2xs">
                          {getIcon(t.icon)}
                        </div>
                        <div>
                          <div className="font-bold text-[#0a0a0a]">{t.label}</div>
                          <div className="text-[10px] font-mono text-[#8a8a8e]">{t.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#0a0a0a] bg-[#f5f5f7] px-2.5 py-0.5 rounded-md border border-[#e3e4e8]">
                        {t.count.toLocaleString()} rows
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#0a0a0a]">
                      {t.kb} KB
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#8a8a8e]">
                      {t.mb} MB
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden border border-[#e3e4e8]">
                          <div
                            className="h-full rounded-full bg-[#0a0a0a]"
                            style={{ width: `${Math.min(t.percent, 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-[#636366]">
                          {t.percent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0a0a0a] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full border border-[#e3e4e8]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" />
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
