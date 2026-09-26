"use client";

import { useState, useEffect } from "react";
import { 
  Database, 
  HardDrive, 
  Cloud, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Loader2, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  Upload, 
  ExternalLink, 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  Save, 
  ArrowUpRight 
} from "lucide-react";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";

interface BucketInfo {
  id: string;
  name: string;
  public: boolean;
  created_at: string;
  file_size_limit: number;
}

interface FileObject {
  id: string;
  bucket: string;
  name: string;
  path: string;
  size: number;
  formattedSize: string;
  contentType: string;
  created_at: string;
  publicUrl: string;
}

interface CategoryBreakdown {
  name: string;
  count: number;
  bytes: number;
  formattedSize: string;
  color: string;
}

interface SupabaseData {
  success: boolean;
  status: string;
  isConnected: boolean;
  latencyMs: number;
  projectId: string;
  projectUrl: string;
  bucketName: string;
  errorMessage?: string;
  storage: {
    totalBytesUsed: number;
    usedMb: string;
    totalLimitBytes: number;
    limitMb: string;
    freeBytes: number;
    freeMb: string;
    usedPercent: number;
    totalFilesCount: number;
  };
  categories: CategoryBreakdown[];
  buckets: BucketInfo[];
  files: FileObject[];
  apiKeys: {
    projectUrl: string;
    anonKey: string;
    serviceKey: string;
    bucketName: string;
  };
}

