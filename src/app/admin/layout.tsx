"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import MaintenanceScreen from "@/components/MaintenanceScreen";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMaintenanceBlocked, setIsMaintenanceBlocked] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // If on admin login page, isolate completely and do not render sidebar or admin features!
  const isLoginPage = pathname === "/admin/login" || pathname?.startsWith("/admin/login/");

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    async function checkMaintenance() {
      try {
        const res = await fetch("/api/system/maintenance?scope=admin");
        const data = await res.json();
        if (data.isBlocked) {
          setIsMaintenanceBlocked(true);
          setMaintenanceData(data);
          return true;
        } else {
          setIsMaintenanceBlocked(false);
          setMaintenanceData(null);
          return false;
        }
      } catch (e) {
        console.error("Maintenance check failed:", e);
        return false;
      } finally {
        setChecking(false);
      }
    }

    checkMaintenance();

    // Periodic polling every 8 seconds for real-time responsiveness
    const interval = setInterval(checkMaintenance, 8000);
    return () => clearInterval(interval);
  }, [isLoginPage]);

  const handleLogout = () => {
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!checking && isMaintenanceBlocked && maintenanceData) {
    const globalSettings = maintenanceData.globalSettings || {};
    return (
      <MaintenanceScreen
        title={globalSettings.title || "Campus Admin Portal Under Maintenance"}
        message={
          maintenanceData.userMaintenance
            ? "Your administrator account is currently undergoing maintenance and security review. Please contact Super Admin for access."
            : globalSettings.message || "The Admin Panel is temporarily undergoing scheduled maintenance."
        }
        estimatedEnd={globalSettings.estimatedEnd}
        scope="Campus Admin Portal"
        isAccountSpecific={maintenanceData.userMaintenance}
        role="admin"
        onRefresh={async () => {
          const res = await fetch("/api/system/maintenance?scope=admin");
          const data = await res.json();
          if (!data.isBlocked) {
            setIsMaintenanceBlocked(false);
            setMaintenanceData(null);
          }
        }}
      />
    );
  }

  return (
    <div className="h-screen bg-[#f5f5f7] text-[#0a0a0a] flex overflow-hidden font-sans antialiased">
      <AdminSidebar
        onLogout={handleLogout}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#f5f5f7]">
        {children}
      </div>
    </div>
  );
}
