import JSZip from "jszip";
import type { StudentRecord, YearFolder } from "@/lib/db/schema";
import { formatYearLabel } from "@/lib/utils";

/**
 * Format a single student's complete profile text.
 */
export function formatStudentDetailsText(student: StudentRecord): string {
  return `
================================================================================
CAMPUS STUDENT RECORD: ${student.roll_number || "N/A"}
================================================================================

1. PERSONAL & BASIC INFORMATION
--------------------------------------------------------------------------------
Full Name            : ${student.name || "N/A"}
Registration / Roll  : ${student.roll_number || "N/A"}
Academic Year Batch  : ${formatYearLabel(student.year || "")} (${student.year || "N/A"})
Branch / Department  : ${student.branch || "N/A"}
Class Section        : ${student.section || "N/A"}
College / Institute  : ${student.college || "Campus Institute of Technology"}
Gender               : ${student.gender || "N/A"}
Date of Birth (DOB)  : ${student.dob || "N/A"}
Blood Group          : ${student.blood_group || "N/A"}
Aadhaar Number       : ${student.aadhaar_no || "N/A"}
Admission Type       : ${student.admission_type || "Convener"}
Reservation Category : ${student.reservation_category || "N/A"}
Mode of Transport    : ${student.mode_of_transport || "N/A"}
Accommodation Type   : ${student.accommodation_type || "Day Scholar"}

2. FAMILY DETAILS
--------------------------------------------------------------------------------
Father's Name        : ${student.father_name || "N/A"}
Father's Occupation  : ${student.father_occupation || "N/A"}
Mother's Name        : ${student.mother_name || "N/A"}
Mother's Occupation  : ${student.mother_occupation || "N/A"}

3. CONTACT & ADDRESS DETAILS
--------------------------------------------------------------------------------
Email Address        : ${student.email || "N/A"}
Primary Phone        : ${student.phone || student.permanent_phone || "N/A"}
Present Phone        : ${student.present_phone || "N/A"}
Permanent Phone      : ${student.permanent_phone || "N/A"}
Present Address      : ${student.present_address || student.address || "N/A"}
Present Pincode      : ${student.present_pincode || "N/A"}
Permanent Address    : ${student.permanent_address || student.address || "N/A"}
Permanent Pincode    : ${student.permanent_pincode || "N/A"}

4. PREVIOUS ACADEMIC RECORD
--------------------------------------------------------------------------------
Qualifying Course    : ${student.previous_course || "SSC / Intermediate / Diploma"}
SSC Marks / Score    : ${student.ssc_marks || student.previous_marks_obtained || "N/A"}
SSC Hall Ticket No   : ${student.ssc_hall_ticket_no || student.previous_sno || "N/A"}
Intermediate Marks   : ${student.intermediate_marks || student.previous_marks_obtained || "N/A"}
Inter Hall Ticket No : ${student.intermediate_hall_ticket_no || student.previous_sno || "N/A"}
Max Marks (Scale)    : ${student.previous_max_marks || "1000"}
Marks Obtained       : ${student.previous_marks_obtained || "N/A"}

5. EXTRACURRICULAR & SKILLS
--------------------------------------------------------------------------------
Technical Skills     : ${student.skills || "N/A"}
Achievements & Awards: ${student.achievements || "N/A"}
Extracurricular      : ${student.extracurricular || "N/A"}
Hobbies              : ${student.hobbies || "N/A"}
Sports Interested    : ${student.sports || "N/A"}
Profile Bio          : ${student.profile_info || "N/A"}

================================================================================
Generated on: ${new Date().toLocaleString()}
System: Campus Unified AI Platform
================================================================================
`.trim();
}

/**
 * Format academic marks text statement.
 */
