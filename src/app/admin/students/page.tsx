"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import StudentRosterView from "@/components/admin/StudentRosterView";

export default function AdminStudentsPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader
        title="Student Records Directory"
        subtitle="Master directory of all registered students, submitted intake form details, and academic batches"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <StudentRosterView panelType="admin" />
      </main>
    </div>
  );
}
