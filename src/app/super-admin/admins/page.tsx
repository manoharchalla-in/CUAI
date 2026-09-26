"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Crown, 
  ShieldCheck, 
  UserPlus, 
  CheckCircle2, 
  X, 
  Lock, 
  Mail, 
  Key, 
  Building2, 
  Trash2, 
  ShieldAlert,
  Loader2,
  Copy,
  Check,
  RefreshCw
} from "lucide-react";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";
import { formatDate } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin";
  created_at?: string;
  status?: string;
}

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("Admin@12345");
  const [newRole, setNewRole] = useState<"admin" | "superadmin">("admin");
  const [modalLoading, setModalLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users?includeSuperAdmin=true");
      const data = await res.json();
      if (data.admins) {
        setAdmins(data.admins);
      }
    } catch (err) {
      console.error("Failed to load admins:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) return;

    setErrorMsg(null);
    setModalLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create admin account");
      }

      await fetchAdmins();
      setNewName("");
      setNewEmail("");
      setNewPassword("Admin@12345");
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add admin");
    } finally {
      setModalLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <SuperAdminHeader
        title="Admin Accounts & RBAC"
        subtitle="Manage authorized Campus Administrators and Master Super Admin accounts"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
                <Users className="w-4 h-4" />
              </span>
              <h1 className="text-xl font-bold text-[#0a0a0a] tracking-tight">
                Admin Panel Accounts & RBAC
              </h1>
            </div>
            <p className="text-xs text-[#8a8a8e] mt-1">
              Manage authorized Campus Administrators and Master Super Admin accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchAdmins}
              className="h-9 px-4 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-xs font-semibold text-[#0a0a0a] transition-colors flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer active:scale-[0.98]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#0a0a0a]" : "text-[#8a8a8e]"}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="h-9 flex items-center gap-2 px-4 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white rounded-xl text-xs font-semibold hover:from-[#2c2c2e] hover:to-[#1c1c1e] shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Admin Account</span>
            </button>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Admin Profile</th>
                  <th className="py-3 px-4">Login Email / Username</th>
                  <th className="py-3 px-4">Role Matrix</th>
                  <th className="py-3 px-4">Default Password</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#0a0a0a]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#8a8a8e]">
                      <Loader2 className="w-5 h-5 animate-spin text-[#0a0a0a] mx-auto mb-2" />
                      Loading administrator directory...
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#8a8a8e]">
                      No administrator accounts found.
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-[#fafafc] transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center font-bold text-xs shadow-2xs">
                            {admin.role === 'superadmin' ? <Crown className="w-4 h-4 text-[#0a0a0a]" /> : <ShieldCheck className="w-4 h-4 text-[#0a0a0a]" />}
                          </div>
                          <div>
                            <div className="font-bold text-[#0a0a0a]">{admin.name}</div>
                            <div className="text-[10px] text-[#8a8a8e] font-mono">ID: {admin.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#0a0a0a] font-semibold bg-[#f5f5f7] border border-[#e3e4e8] px-2.5 py-1 rounded-lg text-[11px]">
                            {admin.email}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(admin.email, `adm_${admin.id}`)}
                            className="text-[#8a8a8e] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                            title="Copy login email"
                          >
                            {copiedKey === `adm_${admin.id}` ? (
                              <Check className="w-3.5 h-3.5 text-[#0a0a0a]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          admin.role === "superadmin"
                            ? "bg-[#0a0a0a] text-white"
                            : "bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]"
                        }`}>
                          {admin.role === "superadmin" ? "Master Super Admin" : "Campus Admin"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                            Admin@12345
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard("Admin@12345", `pwd_${admin.id}`)}
                            className="text-[#8a8a8e] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                            title="Copy password"
                          >
                            {copiedKey === `pwd_${admin.id}` ? (
                              <Check className="w-3.5 h-3.5 text-[#0a0a0a]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#8a8a8e] font-mono text-[11px]">
                        {admin.created_at ? formatDate(admin.created_at) : "Active"}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <span className="inline-flex items-center gap-1.5 text-[#0a0a0a] bg-[#f5f5f7] border border-[#e3e4e8] px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" />
                          <span>Active</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Admin Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-[#e3e4e8] animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e4e8]">
              <div className="flex items-center gap-2 font-bold text-[#0a0a0a] text-sm">
                <UserPlus className="w-4 h-4 text-[#0a0a0a]" />
                <span>Create Administrator Account</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#8a8a8e] hover:text-[#0a0a0a] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddAdmin} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campus Admin Officer"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-10 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl px-3.5 text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1">
                  Login Email / Username
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full h-10 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl px-3.5 text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1">
                  Initial Password
                </label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl px-3.5 text-xs text-[#0a0a0a] font-mono focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1">
                  Role Authority
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full h-10 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl px-3.5 text-xs text-[#0a0a0a] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all font-medium"
                >
                  <option value="admin">Campus Admin (Admin Portal Access)</option>
                  <option value="superadmin">Master Super Admin (Full Root Access)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3e4e8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 rounded-xl border border-[#e3e4e8] bg-white text-[#0a0a0a] text-xs font-semibold hover:bg-[#f5f5f7] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="h-9 px-4 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {modalLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
