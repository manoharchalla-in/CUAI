"use client";

import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";
import StudentRosterView from "@/components/admin/StudentRosterView";

export default function SuperAdminStudentsPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7] text-[#0a0a0a] font-sans">
      <SuperAdminHeader
        title="Students & Form Submissions"
        subtitle="Master directory of all registered students, submitted intake form details, and academic batches across the entire institution"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <StudentRosterView panelType="superadmin" />
      </main>
    </div>
  );
}
