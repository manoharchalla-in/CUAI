"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E8F0] shadow-xs space-y-6 animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-[#F1F5F9] text-rose-600 font-mono text-xs font-bold uppercase tracking-wider">
            Access Restricted
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-3">
            Unauthorized
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            You do not have the required permissions or credentials to access this area.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="w-full sm:w-auto h-10 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </Link>
          <Link
            href="/chat"
            className="w-full sm:w-auto h-10 px-5 bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 text-[#64748B]" />
            <span>Back to Chat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
