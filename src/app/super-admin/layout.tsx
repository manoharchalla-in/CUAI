"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isLoginPage = pathname === "/super-admin/login" || pathname?.startsWith("/super-admin/login/");

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-[#f5f5f7] text-[#0a0a0a] font-sans antialiased overflow-x-hidden selection:bg-[#0a0a0a] selection:text-white">
      <SuperAdminSidebar
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
