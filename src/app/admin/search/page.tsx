"use client";

import { useState } from "react";
import { Search, GraduationCap, ArrowRight, Loader2, Sparkles } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { formatYearLabel } from "@/lib/utils";
import Link from "next/link";

export default function AdminSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/admin/students?search=${encodeURIComponent(searchTerm.trim())}&limit=50`);
      const data = await res.json();
      setResults(data.records || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader
        title="Global Student Database Search"
        subtitle="Multi-field exact & fuzzy query lookup across all academic years"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Search Hero Box */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e3e4e8] text-center w-full shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)]">
          <h2 className="text-xl font-semibold text-[#0a0a0a] mb-1.5 tracking-tight">Search Any Campus Record</h2>
          <p className="text-xs text-[#8a8a8e] mb-6 max-w-lg mx-auto">
            Search by student full name, roll number, department, technical skills, email address or batch year.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8e]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Sai, 23CSE001, Python, Mechanical..."
                className="w-full h-10 pl-10 pr-4 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 focus:bg-white transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-10 px-6 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white font-semibold text-xs shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="bg-white rounded-2xl border border-[#e3e4e8] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)]">
            <div className="p-4 sm:p-5 border-b border-[#e3e4e8] flex items-center justify-between bg-white">
              <h3 className="text-sm font-semibold text-[#0a0a0a] tracking-tight">
                Search Results ({results.length})
              </h3>
              <span className="text-xs text-[#8a8a8e] font-mono">
                Query: &quot;{searchTerm}&quot;
              </span>
            </div>

            {loading ? (
              <div className="text-center py-16 text-[#8a8a8e] text-xs">
                <Loader2 className="w-6 h-6 animate-spin text-[#0a66ff] mx-auto mb-2" />
                Searching all database tables...
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-16 text-[#8a8a8e] text-xs">
                No students found matching &quot;{searchTerm}&quot; across any academic batch.
              </div>
            ) : (
              <div className="divide-y divide-[#f2f2f7]">
                {results.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 sm:p-5 hover:bg-[#fafafc] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#0a0a0a]">{student.name}</span>
                        <span className="font-mono text-[#0a0a0a] font-semibold bg-[#f5f5f7] border border-[#e3e4e8] px-2 py-0.5 rounded-md text-[11px]">
                          {student.roll_number}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#f5f5f7] border border-[#e3e4e8] text-[10px] text-[#0a0a0a] font-semibold">
                          {formatYearLabel(student.year)}
                        </span>
                      </div>
                      <div className="text-[#8a8a8e] flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                        <span><strong className="text-[#0a0a0a] font-medium">Branch:</strong> {student.branch} {student.section ? `(${student.section})` : ""}</span>
                        <span><strong className="text-[#0a0a0a] font-medium">Email:</strong> {student.email}</span>
                        <span><strong className="text-[#0a0a0a] font-medium">College:</strong> {student.college}</span>
                      </div>
                      {student.skills && (
                        <div className="text-[#8a8a8e] pt-0.5 text-[11px]">
                          <strong className="text-[#0a0a0a] font-medium">Skills:</strong> {student.skills}
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/admin/folders/${student.year.replace("_", "-")}`}
                      className="h-8 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center gap-1.5 self-start sm:self-center transition-all shadow-2xs active:scale-[0.98] shrink-0"
                    >
                      <span>Open Folder</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8a8a8e]" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