export function formatAcademicMarksText(student: StudentRecord): string {
  const marksObt = parseFloat(student.previous_marks_obtained || student.intermediate_marks || "0");
  const maxM = parseFloat(student.previous_max_marks || "1000");
  const percentage = maxM > 0 && marksObt > 0 ? ((marksObt / maxM) * 100).toFixed(2) + "%" : "N/A";

  return `
================================================================================
ACADEMIC MARKS & EXAMINATION STATEMENT
================================================================================

Student Name         : ${student.name || "N/A"}
Roll Number / Regd   : ${student.roll_number || "N/A"}
Branch & Section     : ${student.branch || "N/A"} ${student.section ? `(Section ${student.section})` : ""}
Academic Batch       : ${formatYearLabel(student.year || "")}

--------------------------------------------------------------------------------
1. SECONDARY EDUCATION (SSC / 10th Standard)
--------------------------------------------------------------------------------
SSC Marks / GPA      : ${student.ssc_marks || "N/A"}
SSC Hall Ticket No.  : ${student.ssc_hall_ticket_no || "N/A"}

--------------------------------------------------------------------------------
2. HIGHER SECONDARY (Intermediate / +2 / Diploma)
--------------------------------------------------------------------------------
Intermediate Marks   : ${student.intermediate_marks || student.previous_marks_obtained || "N/A"}
Inter Hall Ticket No.: ${student.intermediate_hall_ticket_no || student.previous_sno || "N/A"}
Qualifying Course    : ${student.previous_course || "Intermediate / Secondary"}
Overall Percentage   : ${percentage}

--------------------------------------------------------------------------------
3. ADMISSION & ALLOTMENT
--------------------------------------------------------------------------------
Admission Category   : ${student.admission_type || "Convener"}
Reservation Category : ${student.reservation_category || "General / OC"}
Status               : Enrolled & Grounded in Knowledge Base

================================================================================
Record Generated: ${new Date().toLocaleString()}
================================================================================
`.trim();
}

/**
 * Generate a standalone, styled HTML profile page.
 */
