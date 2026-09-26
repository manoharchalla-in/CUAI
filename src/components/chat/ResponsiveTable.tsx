"use client";

import { ReactNode } from "react";

interface ResponsiveTableProps {
  children: ReactNode;
}

export default function ResponsiveTable({ children }: ResponsiveTableProps) {
  return (
    <div className="my-4 w-full rounded-2xl border border-[#e3e4e8] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_20px_rgba(0,0,0,0.02)] overflow-hidden transition-all">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#e3e4e8]">
        <table className="w-full text-left text-xs text-[#0a0a0a] border-collapse">
          {children}
        </table>
      </div>
    </div>
  );
}
