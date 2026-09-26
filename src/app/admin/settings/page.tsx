"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  Building, 
  Loader2,
  Eye,
  Type,
  Volume2,
  SunMoon,
  Palette,
  Layers,
  Contrast,
  Sliders,
  Check,
  RotateCcw
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"accessibility" | "system" | "interface">("accessibility");

  // System & AI Settings
  const [collegeName, setCollegeName] = useState("");
  const [aiModel, setAiModel] = useState("Grounded Database RAG Engine (Zero Hallucination)");
  const [ragStrictness, setRagStrictness] = useState("strict");
  const [allowRegistration, setAllowRegistration] = useState(true);

  // Accessibility & Interface Settings
  const [fontSize, setFontSize] = useState<"normal" | "medium" | "large" | "xlarge">("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState<"none" | "protanopia" | "deuteranopia" | "tritanopia" | "monochrome">("none");
  const [uiDensity, setUiDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [focusIndicators, setFocusIndicators] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [themeAccent, setThemeAccent] = useState<"blue" | "indigo" | "emerald" | "amber" | "violet">("blue");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Load from API + localStorage
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.settings) {
          setCollegeName(data.settings.collegeName || "");
          setAiModel(data.settings.aiModel || "");
          setRagStrictness(data.settings.ragStrictness || "strict");
          setAllowRegistration(data.settings.allowRegistration !== false);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }

    // Load Accessibility Preferences
    try {
      const savedFontSize = localStorage.getItem("cityapp_font_size") as any;
      if (savedFontSize) setFontSize(savedFontSize);

      const savedHighContrast = localStorage.getItem("cityapp_high_contrast") === "true";
      setHighContrast(savedHighContrast);

      const savedReducedMotion = localStorage.getItem("cityapp_reduced_motion") === "true";
      setReducedMotion(savedReducedMotion);

      const savedDyslexia = localStorage.getItem("cityapp_dyslexia_font") === "true";
      setDyslexiaFont(savedDyslexia);

      const savedColorBlind = localStorage.getItem("cityapp_colorblind_mode") as any;
      if (savedColorBlind) setColorBlindMode(savedColorBlind);

      const savedDensity = localStorage.getItem("cityapp_ui_density") as any;
      if (savedDensity) setUiDensity(savedDensity);

      const savedFocus = localStorage.getItem("cityapp_focus_indicators") !== "false";
      setFocusIndicators(savedFocus);

      const savedSound = localStorage.getItem("cityapp_sound_effects") === "true";
      setSoundEffects(savedSound);

      const savedAccent = localStorage.getItem("cityapp_theme_accent") as any;
      if (savedAccent) setThemeAccent(savedAccent);
    } catch (e) {
      console.error("Could not read from localStorage", e);
    }

    loadSettings();
  }, []);

  const handleSaveAccessibility = () => {
    try {
      localStorage.setItem("cityapp_font_size", fontSize);
      localStorage.setItem("cityapp_high_contrast", String(highContrast));
      localStorage.setItem("cityapp_reduced_motion", String(reducedMotion));
      localStorage.setItem("cityapp_dyslexia_font", String(dyslexiaFont));
      localStorage.setItem("cityapp_colorblind_mode", colorBlindMode);
      localStorage.setItem("cityapp_ui_density", uiDensity);
      localStorage.setItem("cityapp_focus_indicators", String(focusIndicators));
      localStorage.setItem("cityapp_sound_effects", String(soundEffects));
      localStorage.setItem("cityapp_theme_accent", themeAccent);

      // Apply live CSS attributes to root document
      const doc = document.documentElement;
      doc.setAttribute("data-font-size", fontSize);
      doc.setAttribute("data-contrast", highContrast ? "high" : "normal");
      doc.setAttribute("data-motion", reducedMotion ? "reduced" : "normal");
      doc.setAttribute("data-colorblind", colorBlindMode);
      doc.setAttribute("data-density", uiDensity);
      doc.setAttribute("data-accent", themeAccent);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError("Failed to save accessibility preferences");
    }
  };

  const handleResetAccessibility = () => {
    setFontSize("normal");
    setHighContrast(false);
    setReducedMotion(false);
    setDyslexiaFont(false);
    setColorBlindMode("none");
    setUiDensity("comfortable");
    setFocusIndicators(true);
    setSoundEffects(false);
    setThemeAccent("blue");

    const doc = document.documentElement;
    doc.removeAttribute("data-font-size");
    doc.removeAttribute("data-contrast");
    doc.removeAttribute("data-motion");
    doc.removeAttribute("data-colorblind");
    doc.removeAttribute("data-density");
    doc.removeAttribute("data-accent");

    try {
      localStorage.removeItem("cityapp_font_size");
      localStorage.removeItem("cityapp_high_contrast");
      localStorage.removeItem("cityapp_reduced_motion");
      localStorage.removeItem("cityapp_dyslexia_font");
      localStorage.removeItem("cityapp_colorblind_mode");
      localStorage.removeItem("cityapp_ui_density");
      localStorage.removeItem("cityapp_focus_indicators");
      localStorage.removeItem("cityapp_sound_effects");
      localStorage.removeItem("cityapp_theme_accent");
    } catch (e) {}

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const handleSaveSystem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeName,
          aiModel,
          ragStrictness,
          allowRegistration,
        }),
      });

      if (!res.ok) throw new Error("Failed to save system settings");

      handleSaveAccessibility();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8a8a8e] bg-[#f5f5f7] min-h-screen">
        <Loader2 className="w-7 h-7 animate-spin text-[#0a66ff] mb-3" />
        <p className="text-xs font-semibold text-[#0a0a0a]">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f7]">
      <AdminHeader
        title="Settings &amp; Ergonomics"
        subtitle="Configure interface accessibility, font scaling, contrast, campus identity, and AI retrieval guardrails"
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#e3e4e8] pb-3 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("accessibility")}
            className={`h-9 px-4 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "accessibility"
                ? "bg-white text-[#0a0a0a] border border-[#e3e4e8] shadow-2xs"
                : "text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-white/60"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#0a66ff]" />
            <span>Accessibility &amp; Ergonomics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("interface")}
            className={`h-9 px-4 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "interface"
                ? "bg-white text-[#0a0a0a] border border-[#e3e4e8] shadow-2xs"
                : "text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-white/60"
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[#0a66ff]" />
            <span>Display Density &amp; Themes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("system")}
            className={`h-9 px-4 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "system"
                ? "bg-white text-[#0a0a0a] border border-[#e3e4e8] shadow-2xs"
                : "text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-white/60"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#0a66ff]" />
            <span>Campus &amp; AI Guardrails</span>
          </button>
        </div>

        {/* Success / Error Alerts */}
        {success && (
          <div className="p-4 rounded-2xl bg-white border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#0a66ff]" />
            <span>Configuration &amp; accessibility preferences saved successfully!</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* TAB 1: Accessibility & Visual Ergonomics */}
        {activeTab === "accessibility" && (
          <div className="space-y-6">
            {/* Font Scaling */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#0a0a0a] flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#0a66ff]" />
                  <span>Typography &amp; UI Scale</span>
                </h3>
                <p className="text-xs text-[#8a8a8e] mt-0.5">
                  Adjust text scaling for improved legibility across tables, headers, and form inputs
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "normal", label: "Default (100%)", sub: "Standard font size" },
                  { id: "medium", label: "Medium (110%)", sub: "Enhanced readability" },
                  { id: "large", label: "Large (125%)", sub: "Comfortable reading" },
                  { id: "xlarge", label: "Extra Large (140%)", sub: "High visibility scale" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFontSize(item.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      fontSize === item.id
                        ? "bg-[#fafafc] border-[#0a0a0a] ring-1 ring-[#0a0a0a] text-[#0a0a0a]"
                        : "bg-white border-[#e3e4e8] text-[#8a8a8e] hover:bg-[#fafafc]"
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span>{item.label}</span>
                      {fontSize === item.id && <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />}
                    </div>
                    <div className="text-[11px] text-[#8a8a8e] mt-1">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast & Reduced Motion */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-sm font-semibold text-[#0a0a0a] flex items-center gap-2">
                <Contrast className="w-4 h-4 text-[#0a66ff]" />
                <span>Contrast &amp; Motion Accessibility</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* High Contrast Toggle */}
                <label className="flex items-start gap-3.5 p-4 rounded-xl bg-[#fafafc] border border-[#e3e4e8] cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-[#e3e4e8] accent-[#0a0a0a]"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#0a0a0a] block">
                      High Contrast Mode (WCAG AAA)
                    </span>
                    <span className="text-[11px] text-[#8a8a8e] mt-0.5 block">
                      Increases text borders, sharpens dividers, and maximizes background-to-text contrast ratios.
                    </span>
                  </div>
                </label>

                {/* Reduced Motion Toggle */}
                <label className="flex items-start gap-3.5 p-4 rounded-xl bg-[#fafafc] border border-[#e3e4e8] cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-[#e3e4e8] accent-[#0a0a0a]"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#0a0a0a] block">
                      Reduced Motion &amp; Animations
                    </span>
                    <span className="text-[11px] text-[#8a8a8e] mt-0.5 block">
                      Disables pulsing badges, layout transitions, and decorative animations for vestibular comfort.
                    </span>
                  </div>
                </label>

                {/* Dyslexia-Friendly Typography */}
                <label className="flex items-start gap-3.5 p-4 rounded-xl bg-[#fafafc] border border-[#e3e4e8] cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={dyslexiaFont}
                    onChange={(e) => setDyslexiaFont(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-[#e3e4e8] accent-[#0a0a0a]"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#0a0a0a] block">
                      Dyslexia-Optimized Typography
                    </span>
                    <span className="text-[11px] text-[#8a8a8e] mt-0.5 block">
                      Increases letter spacing, line height, and character distinction for easier reading.
                    </span>
                  </div>
                </label>

                {/* Keyboard Navigation Focus Highlights */}
                <label className="flex items-start gap-3.5 p-4 rounded-xl bg-[#fafafc] border border-[#e3e4e8] cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={focusIndicators}
                    onChange={(e) => setFocusIndicators(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-[#e3e4e8] accent-[#0a0a0a]"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#0a0a0a] block">
                      Enhanced Keyboard Focus Rings
                    </span>
                    <span className="text-[11px] text-[#8a8a8e] mt-0.5 block">
                      Draws high-visibility outline rings on focused table rows, buttons, and form inputs.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Colorblindness Vision Filter */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-sm font-semibold text-[#0a0a0a] flex items-center gap-2">
                <SunMoon className="w-4 h-4 text-[#0a66ff]" />
                <span>Color Vision Deficiency Adjustments</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "none", label: "Default Colors", desc: "Standard RGB spectrum" },
                  { id: "protanopia", label: "Protanopia", desc: "Red-weak color compensation" },
                  { id: "deuteranopia", label: "Deuteranopia", desc: "Green-weak color compensation" },
                  { id: "tritanopia", label: "Tritanopia", desc: "Blue-yellow spectrum distinction" },
                  { id: "monochrome", label: "Monochrome / Grayscale", desc: "High luminance grayscale" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setColorBlindMode(item.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      colorBlindMode === item.id
                        ? "bg-[#fafafc] border-[#0a0a0a] ring-1 ring-[#0a0a0a] text-[#0a0a0a]"
                        : "bg-white border-[#e3e4e8] text-[#8a8a8e] hover:bg-[#fafafc]"
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span>{item.label}</span>
                      {colorBlindMode === item.id && <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />}
                    </div>
                    <div className="text-[11px] text-[#8a8a8e] mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResetAccessibility}
                className="h-9 px-4 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold transition-all shadow-2xs active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#8a8a8e]" />
                <span>Reset to System Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAccessibility}
                className="h-9 px-5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold transition-all shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Apply Accessibility Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Interface & Display Density */}
        {activeTab === "interface" && (
          <div className="space-y-6">
            {/* UI Table Density */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-sm font-semibold text-[#0a0a0a] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0a66ff]" />
                <span>Data Table &amp; Component Spacing Density</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "compact", label: "Compact Density", desc: "Dense rows, maximized data per screen" },
                  { id: "comfortable", label: "Comfortable (Default)", desc: "Balanced rows with SaaS spacing system" },
                  { id: "spacious", label: "Spacious / Touch", desc: "Spacious rows for touchscreens & tablets" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUiDensity(item.id as any)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      uiDensity === item.id
                        ? "bg-[#fafafc] border-[#0a0a0a] ring-1 ring-[#0a0a0a] text-[#0a0a0a]"
                        : "bg-white border-[#e3e4e8] text-[#8a8a8e] hover:bg-[#fafafc]"
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span>{item.label}</span>
                      {uiDensity === item.id && <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />}
                    </div>
                    <div className="text-[11px] text-[#8a8a8e] mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Cues */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-sm font-semibold text-[#0a0a0a] flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#0a66ff]" />
                <span>Audio Feedback</span>
              </h3>

              <label className="flex items-start gap-3.5 p-4 rounded-xl bg-[#fafafc] border border-[#e3e4e8] cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={(e) => setSoundEffects(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-[#e3e4e8] accent-[#0a0a0a]"
                />
                <div>
                  <span className="font-semibold text-xs text-[#0a0a0a] block">
                    Play UI Sound Cues on Actions
                  </span>
                  <span className="text-[11px] text-[#8a8a8e] mt-0.5 block">
                    Subtle audio chime when student records are saved, exports finish, or security alerts trigger.
                  </span>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveAccessibility}
                className="h-9 px-5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold transition-all shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Interface Preferences</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Campus & AI Guardrails */}
        {activeTab === "system" && (
          <form onSubmit={handleSaveSystem} className="space-y-6">
            {/* College Identity */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-sm font-semibold text-[#0a0a0a] flex items-center gap-2">
                <Building className="w-4 h-4 text-[#0a66ff]" />
                <span>Institution &amp; Campus Identity</span>
              </h3>

              <div className="text-xs">
                <label className="block font-semibold text-[#0a0a0a] mb-1.5">
                  Default College / Institution Name
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="Enter college or institution name..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 transition-colors text-xs font-medium"
                />
                <p className="text-[11px] text-[#8a8a8e] mt-1">
                  Used as the default institute name across new student records and chatbot responses.
                </p>
              </div>
            </div>

            {/* AI & RAG Strictness */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-sm font-semibold text-[#0a0a0a] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0a66ff]" />
                <span>AI Retrieval &amp; Hallucination Guardrails</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#0a0a0a] mb-1.5">
                    Knowledge Retrieval Mode
                  </label>
                  <select
                    value={ragStrictness}
                    onChange={(e) => setRagStrictness(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] transition-colors text-xs font-medium"
                  >
                    <option value="strict">Strict Database Grounding (Zero Hallucination - Recommended)</option>
                    <option value="moderate">Moderate (Allow general conversation + Grounded Student Lookups)</option>
                  </select>
                  <p className="text-[11px] text-[#8a8a8e] mt-1">
                    Enforces strict verification against the student database. If a student is not found, the AI will explicitly state so rather than hallucinating details.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-[#0a0a0a] mb-1.5">
                    AI Engine Identifier
                  </label>
                  <input
                    type="text"
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] font-mono transition-colors text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Access & Registration */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-sm font-semibold text-[#0a0a0a] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#0a66ff]" />
                <span>Security &amp; Registration Policy</span>
              </h3>

              <div className="text-xs">
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-[#fafafc] border border-[#e3e4e8]">
                  <input
                    type="checkbox"
                    checked={allowRegistration}
                    onChange={(e) => setAllowRegistration(e.target.checked)}
                    className="w-4 h-4 rounded border-[#e3e4e8] accent-[#0a0a0a]"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#0a0a0a] block">
                      Allow Public User Sign-up (/register)
                    </span>
                    <span className="text-[11px] text-[#8a8a8e]">
                      When disabled, only admins can create new chatbot user accounts.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="h-9 px-5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer active:scale-[0.98]"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save All System Configurations
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
