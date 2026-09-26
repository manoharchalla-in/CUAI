"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  Building2,
  Lock,
  Sparkles,
  Command,
  ArrowRight
} from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          loginType: "admin",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid administrator credentials");
      }

      if (redirectParam) {
        router.push(redirectParam);
      } else {
        router.push(data.redirectTo || "/admin/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden border border-[#e3e4e8] grid grid-cols-1 md:grid-cols-2 min-h-[540px] animate-fade-in">
      {/* Left Column: Clean White Form Panel */}
      <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14 bg-white">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center justify-center bg-black p-0.5">
              <img src="/logo.png" alt="CityApp Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-[#0a0a0a] uppercase">
                Campus Admin
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0a66ff]/[0.08] text-[#0a66ff] border border-[#0a66ff]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff] animate-pulse" />
                Live
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight">
            Admin Sign In
          </h1>
          <p className="text-xs text-[#8a8a8e] mt-1 mb-8">
            Enter administrator credentials to access system controls
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#8a8a8e] flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username / Email field */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#0a0a0a] font-semibold block">
                Administrator Username or Email
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin or admin@campus.edu"
                className="w-full h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#0a0a0a] font-semibold block">
                Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-3.5 pr-10 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 focus:bg-white transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8e] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white font-semibold text-xs rounded-xl transition-all shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/70" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Glossy Titanium / Apple Pro System Banner */}
      <div className="relative hidden md:flex flex-col justify-between p-10 lg:p-12 overflow-hidden bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white select-none border-l border-[#2c2c2e]">
        {/* Subtle Ambient Background Highlight */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#0a66ff]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Text Content */}
        <div className="relative z-10 pt-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/10 text-[10px] font-semibold mb-4 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0a66ff]" />
            <span>Campus Security Protocol</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
            Institutional <br /> Control Center
          </h2>
          <p className="text-white/60 text-xs font-normal mt-2 leading-relaxed">
            Centralized telemetry, student batch management, and automated campus knowledge routing.
          </p>
        </div>

        {/* Center/Bottom Illustration Card */}
        <div className="relative z-10 flex flex-col items-center justify-end mt-8">
          <div className="w-full max-w-[300px] bg-white/[0.06] backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0a66ff] animate-pulse" />
                <span className="text-[11px] font-semibold text-white/90">System Status</span>
              </div>
              <span className="text-[10px] font-mono text-white/50">v4.2 PRO</span>
            </div>

            <div className="space-y-2 py-1">
              <div className="flex items-center justify-between text-[10px] text-white/70">
                <span>RAG Knowledge Base</span>
                <span className="text-[#0a66ff] font-semibold">100% Synced</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#0a66ff] rounded-full w-full" />
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/70 pt-1">
                <span>Telemetry Streams</span>
                <span className="text-white/90 font-mono">Active</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white/40 rounded-full w-4/5" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[9px] text-white/50">
              <span>Encrypted Session</span>
              <span className="text-white/80 font-mono">SHA-256</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      <Suspense fallback={
        <div className="w-full max-w-4xl bg-white rounded-3xl p-12 text-center text-[#8a8a8e] text-xs border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)]">
          <Loader2 className="w-6 h-6 animate-spin text-[#0a66ff] mx-auto mb-2" />
          Loading admin portal...
        </div>
      }>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
