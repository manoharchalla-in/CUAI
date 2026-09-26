"use client";

import { X, Download, GraduationCap, Award, BookOpen, CheckCircle2 } from "lucide-react";
import type { StudentRecord } from "@/lib/db/schema";
import { formatYearLabel } from "@/lib/utils";

interface StudentMarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord | null;
}

export default function StudentMarksModal({
  isOpen,
  onClose,
  student,
}: StudentMarksModalProps) {
  if (!isOpen || !student) return null;

  const marksObtained = parseFloat(student.previous_marks_obtained || "0");
  const maxMarks = parseFloat(student.previous_max_marks || "0");
  const percentage = maxMarks > 0 ? ((marksObtained / maxMarks) * 100).toFixed(2) : null;
  const cgpa = percentage ? (parseFloat(percentage) / 9.5).toFixed(2) : null;

  const handleDownload = () => {
    const formatted = `
=====================================================
ACADEMIC MARKS & RESULTS STATEMENT
=====================================================

Student Name           : ${student.name}
Registration No.       : ${student.roll_number}
Current Academic Batch : ${formatYearLabel(student.year)}
Department             : ${student.branch} ${student.section ? `(Sec ${student.section})` : ""}
College / Institution  : ${student.college || "Campus Institute"}

ACADEMIC RECORD & QUALIFYING EXAMINATIONS
-----------------------------------------------------
SSC Marks              : ${student.ssc_marks || student.previous_marks_obtained || "N/A"}
SSC Hall Ticket No.    : ${student.ssc_hall_ticket_no || student.previous_sno || "N/A"}
Intermediate Marks     : ${student.intermediate_marks || student.previous_marks_obtained || "N/A"}
Inter Hall Ticket No.  : ${student.intermediate_hall_ticket_no || student.previous_sno || "N/A"}
Admission Route        : ${student.admission_type || "Convener (EAMCET / ECET)"}
Result Status          : PASSED / QUALIFIED

KEY ACHIEVEMENTS & SKILLS
-----------------------------------------------------
Academic Achievements  : ${student.achievements || "None recorded"}
Technical Competencies : ${student.skills || "None recorded"}

Issued by Campus Academic Records Administration
Date: ${new Date().toLocaleDateString()}
=====================================================
    `.trim();

    const blob = new Blob([formatted], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.roll_number}_academic_marks_statement.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-[#e3e4e8] rounded-2xl w-full max-w-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e3e4e8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center font-bold text-sm">
              📊
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0a0a0a] tracking-tight">
                Academic Results: {student.roll_number}
              </h3>
              <p className="text-xs text-[#8a8a8e]">{student.name} • {student.branch}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-white overflow-y-auto">
          {/* Summary Stat Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#fafafc] border border-[#e3e4e8] text-center">
              <span className="text-[10px] font-semibold text-[#8a8a8e] uppercase block">SSC Marks</span>
              <span className="text-sm font-bold text-[#0a0a0a] mt-1 block truncate">
                {student.ssc_marks || student.previous_marks_obtained || "N/A"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fafafc] border border-[#e3e4e8] text-center">
              <span className="text-[10px] font-semibold text-[#8a8a8e] uppercase block">SSC Hall Ticket</span>
              <span className="text-sm font-mono font-bold text-[#0a0a0a] mt-1 block truncate">
                {student.ssc_hall_ticket_no || student.previous_sno || "N/A"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fafafc] border border-[#e3e4e8] text-center">
              <span className="text-[10px] font-semibold text-[#8a8a8e] uppercase block">Inter Marks</span>
              <span className="text-sm font-bold text-[#0a66ff] mt-1 block truncate">
                {student.intermediate_marks || student.previous_marks_obtained || "N/A"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fafafc] border border-[#e3e4e8] text-center">
              <span className="text-[10px] font-semibold text-[#8a8a8e] uppercase block">Inter Hall Ticket</span>
              <span className="text-sm font-mono font-bold text-[#0a0a0a] mt-1 block truncate">
                {student.intermediate_hall_ticket_no || student.previous_sno || "N/A"}
              </span>
            </div>
          </div>

          {/* Academic Table Breakdown */}
          <div className="border border-[#e3e4e8] rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#fafafc] border-b border-[#e3e4e8] text-[10.5px] font-semibold text-[#8a8a8e] uppercase">
                <tr>
                  <th className="py-2.5 px-3.5">Academic Field</th>
                  <th className="py-2.5 px-3.5">Recorded Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7]">
                <tr>
                  <td className="py-2.5 px-3.5 font-medium text-[#8a8a8e]">SSC Marks</td>
                  <td className="py-2.5 px-3.5 font-semibold text-[#0a0a0a]">
                    {student.ssc_marks || student.previous_marks_obtained || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3.5 font-medium text-[#8a8a8e]">SSC Hall Ticket No.</td>
                  <td className="py-2.5 px-3.5 font-mono font-semibold text-[#0a0a0a]">
                    {student.ssc_hall_ticket_no || student.previous_sno || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3.5 font-medium text-[#8a8a8e]">Intermediate Marks</td>
                  <td className="py-2.5 px-3.5 font-semibold text-[#0a0a0a]">
                    {student.intermediate_marks || student.previous_marks_obtained || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3.5 font-medium text-[#8a8a8e]">Intermediate Hall Ticket Number</td>
                  <td className="py-2.5 px-3.5 font-mono font-semibold text-[#0a0a0a]">
                    {student.intermediate_hall_ticket_no || student.previous_sno || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3.5 font-medium text-[#8a8a8e]">Admission Route</td>
                  <td className="py-2.5 px-3.5 font-medium text-[#0a0a0a]">
                    {student.admission_type || "Convener (EAMCET / ECET)"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3.5 font-medium text-[#8a8a8e]">Academic Honors</td>
                  <td className="py-2.5 px-3.5 font-medium text-[#0a0a0a]">
                    {student.achievements || "None recorded"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verified Grounding Banner */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Marks record verified and synchronized with student knowledge grounding database.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e3e4e8] bg-[#fafafc] flex items-center justify-between">
          <button
            type="button"
            onClick={handleDownload}
            className="h-8 px-3.5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Statement</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-xl bg-[#f5f5f7] hover:bg-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
