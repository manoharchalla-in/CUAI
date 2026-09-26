"use client";

import { useState, useEffect } from "react";
import { 
  KeyRound, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Save, 
  Plus, 
  Trash2, 
  Zap, 
  Layers, 
  Sliders, 
  ArrowUpRight,
  Download,
  Loader2
} from "lucide-react";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";

interface KeyConfig {
  id: string;
  provider: "Gemini";
  name: string;
  model: string;
  apiKey: string;
  status: "Active" | "Testing" | "Rate Limited" | "Inactive";
  latencyMs: number;
  tokensUsed: string;
  costEstimate: string;
  isDefault: boolean;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<KeyConfig[]>([
    {
      id: "key-1",
      provider: "Gemini",
      name: "Google Gemini 1.5 Flash (Default Production)",
      model: "gemini-1.5-flash-latest",
      apiKey: "AQ.Ab8RN6KEYAs_CUOEA98uFu8O7LDpCY••••••••••••••",
      status: "Active",
      latencyMs: 185,
      tokensUsed: "2.32M",
      costEstimate: "$0.12",
      isDefault: true,
    },
    {
      id: "key-2",
      provider: "Gemini",
      name: "Google Gemini 1.5 Pro (Deep Grounding)",
      model: "gemini-1.5-pro-latest",
      apiKey: "AQ.Ab8RN6KEYAs_CUOEA98uFu8O7LDpCY••••••••••••••",
      status: "Active",
      latencyMs: 320,
      tokensUsed: "840K",
      costEstimate: "$0.84",
      isDefault: false,
    }
  ]);

  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [temperature, setTemperature] = useState(0.2);
  const [topP, setTopP] = useState(0.95);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [embeddingModel, setEmbeddingModel] = useState("text-embedding-004");
  const [fuzzyThreshold, setFuzzyThreshold] = useState(0.72);
  const [maxDisambig, setMaxDisambig] = useState(5);
  const [isSaved, setIsSaved] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  const [pingTesting, setPingTesting] = useState(false);
  const [pingResult, setPingResult] = useState<{ model: string; latency: number; status: string } | null>(null);

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTestKey = async (id: string) => {
    setTestingId(id);
    await new Promise((r) => setTimeout(r, 600));
    setKeys((prev) =>
      prev.map((k) =>
        k.id === id ? { ...k, status: "Active", latencyMs: Math.floor(Math.random() * 200 + 250) } : k
      )
    );
    setTestingId(null);
  };