export function generateStudentHtmlProfile(student: StudentRecord): string {
  const photoSrc = student.profile_image || "";
  const hasPhoto = !!photoSrc;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${student.roll_number} - ${student.name} | Student Record</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f5f5f7;
      color: #1d1d1f;
      padding: 32px 16px;
      line-height: 1.5;
    }
    .container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #e3e4e8;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1c1c1e 0%, #0a0a0a 100%);
      color: #ffffff;
      padding: 32px;
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }
    .avatar-box {
      width: 100px;
      height: 100px;
      border-radius: 16px;
      background: #2c2c2e;
      border: 3px solid rgba(255,255,255,0.2);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      flex-shrink: 0;
    }
    .avatar-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .header-info h1 {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .header-info .roll {
      display: inline-block;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 14px;
      font-weight: 700;
      background: rgba(255,255,255,0.15);
      padding: 4px 10px;
      border-radius: 8px;
      margin-top: 6px;
    }
    .header-info .sub {
      color: #8a8a8e;
      font-size: 13px;
      margin-top: 6px;
    }
    .content {
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .section {
      border: 1px solid #e3e4e8;
      border-radius: 14px;
      padding: 20px;
      background: #fafafc;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0a66ff;
      margin-bottom: 14px;
      border-bottom: 1px solid #e3e4e8;
      padding-bottom: 8px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px 20px;
    }
    .field-label {
      font-size: 11px;
      color: #8a8a8e;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .field-value {
      font-size: 13px;
      font-weight: 600;
      color: #0a0a0a;
      margin-top: 2px;
    }
    .footer {
      background: #fafafc;
      border-top: 1px solid #e3e4e8;
      padding: 16px 32px;
      font-size: 11px;
      color: #8a8a8e;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="avatar-box">
        ${hasPhoto ? `<img src="${photoSrc}" alt="${student.name}" />` : (student.name ? student.name.charAt(0) : "S")}
      </div>
      <div class="header-info">
        <h1>${student.name || "Student"}</h1>
        <div class="roll">${student.roll_number || "NO ROLL"}</div>
        <div class="sub">${student.branch || ""} ${student.section ? `• Section ${student.section}` : ""} • ${formatYearLabel(student.year || "")}</div>
      </div>
    </div>

    <div class="content">
      <div class="section">
        <div class="section-title">Personal &amp; Academic Info</div>
        <div class="grid">
          <div><div class="field-label">Student Name</div><div class="field-value">${student.name || "—"}</div></div>
          <div><div class="field-label">Roll Number</div><div class="field-value">${student.roll_number || "—"}</div></div>
          <div><div class="field-label">Branch</div><div class="field-value">${student.branch || "—"}</div></div>
          <div><div class="field-label">Class Section</div><div class="field-value">${student.section || "—"}</div></div>
          <div><div class="field-label">Year / Batch</div><div class="field-value">${formatYearLabel(student.year || "")}</div></div>
          <div><div class="field-label">Admission Type</div><div class="field-value">${student.admission_type || "—"}</div></div>
          <div><div class="field-label">Blood Group</div><div class="field-value">${student.blood_group || "—"}</div></div>
          <div><div class="field-label">Date of Birth</div><div class="field-value">${student.dob || "—"}</div></div>
          <div><div class="field-label">Aadhaar No.</div><div class="field-value">${student.aadhaar_no || "—"}</div></div>
          <div><div class="field-label">Gender</div><div class="field-value">${student.gender || "—"}</div></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Contact &amp; Address</div>
        <div class="grid">
          <div><div class="field-label">Email ID</div><div class="field-value">${student.email || "—"}</div></div>
          <div><div class="field-label">Primary Phone</div><div class="field-value">${student.phone || student.permanent_phone || "—"}</div></div>
          <div><div class="field-label">Accommodation</div><div class="field-value">${student.accommodation_type || "Day Scholar"}</div></div>
          <div><div class="field-label">Transport</div><div class="field-value">${student.mode_of_transport || "—"}</div></div>
          <div><div class="field-label">Present Address</div><div class="field-value">${student.present_address || student.address || "—"} ${student.present_pincode ? `(${student.present_pincode})` : ""}</div></div>
          <div><div class="field-label">Permanent Address</div><div class="field-value">${student.permanent_address || student.address || "—"} ${student.permanent_pincode ? `(${student.permanent_pincode})` : ""}</div></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Academic Marks &amp; Examination</div>
        <div class="grid">
          <div><div class="field-label">SSC Marks</div><div class="field-value">${student.ssc_marks || student.previous_marks_obtained || "—"}</div></div>
          <div><div class="field-label">SSC Hall Ticket</div><div class="field-value">${student.ssc_hall_ticket_no || student.previous_sno || "—"}</div></div>
          <div><div class="field-label">Inter / Diploma Marks</div><div class="field-value">${student.intermediate_marks || student.previous_marks_obtained || "—"}</div></div>
          <div><div class="field-label">Inter Hall Ticket</div><div class="field-value">${student.intermediate_hall_ticket_no || student.previous_sno || "—"}</div></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Skills &amp; Extracurricular</div>
        <div class="grid">
          <div><div class="field-label">Technical Skills</div><div class="field-value">${student.skills || "—"}</div></div>
          <div><div class="field-label">Achievements</div><div class="field-value">${student.achievements || "—"}</div></div>
          <div><div class="field-label">Extracurricular</div><div class="field-value">${student.extracurricular || "—"}</div></div>
          <div><div class="field-label">Hobbies / Sports</div><div class="field-value">${student.hobbies || student.sports || "—"}</div></div>
        </div>
      </div>
    </div>

    <div class="footer">
      Generated from Campus Unified Management System • Verified Grounded Directory
    </div>
  </div>
</body>
</html>`;
}

/**
 * Helper to process and attach image to student folder in zip.
 */
async function attachStudentPhotoToZip(
  studentFolderZip: JSZip,
  student: StudentRecord
): Promise<void> {
  const photo = student.profile_image;
  if (!photo) return;

  try {
    if (photo.startsWith("data:")) {
      // Data URI format: data:image/jpeg;base64,...
      const match = photo.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (match) {
        const ext = match[1] === "jpeg" ? "jpg" : match[1];
        const base64Data = match[2];
        studentFolderZip.file(`photo.${ext}`, base64Data, { base64: true });
        return;
      }
    }

    if (photo.startsWith("http://") || photo.startsWith("https://") || photo.startsWith("/")) {
      const res = await fetch(photo);
      if (res.ok) {
        const blob = await res.blob();
        const mime = blob.type;
        let ext = "jpg";
        if (mime.includes("png")) ext = "png";
        else if (mime.includes("webp")) ext = "webp";
        else if (mime.includes("gif")) ext = "gif";
        const buffer = await blob.arrayBuffer();
        studentFolderZip.file(`photo.${ext}`, buffer);
      }
    }
  } catch (err) {
    console.warn(`Could not attach photo for student ${student.roll_number}:`, err);
  }
}

/**
 * Add a single student's directory and files to a JSZip folder instance.
 */
export async function addStudentToZipFolder(
  parentZip: JSZip,
  student: StudentRecord
): Promise<void> {
  const cleanRoll = (student.roll_number || "UNKNOWN").replace(/[^a-zA-Z0-9_-]/g, "_");
  const cleanName = (student.name || "Student").replace(/[^a-zA-Z0-9_-]/g, "_");
  const folderName = `${cleanRoll}_${cleanName}`;

  const studentFolder = parentZip.folder(folderName);
  if (!studentFolder) return;

  // 1. Text Details
  studentFolder.file("details.txt", formatStudentDetailsText(student));

  // 2. JSON Data (remove large base64 from JSON if present to keep clean)
  const sanitizedStudent = { ...student, has_profile_photo: !!student.profile_image };
  if (sanitizedStudent.profile_image && sanitizedStudent.profile_image.startsWith("data:")) {
    sanitizedStudent.profile_image = "[Embedded Binary Photo Attached as photo.jpg]";
  }
  studentFolder.file("details.json", JSON.stringify(sanitizedStudent, null, 2));

  // 3. Academic Marks
  studentFolder.file("marks.txt", formatAcademicMarksText(student));

  // 4. HTML Standalone Viewer
  studentFolder.file("profile.html", generateStudentHtmlProfile(student));

  // 5. Photo File
  await attachStudentPhotoToZip(studentFolder, student);
}

/**
 * Build CSV string for a list of students.
 */
export function buildStudentsCsv(students: StudentRecord[]): string {
  const headers = [
    "Roll Number",
    "Name",
    "Year",
    "Branch",
    "Section",
    "Admission Type",
    "DOB",
    "Gender",
    "Blood Group",
    "Aadhaar No",
    "Email",
    "Phone",
    "Father Name",
    "Mother Name",
    "Present Address",
    "Permanent Address",
    "SSC Marks",
    "SSC Hall Ticket",
    "Inter Marks",
    "Inter Hall Ticket",
    "Accommodation",
    "Transport",
    "Skills",
    "Achievements"
  ];

  const rows = [headers.join(",")];
  for (const s of students) {
    rows.push([
      `"${s.roll_number || ""}"`,
      `"${(s.name || "").replace(/"/g, '""')}"`,
      `"${s.year || ""}"`,
      `"${(s.branch || "").replace(/"/g, '""')}"`,
      `"${s.section || ""}"`,
      `"${s.admission_type || ""}"`,
      `"${s.dob || ""}"`,
      `"${s.gender || ""}"`,
      `"${s.blood_group || ""}"`,
      `"${s.aadhaar_no || ""}"`,
      `"${s.email || ""}"`,
      `"${s.phone || s.permanent_phone || ""}"`,
      `"${(s.father_name || "").replace(/"/g, '""')}"`,
      `"${(s.mother_name || "").replace(/"/g, '""')}"`,
      `"${(s.present_address || s.address || "").replace(/"/g, '""')}"`,
      `"${(s.permanent_address || s.address || "").replace(/"/g, '""')}"`,
      `"${s.ssc_marks || s.previous_marks_obtained || ""}"`,
      `"${s.ssc_hall_ticket_no || s.previous_sno || ""}"`,
      `"${s.intermediate_marks || s.previous_marks_obtained || ""}"`,
      `"${s.intermediate_hall_ticket_no || s.previous_sno || ""}"`,
      `"${s.accommodation_type || ""}"`,
      `"${s.mode_of_transport || ""}"`,
      `"${(s.skills || "").replace(/"/g, '""')}"`,
      `"${(s.achievements || "").replace(/"/g, '""')}"`,
    ].join(","));
  }

  return rows.join("\n");
}

