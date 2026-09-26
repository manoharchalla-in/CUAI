"use client";

import { useState, useEffect } from "react";
import { 
  Palette, 
  Save, 
  CheckCircle2, 
  Globe, 
  Image, 
  ShieldCheck, 
  Eye, 
  RefreshCw, 
  Bot, 
  Layers,
  Sparkles,
  MessageSquare,
  SlidersHorizontal,
  SquarePen,
  RotateCw
} from "lucide-react";
import SuperAdminHeader from "@/components/super-admin/SuperAdminHeader";

export default function BrandingPage() {
  const [collegeName, setCollegeName] = useState("City Engineering College");
  const [chatbotTitle, setChatbotTitle] = useState("Campus AI");
  const [collegeLogo, setCollegeLogo] = useState("/logo.png");
  const [tagline, setTagline] = useState("Verified RAG Engine");
  const [assistantBadge, setAssistantBadge] = useState("Student Assistant");
  const [welcomeMessage, setWelcomeMessage] = useState("Hello! Welcome to City Engineering College. You can ask me about semester timetables, fee dues, exam dates, or departmental contacts.");
  const [themeColor, setThemeColor] = useState("#0a0a0a");
  const [footerText, setFooterText] = useState("© 2026 City Engineering College. All rights reserved.");
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const presetThemes = [
    { name: "Obsidian Black", hex: "#0a0a0a" },
    { name: "Space Gray", hex: "#3a3a3c" },
    { name: "Titanium Slate", hex: "#636366" },
    { name: "Midnight Navy", hex: "#1c1c2e" },
    { name: "Deep Charcoal", hex: "#2c2c2e" },
    { name: "Electric Blue", hex: "#0a66ff" },
    { name: "Emerald Forest", hex: "#059669" },
  ];

  const presetLogos = [
    { name: "Campus AI Orb", url: "/logo.png" },
    { name: "University Crest", url: "https://images.unsplash.com/photo-1562774053-701939374585?w=128&auto=format&fit=crop&q=60" },
    { name: "Tech Shield", url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=128&auto=format&fit=crop&q=60" },
  ];

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/system/branding");
      const sys = await res.json();
      if (sys.college_name) setCollegeName(sys.college_name);
      if (sys.chatbot_title) setChatbotTitle(sys.chatbot_title);
      if (sys.college_logo) setCollegeLogo(sys.college_logo);
      if (sys.tagline) setTagline(sys.tagline);
      if (sys.assistant_badge) setAssistantBadge(sys.assistant_badge);
      if (sys.welcome_message) setWelcomeMessage(sys.welcome_message);
      if (sys.theme_color) setThemeColor(sys.theme_color);
      if (sys.footer_text) setFooterText(sys.footer_text);
    } catch (e) {
      console.error("Failed to load branding settings:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await fetch("/api/system/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college_name: collegeName,
          chatbot_title: chatbotTitle,
          college_logo: collegeLogo,
          tagline: tagline,
          assistant_badge: assistantBadge,
          welcome_message: welcomeMessage,
          theme_color: themeColor,
          footer_text: footerText,
        }),
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <SuperAdminHeader
        title="Institution Branding & Whitelabel"
        subtitle="Global whitelabel controls across all public student chatbots, admission portals, and campus consoles"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
                <Palette className="w-4 h-4" />
              </span>
              <h1 className="text-xl font-bold text-[#0a0a0a] tracking-tight">
                Institution Branding &amp; Whitelabel Customization
              </h1>
            </div>
            <p className="text-xs text-[#8a8a8e] mt-1">
              Configure global identity, titles, logos, colors, and live AI assistant branding across the entire platform.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isSaved && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Branding Deployed</span>
              </span>
            )}
            <button
              onClick={() => handleSaveSettings()}
              className="h-9 flex items-center gap-2 px-4 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Branding</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Controls */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-5">
            <div className="border-b border-[#e3e4e8] pb-3">
              <h2 className="text-sm font-bold text-[#0a0a0a]">Institutional Identity &amp; Chatbot Parameters</h2>
              <p className="text-xs text-[#8a8a8e]">Configure attributes automatically synchronized with the Chatbot UI and Intake Portals.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0a0a0a] mb-1.5">Institution / University Name</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. City Engineering College"
                    className="w-full h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0a0a0a] mb-1.5">Chatbot Display Title / App Name</label>
                  <input
                    type="text"
                    value={chatbotTitle}
                    onChange={(e) => setChatbotTitle(e.target.value)}
                    placeholder="e.g. Campus AI"
                    className="w-full h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Mascot / Crest / Logo URL</label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl border border-[#e3e4e8] bg-[#f5f5f7] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    <img
                      src={collegeLogo}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/logo.png";
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    value={collegeLogo}
                    onChange={(e) => setCollegeLogo(e.target.value)}
                    placeholder="e.g. /logo.png or https://example.com/logo.png"
                    className="flex-1 h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-mono focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-[#8a8a8e]">Presets:</span>
                  {presetLogos.map((pl) => (
                    <button
                      key={pl.name}
                      type="button"
                      onClick={() => setCollegeLogo(pl.url)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                        collegeLogo === pl.url ? "bg-[#0a0a0a] text-white border-[#0a0a0a]" : "bg-white text-[#636366] border-[#e3e4e8] hover:bg-[#f5f5f7]"
                      }`}
                    >
                      {pl.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0a0a0a] mb-1.5">Sidebar Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Verified RAG Engine"
                    className="w-full h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:bg-white focus:outline-none focus:border-[#0a0a0a] transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0a0a0a] mb-1.5">Header Subtitle Badge</label>
                  <input
                    type="text"
                    value={assistantBadge}
                    onChange={(e) => setAssistantBadge(e.target.value)}
                    placeholder="e.g. Student Assistant"
                    className="w-full h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:bg-white focus:outline-none focus:border-[#0a0a0a] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Primary Accent Theme Palette</label>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {presetThemes.map((theme) => (
                    <button
                      key={theme.hex}
                      type="button"
                      onClick={() => setThemeColor(theme.hex)}
                      className={`h-8 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                        themeColor.toLowerCase() === theme.hex.toLowerCase()
                          ? "border-[#0a0a0a] bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
                          : "border-[#e3e4e8] bg-white text-[#0a0a0a] hover:bg-[#fafafc]"
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ backgroundColor: theme.hex }} />
                      <span>{theme.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#e3e4e8] p-0.5 bg-[#f5f5f7]"
                  />
                  <input
                    type="text"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-40 h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl font-mono text-xs uppercase text-[#0a0a0a] focus:bg-white focus:outline-none focus:border-[#0a0a0a] transition-all"
                  />
                  <span className="text-[11px] text-[#8a8a8e]">Custom HEX value</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Welcome Greeting Message</label>
                <textarea
                  rows={2}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Introductory welcome message displayed in new chat sessions..."
                  className="w-full p-3 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:bg-white focus:outline-none focus:border-[#0a0a0a] resize-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">Footer Legal Attribution</label>
                <input
                  type="text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="w-full h-10 px-3.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs text-[#0a0a0a] font-medium focus:bg-white focus:outline-none focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a]/10 transition-all"
                />
              </div>

              <div className="pt-3 border-t border-[#e3e4e8] flex items-center justify-between">
                <span className="text-[11px] text-[#8a8a8e]">Live automatic propagation across Chatbot &amp; Portals</span>
                <button
                  type="submit"
                  className="h-9 px-4 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white rounded-xl font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Branding</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#e3e4e8] pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#0a0a0a]" />
                  <h3 className="text-sm font-bold text-[#0a0a0a]">Live Chatbot Preview</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                  Synchronized
                </span>
              </div>

              {/* Mock Chatbot UI Mirror */}
              <div className="rounded-2xl border border-[#e3e4e8] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-white text-xs">
                {/* Top Navbar */}
                <div className="p-3 border-b border-[#e3e4e8] flex items-center justify-between bg-white/90 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#f5f5f7] border border-[#e3e4e8] p-0.5 flex items-center justify-center shrink-0">
                      <img
                        src={collegeLogo}
                        alt="Logo"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/logo.png";
                        }}
                      />
                    </div>
                    <span className="font-bold text-[#0a0a0a] text-xs">{chatbotTitle || collegeName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/[0.04] text-[#8a8a8e] font-medium">
                      {assistantBadge}
                    </span>
                  </div>

                  <span
                    className="px-2 py-0.5 rounded-full text-white text-[9px] font-semibold"
                    style={{ backgroundColor: themeColor }}
                  >
                    Online
                  </span>
                </div>

                {/* Chat Canvas */}
                <div className="p-4 space-y-3 bg-[#f5f5f7] min-h-[190px] flex flex-col justify-between">
                  {/* Empty Logo Center Preview */}
                  <div className="flex flex-col items-center justify-center py-2 select-none">
                    <img
                      src={collegeLogo}
                      alt="Logo Center"
                      className="w-12 h-12 object-contain drop-shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/logo.png";
                      }}
                    />
                  </div>

                  {/* AI Message Preview */}
                  <div className="flex items-start gap-2 max-w-[90%]">
                    <div
                      className="w-6 h-6 rounded-lg text-white flex items-center justify-center shrink-0 text-[10px] shadow-2xs"
                      style={{ backgroundColor: themeColor }}
                    >
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="p-2.5 bg-white rounded-2xl rounded-tl-xs border border-[#e3e4e8] shadow-2xs text-[11px] text-[#0a0a0a] leading-relaxed">
                      {welcomeMessage}
                    </div>
                  </div>
                </div>

                {/* Bottom Composer Mock */}
                <div className="p-2.5 bg-white border-t border-[#e3e4e8] flex items-center justify-between gap-2">
                  <div className="text-[11px] text-[#8a8a8e] px-2 truncate">
                    Ask anything about {collegeName}...
                  </div>
                  <div
                    className="w-7 h-7 rounded-lg text-white flex items-center justify-center shrink-0"
                    style={{ backgroundColor: themeColor }}
                  >
                    <SquarePen className="w-3 h-3" />
                  </div>
                </div>

                {/* Footer text */}
                <div className="p-2 bg-[#fafafc] border-t border-[#e3e4e8] text-center text-[9px] text-[#8a8a8e]">
                  {footerText}
                </div>
              </div>

              <div className="p-3.5 bg-[#fafafc] rounded-xl border border-[#e3e4e8] text-[11px] text-[#0a0a0a] space-y-1">
                <div className="font-bold text-[#0a0a0a] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Whitelabel Dynamic Ingestion</span>
                </div>
                <p className="text-[10px] text-[#8a8a8e]">
                  All student chat screens (`/chat`), sidebars, headers, and center emblems will instantly reflect your configured identity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
