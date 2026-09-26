"use client";

import { useState, useEffect } from "react";
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Code, 
  Database, 
  Printer, 
  Filter, 
  Check, 
  RefreshCw, 
  Loader2, 
  CheckCircle2, 
  Users, 
  Layers, 
  Calendar,
  Sparkles,
  FileCheck,
  Eye,
  Sliders,
  X,
  Archive
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import type { StudentRecord } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";
import { downloadSelectedStudentsZip } from "@/lib/zip-export";

type ExportFormat = "csv" | "excel" | "json" | "pdf" | "xml" | "sql" | "zip";

interface FieldOption {
  key: keyof StudentRecord | string;
  label: string;
  category: "student" | "academic" | "contact" | "family" | "extra";
}

const AVAILABLE_FIELDS: FieldOption[] = [
  // Student Details
  { key: "roll_number", label: "Registration / Roll Number", category: "student" },
  { key: "name", label: "Student Full Name", category: "student" },
  { key: "admission_type", label: "Admission Type (Convener/Management)", category: "student" },
  { key: "dob", label: "Date of Birth", category: "student" },
  { key: "blood_group", label: "Blood Group", category: "student" },
  { key: "aadhaar_no", label: "Aadhaar Number", category: "student" },
  { key: "reservation_category", label: "Reservation Category", category: "student" },
  { key: "college", label: "Institution / College Name", category: "student" },

  // Academic Details
  { key: "year", label: "Academic Year Batch", category: "academic" },
  { key: "branch", label: "Branch / Department", category: "academic" },
  { key: "section", label: "Class Section", category: "academic" },
  { key: "ssc_marks", label: "SSC Marks", category: "academic" },
  { key: "ssc_hall_ticket_no", label: "SSC Hall Ticket No.", category: "academic" },
  { key: "intermediate_marks", label: "Intermediate Marks", category: "academic" },
  { key: "intermediate_hall_ticket_no", label: "Intermediate Hall Ticket Number", category: "academic" },

  // Contact Details
  { key: "email", label: "Email Address", category: "contact" },
  { key: "phone", label: "Primary Phone Number", category: "contact" },
  { key: "permanent_address", label: "Permanent Address", category: "contact" },
  { key: "permanent_pincode", label: "Permanent Pincode", category: "contact" },
  { key: "present_address", label: "Present Address", category: "contact" },
  { key: "accommodation_type", label: "Accommodation (Hosteller/Day Scholar)", category: "contact" },
  { key: "mode_of_transport", label: "Mode of Transport", category: "contact" },

  // Family Info
  { key: "father_name", label: "Father's Name", category: "family" },
  { key: "father_occupation", label: "Father's Occupation", category: "family" },
  { key: "mother_name", label: "Mother's Name", category: "family" },
  { key: "mother_occupation", label: "Mother's Occupation", category: "family" },

  // Extra Information
  { key: "skills", label: "Technical Skills", category: "extra" },
  { key: "hobbies", label: "Hobbies", category: "extra" },
  { key: "sports", label: "Sports Interested", category: "extra" },
  { key: "achievements", label: "Achievements & Awards", category: "extra" },
  { key: "created_at", label: "Registration Date", category: "extra" }
];