export default function SupabaseStorageAdminPage() {
  const [data, setData] = useState<SupabaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showAnonKey, setShowAnonKey] = useState(false);
  const [showServiceKey, setShowServiceKey] = useState(false);
  const [successNotice, setSuccessNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");
  const [selectedBucket, setSelectedBucket] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);

  // Edit Credentials Modal State
  const [isEditKeysOpen, setIsEditKeysOpen] = useState(false);
  const [editUrl, setEditUrl] = useState("");
  const [editAnon, setEditAnon] = useState("");
  const [editService, setEditService] = useState("");
  const [editBucket, setEditBucket] = useState("");
  const [savingKeys, setSavingKeys] = useState(false);

  // New Bucket Modal State
  const [isNewBucketOpen, setIsNewBucketOpen] = useState(false);
  const [newBucketName, setNewBucketName] = useState("");
  const [newBucketPublic, setNewBucketPublic] = useState(true);
  const [creatingBucket, setCreatingBucket] = useState(false);

  useEffect(() => {
    fetchSupabaseStatus();
  }, []);

  const fetchSupabaseStatus = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/super-admin/supabase");
      const json = await res.json();
      if (json.success) {
        setData(json);
        setEditUrl(json.apiKeys.projectUrl || "");
        setEditAnon(json.apiKeys.anonKey || "");
        setEditService(json.apiKeys.serviceKey || "");
        setEditBucket(json.apiKeys.bucketName || "student-assets");
      } else {
        setErrorNotice(json.error || "Failed to load Supabase metrics");
      }
    } catch (err: any) {
      console.error("Fetch Supabase error:", err);
      setErrorNotice("Error connecting to Supabase API");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingKeys(true);
      const res = await fetch("/api/super-admin/supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_keys",
          projectUrl: editUrl,
          anonKey: editAnon,
          serviceKey: editService,
          bucketName: editBucket
        })
      });
      const json = await res.json();
      if (json.success) {
        setSuccessNotice("Supabase credentials updated successfully!");
        setIsEditKeysOpen(false);
        fetchSupabaseStatus();
      } else {
        setErrorNotice(json.error || "Failed to update keys");
      }
    } catch (e: any) {
      setErrorNotice(e.message || "Failed to save keys");
    } finally {
      setSavingKeys(false);
    }
  };

  const handleCreateBucket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBucketName.trim()) return;
    try {
      setCreatingBucket(true);
      const res = await fetch("/api/super-admin/supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_bucket",
          name: newBucketName,
          isPublic: newBucketPublic
        })
      });
      const json = await res.json();
      if (json.success) {
        setSuccessNotice(`Bucket "${newBucketName}" created successfully!`);
        setIsNewBucketOpen(false);
        setNewBucketName("");
        fetchSupabaseStatus();
      } else {
        setErrorNotice(json.error || "Failed to create bucket");
      }
    } catch (e: any) {
      setErrorNotice(e.message || "Failed to create bucket");
    } finally {
      setCreatingBucket(false);
    }
  };

  const handleDeleteFile = async (bucket: string, filePath: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${filePath}" from Supabase Storage?`)) {
      return;
    }
    try {
      setDeletingPath(filePath);
      const res = await fetch("/api/super-admin/supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_file",
          bucket,
          path: filePath
        })
      });
      const json = await res.json();
      if (json.success) {
        setSuccessNotice(`File "${filePath}" deleted from Supabase Storage.`);
        fetchSupabaseStatus();
      } else {
        setErrorNotice(json.error || "Failed to delete file");
      }
    } catch (e: any) {
      setErrorNotice(e.message || "Delete error");
    } finally {
      setDeletingPath(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "manual-uploads");

      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        setSuccessNotice(`Successfully uploaded "${file.name}" to Supabase Storage!`);
        fetchSupabaseStatus();
      } else {
        setErrorNotice(json.error || "Upload failed");
      }
    } catch (e: any) {
      setErrorNotice(e.message || "Upload failed");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const filteredFiles = (data?.files || []).filter((f) => {
    const matchesBucket = selectedBucket === "all" || f.bucket === selectedBucket;
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.path.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBucket && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8a8a8e] bg-[#f5f5f7] min-h-screen font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a0a0a] mb-3" />
        <p className="text-xs font-semibold text-[#0a0a0a]">Connecting to Supabase Cloud Storage...</p>
      </div>
    );
  }

  const storage = data?.storage;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7] text-[#0a0a0a] font-sans antialiased">
      <SuperAdminHeader
        title="Supabase Cloud Storage &amp; Database Hub"
        subtitle="Live storage quotas, file browser, bucket management, and API credentials vault"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Success / Error Alerts */}
        {successNotice && (
          <div className="p-3.5 rounded-xl bg-white border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              <span>{successNotice}</span>
            </div>
            <button onClick={() => setSuccessNotice("")} className="text-[#8a8a8e] hover:text-[#0a0a0a] text-xs">
              Dismiss
            </button>
          </div>
        )}

        {errorNotice && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{errorNotice}</span>
            </div>
            <button onClick={() => setErrorNotice("")} className="text-red-600 hover:text-red-900 text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Top Connection Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#0a0a0a] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold tracking-tight text-[#0a0a0a]">
                  Supabase Project: <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[#f5f5f7] border border-[#e3e4e8]">{data?.projectId}</span>
                </h2>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  data?.isConnected 
                    ? "bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]" 
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${data?.isConnected ? "bg-[#10b981] animate-pulse" : "bg-red-500"}`} />
                  {data?.status || "Unknown"}
                </span>
              </div>
              <p className="text-xs text-[#8a8a8e] mt-1 max-w-2xl font-mono truncate">
                {data?.projectUrl || "No URL configured"} &bull; Ping Latency: <strong>{data?.latencyMs || 0}ms</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={fetchSupabaseStatus}
              disabled={refreshing}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.98] disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Syncing..." : "Sync Live Storage"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditKeysOpen(true)}
              className="h-9 px-3.5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Manage Keys</span>
            </button>
          </div>
        </div>

        {/* 1. Storage Quotas & Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Storage Used */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-2">
            <div className="flex items-center justify-between text-[#8a8a8e] text-xs font-medium">
              <span>Storage Used</span>
              <HardDrive className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
              {storage?.usedMb || "0 MB"}
            </div>
            <div className="text-[11px] text-[#8a8a8e]">
              Across {storage?.totalFilesCount || 0} files in {data?.buckets.length || 0} buckets
            </div>
          </div>

          {/* Card 2: Storage Remaining */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-2">
            <div className="flex items-center justify-between text-[#8a8a8e] text-xs font-medium">
              <span>Remaining / Free</span>
              <Cloud className="w-4 h-4 text-[#10b981]" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
              {storage?.freeMb || "1024 MB"}
            </div>
            <div className="text-[11px] text-[#10b981] font-semibold flex items-center gap-1">
              <span>{(100 - (storage?.usedPercent || 0)).toFixed(2)}% Available Free</span>
            </div>
          </div>

          {/* Card 3: Free Tier Capacity */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-2">
            <div className="flex items-center justify-between text-[#8a8a8e] text-xs font-medium">
              <span>Total Plan Quota</span>
              <ShieldCheck className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
              1.00 GB
            </div>
            <div className="text-[11px] text-[#8a8a8e]">
              Supabase Free Tier (1,024 MB)
            </div>
          </div>

          {/* Card 4: Total Files Stored */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-2">
            <div className="flex items-center justify-between text-[#8a8a8e] text-xs font-medium">
              <span>Stored Objects</span>
              <Folder className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
              {storage?.totalFilesCount || 0}
            </div>
            <div className="text-[11px] text-[#8a8a8e]">
              Primary bucket: <strong className="font-mono text-[#0a0a0a]">{data?.bucketName}</strong>
            </div>
          </div>
        </div>

        {/* Storage Capacity Visual Progress Bar */}
        <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[#0a0a0a]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#0a0a0a]" />
              <span>Storage Quota Utilization</span>
            </div>
            <span className="font-mono text-[#8a8a8e]">
              {storage?.usedMb} used of 1,024 MB ({storage?.usedPercent}%)
            </span>
          </div>

          <div className="w-full h-3.5 bg-[#f5f5f7] rounded-full overflow-hidden border border-[#e3e4e8] flex">
            <div
              style={{ width: `${Math.max(1, storage?.usedPercent || 0)}%` }}
              className="h-full bg-gradient-to-r from-[#1c1c1e] to-[#0a0a0a] rounded-full transition-all duration-500"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8a8a8e] pt-1">
            <span>0 MB</span>
            <span>256 MB</span>
            <span>512 MB</span>
            <span>768 MB</span>
            <span>1,024 MB (1 GB Max)</span>
          </div>
        </div>

        {/* 2. Categories Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.categories.map((cat) => (
            <div key={cat.name} className="bg-white p-4 rounded-xl border border-[#e3e4e8] space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#0a0a0a]">{cat.name}</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              </div>
              <div className="text-lg font-bold text-[#0a0a0a]">{cat.formattedSize}</div>
              <div className="text-[11px] text-[#8a8a8e]">{cat.count} files</div>
            </div>
          ))}
        </div>

        {/* 3. Live Storage Explorer & Bucket Browser */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#e3e4e8] pb-3">
            <div>
              <h3 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider flex items-center gap-2">
                <Folder className="w-4 h-4 text-[#0a0a0a]" />
                <span>Supabase Storage Object Browser</span>
              </h3>
              <p className="text-xs text-[#8a8a8e] mt-0.5">
                Browse, preview, copy CDN links, or delete files stored in your Supabase buckets
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Upload Test File Button */}
              <label className="h-9 px-3 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs">
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{isUploading ? "Uploading..." : "Upload File"}</span>
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
              </label>

              {/* Create Bucket Button */}
              <button
                type="button"
                onClick={() => setIsNewBucketOpen(true)}
                className="h-9 px-3 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Bucket</span>
              </button>
            </div>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files by name or path..."
                className="w-full h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedBucket}
                onChange={(e) => setSelectedBucket(e.target.value)}
                className="h-10 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs font-medium text-[#0a0a0a] focus:bg-white focus:outline-none focus:border-[#0a0a0a] cursor-pointer"
              >
                <option value="all">All Buckets ({data?.buckets.length})</option>
                {data?.buckets.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name} {b.public ? "(Public)" : "(Private)"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Files List Table */}
          <div className="border border-[#e3e4e8] rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#fafafc] border-b border-[#e3e4e8] text-[10px] font-semibold text-[#8a8a8e] uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Object / File Name</th>
                  <th className="py-3 px-4">Bucket</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">Uploaded</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#3a3a3c]">
                {filteredFiles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#8a8a8e]">
                      <Folder className="w-7 h-7 mx-auto mb-2 text-[#8a8a8e]" />
                      <p className="font-semibold text-[#0a0a0a]">No files in this bucket yet</p>
                      <p className="text-[11px] text-[#8a8a8e] mt-0.5">Upload a test file or intake a student form with photo</p>
                    </td>
                  </tr>
                ) : (
                  filteredFiles.map((file) => {
                    const isDeleting = deletingPath === file.path;
                    const isImage = file.contentType.startsWith("image/");

                    return (
                      <tr key={file.id} className="transition-colors hover:bg-[#fafafc]">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center shrink-0 overflow-hidden">
                              {isImage ? (
                                <img src={file.publicUrl} alt={file.name} className="w-full h-full object-cover" />
                              ) : (
                                <FileText className="w-4 h-4 text-[#8a8a8e]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-[#0a0a0a] truncate max-w-[200px] sm:max-w-[320px]">
                                {file.name}
                              </div>
                              <div className="text-[10px] text-[#8a8a8e] font-mono truncate max-w-[200px] sm:max-w-[320px]">
                                {file.path}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] font-mono">
                            {file.bucket}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs">
                          {file.formattedSize}
                        </td>

                        <td className="py-3.5 px-4 text-[#8a8a8e] text-[11px]">
                          {new Date(file.created_at).toLocaleDateString()}
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Copy Public CDN Link */}
                            <button
                              type="button"
                              onClick={() => handleCopy(file.publicUrl, `file-${file.id}`)}
                              className="p-1.5 rounded-lg text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] transition-all"
                              title="Copy Public CDN URL"
                            >
                              {copiedKey === `file-${file.id}` ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            {/* View in new tab */}
                            <a
                              href={file.publicUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] transition-all"
                              title="Open in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteFile(file.bucket, file.path)}
                              disabled={isDeleting}
                              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer"
                              title="Delete from Supabase"
                            >
                              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Supabase Credentials & API Vault */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e3e4e8] pb-3">
            <h3 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0a0a0a]" />
              <span>Supabase Cloud Vault &amp; API Keys</span>
            </h3>
            <span className="text-[11px] text-[#8a8a8e]">Encrypted in .env.local</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Project URL */}
            <div className="p-3.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] space-y-1.5">
              <div className="flex items-center justify-between text-[#8a8a8e] font-sans font-semibold text-[11px]">
                <span>NEXT_PUBLIC_SUPABASE_URL</span>
                <button
                  type="button"
                  onClick={() => handleCopy(data?.apiKeys.projectUrl || "", "url")}
                  className="text-[#0a0a0a] hover:underline flex items-center gap-1"
                >
                  {copiedKey === "url" ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="font-bold text-[#0a0a0a] truncate">{data?.apiKeys.projectUrl}</div>
            </div>

            {/* Storage Bucket */}
            <div className="p-3.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] space-y-1.5">
              <div className="flex items-center justify-between text-[#8a8a8e] font-sans font-semibold text-[11px]">
                <span>NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET</span>
                <button
                  type="button"
                  onClick={() => handleCopy(data?.apiKeys.bucketName || "", "bname")}
                  className="text-[#0a0a0a] hover:underline flex items-center gap-1"
                >
                  {copiedKey === "bname" ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="font-bold text-[#0a0a0a] truncate">{data?.apiKeys.bucketName}</div>
            </div>

            {/* Anon Public Key */}
            <div className="p-3.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] space-y-1.5">
              <div className="flex items-center justify-between text-[#8a8a8e] font-sans font-semibold text-[11px]">
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY (Public)</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setShowAnonKey(!showAnonKey)} className="text-[#0a0a0a]">
                    {showAnonKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(data?.apiKeys.anonKey || "", "anon")}
                    className="text-[#0a0a0a] hover:underline flex items-center gap-1"
                  >
                    {copiedKey === "anon" ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>
              <div className="font-bold text-[#0a0a0a] truncate">
                {showAnonKey ? data?.apiKeys.anonKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
              </div>
            </div>

            {/* Service Role Key */}
            <div className="p-3.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] space-y-1.5">
              <div className="flex items-center justify-between text-[#8a8a8e] font-sans font-semibold text-[11px]">
                <span>SUPABASE_SERVICE_ROLE_KEY (Secret Admin)</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setShowServiceKey(!showServiceKey)} className="text-[#0a0a0a]">
                    {showServiceKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(data?.apiKeys.serviceKey || "", "service")}
                    className="text-[#0a0a0a] hover:underline flex items-center gap-1"
                  >
                    {copiedKey === "service" ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>
              <div className="font-bold text-[#0a0a0a] truncate">
                {showServiceKey ? data?.apiKeys.serviceKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Credentials Modal */}
      {isEditKeysOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-[#e3e4e8] shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#e3e4e8] pb-3">
              <h3 className="font-bold text-sm text-[#0a0a0a]">Update Supabase API Credentials</h3>
              <button type="button" onClick={() => setIsEditKeysOpen(false)} className="text-[#8a8a8e] hover:text-[#0a0a0a]">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveKeys} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1">Project URL</label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="https://xyz.supabase.co"
                  className="w-full h-9 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl font-mono text-[#0a0a0a] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1">Anon Public Key</label>
                <input
                  type="text"
                  value={editAnon}
                  onChange={(e) => setEditAnon(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full h-9 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl font-mono text-[#0a0a0a] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1">Service Role Secret Key</label>
                <input
                  type="text"
                  value={editService}
                  onChange={(e) => setEditService(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full h-9 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl font-mono text-[#0a0a0a] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1">Default Storage Bucket</label>
                <input
                  type="text"
                  value={editBucket}
                  onChange={(e) => setEditBucket(e.target.value)}
                  placeholder="student-assets"
                  className="w-full h-9 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl font-mono text-[#0a0a0a] focus:bg-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditKeysOpen(false)}
                  className="h-9 px-4 rounded-xl border border-[#e3e4e8] text-[#0a0a0a] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingKeys}
                  className="h-9 px-4 bg-[#0a0a0a] text-white rounded-xl font-semibold flex items-center gap-1.5"
                >
                  {savingKeys ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Bucket Modal */}
      {isNewBucketOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-[#e3e4e8] shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#e3e4e8] pb-3">
              <h3 className="font-bold text-sm text-[#0a0a0a]">Create New Storage Bucket</h3>
              <button type="button" onClick={() => setIsNewBucketOpen(false)} className="text-[#8a8a8e] hover:text-[#0a0a0a]">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBucket} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1">Bucket Name</label>
                <input
                  type="text"
                  value={newBucketName}
                  onChange={(e) => setNewBucketName(e.target.value)}
                  placeholder="e.g. certificates or resumes"
                  className="w-full h-9 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl font-mono text-[#0a0a0a] focus:bg-white"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="bucketPublic"
                  checked={newBucketPublic}
                  onChange={(e) => setNewBucketPublic(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="bucketPublic" className="font-medium text-[#0a0a0a] cursor-pointer">
                  Public Bucket (Allows public read access for student images &amp; files)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewBucketOpen(false)}
                  className="h-9 px-4 rounded-xl border border-[#e3e4e8] text-[#0a0a0a] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingBucket}
                  className="h-9 px-4 bg-[#0a0a0a] text-white rounded-xl font-semibold flex items-center gap-1.5"
                >
                  {creatingBucket ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Create Bucket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
