"use client";

import { useState } from "react";
import { X, Copy, Check, Download, User, MapPin, Mail, Phone, GraduationCap, Award, Calendar, Heart, CreditCard, Briefcase, Bus, Home, Code2 } from "lucide-react";
import type { StudentRecord } from "@/lib/db/schema";
import { formatYearLabel } from "@/lib/utils";

interface StudentDetailsPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord | null;
}

export default function StudentDetailsPreviewModal({
  isOpen,
  onClose,
  student,
}: StudentDetailsPreviewModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !student) return null;

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = () => {
    const formatted = `
=====================================================
STUDENT REGISTRATION RECORD: ${student.roll_number}
=====================================================

1. PERSONAL DETAILS
-----------------------------------------------------
Name of the Student    : ${student.name}
Registration / Roll No : ${student.roll_number}
Academic Year          : ${formatYearLabel(student.year)}
Branch / Department    : ${student.branch} ${student.section ? `(Section ${student.section})` : ""}
College / Campus       : ${student.college || "City University"}
Type of Admission      : ${student.admission_type || "N/A"}
Date of Birth          : ${student.dob || "N/A"}
Blood Group            : ${student.blood_group || "N/A"}
Aadhaar Card No.       : ${student.aadhaar_no || "N/A"}
Reservation Category   : ${student.reservation_category || "N/A"}
Mode of Transport      : ${student.mode_of_transport || "N/A"}
Type of Accommodation  : ${student.accommodation_type || "N/A"}

2. FAMILY DETAILS
-----------------------------------------------------
Father's Name          : ${student.father_name || "N/A"}
Father's Occupation    : ${student.father_occupation || "N/A"}
Mother's Name          : ${student.mother_name || "N/A"}
Mother's Occupation    : ${student.mother_occupation || "N/A"}

3. ADDRESS & CONTACT DETAILS
-----------------------------------------------------
E-mail Address         : ${student.email}
Phone Number           : ${student.phone || student.permanent_phone || "N/A"}
Present Phone No       : ${student.present_phone || "N/A"}
Permanent Address      : ${student.permanent_address || "N/A"} ${student.permanent_pincode ? `(${student.permanent_pincode})` : ""}
Present Address        : ${student.present_address || "N/A"} ${student.present_pincode ? `(${student.present_pincode})` : ""}

4. PREVIOUS ACADEMIC RECORD
-----------------------------------------------------
Course of Study        : ${student.previous_course || "N/A"}
Marks / Grade Obtained : ${student.previous_marks_obtained || "N/A"} ${student.previous_max_marks ? `/ ${student.previous_max_marks}` : ""}
Hall Ticket / S.No.    : ${student.previous_sno || "N/A"}

5. ACTIVITIES & INTERESTS
-----------------------------------------------------
Technical Skills       : ${student.skills || "N/A"}
Achievements           : ${student.achievements || "N/A"}
Extra-curricular       : ${student.extracurricular || "N/A"}
Hobbies                : ${student.hobbies || "N/A"}
Sports Interested      : ${student.sports || "N/A"}
Profile Summary        : ${student.profile_info || "N/A"}

Generated on: ${new Date().toLocaleString()}
=====================================================
    `.trim();

    const blob = new Blob([formatted], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.roll_number}_student_details.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sections = [
    {
      title: "1. Personal Information",
      icon: User,
      fields: [
        { label: "Student Name", value: student.name, key: "name" },
        { label: "Registration No.", value: student.roll_number, key: "roll_number" },
        { label: "Academic Year", value: formatYearLabel(student.year), key: "year" },
        { label: "Department / Branch", value: student.branch, key: "branch" },
        { label: "Section", value: student.section || "N/A", key: "section" },
        { label: "Type of Admission", value: student.admission_type || "N/A", key: "admission_type" },
        { label: "Date of Birth", value: student.dob || "N/A", key: "dob" },
        { label: "Blood Group", value: student.blood_group || "N/A", key: "blood_group" },
        { label: "Aadhaar Card No.", value: student.aadhaar_no || "N/A", key: "aadhaar_no" },
        { label: "Reservation Category", value: student.reservation_category || "N/A", key: "reservation_category" },
        { label: "Mode of Transport", value: student.mode_of_transport || "N/A", key: "mode_of_transport" },
        { label: "Accommodation Type", value: student.accommodation_type || "N/A", key: "accommodation_type" },
      ],
    },
    {
      title: "2. Family Background",
      icon: Briefcase,
      fields: [
        { label: "Father's Name", value: student.father_name || "N/A", key: "father_name" },
        { label: "Father's Occupation", value: student.father_occupation || "N/A", key: "father_occupation" },
        { label: "Mother's Name", value: student.mother_name || "N/A", key: "mother_name" },
        { label: "Mother's Occupation", value: student.mother_occupation || "N/A", key: "mother_occupation" },
      ],
    },
    {
      title: "3. Address & Contact Information",
      icon: MapPin,
      fields: [
        { label: "Official Email", value: student.email, key: "email" },
        { label: "Primary Phone", value: student.phone || student.permanent_phone || "N/A", key: "phone" },
        { label: "Present Phone", value: student.present_phone || "N/A", key: "present_phone" },
        { label: "Permanent Address", value: `${student.permanent_address || "N/A"} ${student.permanent_pincode ? `(${student.permanent_pincode})` : ""}`, key: "permanent_address" },
        { label: "Present Address", value: `${student.present_address || "N/A"} ${student.present_pincode ? `(${student.present_pincode})` : ""}`, key: "present_address" },
      ],
    },
    {
      title: "4. Academic History (SSC & Intermediate)",
      icon: GraduationCap,
      fields: [
        { label: "SSC Marks", value: student.ssc_marks || student.previous_marks_obtained || "N/A", key: "ssc_marks" },
        { label: "SSC Hall Ticket No.", value: student.ssc_hall_ticket_no || student.previous_sno || "N/A", key: "ssc_hall_ticket_no" },
        { label: "Intermediate Marks", value: student.intermediate_marks || student.previous_marks_obtained || "N/A", key: "intermediate_marks" },
        { label: "Intermediate Hall Ticket No.", value: student.intermediate_hall_ticket_no || student.previous_sno || "N/A", key: "intermediate_hall_ticket_no" },
      ],
    },
    {
      title: "5. Skills & Extracurricular Activities",
      icon: Award,
      fields: [
        { label: "Technical Skills", value: student.skills || "N/A", key: "skills" },
        { label: "Achievements", value: student.achievements || "N/A", key: "achievements" },
        { label: "Extra-curricular", value: student.extracurricular || "N/A", key: "extracurricular" },
        { label: "Hobbies", value: student.hobbies || "N/A", key: "hobbies" },
        { label: "Sports Interested", value: student.sports || "N/A", key: "sports" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-[#e3e4e8] rounded-2xl w-full max-w-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e3e4e8] flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
              {student.profile_image ? (
                <img
                  src={student.profile_image}
                  alt={student.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <span className="text-[#0a0a0a]">{student.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0a0a0a] tracking-tight flex items-center gap-2">
                <span>Student Record: {student.roll_number}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#f5f5f7] border border-[#e3e4e8] font-normal text-[#8a8a8e]">
                  {student.name}
                </span>
              </h3>
              <p className="text-xs text-[#8a8a8e]">{student.branch} • {formatYearLabel(student.year)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="h-8 px-3 rounded-lg bg-[#f5f5f7] hover:bg-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Record</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white">
          {/* Top Profile Card with Image Preview */}
          <div className="p-4 rounded-2xl border border-[#e3e4e8] bg-[#fafafc] flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-2xs">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[#e3e4e8] bg-white shadow-xs shrink-0 relative flex items-center justify-center">
              {student.profile_image ? (
                <img
                  src={student.profile_image}
                  alt={student.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <User className="w-10 h-10 text-[#8a8a8e]" />
              )}
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h4 className="text-base font-bold text-[#0a0a0a] tracking-tight">{student.name}</h4>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white text-[#0a0a0a] border border-[#e3e4e8]">
                  {student.roll_number}
                </span>
              </div>
              <p className="text-xs text-[#8a8a8e]">
                {student.branch} {student.section ? `• Section ${student.section}` : ""} • {formatYearLabel(student.year)}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0a66ff]/[0.08] text-[#0a66ff] border border-[#0a66ff]/20 text-[10.5px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                  Verified Student Profile
                </span>
                {student.blood_group && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10.5px] font-bold">
                    Blood Group: {student.blood_group}
                  </span>
                )}
              </div>
            </div>
          </div>

          {sections.map((sec, secIdx) => {
            const SecIcon = sec.icon;
            return (
              <div key={secIdx} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#e3e4e8]">
                  <SecIcon className="w-4 h-4 text-[#0a66ff]" />
                  <h4 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider">
                    {sec.title}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sec.fields.map((field) => (
                    <div
                      key={field.key}
                      className="p-2.5 rounded-xl bg-[#fafafc] border border-[#e3e4e8] flex items-center justify-between group hover:border-[#0a66ff]/40 transition-colors"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="block text-[10.5px] font-semibold text-[#8a8a8e] uppercase tracking-wider">
                          {field.label}
                        </span>
                        <span className="block text-xs font-semibold text-[#0a0a0a] truncate mt-0.5">
                          {field.value}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(field.key, field.value)}
                        className="p-1 rounded-md text-[#8a8a8e] hover:text-[#0a0a0a] opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy to clipboard"
                      >
                        {copiedField === field.key ? (
                          <Check className="w-3.5 h-3.5 text-[#0a66ff]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e3e4e8] bg-[#fafafc] flex items-center justify-between text-xs text-[#8a8a8e]">
          <span>Record ID: <code className="font-mono text-[#0a0a0a]">{student.id}</code></span>
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-xl bg-[#0a0a0a] hover:bg-[#2c2c2e] text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
