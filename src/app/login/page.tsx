"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  BookOpen, 
  GraduationCap 
} from "lucide-react";

function ChatbotLoginForm() {
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
          loginType: "user",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      if (redirectParam) {
        router.push(redirectParam);
      } else {
        router.push(data.redirectTo || "/chat");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_20px_60px_rgba(15,23,42,0.12)] overflow-hidden border border-[#E2E8F0] grid grid-cols-1 md:grid-cols-2 min-h-[560px] animate-fade-in">
      {/* Left Column: Clean White Form Panel */}
      <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14 bg-white">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 mb-8">
            <img 
              src="/logo.png" 
              alt="CityApp AI" 
              className="w-8 h-8 rounded-xl object-cover shadow-2xs ring-1 ring-black/5" 
            />
            <span className="text-sm font-extrabold tracking-wider text-[#111827] uppercase">
              CITYAPP AI
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
            Login
          </h1>
          <p className="text-xs text-[#64748B] mt-1 mb-8">
            Enter your account details
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div className="space-y-1">
              <label className="text-xs text-[#475569] font-bold block">
                Username / Email
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className="w-full bg-transparent border-b border-[#CBD5E1] focus:border-[#7C3AED] text-[#0F172A] text-sm py-2 px-0 focus:outline-none transition-colors placeholder:text-[#94A3B8]"
              />
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label className="text-xs text-[#475569] font-bold block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-[#CBD5E1] focus:border-[#7C3AED] text-[#0F172A] text-sm py-2 pr-8 px-0 focus:outline-none transition-colors placeholder:text-[#94A3B8] font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
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
              className="w-full h-11 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_4px_16px_rgba(124,58,237,0.35)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Vibrant Purple Chatbot Banner */}
      <div className="relative hidden md:flex flex-col justify-between p-10 lg:p-12 overflow-hidden bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] select-none">
        {/* Background ambient curved shapes */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Text Content */}
        <div className="relative z-10 pt-2">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Welcome to <br /> chatbot
          </h2>
          <p className="text-white/85 text-xs sm:text-sm font-medium mt-2">
            Login to access your chatbot account
          </p>
        </div>

        {/* Center/Bottom Clean Illustration Art */}
        <div className="relative z-10 flex flex-col items-center justify-end mt-6">
          <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center">
            {/* Embedded illustration representation */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Document / Card backplate */}
              <div className="w-56 h-44 bg-white rounded-2xl shadow-2xl p-4 border border-white/40 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="text-[10px] font-bold text-neutral-800">Student Dashboard</span>
                  </div>
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                </div>
                <div className="space-y-2 py-1">
                  <div className="h-2 bg-neutral-100 rounded-full w-4/5" />
                  <div className="h-2 bg-neutral-100 rounded-full w-full" />
                  <div className="h-2 bg-purple-100 rounded-full w-3/5" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[9px] text-neutral-500 font-semibold">
                  <span>AI Assistant Ready</span>
                  <span className="text-purple-600 font-bold">Active</span>
                </div>
              </div>

              {/* Floating study icon badges */}
              <div className="absolute -top-3 -right-2 bg-white text-purple-700 p-2.5 rounded-2xl shadow-lg border border-purple-100">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-2 -left-2 bg-white text-purple-700 p-2.5 rounded-2xl shadow-lg border border-purple-100">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Background ambient subtle glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={
        <div className="w-full max-w-4xl bg-white rounded-3xl p-12 text-center text-[#64748B] text-xs border border-[#E2E8F0] shadow-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#7C3AED] mx-auto mb-2" />
          Loading chatbot portal...
        </div>
      }>
        <ChatbotLoginForm />
      </Suspense>
    </div>
  );
}
