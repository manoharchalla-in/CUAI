"use client";

import { useState, useEffect } from "react";
import { 
  Wrench, 
  ShieldAlert, 
  Power, 
  Users, 
  CheckCircle2, 
  Search, 
  Loader2, 
  Unlock, 
  Crown
} from "lucide-react";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";

interface GlobalMaintenance {
  enabled: boolean;
  scope: string;
  title: string;
  message: string;
  estimatedEnd?: string;
}

interface AccountItem {
  id: string;
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  status: 'active' | 'maintenance' | 'suspended';
  created_at: string;
}

export default function MaintenancePage() {
  const [globalConfig, setGlobalConfig] = useState<GlobalMaintenance>({
    enabled: false,
    scope: 'all',
    title: 'Scheduled System Maintenance',
    message: 'The platform is currently undergoing routine maintenance and infrastructure upgrades. Service will resume shortly.',
    estimatedEnd: '30 Minutes'
  });
  const [allAccounts, setAllAccounts] = useState<AccountItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [successNotice, setSuccessNotice] = useState("");

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/super-admin/maintenance");
      const data = await res.json();

      if (data.global) {
        setGlobalConfig(data.global);
      }
      if (data.allAccounts) {
        setAllAccounts(data.allAccounts);
      }
    } catch (err) {
      console.error("Error loading maintenance data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickToggleGlobal = async () => {
    try {
      const nextEnabled = !globalConfig.enabled;
      setGlobalConfig((prev) => ({ ...prev, enabled: nextEnabled }));
      setSavingGlobal(true);

      const res = await fetch("/api/super-admin/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_global",
          ...globalConfig,
          enabled: nextEnabled
        }),
      });

      const data = await res.json();
      if (data.global) {
        setGlobalConfig(data.global);
      }
      setSuccessNotice(
        nextEnabled 
          ? "Global Maintenance Mode is now ENABLED. Non-admin users are locked out." 
          : "Global Maintenance Mode is now DISABLED. All services are live."
      );
      setTimeout(() => setSuccessNotice(""), 4000);
    } catch (err) {
      console.error("Failed to toggle global maintenance:", err);
    } finally {
      setSavingGlobal(false);
    }
  };

  const handleSaveGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingGlobal(true);
      const res = await fetch("/api/super-admin/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_global",
          ...globalConfig
        }),
      });

      const data = await res.json();
      if (data.global) {
        setGlobalConfig(data.global);
      }
      setSuccessNotice("Maintenance configuration saved successfully!");
      setTimeout(() => setSuccessNotice(""), 4000);
    } catch (err) {
      console.error("Failed to save global maintenance:", err);
    } finally {
      setSavingGlobal(false);
    }
  };

  const handleToggleUserMaintenance = async (account: AccountItem) => {
    try {
      setUpdatingUserId(account.id);
      const nextStatus = account.status === "maintenance" ? "active" : "maintenance";

      const res = await fetch("/api/super-admin/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_account_status",
          accountId: account.id,
          accountRole: account.role,
          status: nextStatus
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAllAccounts((prev) =>
          prev.map((a) => (a.id === account.id ? { ...a, status: nextStatus } : a))
        );
        setSuccessNotice(
          nextStatus === "maintenance"
            ? `Put "${account.name}" (${account.email}) into maintenance lockdown.`
            : `Restored active platform access for "${account.name}".`
        );
        setTimeout(() => setSuccessNotice(""), 4000);
      }
    } catch (err) {
      console.error("Failed to update account status:", err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredAccounts = allAccounts.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "user" && acc.role === "user") ||
      (roleFilter === "admin" && (acc.role === "admin" || acc.role === "superadmin"));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "maintenance" && acc.status === "maintenance") ||
      (statusFilter === "active" && acc.status === "active");

    return matchesSearch && matchesRole && matchesStatus;
  });

  const maintenanceAccountsCount = allAccounts.filter((a) => a.status === "maintenance").length;
  const activeAccountsCount = allAccounts.filter((a) => a.status === "active").length;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8a8a8e] bg-[#f5f5f7] min-h-screen font-sans">
        <Loader2 className="w-7 h-7 animate-spin text-[#0a0a0a] mb-3" />
        <p className="text-xs font-semibold text-[#0a0a0a]">Loading Maintenance Suite...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7] text-[#0a0a0a] font-sans">
      <SuperAdminHeader
        title="Maintenance Mode Control Center"
        subtitle="Global lockdown controls, per-account restriction switches, and downtime notice broadcast"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Success Alert Banner */}
        {successNotice && (
          <div className="p-3.5 rounded-xl bg-white border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Global Status Banner - Apple Glossy Pro Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] transition-all">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] text-white flex items-center justify-center shrink-0 shadow-xs">
                {globalConfig.enabled ? <Wrench className="w-5 h-5 animate-pulse" /> : <Power className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold tracking-tight text-[#0a0a0a]">
                    {globalConfig.enabled ? "GLOBAL PLATFORM MAINTENANCE IS ACTIVE" : "PLATFORM IS LIVE & FULLY OPERATIONAL"}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
                    {globalConfig.enabled ? `Scope: ${globalConfig.scope}` : "Online"}
                  </span>
                </div>
                <p className="text-xs text-[#8a8a8e] mt-1 max-w-2xl leading-relaxed">
                  {globalConfig.enabled 
                    ? `Public access is restricted for: ${globalConfig.scope.toUpperCase()}. Non-superadmins will see the maintenance screen.`
                    : "All students, chatbot users, and campus administrators can freely access the chatbot platform and admin consoles."}
                </p>
              </div>
            </div>

            {/* Quick Toggle Button */}
            <button
              type="button"
              onClick={handleQuickToggleGlobal}
              disabled={savingGlobal}
              className={`h-9 px-4 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50 shrink-0 active:scale-[0.98] ${
                globalConfig.enabled
                  ? "bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a]"
                  : "bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white hover:from-[#2c2c2e] hover:to-[#1c1c1e]"
              }`}
            >
              {savingGlobal ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Power className="w-3.5 h-3.5" />
                  <span>{globalConfig.enabled ? "Disable Global Lock" : "Enable Global Lock"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 1. Global Maintenance Mode Configuration Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e3e4e8] pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#0a0a0a]" />
              <h3 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider">
                1. Global Maintenance Mode Configuration
              </h3>
            </div>
            <span className="text-xs text-[#8a8a8e]">Universal visitor &amp; user access</span>
          </div>

          <form onSubmit={handleSaveGlobal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Scope Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#0a0a0a] mb-1.5">
                  Maintenance Target Scope
                </label>
                <select
                  value={globalConfig.scope}
                  onChange={(e) => setGlobalConfig({ ...globalConfig, scope: e.target.value })}
                  className="w-full h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs font-medium text-[#0a0a0a] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all"
                >
                  <option value="all">Entire Platform (Chatbot + Admin Panel + Public Intake)</option>
                  <option value="chatbot">Student Chatbot Only</option>
                  <option value="admin">Campus Admin Portal Only</option>
                  <option value="forms">Intake Registration Forms Only</option>
                </select>
              </div>

              {/* Estimated Downtime */}
              <div>
                <label className="block text-xs font-semibold text-[#0a0a0a] mb-1.5">
                  Estimated Downtime Notice
                </label>
                <input
                  type="text"
                  value={globalConfig.estimatedEnd || ""}
                  onChange={(e) => setGlobalConfig({ ...globalConfig, estimatedEnd: e.target.value })}
                  placeholder="e.g. 45 Minutes / Resuming at 9:00 PM IST"
                  className="w-full h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 font-medium transition-all"
                />
              </div>
            </div>

            {/* Custom Maintenance Title */}
            <div>
              <label className="block text-xs font-semibold text-[#0a0a0a] mb-1.5">
                Maintenance Screen Title
              </label>
              <input
                type="text"
                value={globalConfig.title}
                onChange={(e) => setGlobalConfig({ ...globalConfig, title: e.target.value })}
                placeholder="Scheduled System Maintenance"
                className="w-full h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 font-medium transition-all"
              />
            </div>

            {/* Custom Notice Message */}
            <div>
              <label className="block text-xs font-semibold text-[#0a0a0a] mb-1.5">
                Public Announcement / Description
              </label>
              <textarea
                rows={2}
                value={globalConfig.message}
                onChange={(e) => setGlobalConfig({ ...globalConfig, message: e.target.value })}
                placeholder="Detailed reason for maintenance..."
                className="w-full p-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 font-medium resize-none transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={savingGlobal}
                className="h-9 px-5 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl text-xs font-semibold transition-all shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
              >
                {savingGlobal ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Global Configuration</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 2. Granular Per-User & Admin Maintenance Management */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#e3e4e8] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0a0a0a]" />
                <h3 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider">
                  2. Per-Account Maintenance &amp; Target Lockdown
                </h3>
              </div>
              <p className="text-xs text-[#8a8a8e] mt-0.5">
                Put individual chatbot users or admin accounts into maintenance mode with 1 click
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-lg bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
                {maintenanceAccountsCount} in Maintenance
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#0a0a0a] text-white">
                {activeAccountsCount} Active
              </span>
            </div>
          </div>

          {/* Search & Filter Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8a8a8e] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search accounts by name or email..."
                className="w-full h-10 pl-10 pr-4 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-10 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs font-medium text-[#0a0a0a] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 cursor-pointer"
              >
                <option value="all">All Account Types</option>
                <option value="user">Chatbot Users (Students)</option>
                <option value="admin">Admin Panel Accounts</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs font-medium text-[#0a0a0a] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="maintenance">Locked (In Maintenance)</option>
                <option value="active">Active Accounts</option>
              </select>
            </div>
          </div>

          {/* Accounts List Table */}
          <div className="border border-[#e3e4e8] rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#fafafc] border-b border-[#e3e4e8] text-[10px] font-semibold text-[#8a8a8e] uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Account User</th>
                  <th className="py-3 px-4">Portal Type</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Maintenance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#3a3a3c]">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[#8a8a8e]">
                      <Users className="w-6 h-6 mx-auto mb-2 text-[#8a8a8e]" />
                      <p className="font-semibold text-[#0a0a0a]">No accounts match your filter criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => {
                    const isUnderMaintenance = account.status === "maintenance";
                    const isSuperAdmin = account.role === "superadmin";
                    const isUpdating = updatingUserId === account.id;

                    return (
                      <tr 
                        key={account.id} 
                        className={`transition-colors hover:bg-[#fafafc] ${
                          isUnderMaintenance ? "bg-[#f5f5f7]/60" : ""
                        }`}
                      >
                        {/* Name & Email */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-bold text-[#0a0a0a] flex items-center gap-1.5">
                            <span>{account.name}</span>
                            {isSuperAdmin && (
                              <Crown className="w-3.5 h-3.5 text-[#0a0a0a]" />
                            )}
                          </div>
                          <div className="text-[11px] text-[#8a8a8e] font-mono mt-0.5">
                            {account.email}
                          </div>
                        </td>

                        {/* Portal Role */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a]">
                            {account.roleLabel}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          {isUnderMaintenance ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0a0a0a] text-white">
                              <Wrench className="w-3 h-3 animate-pulse" />
                              <span>In Maintenance</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" />
                              <span>Active</span>
                            </span>
                          )}
                        </td>

                        {/* Action Button */}
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          {isSuperAdmin ? (
                            <span className="text-[10px] font-semibold text-[#8a8a8e]">
                              Super Admin (Exempt)
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleUserMaintenance(account)}
                              disabled={isUpdating}
                              className={`h-8 px-3.5 rounded-xl font-semibold text-xs transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ml-auto disabled:opacity-50 active:scale-[0.98] ${
                                isUnderMaintenance
                                  ? "bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white"
                                  : "bg-white hover:bg-[#0a0a0a] hover:text-white text-[#0a0a0a] border border-[#e3e4e8]"
                              }`}
                            >
                              {isUpdating ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : isUnderMaintenance ? (
                                <>
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>Restore Active</span>
                                </>
                              ) : (
                                <>
                                  <Wrench className="w-3.5 h-3.5" />
                                  <span>Put in Maintenance</span>
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
