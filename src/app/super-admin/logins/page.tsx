"use client";

import { useState, useEffect } from "react";
import { 
  KeyRound, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  Loader2, 
  Lock, 
  Copy, 
  Check, 
  ExternalLink, 
  Bot, 
  Crown, 
  User, 
  Shield, 
  ShieldAlert 
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";

export default function SuperAdminLoginsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchLogins();
  }, []);

  const fetchLogins = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users?includeSuperAdmin=true");
      const data = await res.json();
      if (data.users) setUsers(data.users);
      if (data.admins) setAdmins(data.admins);
    } catch (err) {
      console.error("Error fetching logins:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredAdmins = admins.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.role?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <SuperAdminHeader
        title="Master Logins & Credentials Directory"
        subtitle="Centralized login credentials and direct access for Admin Panel officers and Chatbot accounts"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
                <KeyRound className="w-4 h-4" />
              </span>
              <h1 className="text-xl font-bold text-[#0a0a0a] tracking-tight">
                Master Logins & Credentials Directory
              </h1>
            </div>
            <p className="text-xs text-[#8a8a8e] mt-1">
              Centralized login details and access control for Admin Panel officers and Chatbot student accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchLogins}
              className="h-9 px-4 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-xs font-semibold text-[#0a0a0a] transition-all flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#0a0a0a]" : "text-[#8a8a8e]"}`} />
              <span>Refresh Directory</span>
            </button>
          </div>
        </div>

        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center text-[#0a0a0a] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Admin Panel Logins</div>
              <div className="text-2xl font-bold text-[#0a0a0a] mt-0.5">{admins.length}</div>
              <div className="text-[11px] text-[#8a8a8e] font-medium mt-0.5">Campus & Super Admins</div>
            </div>
          </div>

          <div className="p-5 bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center text-[#0a0a0a] flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Chatbot User Accounts</div>
              <div className="text-2xl font-bold text-[#0a0a0a] mt-0.5">{users.length}</div>
              <div className="text-[11px] text-[#8a8a8e] font-medium mt-0.5">Student Users</div>
            </div>
          </div>

          <div className="p-5 bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center text-[#0a0a0a] flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Auth Protection</div>
              <div className="text-2xl font-bold text-[#0a0a0a] mt-0.5">Active</div>
              <div className="text-[11px] text-[#8a8a8e] font-medium mt-0.5">JWT Cookie Protection</div>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8e]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, role or username..."
              className="w-full h-9 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] pl-9 pr-4 focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all font-medium"
            />
          </div>

          <span className="text-xs text-[#8a8a8e] hidden sm:inline font-mono">
            {filteredAdmins.length + filteredUsers.length} total accounts indexed
          </span>
        </div>

        {/* SECTION 1: ADMIN PANEL USER LOGIN DETAILS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
              <h2 className="text-sm font-bold text-[#0a0a0a] tracking-tight">
                Admin Panel User Login Details
              </h2>
            </div>
            <Link
              href="/admin/login"
              target="_blank"
              className="text-xs font-semibold text-[#0a0a0a] hover:underline flex items-center gap-1.5 transition-colors"
            >
              <span>Open Admin Login Page</span>
              <ExternalLink className="w-3 h-3 text-[#8a8a8e]" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Admin Name</th>
                    <th className="py-3 px-4">Login Email / Username</th>
                    <th className="py-3 px-4">Admin Role</th>
                    <th className="py-3 px-4">Default Password</th>
                    <th className="py-3 px-4">Direct Login Link</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#0a0a0a]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#8a8a8e]">
                        <Loader2 className="w-5 h-5 animate-spin text-[#0a0a0a] mx-auto mb-1" />
                        Loading admin credentials...
                      </td>
                    </tr>
                  ) : filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#8a8a8e]">
                        No matching admin accounts found.
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin) => (
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
                              onClick={() => copyToClipboard(admin.email, `adm_email_${admin.id}`)}
                              className="text-[#8a8a8e] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                              title="Copy email"
                            >
                              {copiedKey === `adm_email_${admin.id}` ? (
                                <Check className="w-3.5 h-3.5 text-[#0a0a0a]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
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
                              {admin.role === 'superadmin' ? 'mnbvcxz' : 'zxcvbnm'}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(admin.role === 'superadmin' ? 'mnbvcxz' : 'zxcvbnm', `adm_pwd_${admin.id}`)}
                              className="text-[#8a8a8e] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                              title="Copy default password"
                            >
                              {copiedKey === `adm_pwd_${admin.id}` ? (
                                <Check className="w-3.5 h-3.5 text-[#0a0a0a]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <Link
                            href={admin.role === 'superadmin' ? "/super-admin/login" : "/admin/login"}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] font-semibold text-[11px] transition-colors shadow-2xs"
                          >
                            <span>{admin.role === 'superadmin' ? '/super-admin/login' : '/admin/login'}</span>
                            <ExternalLink className="w-3 h-3 text-[#8a8a8e]" />
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <span className="inline-flex items-center gap-1 text-[#0a0a0a] bg-[#f5f5f7] border border-[#e3e4e8] px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
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
        </div>

        {/* SECTION 2: CHATBOT USERS & ACCESS DETAILS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
              <h2 className="text-sm font-bold text-[#0a0a0a] tracking-tight">
                Chatbot Student Users
              </h2>
            </div>
            <Link
              href="/login"
              target="_blank"
              className="text-xs font-semibold text-[#0a0a0a] hover:underline flex items-center gap-1.5 transition-colors"
            >
              <span>Open Chatbot Login Page</span>
              <ExternalLink className="w-3 h-3 text-[#8a8a8e]" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Student Name</th>
                    <th className="py-3 px-4">Login Email / Roll Number</th>
                    <th className="py-3 px-4">Default Password</th>
                    <th className="py-3 px-4">Direct Login URL</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#0a0a0a]">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#8a8a8e]">
                        <Loader2 className="w-5 h-5 animate-spin text-[#0a0a0a] mx-auto mb-1" />
                        Loading chatbot student accounts...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#8a8a8e]">
                        No matching student accounts found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#fafafc] transition-colors">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center font-bold text-xs shadow-2xs">
                              <Bot className="w-4 h-4 text-[#0a0a0a]" />
                            </div>
                            <div>
                              <div className="font-bold text-[#0a0a0a]">{user.name}</div>
                              <div className="text-[10px] text-[#8a8a8e] font-mono">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[#0a0a0a] font-semibold bg-[#f5f5f7] border border-[#e3e4e8] px-2.5 py-1 rounded-lg text-[11px]">
                              {user.email}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(user.email, `usr_email_${user.id}`)}
                              className="text-[#8a8a8e] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                              title="Copy email"
                            >
                              {copiedKey === `usr_email_${user.id}` ? (
                                <Check className="w-3.5 h-3.5 text-[#0a0a0a]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                              User@12345
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard("User@12345", `usr_pwd_${user.id}`)}
                              className="text-[#8a8a8e] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                              title="Copy default password"
                            >
                              {copiedKey === `usr_pwd_${user.id}` ? (
                                <Check className="w-3.5 h-3.5 text-[#0a0a0a]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <Link
                            href="/login"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] font-semibold text-[11px] transition-colors shadow-2xs"
                          >
                            <span>/login</span>
                            <ExternalLink className="w-3 h-3 text-[#8a8a8e]" />
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border font-semibold text-[10px] ${
                            user.status === 'suspended'
                              ? 'bg-[#f5f5f7] text-[#8a8a8e] border-[#e3e4e8]'
                              : 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'suspended' ? 'bg-[#8a8a8e]' : 'bg-white'}`} />
                            <span>{user.status === 'suspended' ? 'Suspended' : 'Active'}</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
