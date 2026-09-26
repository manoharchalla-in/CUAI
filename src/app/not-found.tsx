"use client";

import Link from "next/link";
import { ArrowLeft, Home, Compass, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E8F0] shadow-xs space-y-6 animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-xs">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-[#F1F5F9] text-[#64748B] font-mono text-xs font-bold uppercase tracking-wider">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-3">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            The requested page or directory route could not be found on the server.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/chat"
            className="w-full sm:w-auto h-10 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Go to Chatbot</span>
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto h-10 px-5 bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 text-[#64748B]" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
