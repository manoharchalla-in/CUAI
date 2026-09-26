"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Loader2, 
  GraduationCap, 
  Folder, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  ExternalLink,
  Award,
  Bus,
  Home,
  User,
  Hash,
  Layers,
  Heart,
  Calendar,
  Briefcase
} from "lucide-react";
import StudentModal from "@/components/admin/StudentModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import type { StudentRecord } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";

interface StudentRosterViewProps {
  panelType: "admin" | "superadmin";
}

export default function StudentRosterView({ panelType }: StudentRosterViewProps) {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Field Filters
  const [yearFilter, setYearFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [admissionFilter, setAdmissionFilter] = useState("all");
  const [accommodationFilter, setAccommodationFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<StudentRecord | null>(null);
  const [inspectStudent, setInspectStudent] = useState<StudentRecord | null>(null);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<StudentRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/students?limit=200");
      const data = await res.json();
      if (data.records) {
        setStudents(data.records);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSaveStudent = async (studentData: any) => {
    if (editStudent) {
      const res = await fetch(`/api/admin/students/${editStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update student");
      }
      showSuccess(`Student "${studentData.name}" updated successfully!`);
      setEditStudent(null);
    } else {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add student");
      }
      showSuccess(`Student "${studentData.name}" added successfully!`);
      setIsAddModalOpen(false);
    }
    fetchStudents();
  };

  const handleDelete = async () => {
    if (!deleteConfirmStudent) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/students/${deleteConfirmStudent.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete student");
      showSuccess(`Student "${deleteConfirmStudent.name}" removed from database`);
      setDeleteConfirmStudent(null);
      fetchStudents();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = [
      "Roll Number", "Name", "Year", "Branch", "Section", "Email", "Phone",
      "Admission Type", "Father Name", "Mother Name", "Blood Group", "College",
      "Accommodation", "Transport", "Created At"
    ];
    const rows = filteredStudents.map((s) => [
      `"${s.roll_number}"`,
      `"${s.name}"`,
      `"${s.year}"`,
      `"${s.branch}"`,
      `"${s.section || ''}"`,
      `"${s.email}"`,
      `"${s.phone || ''}"`,
      `"${s.admission_type || ''}"`,
      `"${s.father_name || ''}"`,
      `"${s.mother_name || ''}"`,
      `"${s.blood_group || ''}"`,
      `"${s.college || ''}"`,
      `"${s.accommodation_type || ''}"`,
      `"${s.mode_of_transport || ''}"`,
      `"${s.created_at}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registered_students_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Comprehensive Multi-Field Filter & Search
  const filteredStudents = students.filter((s) => {
    // 1. Search Query across all 20+ fields
    if (search.trim()) {
      const tokens = search.toLowerCase().trim().split(/\s+/);
      const searchTarget = `
        ${s.name} 
        ${s.roll_number} 
        ${s.branch} 
        ${s.year} 
        ${s.college} 
        ${s.skills || ''} 
        ${s.email} 
        ${s.phone || ''} 
        ${s.father_name || ''} 
        ${s.mother_name || ''} 
        ${s.blood_group || ''} 
        ${s.hobbies || ''} 
        ${s.sports || ''} 
        ${s.achievements || ''} 
        ${s.extracurricular || ''} 
        ${s.admission_type || ''} 
        ${s.reservation_category || ''} 
        ${s.accommodation_type || ''} 
        ${s.mode_of_transport || ''} 
        ${s.permanent_address || ''} 
        ${s.present_address || ''} 
        ${s.previous_course || ''}
      `.toLowerCase();

      const matchesTokens = tokens.every(token => searchTarget.includes(token));
      if (!matchesTokens) return false;
    }

    // 2. Year Filter
    if (yearFilter !== "all") {
      const targetSlug = yearFilter;
      const matchesYear = s.year === targetSlug || s.folder_id === targetSlug || s.folder_id.includes(targetSlug.replace("-", "_"));
      if (!matchesYear) return false;
    }

    // 3. Branch Filter
    if (branchFilter !== "all") {
      if (s.branch.toLowerCase() !== branchFilter.toLowerCase()) return false;
    }

    // 4. Admission Type Filter
    if (admissionFilter !== "all") {
      if (!s.admission_type || !s.admission_type.toLowerCase().includes(admissionFilter.toLowerCase())) return false;
    }

    // 5. Accommodation Filter
    if (accommodationFilter !== "all") {
      if (!s.accommodation_type || !s.accommodation_type.toLowerCase().includes(accommodationFilter.toLowerCase())) return false;
    }

    return true;
  });

  const availableBranches = Array.from(new Set(students.map(s => s.branch).filter(Boolean)));

  // KPI Calculations
  const totalCount = students.length;
  const count1st = students.filter(s => s.year === "1st_year" || s.folder_id === "1st-year" || s.folder_id.includes("1st")).length;
  const count2nd = students.filter(s => s.year === "2nd_year" || s.folder_id === "2nd-year" || s.folder_id.includes("2nd")).length;
  const count3rd = students.filter(s => s.year === "3rd_year" || s.folder_id === "3rd-year" || s.folder_id.includes("3rd")).length;
  const count4th = students.filter(s => s.year === "4th_year" || s.folder_id === "4th-year" || s.folder_id.includes("4th")).length;

  return (
    <div className="space-y-6 w-full">
      {/* Alert Banner */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-white border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0a66ff]" />
            <span>{successMsg}</span>
          </div>
          <button type="button" onClick={() => setSuccessMsg(null)} className="text-[#8a8a8e] hover:text-[#0a0a0a] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Small Containers / KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Students Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-semibold text-[#8a8a8e]">Total Students</span>
            <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">{totalCount}</div>
          </div>
          <div className="text-[11px] text-[#8a8a8e] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
            <span>All Batches Active</span>
          </div>
        </div>

        {/* 1st Year Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-semibold text-[#8a8a8e]">1st Year</span>
            <div className="w-7 h-7 rounded-lg bg-[#f5f5f7] text-[#0a0a0a] flex items-center justify-center font-bold text-xs">
              1
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">{count1st}</div>
          </div>
          <div className="text-[11px] text-[#8a8a8e] font-medium">Freshman Intake</div>
        </div>

        {/* 2nd Year Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-semibold text-[#8a8a8e]">2nd Year</span>
            <div className="w-7 h-7 rounded-lg bg-[#f5f5f7] text-[#0a0a0a] flex items-center justify-center font-bold text-xs">
              2
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">{count2nd}</div>
          </div>
          <div className="text-[11px] text-[#8a8a8e] font-medium">Core Engineering</div>
        </div>

        {/* 3rd Year Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-semibold text-[#8a8a8e]">3rd Year</span>
            <div className="w-7 h-7 rounded-lg bg-[#f5f5f7] text-[#0a0a0a] flex items-center justify-center font-bold text-xs">
              3
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">{count3rd}</div>
          </div>
          <div className="text-[11px] text-[#8a8a8e] font-medium">Specialization</div>
        </div>

        {/* 4th Year Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-semibold text-[#8a8a8e]">4th Year</span>
            <div className="w-7 h-7 rounded-lg bg-[#f5f5f7] text-[#0a0a0a] flex items-center justify-center font-bold text-xs">
              4
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">{count4th}</div>
          </div>
          <div className="text-[11px] text-[#8a8a8e] font-medium">Graduation Roster</div>
        </div>
      </div>

      {/* Control Bar: Search Bar + Actions */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8e]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across all fields (Name, Roll No, Branch, Email, Phone, Father Name, Skills)..."
              className="w-full h-10 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] pl-9 pr-8 focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 font-medium transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8e] hover:text-[#0a0a0a] p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={fetchStudents}
              disabled={loading}
              className="h-10 px-3 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center justify-center transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#8a8a8e] ${loading ? "animate-spin text-[#0a66ff]" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={students.length === 0}
              className="h-10 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8a8a8e]" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditStudent(null);
                setIsAddModalOpen(true);
              }}
              className="h-10 px-4 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="pt-3 border-t border-[#e3e4e8] flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[#8a8a8e] font-semibold uppercase text-[10px] tracking-wider mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Academic Year Filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="h-8 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-[#0a0a0a] font-medium text-xs focus:outline-none"
          >
            <option value="all">All Academic Years</option>
            <option value="1st-year">1st Year (Freshman)</option>
            <option value="2nd-year">2nd Year (Sophomore)</option>
            <option value="3rd-year">3rd Year (Junior)</option>
            <option value="4th-year">4th Year (Senior)</option>
          </select>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="h-8 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-[#0a0a0a] font-medium text-xs focus:outline-none"
          >
            <option value="all">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
            <option value="IT">IT</option>
            <option value="AI & DS">AI &amp; DS</option>
            {availableBranches
              .filter(b => !["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "AI & DS"].includes(b.toUpperCase()))
              .map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
          </select>

          {/* Admission Type Filter */}
          <select
            value={admissionFilter}
            onChange={(e) => setAdmissionFilter(e.target.value)}
            className="h-8 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-[#0a0a0a] font-medium text-xs focus:outline-none"
          >
            <option value="all">All Admission Types</option>
            <option value="convener">Convener (EAMCET / ECET)</option>
            <option value="management">Management Quota</option>
            <option value="nri">NRI / Spot Admission</option>
          </select>

          {/* Accommodation Filter */}
          <select
            value={accommodationFilter}
            onChange={(e) => setAccommodationFilter(e.target.value)}
            className="h-8 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-[#0a0a0a] font-medium text-xs focus:outline-none"
          >
            <option value="all">All Accommodations</option>
            <option value="day scholar">Day Scholar</option>
            <option value="hosteller">Hosteller</option>
          </select>

          {/* Reset Filters */}
          {(yearFilter !== "all" || branchFilter !== "all" || admissionFilter !== "all" || accommodationFilter !== "all" || search) && (
            <button
              type="button"
              onClick={() => {
                setYearFilter("all");
                setBranchFilter("all");
                setAdmissionFilter("all");
                setAccommodationFilter("all");
                setSearch("");
              }}
              className="text-xs font-semibold text-[#0a66ff] hover:underline ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Roster Table Container */}
      <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#e3e4e8] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-[#0a0a0a]">
              Submitted Student Form Records ({filteredStudents.length} of {totalCount})
            </h2>
            <p className="text-xs text-[#8a8a8e] mt-0.5">Live synchronized roster across all active academic intake folders.</p>
          </div>

          <span className="text-xs text-[#8a8a8e] font-medium">
            {filteredStudents.length} Records Shown
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Regd Roll No &amp; Student</th>
                <th className="py-2.5 px-3">Academic Batch</th>
                <th className="py-2.5 px-3">Branch &amp; Section</th>
                <th className="py-2.5 px-3">Admission &amp; Type</th>
                <th className="py-2.5 px-3">Contact Details</th>
                <th className="py-2.5 px-3">Parent Info</th>
                <th className="py-2.5 px-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f2f7]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8a8a8e] text-xs">
                    <Loader2 className="w-5 h-5 animate-spin text-[#0a66ff] mx-auto mb-2" />
                    Loading registered student records...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8a8a8e] text-xs">
                    No student records matching current filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const yearDisplay = 
                    s.year === "1st_year" || s.folder_id === "1st-year" ? "1st Year" :
                    s.year === "2nd_year" || s.folder_id === "2nd-year" ? "2nd Year" :
                    s.year === "3rd_year" || s.folder_id === "3rd-year" ? "3rd Year" : "4th Year";

                  return (
                    <tr key={s.id} className="hover:bg-[#fafafc] transition-colors">
                      {/* Roll & Name */}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center font-bold text-[11px] shrink-0 overflow-hidden shadow-xs">
                            {s.profile_image ? (
                              <img
                                src={s.profile_image}
                                alt={s.name}
                                className="w-full h-full object-cover object-top"
                              />
                            ) : (
                              s.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-[#0a0a0a] text-[11.5px] leading-tight">{s.name}</div>
                            <div className="text-[#8a8a8e] font-mono text-[10px] font-semibold mt-0.5">{s.roll_number}</div>
                          </div>
                        </div>
                      </td>

                      {/* Year Folder */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
                          {yearDisplay}
                        </span>
                      </td>

                      {/* Branch & Section */}
                      <td className="py-2 px-3">
                        <div className="font-semibold text-[#0a0a0a] text-[11px] leading-tight">{s.branch}</div>
                        <div className="text-[10px] text-[#8a8a8e] mt-0.5 font-medium">Sec: {s.section || "A"}</div>
                      </td>

                      {/* Admission Type */}
                      <td className="py-2 px-3">
                        <div className="inline-block px-1.5 py-0.5 rounded bg-[#f5f5f7] text-[#0a0a0a] text-[9.5px] font-semibold border border-[#e3e4e8] leading-tight">
                          {s.admission_type || "Convener"}
                        </div>
                        {s.accommodation_type && (
                          <div className="text-[9.5px] text-[#8a8a8e] mt-0.5 leading-tight font-medium">
                            {s.accommodation_type}
                          </div>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-2 px-3">
                        <div className="text-[#0a0a0a] font-mono text-[10.5px] leading-tight break-all">{s.email}</div>
                        {s.phone && <div className="text-[#8a8a8e] text-[10px] mt-0.5 font-mono">{s.phone}</div>}
                      </td>

                      {/* Parent */}
                      <td className="py-2 px-3 text-[11px] text-[#0a0a0a]">
                        <div className="font-semibold text-[#0a0a0a] text-[11px] leading-tight">{s.father_name || "—"}</div>
                        {s.mother_name && <div className="text-[10px] text-[#8a8a8e] mt-0.5 leading-tight">{s.mother_name}</div>}
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Eye: View Full 20+ Fields */}
                          <button
                            type="button"
                            onClick={() => setInspectStudent(s)}
                            className="w-6.5 h-6.5 rounded-md bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#8a8a8e] hover:text-[#0a0a0a] flex items-center justify-center transition-colors cursor-pointer"
                            title="View Full Student Form Submission"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => setEditStudent(s)}
                            className="w-6.5 h-6.5 rounded-md bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#8a8a8e] hover:text-[#0a0a0a] flex items-center justify-center transition-colors cursor-pointer"
                            title="Edit Student Record"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmStudent(s)}
                            className="w-6.5 h-6.5 rounded-md bg-white hover:bg-rose-50 border border-[#e3e4e8] text-[#8a8a8e] hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Student Modal */}
      {(isAddModalOpen || editStudent) && (
        <StudentModal
          isOpen={isAddModalOpen || !!editStudent}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditStudent(null);
          }}
          student={editStudent}
          defaultFolderId={editStudent?.folder_id || "folder_1st_year"}
          defaultYear={editStudent?.year || "1st_year"}
          onSave={handleSaveStudent}
        />
      )}

      {/* View Full 20+ Form Fields Inspector Modal */}
      {inspectStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#e3e4e8] animate-scale-up overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#e3e4e8] flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
                  {inspectStudent.profile_image ? (
                    <img
                      src={inspectStudent.profile_image}
                      alt={inspectStudent.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <span className="text-[#0a0a0a]">{inspectStudent.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#0a0a0a]">{inspectStudent.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#0a0a0a] font-semibold text-[10px] border border-[#e3e4e8]">
                      {inspectStudent.year || "1st_year"}
                    </span>
                  </div>
                  <p className="text-xs text-[#8a8a8e] font-mono font-semibold mt-0.5">
                    Regd No: {inspectStudent.roll_number} &bull; {inspectStudent.branch}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectStudent(null)}
                className="p-1.5 rounded-lg text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with 4 Structured Form Sections */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* Photo Preview Card */}
              {inspectStudent.profile_image && (
                <div className="p-4 rounded-2xl border border-[#e3e4e8] bg-[#fafafc] flex items-center gap-4 shadow-2xs">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#e3e4e8] bg-white shadow-xs shrink-0">
                    <img
                      src={inspectStudent.profile_image}
                      alt={inspectStudent.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-[#0a0a0a] block">{inspectStudent.name}</span>
                    <p className="text-xs text-[#8a8a8e]">Official Identity Photograph &bull; {inspectStudent.roll_number}</p>
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] text-[#0a66ff] font-semibold bg-[#0a66ff]/[0.08] px-2.5 py-0.5 rounded-full border border-[#0a66ff]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                      Verified Profile Photo
                    </span>
                  </div>
                </div>
              )}

              {/* Section 1: Student Details */}
              <div className="bg-[#fafafc] p-5 rounded-2xl border border-[#e3e4e8] space-y-3">
                <h4 className="font-semibold text-[#0a0a0a] uppercase tracking-wider text-[11px] flex items-center gap-2 pb-2 border-b border-[#e3e4e8]">
                  <User className="w-4 h-4 text-[#0a66ff]" />
                  <span>1. Student Details</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Full Name</span>
                    <span className="font-semibold text-[#0a0a0a]">{inspectStudent.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Regd No.</span>
                    <span className="font-mono font-semibold text-[#0a0a0a]">{inspectStudent.roll_number}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Admission Type</span>
                    <span className="font-medium text-[#0a0a0a]">{inspectStudent.admission_type || "Convener"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Date of Birth</span>
                    <span className="font-mono text-[#0a0a0a]">{inspectStudent.dob || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Blood Group</span>
                    <span className="font-semibold text-[#0a0a0a]">{inspectStudent.blood_group || "O+"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Aadhaar No.</span>
                    <span className="font-mono text-[#0a0a0a]">{inspectStudent.aadhaar_no || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Father&apos;s Name</span>
                    <span className="font-medium text-[#0a0a0a]">{inspectStudent.father_name || "—"} ({inspectStudent.father_occupation || "—"})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Mother&apos;s Name</span>
                    <span className="font-medium text-[#0a0a0a]">{inspectStudent.mother_name || "—"} ({inspectStudent.mother_occupation || "—"})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Reservation Category</span>
                    <span className="font-medium text-[#0a0a0a]">{inspectStudent.reservation_category || "General / OC"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Transport</span>
                    <span className="font-medium text-[#0a0a0a]">{inspectStudent.mode_of_transport || "College Bus"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Accommodation</span>
                    <span className="font-medium text-[#0a0a0a]">{inspectStudent.accommodation_type || "Day Scholar"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Institution</span>
                    <span className="font-medium text-[#0a0a0a]">{inspectStudent.college}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Address */}
              <div className="bg-[#fafafc] p-5 rounded-2xl border border-[#e3e4e8] space-y-3">
                <h4 className="font-semibold text-[#0a0a0a] uppercase tracking-wider text-[11px] flex items-center gap-2 pb-2 border-b border-[#e3e4e8]">
                  <MapPin className="w-4 h-4 text-[#0a66ff]" />
                  <span>2. Contact &amp; Address Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Email Address</span>
                    <span className="font-mono text-[#0a0a0a] font-semibold">{inspectStudent.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Primary Phone</span>
                    <span className="font-mono text-[#0a0a0a] font-semibold">{inspectStudent.phone || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Permanent Address</span>
                    <span className="text-[#0a0a0a] leading-relaxed">{inspectStudent.permanent_address || inspectStudent.address || "—"} ({inspectStudent.permanent_pincode || ""})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Present Address</span>
                    <span className="text-[#0a0a0a] leading-relaxed">{inspectStudent.present_address || inspectStudent.permanent_address || "—"} ({inspectStudent.present_pincode || ""})</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Previous Academic Record */}
              <div className="bg-[#fafafc] p-5 rounded-2xl border border-[#e3e4e8] space-y-3">
                <h4 className="font-semibold text-[#0a0a0a] uppercase tracking-wider text-[11px] flex items-center gap-2 pb-2 border-b border-[#e3e4e8]">
                  <GraduationCap className="w-4 h-4 text-[#0a66ff]" />
                  <span>3. Academic History (SSC &amp; Intermediate)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">SSC Marks</span>
                    <span className="font-semibold text-[#0a0a0a]">{inspectStudent.ssc_marks || inspectStudent.previous_marks_obtained || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">SSC Hall Ticket</span>
                    <span className="font-mono text-[#0a0a0a]">{inspectStudent.ssc_hall_ticket_no || inspectStudent.previous_sno || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Inter Marks</span>
                    <span className="font-mono font-semibold text-[#0a66ff]">{inspectStudent.intermediate_marks || inspectStudent.previous_marks_obtained || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Inter Hall Ticket</span>
                    <span className="font-mono text-[#0a0a0a]">{inspectStudent.intermediate_hall_ticket_no || inspectStudent.previous_sno || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Skills & Extracurriculars */}
              <div className="bg-[#fafafc] p-5 rounded-2xl border border-[#e3e4e8] space-y-3">
                <h4 className="font-semibold text-[#0a0a0a] uppercase tracking-wider text-[11px] flex items-center gap-2 pb-2 border-b border-[#e3e4e8]">
                  <Award className="w-4 h-4 text-[#0a66ff]" />
                  <span>4. Skills &amp; Extracurriculars</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Technical Skills</span>
                    <span className="font-medium text-[#0a0a0a]">{inspectStudent.skills || "Python, React, Data Structures"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Sports &amp; Hobbies</span>
                    <span className="font-medium text-[#0a0a0a]">{inspectStudent.sports || "Cricket"}, {inspectStudent.hobbies || "Coding"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-[#8a8a8e] font-semibold block">Achievements</span>
                    <span className="text-[#0a0a0a]">{inspectStudent.achievements || "Hackathon Finalist, Merit Scholarship"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#e3e4e8] bg-[#fafafc] flex items-center justify-between text-xs text-[#8a8a8e]">
              <span>Record ID: <code className="font-mono text-[#0a0a0a]">{inspectStudent.id}</code></span>
              <button
                type="button"
                onClick={() => setInspectStudent(null)}
                className="h-9 px-5 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white font-semibold rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmStudent && (
        <DeleteConfirmModal
          isOpen={!!deleteConfirmStudent}
          onClose={() => setDeleteConfirmStudent(null)}
          onConfirm={handleDelete}
          loading={isDeleting}
          title={`Delete student "${deleteConfirmStudent.name}"?`}
          description={`Are you sure you want to delete ${deleteConfirmStudent.name} (${deleteConfirmStudent.roll_number})? This will remove all form submission data from the database.`}
        />
      )}
    </div>
  );
}
