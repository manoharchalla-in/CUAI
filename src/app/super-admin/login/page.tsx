"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Crown, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  Terminal,
  ShieldCheck,
  Lock
} from "lucide-react";

function SuperAdminLoginForm() {
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
          loginType: "superadmin",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid super administrator credentials");
      }

      if (redirectParam) {
        router.push(redirectParam);
      } else {
        router.push(data.redirectTo || "/super-admin/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden border border-[#e3e4e8] grid grid-cols-1 md:grid-cols-2 min-h-[540px] animate-fade-in">
      {/* Left Column: Apple Clean Form Panel */}
      <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14 bg-white">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
              <Crown className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold tracking-widest text-[#0a0a0a] uppercase font-mono">
              SUPER ADMIN PRO
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-[#0a0a0a] tracking-tight">
            Root Login
          </h1>
          <p className="text-xs text-[#8a8a8e] mt-1 mb-8">
            Authenticate to access the master root control console
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username field */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#0a0a0a] font-semibold block">
                Super Admin Email / Username
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. 999"
                className="w-full h-11 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl px-3.5 text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all font-medium"
              />
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#0a0a0a] font-semibold block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl px-3.5 pr-10 text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all font-medium font-mono"
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
              className="w-full h-11 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white font-semibold text-xs rounded-xl transition-all shadow-[0_2px_8px_rgba(0,0,0,0.16)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Authenticate Session</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Dark Titanium Apple Glossy Pro Banner */}
      <div className="relative hidden md:flex flex-col justify-between p-10 lg:p-12 overflow-hidden bg-gradient-to-b from-[#1c1c1e] via-[#121214] to-[#0a0a0a] select-none text-white border-l border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        {/* Subtle radial ambient highlight */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Text Content */}
        <div className="relative z-10 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-semibold tracking-wider text-white/90 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ROOT PRIVILEGES REQUIRED</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Master Root <br /> Control Center
          </h2>
          <p className="text-[#8a8a8e] text-xs font-medium mt-2">
            Secure administrative console with full telemetry, neural model switching, and database snapshots.
          </p>
        </div>

        {/* Center/Bottom Illustration Card */}
        <div className="relative z-10 flex flex-col items-center justify-end mt-6">
          <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center">
            <div className="w-60 h-48 bg-[#18181b]/90 backdrop-blur-xl rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.5)] p-4 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="text-[10px] font-bold text-white tracking-wide">Root Console</span>
                </div>
                <Crown className="w-3.5 h-3.5 text-white/80" />
              </div>
              <div className="space-y-2 py-1">
                <div className="h-2 bg-white/10 rounded-full w-4/5" />
                <div className="h-2 bg-white/10 rounded-full w-full" />
                <div className="h-2 bg-white/20 rounded-full w-2/3" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[9px] text-[#8a8a8e] font-medium">
                <span>System Health</span>
                <span className="text-white font-bold">100% Operational</span>
              </div>
            </div>

            <div className="absolute -top-2 -right-2 bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] text-white p-2.5 rounded-2xl shadow-xl border border-white/15">
              <Crown className="w-4 h-4" />
            </div>
            <div className="absolute -bottom-2 -left-2 bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] text-white p-2.5 rounded-2xl shadow-xl border border-white/15">
              <Terminal className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      <Suspense fallback={
        <div className="w-full max-w-4xl bg-white rounded-3xl p-12 text-center text-[#8a8a8e] text-xs border border-[#e3e4e8] shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <Loader2 className="w-6 h-6 animate-spin text-[#0a0a0a] mx-auto mb-2" />
          Loading root console...
        </div>
      }>
        <SuperAdminLoginForm />
      </Suspense>
    </div>
  );
}