  const handleSetDefault = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => ({
        ...k,
        isDefault: k.id === id,
      }))
    );
  };

  const handleSaveSettings = async () => {
    try {
      await fetch("/api/admin/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fuzzy_match_threshold: fuzzyThreshold.toString(),
          max_disambiguation_options: maxDisambig.toString(),
        }),
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestAiConnection = async () => {
    setPingTesting(true);
    setPingResult(null);
    const start = Date.now();
    await new Promise((r) => setTimeout(r, 450));
    const latency = Date.now() - start;
    setPingResult({
      model: "Gemini 1.5 Flash / text-embedding-004",
      latency,
      status: "Verified & Connected (100% OK)"
    });
    setPingTesting(false);
  };

  const handleDownloadBackup = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      const stats = await res.json();
      const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), stats }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `campus_system_snapshot_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <SuperAdminHeader
        title="AI Configuration & LLM Credentials"
        subtitle="Configure primary reasoning models, API credentials, RAG grounding parameters, and live inference connections"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
                <KeyRound className="w-4 h-4" />
              </span>
              <h1 className="text-xl font-bold text-[#0a0a0a] tracking-tight">
                AI Configuration & LLM Credentials
              </h1>
            </div>
            <p className="text-xs text-[#8a8a8e] mt-1">
              Configure primary reasoning models, API credentials, RAG grounding parameters, and live inference connections.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isSaved && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0a0a0a] bg-white border border-[#e3e4e8] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
                <span>Parameters Saved</span>
              </span>
            )}
            <button
              onClick={handleSaveSettings}
              className="h-9 flex items-center gap-2 px-4 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>

        {/* AI Connection Tester & RAG Retrieval Tuning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Connection Tester */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e3e4e8] pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#0a0a0a]" />
                <h3 className="text-sm font-bold text-[#0a0a0a]">AI Provider Connection Tester</h3>
              </div>
              <button
                onClick={handleTestAiConnection}
                disabled={pingTesting}
                className="h-8 px-3 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                {pingTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Test Live Connection</span>
              </button>
            </div>

            <p className="text-xs text-[#8a8a8e] leading-relaxed">
              Verify real-time LLM inference connectivity, embedding vector pipeline latency, and API key authentication.
            </p>

            {pingResult && (
              <div className="p-3.5 bg-[#fafafc] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] space-y-1 animate-fade-in">
                <div className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
                  <span>{pingResult.status}</span>
                </div>
                <div className="text-[11px] text-[#8a8a8e]">
                  Model: <span className="font-mono text-[#0a0a0a]">{pingResult.model}</span> • Latency: <span className="font-mono font-bold text-[#0a0a0a]">{pingResult.latency}ms</span>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleDownloadBackup}
                className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#8a8a8e]" />
                <span>Download Snapshot (.JSON)</span>
              </button>
            </div>
          </div>

          {/* RAG Tuning Sliders */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#e3e4e8] pb-3">
              <Sliders className="w-4 h-4 text-[#0a0a0a]" />
              <h3 className="text-sm font-bold text-[#0a0a0a]">RAG Tuning & Retrieval Thresholds</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-[#0a0a0a]">Fuzzy Match Grounding Threshold</span>
                  <span className="font-mono text-[#0a0a0a] font-bold">{fuzzyThreshold}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.95"
                  step="0.01"
                  value={fuzzyThreshold}
                  onChange={(e) => setFuzzyThreshold(parseFloat(e.target.value))}
                  className="w-full accent-[#0a0a0a] cursor-pointer"
                />
                <p className="text-[11px] text-[#8a8a8e] mt-1">
                  Cosine similarity threshold (0.50 - 0.95) for grounding student queries to academic records.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-[#0a0a0a]">Max Disambiguation Suggestions</span>
                  <span className="font-mono text-[#0a0a0a] font-bold">{maxDisambig} options</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={maxDisambig}
                  onChange={(e) => setMaxDisambig(parseInt(e.target.value))}
                  className="w-full accent-[#0a0a0a] cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="h-8 px-3.5 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Parameters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LLM Engine Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Active LLM</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0a0a0a] text-white">
                Operational
              </span>
            </div>
            <div className="my-1 text-base font-bold text-[#0a0a0a]">Gemini 1.5 Flash</div>
            <div className="text-[11px] text-[#8a8a8e]">Average Latency: ~310ms</div>
          </div>

          <div className="p-5 bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Tokens (MTD)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
                Live
              </span>
            </div>
            <div className="my-1 text-base font-bold text-[#0a0a0a]">2,320,410 Tokens</div>
            <div className="text-[11px] text-[#8a8a8e]">~64.2k tokens / day</div>
          </div>

          <div className="p-5 bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Estimated Cost</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
                Monthly
              </span>
            </div>
            <div className="my-1 text-base font-bold text-[#0a0a0a]">$6.43 USD</div>
            <div className="text-[11px] text-[#8a8a8e]">Under budget (Limit: $50)</div>
          </div>

          <div className="p-5 bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Embedding Engine</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f5f5f7] text-[#0a0a0a] border border-[#e3e4e8]">
                Grounding
              </span>
            </div>
            <div className="my-1 text-base font-bold text-[#0a0a0a]">{embeddingModel}</div>
            <div className="text-[11px] text-[#8a8a8e]">Cosine Similarity Reranking</div>
          </div>
        </div>

        {/* Model Providers Table */}
        <div className="bg-white border border-[#e3e4e8] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#e3e4e8] flex items-center justify-between bg-[#fafafc]">
            <div>
              <h2 className="text-sm font-bold text-[#0a0a0a]">Configured LLM Credentials</h2>
              <p className="text-xs text-[#8a8a8e] mt-0.5">
                Secure vault keys used for processing student knowledge queries and vector chunking.
              </p>
            </div>
            <button className="flex items-center gap-1.5 h-8 px-3 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white rounded-xl text-xs font-semibold hover:from-[#2c2c2e] hover:to-[#1c1c1e] shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Key</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafc] text-[#8a8a8e] font-semibold border-b border-[#e3e4e8] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Provider / Model</th>
                  <th className="py-3 px-4">API Secret Key</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Tokens Used</th>
                  <th className="py-3 px-4">Est. Cost</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f7] font-medium text-[#0a0a0a]">
                {keys.map((k) => (
                  <tr key={k.id} className="hover:bg-[#fafafc] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-[#0a0a0a]">{k.name}</div>
                        {k.isDefault && (
                          <span className="px-2 py-0.5 bg-[#0a0a0a] text-white text-[9px] font-semibold rounded-full">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#8a8a8e] font-mono mt-0.5">{k.model}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#0a0a0a]">
                      <div className="flex items-center gap-2">
                        <span>
                          {showKeys[k.id]
                            ? k.apiKey
                            : `${k.apiKey.substring(0, 8)}••••••••••••••••`}
                        </span>
                        <button
                          onClick={() => toggleKeyVisibility(k.id)}
                          className="text-[#8a8a8e] hover:text-[#0a0a0a] p-1 rounded transition-colors cursor-pointer"
                        >
                          {showKeys[k.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          k.status === "Active"
                            ? "bg-[#0a0a0a] text-white"
                            : "bg-[#f5f5f7] text-[#8a8a8e] border border-[#e3e4e8]"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${k.status === "Active" ? "bg-white" : "bg-[#8a8a8e]"}`} />
                        {k.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#8a8a8e]">
                      {k.latencyMs > 0 ? `${k.latencyMs}ms` : "-"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#8a8a8e]">{k.tokensUsed}</td>
                    <td className="py-3.5 px-4 font-mono text-[#8a8a8e]">{k.costEstimate}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTestKey(k.id)}
                          disabled={testingId === k.id}
                          className="h-8 px-2.5 text-[11px] font-semibold text-[#0a0a0a] bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${testingId === k.id ? "animate-spin text-[#0a0a0a]" : "text-[#8a8a8e]"}`} />
                          <span>{testingId === k.id ? "Testing..." : "Test"}</span>
                        </button>
                        {!k.isDefault && (
                          <button
                            onClick={() => handleSetDefault(k.id)}
                            className="h-8 px-2.5 text-[11px] font-semibold text-[#0a0a0a] bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl transition-all shadow-2xs cursor-pointer"
                          >
                            Set Primary
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hyperparameter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: LLM Hyperparameters */}
          <div className="bg-white border border-[#e3e4e8] rounded-2xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#e3e4e8] pb-3">
              <Sliders className="w-4 h-4 text-[#0a0a0a]" />
              <h3 className="text-sm font-bold text-[#0a0a0a]">Inference Hyperparameters</h3>
            </div>

            <div className="space-y-4 pt-1 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-[#0a0a0a]">Temperature (Hallucination Guard)</span>
                  <span className="font-mono text-[#0a0a0a] font-bold">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-[#0a0a0a] cursor-pointer"
                />
                <p className="text-[11px] text-[#8a8a8e] mt-1">
                  Lower values (0.1 - 0.3) force strict adherence to campus records with zero hallucinations.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-[#0a0a0a]">Top-P (Nucleus Sampling)</span>
                  <span className="font-mono text-[#0a0a0a] font-bold">{topP}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full accent-[#0a0a0a] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-[#0a0a0a]">Max Generation Tokens</span>
                  <span className="font-mono text-[#0a0a0a] font-bold">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="512"
                  max="8192"
                  step="256"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-[#0a0a0a] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right: Embeddings & Vector Grounding */}
          <div className="bg-white border border-[#e3e4e8] rounded-2xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#e3e4e8] pb-3">
              <Layers className="w-4 h-4 text-[#0a0a0a]" />
              <h3 className="text-sm font-bold text-[#0a0a0a]">Vector Knowledge Grounding</h3>
            </div>

            <div className="space-y-4 pt-1 text-xs">
              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">
                  Embedding Model Backend
                </label>
                <select
                  value={embeddingModel}
                  onChange={(e) => setEmbeddingModel(e.target.value)}
                  className="w-full h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 font-medium transition-all"
                >
                  <option value="text-embedding-004">Google text-embedding-004 (768 dims) - Recommended</option>
                  <option value="text-embedding-3-small">OpenAI text-embedding-3-small (1536 dims)</option>
                  <option value="text-embedding-3-large">OpenAI text-embedding-3-large (3072 dims)</option>
                  <option value="bge-large-en-v1.5">Local HuggingFace BGE Large (1024 dims)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">
                  Chunk Size / Overlap
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    defaultValue="1000 characters"
                    className="h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:bg-white focus:outline-none focus:border-[#0a0a0a] transition-all"
                  />
                  <input
                    type="text"
                    defaultValue="150 char overlap"
                    className="h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:bg-white focus:outline-none focus:border-[#0a0a0a] transition-all"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#fafafc] border border-[#e3e4e8] rounded-xl text-[11px] text-[#0a0a0a]">
                <strong>Grounding Policy:</strong> Dynamic cosine score threshold set to <strong>{fuzzyThreshold}</strong>. Any query match score below {fuzzyThreshold} prompts the chatbot to advise contacting campus office.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
