"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User as UserIcon, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/chat");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative overflow-hidden select-none">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#7c3aed]/5 via-[#6366f1]/5 to-[#3b82f6]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[440px] bg-white rounded-[28px] sm:rounded-[32px] shadow-[0_20px_60px_rgba(15,23,42,0.12)] overflow-hidden border border-[#E2E8F0] animate-fade-in relative z-10">
        {/* Top Gradient Banner matching Reference Image */}
        <div className="bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] pt-8 pb-7 px-6 flex flex-col items-center justify-center text-center relative">
          {/* Frosted Glass Logo Badge */}
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] p-2">
            <img 
              src="/logo.png" 
              alt="CityApp Logo" 
              className="w-10 h-10 rounded-xl object-cover shadow-xs ring-1 ring-white/40"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wider uppercase font-sans">
            CITYAPP AI
          </h1>
          <p className="text-xs text-white/90 font-medium mt-1">
            Create an account to access the AI Student Platform
          </p>
        </div>

        {/* Form Content Area */}
        <div className="p-6 sm:p-7 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Full Name:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="block w-full pl-10 pr-3.5 h-11 bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] placeholder-[#94A3B8] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 focus:border-[#7C3AED] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Student Email / Roll Number:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter student email or roll number"
                  className="block w-full pl-10 pr-3.5 h-11 bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] placeholder-[#94A3B8] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 focus:border-[#7C3AED] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Password:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="block w-full pl-10 pr-3.5 h-11 bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] placeholder-[#94A3B8] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 focus:border-[#7C3AED] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white font-bold text-xs shadow-[0_4px_16px_rgba(124,58,237,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Start Chatting</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