export default function AdminExportPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Format selection
  const [format, setFormat] = useState<ExportFormat>("csv");

  // Filter options according to form fields
  const [yearFilter, setYearFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [admissionFilter, setAdmissionFilter] = useState("all");
  const [accommodationFilter, setAccommodationFilter] = useState("all");
  const [transportFilter, setTransportFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Selected Fields Checkboxes
  const [selectedFields, setSelectedFields] = useState<string[]>(
    AVAILABLE_FIELDS.map(f => f.key)
  );

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/students?limit=500");
      const data = await res.json();
      if (data.records) setStudents(data.records);
    } catch (e) {
      console.error("Export load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleField = (key: string) => {
    setSelectedFields(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSelectAllFields = () => {
    setSelectedFields(AVAILABLE_FIELDS.map(f => f.key));
  };

  const handleDeselectAllFields = () => {
    setSelectedFields(["roll_number", "name"]);
  };

  // Filter students based on selected form field criteria
  const filteredStudents = students.filter(s => {
    if (yearFilter !== "all") {
      const match = s.year === yearFilter || s.folder_id === yearFilter || s.folder_id.includes(yearFilter.replace("-", "_"));
      if (!match) return false;
    }
    if (branchFilter !== "all") {
      if (s.branch.toLowerCase() !== branchFilter.toLowerCase()) return false;
    }
    if (admissionFilter !== "all") {
      if (!s.admission_type || !s.admission_type.toLowerCase().includes(admissionFilter.toLowerCase())) return false;
    }
    if (accommodationFilter !== "all") {
      if (!s.accommodation_type || !s.accommodation_type.toLowerCase().includes(accommodationFilter.toLowerCase())) return false;
    }
    if (transportFilter !== "all") {
      if (!s.mode_of_transport || !s.mode_of_transport.toLowerCase().includes(transportFilter.toLowerCase())) return false;
    }
    if (dateFilter !== "all") {
      const created = new Date(s.created_at).getTime();
      const now = Date.now();
      if (dateFilter === "today" && now - created > 24 * 3600 * 1000) return false;
      if (dateFilter === "week" && now - created > 7 * 24 * 3600 * 1000) return false;
      if (dateFilter === "month" && now - created > 30 * 24 * 3600 * 1000) return false;
    }
    return true;
  });

  const availableBranches = Array.from(new Set(students.map(s => s.branch).filter(Boolean)));

  const handleTriggerExport = () => {
    if (filteredStudents.length === 0) return;
    setIsExporting(true);

    setTimeout(async () => {
      const timestamp = new Date().toISOString().split("T")[0];
      const activeFieldObjects = AVAILABLE_FIELDS.filter(f => selectedFields.includes(f.key));

      if (format === "csv") {
        const headers = activeFieldObjects.map(f => `"${f.label}"`).join(",");
        const rows = filteredStudents.map(s => 
          activeFieldObjects.map(f => {
            const val = (s as any)[f.key] || "";
            return `"${String(val).replace(/"/g, '""')}"`;
          }).join(",")
        );
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
        downloadFile(csvContent, `student_roster_export_${timestamp}.csv`, "text/csv");
      } 
      else if (format === "excel") {
        const tableHeader = `<tr>${activeFieldObjects.map(f => `<th style="background:#0a0a0a;color:#fff;font-weight:bold;padding:8px;border:1px solid #ccc;">${f.label}</th>`).join("")}</tr>`;
        const tableRows = filteredStudents.map((s, idx) => 
          `<tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">${activeFieldObjects.map(f => `<td style="padding:6px;border:1px solid #ccc;">${(s as any)[f.key] || ""}</td>`).join("")}</tr>`
        ).join("");
        const excelHtml = `
          <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head><meta charset="utf-8"/></head>
            <body>
              <h2>Campus Student Intake Roster Export</h2>
              <table border="1">${tableHeader}${tableRows}</table>
            </body>
          </html>
        `;
        const blob = new Blob([excelHtml], { type: "application/vnd.ms-excel" });
        const url = URL.createObjectURL(blob);
        downloadUrl(url, `student_roster_export_${timestamp}.xls`);
      }
      else if (format === "json") {
        const jsonExport = filteredStudents.map(s => {
          const item: Record<string, any> = {};
          activeFieldObjects.forEach(f => {
            item[f.key] = (s as any)[f.key] || "";
          });
          return item;
        });
        const blob = new Blob([JSON.stringify(jsonExport, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        downloadUrl(url, `student_roster_export_${timestamp}.json`);
      }
      else if (format === "xml") {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<students count="${filteredStudents.length}" exportedAt="${new Date().toISOString()}">\n`;
        filteredStudents.forEach(s => {
          xml += `  <student id="${s.id}">\n`;
          activeFieldObjects.forEach(f => {
            const val = String((s as any)[f.key] || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            xml += `    <${f.key}>${val}</${f.key}>\n`;
          });
          xml += `  </student>\n`;
        });
        xml += `</students>`;
        const blob = new Blob([xml], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        downloadUrl(url, `student_roster_export_${timestamp}.xml`);
      }
      else if (format === "sql") {
        let sql = `-- Campus Student Intake Database Export Dump\n-- Generated on: ${new Date().toISOString()}\n-- Total Records: ${filteredStudents.length}\n\n`;
        sql += `CREATE TABLE IF NOT EXISTS student_records (\n  id VARCHAR(64) PRIMARY KEY,\n  roll_number VARCHAR(64),\n  name VARCHAR(255),\n  year VARCHAR(32),\n  branch VARCHAR(64),\n  email VARCHAR(255)\n);\n\n`;
        filteredStudents.forEach(s => {
          const cols = activeFieldObjects.map(f => f.key).join(", ");
          const vals = activeFieldObjects.map(f => `'${String((s as any)[f.key] || "").replace(/'/g, "''")}'`).join(", ");
          sql += `INSERT INTO student_records (${cols}) VALUES (${vals});\n`;
        });
        const blob = new Blob([sql], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        downloadUrl(url, `student_roster_inserts_${timestamp}.sql`);
      }
      else if (format === "pdf") {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          const tableHeader = `<tr>${activeFieldObjects.slice(0, 8).map(f => `<th style="background:#0a0a0a;color:#fff;padding:8px;font-size:11px;text-align:left;">${f.label}</th>`).join("")}</tr>`;
          const tableRows = filteredStudents.map((s, idx) => 
            `<tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};border-bottom:1px solid #e2e8f0;">${activeFieldObjects.slice(0, 8).map(f => `<td style="padding:6px 8px;font-size:10px;font-family:sans-serif;">${(s as any)[f.key] || "—"}</td>`).join("")}</tr>`
          ).join("");

          printWindow.document.write(`
            <html>
              <head>
                <title>Campus Student Roster Official Report</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; color: #0a0a0a; }
                  h1 { font-size: 18px; margin-bottom: 4px; }
                  p { font-size: 11px; color: #8a8a8e; margin-top: 0; }
                  table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                  @media print { body { padding: 0; } }
                </style>
              </head>
              <body>
                <h1>Campus Student Intake Roster Report</h1>
                <p>Export Date: ${new Date().toLocaleDateString()} &bull; Total Filtered Students: ${filteredStudents.length}</p>
                <table>${tableHeader}${tableRows}</table>
                <script>window.onload = function() { window.print(); }</script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }

      else if (format === "zip") {
        const dummyFolder = {
          id: "filtered_export",
          name: "Filtered Export",
          slug: "filtered_students",
          year_label: "Filtered Students",
          description: "Filtered student records export",
          is_form_active: 1,
          form_token: "",
          created_at: new Date().toISOString()
        };
        await downloadSelectedStudentsZip(dummyFolder as any, filteredStudents);
      }

      setIsExporting(false);
      setExportSuccess(`Successfully generated ${filteredStudents.length} student records in ${format.toUpperCase()} format!`);
      setTimeout(() => setExportSuccess(null), 4000);
    }, 500);
  };

  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const encodedUri = encodeURI(content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadUrl = (url: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCards = [
    { id: "zip" as const, title: "ZIP Folders Archive (.zip)", desc: "Main ZIP containing all child student folders with details, photo & marks", icon: Archive },
    { id: "csv" as const, title: "CSV (.csv)", desc: "Standard comma-separated table for Excel & Google Sheets", icon: FileText },
    { id: "excel" as const, title: "Excel (.xls)", desc: "Formatted Microsoft Excel spreadsheet with column headers", icon: FileSpreadsheet },
    { id: "json" as const, title: "JSON (.json)", desc: "Structured raw data payload for developer APIs & backups", icon: Code },
    { id: "pdf" as const, title: "Print / PDF Report", desc: "Clean printable student roster document for campus records", icon: Printer },
    { id: "xml" as const, title: "XML (.xml)", desc: "Hierarchical XML tree format with schema attributes", icon: Layers },
    { id: "sql" as const, title: "SQL Insert (.sql)", desc: "Database INSERT table statements for migrations & SQL restores", icon: Database }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader
        title="Master Data Export Console"
        subtitle="Export student records and intake form submissions across all file formats with custom field filters"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Header & Success Alert */}
        {exportSuccess && (
          <div className="p-4 rounded-2xl bg-white border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0a66ff]" />
              <span>{exportSuccess}</span>
            </div>
            <button onClick={() => setExportSuccess(null)} className="text-[#8a8a8e] hover:text-[#0a0a0a]">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-[#0a0a0a] tracking-tight">Master Data Export</h1>
            <p className="text-xs text-[#8a8a8e]">Generate filtered student rosters, custom column extracts, and database dumps</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStudents}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] transition-all shadow-2xs active:scale-[0.98] flex items-center gap-1.5 text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#8a8a8e] ${loading ? "animate-spin text-[#0a66ff]" : ""}`} />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>

        {/* Step 1: Select Export Format */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#e3e4e8]">
            <span className="w-5 h-5 rounded-full bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] font-bold text-[10px] flex items-center justify-center">1</span>
            <h2 className="text-sm font-semibold text-[#0a0a0a]">Select Export File Format</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {formatCards.map((card) => {
              const Icon = card.icon;
              const isSelected = format === card.id;

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setFormat(card.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? "border-[#0a0a0a] bg-[#fafafc] shadow-xs ring-1 ring-[#0a0a0a]"
                      : "border-[#e3e4e8] bg-white hover:bg-[#fafafc] hover:-translate-y-0.5"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#0a0a0a] text-xs">{card.title}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />}
                    </div>
                    <p className="text-[11px] text-[#8a8a8e] mt-1 leading-relaxed">{card.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Filter Options According to Form Fields */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e3e4e8]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] font-bold text-[10px] flex items-center justify-center">2</span>
              <h2 className="text-sm font-semibold text-[#0a0a0a]">Filter Criteria by Form Fields</h2>
            </div>
            <span className="text-xs font-semibold text-[#8a8a8e]">
              {filteredStudents.length} of {students.length} students matched
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Year Batch */}
            <div>
              <label className="block font-semibold text-[#0a0a0a] mb-1.5">Academic Year / Batch</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:outline-none focus:border-[#0a66ff] transition-all"
              >
                <option value="all">All Academic Batches (1st to 4th Year)</option>
                <option value="1st-year">1st Year (Freshman Intake)</option>
                <option value="2nd-year">2nd Year (Core Department)</option>
                <option value="3rd-year">3rd Year (Specialization)</option>
                <option value="4th-year">4th Year (Graduation)</option>
              </select>
            </div>

            {/* Branch Filter */}
            <div>
              <label className="block font-semibold text-[#0a0a0a] mb-1.5">Branch / Department</label>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:outline-none focus:border-[#0a66ff] transition-all"
              >
                <option value="all">All Branches / Disciplines</option>
                <option value="CSE">Computer Science &amp; Engineering (CSE)</option>
                <option value="ECE">Electronics &amp; Communication (ECE)</option>
                <option value="EEE">Electrical &amp; Electronics (EEE)</option>
                <option value="MECH">Mechanical Engineering (MECH)</option>
                <option value="CIVIL">Civil Engineering (CIVIL)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="AI & DS">Artificial Intelligence &amp; Data Science</option>
                {availableBranches
                  .filter(b => !["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "AI & DS"].includes(b.toUpperCase()))
                  .map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
              </select>
            </div>

            {/* Admission Type Filter */}
            <div>
              <label className="block font-semibold text-[#0a0a0a] mb-1.5">Admission Category</label>
              <select
                value={admissionFilter}
                onChange={(e) => setAdmissionFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:outline-none focus:border-[#0a66ff] transition-all"
              >
                <option value="all">All Admission Types</option>
                <option value="convener">Convener Quota (EAMCET / ECET)</option>
                <option value="management">Management Quota</option>
                <option value="nri">NRI / Spot Admission</option>
              </select>
            </div>

            {/* Accommodation Filter */}
            <div>
              <label className="block font-semibold text-[#0a0a0a] mb-1.5">Accommodation Type</label>
              <select
                value={accommodationFilter}
                onChange={(e) => setAccommodationFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:outline-none focus:border-[#0a66ff] transition-all"
              >
                <option value="all">All Accommodations</option>
                <option value="day scholar">Day Scholar (Living with Parents)</option>
                <option value="hosteller">Hosteller (Campus Hostel)</option>
              </select>
            </div>

            {/* Mode of Transport */}
            <div>
              <label className="block font-semibold text-[#0a0a0a] mb-1.5">Mode of Transport</label>
              <select
                value={transportFilter}
                onChange={(e) => setTransportFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:outline-none focus:border-[#0a66ff] transition-all"
              >
                <option value="all">All Transport Types</option>
                <option value="bus">College Bus</option>
                <option value="self">Self / Public Transport</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block font-semibold text-[#0a0a0a] mb-1.5">Intake Submission Period</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:outline-none focus:border-[#0a66ff] transition-all"
              >
                <option value="all">All Time Records</option>
                <option value="today">Today&apos;s Submissions Only</option>
                <option value="week">Past 7 Days</option>
                <option value="month">Past 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Custom Field Selector Checkboxes */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e3e4e8]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] font-bold text-[10px] flex items-center justify-center">3</span>
              <h2 className="text-sm font-semibold text-[#0a0a0a]">Select Columns &amp; Form Fields ({selectedFields.length} selected)</h2>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleSelectAllFields}
                className="text-[#0a66ff] hover:underline font-semibold cursor-pointer"
              >
                Select All
              </button>
              <span className="text-[#e3e4e8]">&bull;</span>
              <button
                type="button"
                onClick={handleDeselectAllFields}
                className="text-[#8a8a8e] hover:text-[#0a0a0a] font-semibold cursor-pointer"
              >
                Reset to Minimum
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
            {AVAILABLE_FIELDS.map((f) => {
              const isChecked = selectedFields.includes(f.key);

              return (
                <label
                  key={f.key}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                    isChecked
                      ? "bg-white border-[#0a0a0a] text-[#0a0a0a] font-semibold shadow-2xs"
                      : "bg-[#fafafc] border-[#e3e4e8] text-[#8a8a8e] hover:bg-white hover:text-[#0a0a0a]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleField(f.key)}
                    className="w-4 h-4 rounded border-[#e3e4e8] accent-[#0a0a0a] cursor-pointer"
                  />
                  <span className="truncate">{f.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Step 4: Final Summary & Download Trigger Bar */}
        <div className="p-6 rounded-2xl bg-white border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
              <span>Export Package Ready</span>
            </div>
            <h3 className="text-base font-semibold text-[#0a0a0a]">Ready to Export {filteredStudents.length} Student Records</h3>
            <p className="text-xs text-[#8a8a8e]">
              Format: <span className="font-semibold text-[#0a0a0a] uppercase">{format}</span> &bull; {selectedFields.length} Form Fields &bull; Real-time generation
            </p>
          </div>

          <button
            type="button"
            onClick={handleTriggerExport}
            disabled={isExporting || filteredStudents.length === 0}
            className="h-10 px-6 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] disabled:opacity-50 text-white text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all flex items-center gap-2 active:scale-[0.98] flex-shrink-0 cursor-pointer"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isExporting ? "Generating Package..." : `Download ${format.toUpperCase()} File`}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
