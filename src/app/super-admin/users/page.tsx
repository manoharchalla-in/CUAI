"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  ShieldCheck, 
  Bot, 
  Search, 
  Trash2, 
  Edit, 
  Loader2, 
  RefreshCw, 
  Crown, 
  Lock, 
  UserPlus, 
  Check, 
  X,
  AlertCircle
} from "lucide-react";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";
import { formatDate } from "@/lib/utils";

interface Account {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "user";
  status?: "active" | "suspended";
  created_at: string;
}

export default function SuperAdminAllUsersPage() {
  const [users, setUsers] = useState<Account[]>([]);
  const [admins, setAdmins] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState<"all" | "admins" | "chatbot">("all");

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "superadmin" | "admin" | "user",
    status: "active" as "active" | "suspended"
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Delete Confirm Modal
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<Account | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
      if (data.admins) setAdmins(data.admins);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleOpenAdd = (defaultRole: "superadmin" | "admin" | "user" = "user") => {
    setModalMode("add");
    setCurrentId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: defaultRole,
      status: "active"
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc: Account) => {
    setModalMode("edit");
    setCurrentId(acc.id);
    setFormData({
      name: acc.name,
      email: acc.email,
      password: "",
      role: acc.role,
      status: acc.status || "active"
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      if (modalMode === "add") {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");
        showSuccess(`Account "${formData.name}" created successfully!`);
      } else {
        const res = await fetch(`/api/admin/users/${currentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update account");
        showSuccess(`Account "${formData.name}" updated successfully!`);
      }

      setIsModalOpen(false);
      fetchAccounts();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmUser) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/users/${deleteConfirmUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete account");

      showSuccess(`Account "${deleteConfirmUser.name}" deleted permanently.`);
      setDeleteConfirmUser(null);
      fetchAccounts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (acc: Account) => {
    const nextStatus = acc.status === "suspended" ? "active" : "suspended";
    try {
      const res = await fetch(`/api/admin/users/${acc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, role: acc.role }),
      });
      if (res.ok) {
        showSuccess(`Account ${acc.email} is now ${nextStatus}.`);
        fetchAccounts();
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const allAccounts: Account[] = [
    ...admins.map(a => ({ ...a, role: (a.role || "admin") as "superadmin" | "admin" })),
    ...users.map(u => ({ ...u, role: "user" as const }))
  ];

  const filteredAccounts = allAccounts.filter(acc => {
    const matchesSearch = 
      acc.name.toLowerCase().includes(search.toLowerCase()) ||
      acc.email.toLowerCase().includes(search.toLowerCase()) ||
      acc.role.toLowerCase().includes(search.toLowerCase());

    const matchesTab = 
      tabFilter === "all" ||
      (tabFilter === "admins" && (acc.role === "admin" || acc.role === "superadmin")) ||
      (tabFilter === "chatbot" && acc.role === "user");

    return matchesSearch && matchesTab;
  });

  const totalAccounts = allAccounts.length;
  const totalAdmins = admins.length;
  const totalChatbotUsers = users.length;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8a8a8e] bg-[#f5f5f7] min-h-screen font-sans">
        <Loader2 className="w-7 h-7 animate-spin text-[#0a0a0a] mb-3" />
        <p className="text-xs font-semibold text-[#0a0a0a]">Loading Accounts...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7] text-[#0a0a0a] font-sans">
      <SuperAdminHeader
        title="All Users & System Accounts"
        subtitle="Global directory of student chatbot logins, campus administrative officers, and root master credentials"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-white border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#0a0a0a] tracking-tight">Platform User Directory</h1>
            <p className="text-xs text-[#8a8a8e] mt-0.5">Manage credentials, administrative roles, and platform permissions.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchAccounts}
              className="h-9 px-3 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleOpenAdd("admin")}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Add Admin Account</span>
            </button>

            <button
              onClick={() => handleOpenAdd("user")}
              className="h-9 px-4 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Chatbot User</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[135px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8a8a8e]">Total Accounts</span>
              <Users className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a] my-1">{totalAccounts}</div>
            <div className="text-[11px] text-[#8a8a8e] font-medium">All Platform Users &amp; Staff</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[135px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8a8a8e]">Admin Logins</span>
              <ShieldCheck className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a] my-1">{totalAdmins}</div>
            <div className="text-[11px] text-[#0a0a0a] font-semibold">Campus Console Access</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[135px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8a8a8e]">Chatbot Users</span>
              <Bot className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a] my-1">{totalChatbotUsers}</div>
            <div className="text-[11px] text-[#8a8a8e] font-medium">Registered Student Users</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[135px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8a8a8e]">Authentication Mode</span>
              <Lock className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <div className="text-2xl font-bold text-[#0a0a0a] my-1 tracking-tight">JWT + BCrypt</div>
            <div className="text-[11px] text-[#8a8a8e] font-medium">Zero-Login Chat Option Active</div>
          </div>
        </div>

        {/* Filter Bar & Table Container */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden space-y-4">
          {/* Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-[#e3e4e8] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fafafc]">
            {/* Tab Filter */}
            <div className="flex items-center gap-1 bg-[#f5f5f7] p-1 rounded-xl text-xs font-semibold w-full sm:w-auto border border-[#e3e4e8]">
              <button
                onClick={() => setTabFilter("all")}
                className={`h-7 px-3.5 rounded-lg transition-all ${
                  tabFilter === "all" ? "bg-white text-[#0a0a0a] shadow-xs font-bold" : "text-[#8a8a8e] hover:text-[#0a0a0a]"
                }`}
              >
                All ({totalAccounts})
              </button>
              <button
                onClick={() => setTabFilter("admins")}
                className={`h-7 px-3.5 rounded-lg transition-all ${
                  tabFilter === "admins" ? "bg-white text-[#0a0a0a] shadow-xs font-bold" : "text-[#8a8a8e] hover:text-[#0a0a0a]"
                }`}
              >
                Admins ({totalAdmins})
              </button>
              <button
                onClick={() => setTabFilter("chatbot")}
                className={`h-7 px-3.5 rounded-lg transition-all ${
                  tabFilter === "chatbot" ? "bg-white text-[#0a0a0a] shadow-xs font-bold" : "text-[#8a8a8e] hover:text-[#0a0a0a]"
                }`}
              >
                Chatbot Users ({totalChatbotUsers})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8e]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or role..."
                className="w-full h-9 bg-white border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] pl-10 pr-3.5 focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 font-medium transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Account Name &amp; Email</th>
                  <th className="py-3 px-4">Assigned Portal &amp; Role</th>
                  <th className="py-3 px-4">Access Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#3a3a3c]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#8a8a8e]">
                      <Loader2 className="w-6 h-6 animate-spin text-[#0a0a0a] mx-auto mb-2" />
                      Loading platform accounts...
                    </td>
                  </tr>
                ) : filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#8a8a8e]">
                      No matching accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((acc) => {
                    const isAdmin = acc.role === "admin" || acc.role === "superadmin";
                    const isSuper = acc.role === "superadmin";

                    return (
                      <tr key={acc.id} className="hover:bg-[#fafafc] transition-colors">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-[#f5f5f7] border border-[#e3e4e8] flex items-center justify-center font-bold text-xs text-[#0a0a0a]">
                              {isSuper ? <Crown className="w-3.5 h-3.5 text-[#0a0a0a]" /> : isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-[#0a0a0a]" /> : <Bot className="w-3.5 h-3.5 text-[#0a0a0a]" />}
                            </div>
                            <div>
                              <div className="font-bold text-[#0a0a0a] text-xs">{acc.name}</div>
                              <div className="text-[#8a8a8e] font-mono text-[11px]">{acc.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a]">
                            {isSuper ? "Master Super Admin" : isAdmin ? "Campus Admin Panel" : "Chatbot End-User"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleStatus(acc)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all border bg-[#f5f5f7] text-[#0a0a0a] border-[#e3e4e8] hover:bg-white"
                            title="Click to toggle status"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${acc.status === "suspended" ? "bg-[#8a8a8e]" : "bg-[#0a0a0a]"}`} />
                            <span className="capitalize">{acc.status || "active"}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-[#8a8a8e] font-mono text-[11px]">
                          {formatDate(acc.created_at)}
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(acc)}
                              className="p-1.5 rounded-lg border border-[#e3e4e8] bg-white hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a] text-[#636366] transition-all"
                              title="Edit Account"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmUser(acc)}
                              className="p-1.5 rounded-lg border border-[#e3e4e8] bg-white hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a] text-[#636366] transition-all"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {/* Add / Edit Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#e3e4e8] animate-scale-up space-y-4">
            <div className="flex items-center justify-between border-b border-[#e3e4e8] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0a0a0a] tracking-tight">
                  {modalMode === "add" ? "Create New Platform Account" : "Edit Account Profile"}
                </h3>
                <p className="text-xs text-[#8a8a8e] mt-0.5">
                  {modalMode === "add" ? "Configure login permissions and portal access." : "Update account credentials and status."}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-xs rounded-xl font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-9 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-9 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 font-medium font-mono transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1">
                  {modalMode === "add" ? "Account Password" : "New Password (leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  required={modalMode === "add"}
                  placeholder={modalMode === "add" ? "••••••••" : "Leave blank to preserve password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-9 px-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 font-medium transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0a0a0a] mb-1">Account Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full h-9 px-2.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs font-semibold text-[#0a0a0a] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10"
                  >
                    <option value="user">Chatbot User (Student)</option>
                    <option value="admin">Campus Administrator</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#0a0a0a] mb-1">Access Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full h-9 px-2.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs font-semibold text-[#0a0a0a] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10"
                  >
                    <option value="active">Active (Permitted)</option>
                    <option value="suspended">Suspended (Blocked)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#e3e4e8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 text-[#0a0a0a] hover:bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl font-semibold text-xs transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="h-9 px-5 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl font-semibold text-xs shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center gap-1.5 active:scale-[0.98] transition-all"
                >
                  {formLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{modalMode === "add" ? "Create Account" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-[#e3e4e8] animate-scale-up space-y-4">
            <div className="w-9 h-9 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0a0a0a] tracking-tight">Delete Account?</h3>
              <p className="text-xs text-[#8a8a8e] mt-1 leading-relaxed">
                Are you sure you want to delete <strong>{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})? This action cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="h-9 px-4 text-[#0a0a0a] hover:bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl font-semibold text-xs transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-9 px-4 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl font-semibold text-xs shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center gap-1.5 active:scale-[0.98]"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
