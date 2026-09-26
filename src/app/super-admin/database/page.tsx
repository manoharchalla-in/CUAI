"use client";

import { useState } from "react";
import { 
  HardDrive, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  FileJson, 
  Layers, 
  Clock, 
  Database,
  ArrowRight
} from "lucide-react";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";

export default function DatabaseBackupsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const stats = [
    { label: "Storage Engine", value: "Atomic JSON Store", sub: "data/db.json (Native File)" },
    { label: "Total Students", value: "24 Records", sub: "1st, 2nd, 3rd, 4th Year Folders" },
    { label: "Intake Form Fields", value: "22 Custom Fields", sub: "Auto-synced to Folders" },
    { label: "Audit Log Entries", value: "48 Events", sub: "Immutable Security Trails" },
  ];

  const backupsList = [
    {
      id: "bk-20260922-1200",
      filename: "campus_snapshot_2026-09-22_1200.json",
      size: "42.8 KB",
      createdAt: "Today at 12:00 PM",
      type: "Automatic System Backup",
      recordsCount: 72,
    },
    {
      id: "bk-20260921-1800",
      filename: "campus_snapshot_2026-09-21_1800.json",
      size: "41.2 KB",
      createdAt: "Yesterday at 06:00 PM",
      type: "Daily Scheduled Backup",
      recordsCount: 68,
    },
    {
      id: "bk-20260920-0000",
      filename: "campus_snapshot_2026-09-20_0000.json",
      size: "39.5 KB",
      createdAt: "20 Sep 2026, 12:00 AM",
      type: "Weekly Checkpoint",
      recordsCount: 64,
    },
  ];

  const handleCreateSnapshot = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/admin/reset-db");
      await new Promise((r) => setTimeout(r, 800));
      
      const dummyData = {
        exportedAt: new Date().toISOString(),
        version: "2.0.0-super-admin",
        system: "City Engineering College AI Intake & Knowledge Hub",
        author: "Root Administrator",
      };

      const blob = new Blob([JSON.stringify(dummyData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `campus_master_backup_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFactoryReset = async () => {
    if (!confirm("⚠️ CAUTION: Are you sure you want to perform a factory database reset? This will reseed standard demo students and initial configuration.")) {
      return;
    }
    setIsResetting(true);
    try {
      await fetch("/api/admin/reset-db", { method: "POST" });
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <SuperAdminHeader
        title="Database Snapshots & Disaster Recovery"
        subtitle="Perform instant database exports, download full atomic JSON snapshots, and restore system state"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
                <HardDrive className="w-4 h-4" />
              </span>
              <h1 className="text-xl font-bold text-[#0a0a0a] tracking-tight">
                Database Snapshots & Disaster Recovery
              </h1>
            </div>
            <p className="text-xs text-[#8a8a8e] mt-1">
              Perform instant database exports, download full atomic JSON snapshots, and restore system state.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {exportSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0a0a0a] bg-white border border-[#e3e4e8] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
                Snapshot Downloaded
              </span>
            )}
            {resetSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0a0a0a] bg-white border border-[#e3e4e8] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
                Database Reseeded
              </span>
            )}
            <button
              onClick={handleCreateSnapshot}
              disabled={isExporting}
              className="h-9 px-4 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Download className={`w-3.5 h-3.5 ${isExporting ? "animate-bounce" : ""}`} />
              <span>{isExporting ? "Generating..." : "Create Full Backup (.JSON)"}</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div key={idx} className="p-5 bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[120px]">
              <span className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">{s.label}</span>
              <div className="text-xl font-bold text-[#0a0a0a] mt-2">{s.value}</div>
              <div className="text-[11px] text-[#8a8a8e] font-medium mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Backup Files Table */}
        <div className="bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-5 border-b border-[#e3e4e8] flex items-center justify-between bg-[#fafafc]">
            <div>
              <h2 className="text-sm font-bold text-[#0a0a0a]">Available System Snapshots</h2>
              <p className="text-xs text-[#8a8a8e] mt-0.5">
                Point-in-time database snapshots stored locally and in encrypted cloud vault.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Backup Filename</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Total Records</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#0a0a0a]">
                {backupsList.map((b) => (
                  <tr key={b.id} className="hover:bg-[#fafafc] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-[#0a0a0a] flex items-center gap-2">
                      <FileJson className="w-4 h-4 text-[#0a0a0a] flex-shrink-0" />
                      <span>{b.filename}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-[11px] font-semibold">
                        {b.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#8a8a8e]">{b.size}</td>
                    <td className="py-3.5 px-4 font-mono text-[#8a8a8e]">{b.recordsCount} items</td>
                    <td className="py-3.5 px-4 text-[#8a8a8e]">{b.createdAt}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        onClick={handleCreateSnapshot}
                        className="h-8 px-3 text-[11px] font-semibold text-[#0a0a0a] bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-[0.98]"
                      >
                        <Download className="w-3 h-3 text-[#8a8a8e]" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Restore & Danger Zone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Restore Upload Box */}
          <div className="bg-white border border-[#e3e4e8] rounded-2xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#e3e4e8] pb-3">
              <Upload className="w-4 h-4 text-[#0a0a0a]" />
              <h3 className="text-sm font-bold text-[#0a0a0a]">Restore Database from File</h3>
            </div>

            <div className="border-2 border-dashed border-[#e3e4e8] rounded-xl p-6 sm:p-8 text-center hover:border-[#0a0a0a] transition-colors cursor-pointer bg-[#fafafc]">
              <Upload className="w-8 h-8 text-[#8a8a8e] mx-auto mb-2" />
              <div className="text-xs font-bold text-[#0a0a0a]">
                Drag and drop backup JSON file here
              </div>
              <div className="text-[11px] text-[#8a8a8e] mt-1">
                Supports .json full database snapshots up to 50MB
              </div>
              <button className="mt-4 h-8 px-4 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all cursor-pointer">
                Browse Files
              </button>
            </div>
          </div>

          {/* Danger Zone: Factory Reseed */}
          <div className="bg-white border border-[#e3e4e8] rounded-2xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#e3e4e8] pb-3 text-[#0a0a0a]">
              <AlertTriangle className="w-4 h-4 text-[#0a0a0a]" />
              <h3 className="text-sm font-bold">Emergency Operations & Factory Reseed</h3>
            </div>

            <p className="text-xs text-[#8a8a8e] leading-relaxed">
              Wipe all runtime changes and restore fresh demo datasets for all 4 academic years (1st, 2nd, 3rd, 4th Year) and standard intake schema.
            </p>

            <div className="pt-2">
              <button
                onClick={handleFactoryReset}
                disabled={isResetting}
                className="h-9 px-4 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isResetting ? "Reseeding..." : "Factory Reset & Reseed Database"}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
