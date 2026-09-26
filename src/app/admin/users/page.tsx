"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Eye, 
  Search, 
  Loader2, 
  AlertCircle, 
  Bot, 
  X, 
  Sparkles
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { formatDate } from "@/lib/utils";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended";
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Add User State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Edit / Update User State
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "suspended">("active");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // View / See User State
  const [viewingUser, setViewingUser] = useState<UserItem | null>(null);

  // Delete User State
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
      if (data.admins) setAdmins(data.admins);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");

      setIsAddOpen(false);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      fetchUsers();
    } catch (err: any) {
      setAddError(err.message || "Failed to create user");
    } finally {
      setAddLoading(false);
    }
  };

  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditStatus(user.status);
    setEditPassword("");
    setEditError("");
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditError("");
    setEditLoading(true);

    try {
      const payload: any = {
        name: editName,
        email: editEmail,
        status: editStatus,
      };
      if (editPassword && editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");

      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      setEditError(err.message || "Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      const res = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setDeletingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader
        title="Chatbot User Directory"
        subtitle="Manage student and end-user accounts with exclusive access to the AI Chatbot"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Chatbot Access Scope Alert Banner */}
        <div className="p-4 rounded-2xl bg-white border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#0a0a0a]">
              Chatbot User Scope &amp; Permissions
            </h4>
            <p className="text-xs text-[#8a8a8e] mt-0.5 leading-relaxed">
              Users managed here are student and campus end-users with <strong className="text-[#0a0a0a]">exclusive access to the AI Chatbot (/chat)</strong>. They do not possess administrative permissions to modify academic records or configure intake forms.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#0a0a0a] tracking-tight">Registered Chatbot Users</h2>
            <p className="text-xs text-[#8a8a8e]">
              {users.length} active end-users &bull; Full CRUD controls
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="h-9 px-4 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Chatbot User</span>
          </button>
        </div>

        {/* Normal Chatbot Users Table */}
        <div className="bg-white rounded-2xl border border-[#e3e4e8] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)]">
          <div className="p-4 sm:p-5 border-b border-[#e3e4e8] flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-semibold text-[#0a0a0a]">
                Chatbot Users ({users.length})
              </h3>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8e]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] pl-9 pr-3.5 py-2 focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 font-medium transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10.5px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">User Name</th>
                  <th className="py-3 px-4 sm:px-6">Email Address</th>
                  <th className="py-3 px-4 sm:px-6">Access Scope</th>
                  <th className="py-3 px-4 sm:px-6">Account Status</th>
                  <th className="py-3 px-4 sm:px-6">Created Date</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[#8a8a8e]">
                      <Loader2 className="w-6 h-6 animate-spin text-[#0a66ff] mx-auto mb-2" />
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[#8a8a8e]">
                      No matching users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#fafafc] transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] flex items-center justify-center font-bold text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-[#0a0a0a]">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-[#0a0a0a]">
                        {user.email}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#f5f5f7] text-[#0a0a0a] text-[10px] font-semibold border border-[#e3e4e8]">
                          <Bot className="w-3 h-3 text-[#0a66ff]" />
                          Chatbot Only
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border transition-all cursor-pointer ${
                            user.status === "active"
                              ? "bg-white text-[#0a0a0a] border-[#e3e4e8] shadow-2xs"
                              : "bg-[#f5f5f7] text-[#8a8a8e] border-[#e3e4e8]"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-[#0a66ff]" : "bg-[#8a8a8e]"}`} />
                          <span>{user.status === "active" ? "Active" : "Suspended"}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-[#8a8a8e]">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* See / View Button */}
                          <button
                            type="button"
                            onClick={() => setViewingUser(user)}
                            className="w-7 h-7 rounded-lg bg-white border border-[#e3e4e8] hover:bg-[#f5f5f7] text-[#8a8a8e] hover:text-[#0a0a0a] flex items-center justify-center transition-colors"
                            title="See User Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Update / Edit Button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            className="w-7 h-7 rounded-lg bg-white border border-[#e3e4e8] hover:bg-[#f5f5f7] text-[#8a8a8e] hover:text-[#0a0a0a] flex items-center justify-center transition-colors"
                            title="Update / Edit User"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingUser(user)}
                            className="w-7 h-7 rounded-lg bg-white border border-[#e3e4e8] hover:bg-rose-50 text-[#8a8a8e] hover:text-rose-600 flex items-center justify-center transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 1. Add User Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#e3e4e8] rounded-2xl w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e4e8]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[#0a0a0a]">Add New Chatbot User</h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 text-[#8a8a8e] hover:text-[#0a0a0a] rounded-lg hover:bg-[#f5f5f7] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4 text-xs pt-4">
              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Ramesh Reddy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="ramesh.reddy@student.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 font-medium transition-all"
                />
              </div>

              <div className="p-3 bg-[#fafafc] rounded-xl border border-[#e3e4e8] text-[11px] text-[#8a8a8e] flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#0a66ff] flex-shrink-0" />
                <span>Account will have standard access to the <strong className="text-[#0a0a0a]">AI Chatbot (/chat)</strong>.</span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#e3e4e8]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="h-9 px-4 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] font-semibold shadow-2xs active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="h-9 px-5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {addLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Update / Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#e3e4e8] rounded-2xl w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e4e8]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[#0a0a0a]">Update Chatbot User</h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-[#8a8a8e] hover:text-[#0a0a0a] rounded-lg hover:bg-[#f5f5f7] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4 text-xs pt-4">
              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Reset Password (Optional)</label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="New password (leave blank to keep current)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as "active" | "suspended")}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] font-medium focus:outline-none focus:border-[#0a66ff]"
                >
                  <option value="active">Active (Access to Chatbot)</option>
                  <option value="suspended">Suspended (Access Revoked)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#e3e4e8]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="h-9 px-4 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] font-semibold shadow-2xs active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="h-9 px-5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {editLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Edit3 className="w-3.5 h-3.5" />}
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. See / View User Details Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#e3e4e8] rounded-2xl w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6 animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e4e8]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[#0a0a0a]">User Profile &amp; Access</h3>
              </div>
              <button
                onClick={() => setViewingUser(null)}
                className="p-1.5 text-[#8a8a8e] hover:text-[#0a0a0a] rounded-lg hover:bg-[#f5f5f7] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#fafafc] rounded-xl border border-[#e3e4e8] space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8e]">User ID:</span>
                <span className="font-mono font-semibold text-[#0a0a0a]">{viewingUser.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8e]">Full Name:</span>
                <span className="font-semibold text-[#0a0a0a]">{viewingUser.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8e]">Email Address:</span>
                <span className="font-mono text-[#0a0a0a]">{viewingUser.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8e]">Assigned Role:</span>
                <span className="px-2 py-0.5 bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8] rounded-md font-semibold text-[10px]">
                  End-User
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8e]">Permitted Route:</span>
                <span className="font-mono font-semibold text-[#0a0a0a]">/chat (Chatbot Interface Only)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8e]">Admin Permissions:</span>
                <span className="text-[#8a8a8e] font-semibold">None (Restricted)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8e]">Account Status:</span>
                <span className="px-2.5 py-0.5 rounded-full font-semibold text-[10px] bg-white border border-[#e3e4e8] text-[#0a0a0a] shadow-2xs">
                  {viewingUser.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8e]">Member Since:</span>
                <span className="text-[#0a0a0a]">{formatDate(viewingUser.created_at)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="h-9 px-5 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete User Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteUser}
        title={`Delete user account "${deletingUser?.name}"?`}
        description={`This will permanently remove the chatbot user (${deletingUser?.email}) and wipe their conversation history.`}
      />
    </div>
  );
}
