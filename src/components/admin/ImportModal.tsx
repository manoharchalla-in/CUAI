"use client";

import { useState } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2, AlertTriangle, Layers } from "lucide-react";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string;
  folderName?: string;
  onSuccess: () => void;
}

export default function ImportModal({
  isOpen,
  onClose,
  folderId,
  folderName,
  onSuccess,
}: ImportModalProps) {
  const [fileContent, setFileContent] = useState("");
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationReport, setValidationReport] = useState<{ validCount: number; duplicateCount: number; sampleRows: any[] } | null>(null);
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text);
      if (file.name.endsWith(".json")) setFormat("json");
      else setFormat("csv");
      runPreValidation(text, file.name.endsWith(".json") ? "json" : "csv");
    };
    reader.readAsText(file);
  };

  const parseCsv = (csvText: string) => {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, "").toLowerCase());
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
      const obj: Record<string, any> = {};

      headers.forEach((h, index) => {
        let key = h;
        if (h.includes("name")) key = "name";
        else if (h.includes("roll")) key = "roll_number";
        else if (h.includes("branch")) key = "branch";
        else if (h.includes("section")) key = "section";
        else if (h.includes("email")) key = "email";
        else if (h.includes("phone")) key = "phone";
        else if (h.includes("college")) key = "college";
        else if (h.includes("skill")) key = "skills";
        else if (h.includes("year")) key = "year";

        obj[key] = values[index] || "";
      });

      if (obj.name && (obj.roll_number || obj.email)) {
        records.push(obj);
      }
    }
    return records;
  };

  const runPreValidation = (content: string, fmt: "csv" | "json") => {
    try {
      let records: any[] = [];
      if (fmt === "json") records = JSON.parse(content);
      else records = parseCsv(content);

      const rollSet = new Set<string>();
      let dupes = 0;
      for (const r of records) {
        const roll = r.roll_number?.trim().toLowerCase();
        if (roll) {
          if (rollSet.has(roll)) dupes++;
          else rollSet.add(roll);
        }
      }

      setValidationReport({
        validCount: records.length,
        duplicateCount: dupes,
        sampleRows: records.slice(0, 3),
      });
    } catch (e) {
      setValidationReport(null);
    }
  };

  const handleImport = async () => {
    if (!fileContent.trim()) {
      setError("Please paste or upload CSV or JSON data.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let records: any[] = [];
      if (format === "json") {
        records = JSON.parse(fileContent);
      } else {
        records = parseCsv(fileContent);
      }

      if (records.length === 0) {
        throw new Error("No valid student records could be parsed from input.");
      }

      const res = await fetch("/api/admin/students/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder_id: folderId,
          records,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to import records");

      setResult({ imported: data.importedCount, skipped: data.skippedCount });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to parse and import data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-[#e3e4e8] rounded-2xl w-full max-w-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden animate-scale-up">
        <div className="px-6 py-4 border-b border-[#e3e4e8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#0a0a0a]">
              Import Students {folderName ? `to ${folderName}` : ""}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result ? (
            <div className="p-6 rounded-2xl bg-[#fafafc] border border-[#e3e4e8] text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#0a66ff]/[0.08] text-[#0a66ff] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#0a0a0a]">Import Successful</h4>
              <p className="text-[#8a8a8e]">
                Successfully recorded <strong className="text-[#0a0a0a] font-bold">{result.imported}</strong> student rows ({result.skipped} skipped).
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 h-9 px-5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white font-semibold text-xs shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all"
              >
                Close &amp; View Roster
              </button>
            </div>
          ) : (
            <>
              {/* File upload drag drop */}
              <div className="border border-dashed border-[#e3e4e8] hover:border-[#0a0a0a] rounded-2xl p-6 text-center transition-colors bg-[#fafafc]">
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="import-file-input"
                />
                <label htmlFor="import-file-input" className="cursor-pointer flex flex-col items-center">
                  <FileText className="w-8 h-8 text-[#8a8a8e] mb-2" />
                  <span className="text-[#0a0a0a] font-semibold mb-0.5">Click to choose CSV or JSON file</span>
                  <span className="text-[11px] text-[#8a8a8e]">Supported formats: .csv, .json</span>
                </label>
              </div>

              {/* Pre-validation Report */}
              {validationReport && (
                <div className="p-3 bg-[#fafafc] rounded-xl border border-[#e3e4e8] text-[#0a0a0a] space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
                    <span>Pre-Import Validation: {validationReport.validCount} records parsed</span>
                  </div>
                  {validationReport.duplicateCount > 0 && (
                    <div className="text-[11px] text-[#8a8a8e] font-medium">
                      Notice: Found {validationReport.duplicateCount} duplicate roll numbers in upload file.
                    </div>
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-[#0a0a0a]">
                    Or paste raw CSV / JSON rows directly:
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFormat("csv")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        format === "csv" ? "bg-[#0a0a0a] text-white" : "bg-[#f5f5f7] text-[#8a8a8e] hover:text-[#0a0a0a]"
                      }`}
                    >
                      CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormat("json")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        format === "json" ? "bg-[#0a0a0a] text-white" : "bg-[#f5f5f7] text-[#8a8a8e] hover:text-[#0a0a0a]"
                      }`}
                    >
                      JSON
                    </button>
                  </div>
                </div>

                <textarea
                  rows={5}
                  value={fileContent}
                  onChange={(e) => {
                    setFileContent(e.target.value);
                    runPreValidation(e.target.value, format);
                  }}
                  placeholder={
                    format === "csv"
                      ? "Name,Roll Number,Branch,Email,Skills,College\nSai,23CSE001,CSE,sai@example.com,\"Java, Python\",Campus Engineering"
                      : '[{\n  "name": "Sai",\n  "roll_number": "23CSE001",\n  "branch": "CSE",\n  "email": "sai@example.com"\n}]'
                  }
                  className="w-full p-3 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] font-mono focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 resize-none text-[11px] font-medium transition-all"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#e3e4e8]">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 px-4 rounded-xl border border-[#e3e4e8] bg-white hover:bg-[#fafafc] text-[#0a0a0a] font-semibold text-xs shadow-2xs active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={loading || !fileContent.trim()}
                  className="h-9 px-5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white font-semibold text-xs shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] flex items-center gap-1.5 disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  Commit Ingestion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