/**
 * Trigger browser file download from Blob.
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * EXPORT 1: Download Single Student Record ZIP (separate folder option)
 */
export async function downloadSingleStudentZip(student: StudentRecord): Promise<void> {
  const zip = new JSZip();
  await addStudentToZipFolder(zip, student);

  const cleanRoll = (student.roll_number || "student").replace(/[^a-zA-Z0-9_-]/g, "_");
  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });

  triggerBlobDownload(blob, `${cleanRoll}_record_folder.zip`);
}

/**
 * EXPORT 2: Download Entire Parent Folder ZIP (Main Parent Folder containing all child folders + data)
 */
export async function downloadParentFolderZip(
  folder: YearFolder,
  students: StudentRecord[],
  onProgress?: (percent: number, current: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folderSlug = folder.slug || "folder";
  const folderName = folder.name || folder.year_label || folderSlug;
  const rootFolderName = `${folderName.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

  const parentZipFolder = zip.folder(rootFolderName) || zip;

  // 1. Folder Overview & Metadata
  const folderInfo = `
================================================================================
ACADEMIC YEAR FOLDER ARCHIVE
================================================================================
Folder Title        : ${folder.name || folder.year_label || "Folder"}
Year Batch          : ${folder.year_label || folder.slug}
Slug                : ${folder.slug}
Description         : ${folder.description || "N/A"}
Total Students      : ${students.length}
Intake Form Status  : ${folder.is_form_active === 1 ? "Active / Open" : "Closed"}
Export Timestamp    : ${new Date().toLocaleString()}
================================================================================
`.trim();
  parentZipFolder.file("README_FOLDER_INFO.txt", folderInfo);

  // 2. Master Roster CSV
  const csvContent = buildStudentsCsv(students);
  parentZipFolder.file(`${folderSlug}_students_roster.csv`, csvContent);

  // 3. Master Roster JSON
  const cleanStudentsJson = students.map((s) => ({
    ...s,
    profile_image: s.profile_image ? (s.profile_image.startsWith("data:") ? "[Embedded Photo]" : s.profile_image) : null
  }));
  parentZipFolder.file(`${folderSlug}_students_roster.json`, JSON.stringify(cleanStudentsJson, null, 2));

  // 4. Populate each child student folder
  const total = students.length;
  for (let i = 0; i < total; i++) {
    const student = students[i];
    await addStudentToZipFolder(parentZipFolder, student);
    if (onProgress) {
      const pct = Math.round(((i + 1) / total) * 100);
      onProgress(pct, i + 1, total);
    }
  }

  // 5. Generate ZIP Blob
  const blob = await zip.generateAsync(
    {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 5 }
    },
    (metadata) => {
      if (onProgress && metadata.percent) {
        onProgress(Math.round(metadata.percent), total, total);
      }
    }
  );

  triggerBlobDownload(blob, `${folderSlug}_complete_archive.zip`);
}

/**
 * EXPORT 3: Download Selected Students ZIP from a Folder
 */
export async function downloadSelectedStudentsZip(
  folder: YearFolder,
  students: StudentRecord[],
  onProgress?: (percent: number, current: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folderSlug = folder.slug || "folder";
  const parentZipFolder = zip.folder(`${folderSlug}_selected_${students.length}_students`) || zip;

  parentZipFolder.file("selected_students.csv", buildStudentsCsv(students));

  const total = students.length;
  for (let i = 0; i < total; i++) {
    await addStudentToZipFolder(parentZipFolder, students[i]);
    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100), i + 1, total);
    }
  }

  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 5 }
  });

  triggerBlobDownload(blob, `${folderSlug}_selected_${students.length}_students.zip`);
}

/**
 * EXPORT 4: Download Master Archive of ALL Year Folders & Students
 */
export async function downloadMasterAllFoldersZip(
  folderGroups: { folder: YearFolder; students: StudentRecord[] }[],
  onProgress?: (percent: number, currentFolder: string) => void
): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder("Campus_All_Academic_Batches_Archive") || zip;

  rootFolder.file(
    "README_CAMPUS_ARCHIVE.txt",
    `
================================================================================
CAMPUS UNIFIED MASTER ACADEMIC ARCHIVE
================================================================================
Generated On: ${new Date().toLocaleString()}
Total Batches / Folders: ${folderGroups.length}
Total Enrolled Students: ${folderGroups.reduce((acc, g) => acc + g.students.length, 0)}
================================================================================
`.trim()
  );

  for (let fIdx = 0; fIdx < folderGroups.length; fIdx++) {
    const { folder, students } = folderGroups[fIdx];
    if (onProgress) {
      const pct = Math.round(((fIdx + 1) / folderGroups.length) * 100);
      onProgress(pct, folder.name || folder.slug);
    }

    const folderDir = rootFolder.folder(folder.slug || `folder_${fIdx + 1}`) || rootFolder;
    folderDir.file(`${folder.slug}_roster.csv`, buildStudentsCsv(students));

    for (const student of students) {
      await addStudentToZipFolder(folderDir, student);
    }
  }

  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 4 }
  });

  triggerBlobDownload(blob, "Campus_Master_All_Batches_Archive.zip");
}
