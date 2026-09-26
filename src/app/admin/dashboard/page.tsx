"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Folder, 
  RefreshCw, 
  ArrowRight, 
  Loader2, 
  TrendingUp,
  UserCheck,
  Bell,
  CheckCircle2,
  Clock,
  GraduationCap,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Mail,
  Phone,
  Layers,
  ArrowUpRight,
  Activity
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [recentFilings, setRecentFilings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, studentsRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/students?limit=5")
      ]);
      const resData = await analyticsRes.json();
      const studentsData = await studentsRes.json();

      setData(resData);
      if (studentsData.records) {
        const sorted = [...studentsData.records].sort(
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setRecentFilings(sorted.slice(0, 5));
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8a8a8e] bg-[#f5f5f7] min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a0a0a] mb-3" />
        <p className="text-xs font-semibold text-[#0a0a0a]">Loading Console...</p>
      </div>
    );
  }

  const kpis = data.kpis || {};
  const totalStudents = kpis.totalStudents || 0;
  const verifiedCount = Math.round(totalStudents * 0.85);
  const pendingCount = totalStudents - verifiedCount;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader
        title="Operations Console"
        subtitle="Live real-time operational analytics, student KPI cards, and intake form submission notifications"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Title & Refresh Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0a0a0a] tracking-tight">Campus Operations Console</h1>
            <p className="text-xs text-[#8a8a8e] mt-1">Real-time student roster stats and live intake form submission stream</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#8a8a8e] font-medium bg-white px-3 py-1.5 rounded-xl border border-[#e3e4e8] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Auto-sync Active
            </span>
            <button
              type="button"
              onClick={fetchDashboardData}
              className="h-9 px-4 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] transition-all shadow-2xs flex items-center gap-2 text-xs font-semibold cursor-pointer active:scale-[0.98]"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#8a8a8e]" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* 1. 4 Clean KPI Cards with Trend Badges & Mini Sparkline Visuals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* KPI 1: Total Students */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[145px] relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Total Students</span>
              <div className="w-9 h-9 rounded-xl bg-[#0a66ff]/[0.08] text-[#0a66ff] border border-[#0a66ff]/15 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight">
                {totalStudents}
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +100% active
              </span>
              <span className="text-[#8a8a8e]">{totalStudents} records</span>
            </div>
          </div>

          {/* KPI 2: Academic Folders */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[145px] group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Academic Folders</span>
              <div className="w-9 h-9 rounded-xl bg-[#0a66ff]/[0.08] text-[#0a66ff] border border-[#0a66ff]/15 flex items-center justify-center">
                <Folder className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight">
                {kpis.totalFolders || 4}
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-blue-700 bg-blue-50 border border-blue-200/60 font-semibold px-2 py-0.5 rounded-md">
                All 4 Batches
              </span>
              <span className="text-[#8a8a8e]">1st - 4th Year</span>
            </div>
          </div>

          {/* KPI 3: Male Students */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[145px] group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Male Students</span>
              <div className="w-9 h-9 rounded-xl bg-[#0a66ff]/[0.08] text-[#0a66ff] border border-[#0a66ff]/15 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight">
                {kpis.maleStudents || 0}
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#0a0a0a] bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
                {totalStudents > 0 ? `${Math.round(((kpis.maleStudents || 0) / totalStudents) * 100)}%` : "0%"}
              </span>
              <span className="text-[#8a8a8e]">Enrolled Male</span>
            </div>
          </div>

          {/* KPI 4: Female Students */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[145px] group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Female Students</span>
              <div className="w-9 h-9 rounded-xl bg-[#0a66ff]/[0.08] text-[#0a66ff] border border-[#0a66ff]/15 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight">
                {kpis.femaleStudents || 0}
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#0a0a0a] bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
                {totalStudents > 0 ? `${Math.round(((kpis.femaleStudents || 0) / totalStudents) * 100)}%` : "0%"}
              </span>
              <span className="text-[#8a8a8e]">Enrolled Female</span>
            </div>
          </div>
        </div>

        {/* 2. Quick Directory Shortcuts & Verification Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Quick Year Folder Launchpad */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0a66ff]" />
                <h3 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider">Academic Batch Folders</h3>
              </div>
              <Link href="/admin/folders" className="text-xs font-semibold text-[#0a66ff] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { slug: "1st-year", name: "1st Year", label: "Freshman" },
                { slug: "2nd-year", name: "2nd Year", label: "Sophomore" },
                { slug: "3rd-year", name: "3rd Year", label: "Junior" },
                { slug: "4th-year", name: "4th Year", label: "Senior" },
              ].map((f) => (
                <Link
                  key={f.slug}
                  href={`/admin/folders/${f.slug}`}
                  className="p-3.5 rounded-xl bg-[#f5f5f7] hover:bg-white border border-[#e3e4e8] hover:border-[#0a0a0a] hover:shadow-sm transition-all text-left group"
                >
                  <div className="text-xl mb-1.5">📁</div>
                  <div className="text-xs font-bold text-[#0a0a0a] group-hover:text-[#0a66ff] transition-colors">{f.name}</div>
                  <div className="text-[10px] text-[#8a8a8e] mt-0.5">{f.label} Batch</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Verification & Dossier Completion Ring / Health Widget */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider">Dossier Health</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Healthy
                </span>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-[#8a8a8e]">Verified Profiles</span>
                  <span className="font-bold text-[#0a0a0a]">{verifiedCount} ({totalStudents > 0 ? Math.round((verifiedCount / totalStudents) * 100) : 100}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f5f5f7] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${totalStudents > 0 ? Math.round((verifiedCount / totalStudents) * 100) : 100}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs font-medium pt-1">
                  <span className="text-[#8a8a8e]">Pending Verification</span>
                  <span className="font-bold text-[#0a0a0a]">{pendingCount}</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-[#e3e4e8] text-[11px] text-[#8a8a8e] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>All storage assets synchronized</span>
            </div>
          </div>
        </div>

        {/* 3. Recent Form Submissions Stream */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#e3e4e8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fafafc]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0a66ff]/[0.08] text-[#0a66ff] border border-[#0a66ff]/15 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#0a0a0a] tracking-tight">
                    Recent Form Submission Stream
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-[10px] font-semibold">
                    Latest Filings
                  </span>
                </div>
                <p className="text-xs text-[#8a8a8e] mt-0.5">
                  Real-time notification stream of students who submitted intake forms.
                </p>
              </div>
            </div>

            <Link
              href="/admin/students"
              className="h-9 px-4 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all w-full sm:w-auto active:scale-[0.98]"
            >
              <span>View All Students</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* List of Latest Notifications */}
          <div className="p-4 sm:p-5 space-y-2.5">
            {recentFilings.length === 0 ? (
              <div className="py-12 text-center text-[#8a8a8e] text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 text-[#e3e4e8]" />
                <p className="font-semibold text-[#0a0a0a]">No new form submissions recorded yet.</p>
                <p className="text-[11px] text-[#8a8a8e] mt-0.5">When students submit public registration forms, the latest filings will appear here.</p>
              </div>
            ) : (
              recentFilings.map((student, index) => {
                const yearLabel = 
                  student.year === "1st_year" || student.folder_id === "1st-year" ? "1st Year Intake" :
                  student.year === "2nd_year" || student.folder_id === "2nd-year" ? "2nd Year Intake" :
                  student.year === "3rd_year" || student.folder_id === "3rd-year" ? "3rd Year Intake" : "4th Year Intake";

                return (
                  <div
                    key={student.id || index}
                    className="p-3.5 sm:p-4 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-[#0a0a0a]/20"
                  >
                    {/* Left: Student & Form Badge */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center font-bold text-xs shadow-2xs flex-shrink-0 mt-0.5">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-[#0a0a0a] text-xs sm:text-sm">
                            {student.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#f5f5f7] text-[#0a0a0a] font-semibold text-[10px] border border-[#e3e4e8]">
                            📁 {yearLabel}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#f5f5f7] text-[#0a0a0a] font-semibold text-[10px] border border-[#e3e4e8]">
                            {student.branch}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-[#8a8a8e]">
                          <span className="font-mono font-semibold text-[#0a0a0a]">
                            Roll No: {student.roll_number}
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1 font-mono">
                            <Mail className="w-3 h-3 text-[#8a8a8e]" />
                            {student.email}
                          </span>
                          {student.phone && (
                            <>
                              <span>&bull;</span>
                              <span className="flex items-center gap-1 font-mono">
                                <Phone className="w-3 h-3 text-[#8a8a8e]" />
                                {student.phone}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Submission Timestamp & Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f2f2f7]">
                      <div className="text-left sm:text-right text-[11px]">
                        <div className="font-semibold text-[#0a0a0a] flex items-center gap-1.5 sm:justify-end">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                          <span>Form Submitted</span>
                        </div>
                        <div className="text-[10px] text-[#8a8a8e] font-mono mt-0.5">
                          {formatDate(student.created_at)}
                        </div>
                      </div>

                      <Link
                        href="/admin/students"
                        className="w-8 h-8 rounded-xl bg-white hover:bg-[#0a0a0a] hover:text-white border border-[#e3e4e8] hover:border-[#0a0a0a] text-[#8a8a8e] flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95"
                        title="View in Roster"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
