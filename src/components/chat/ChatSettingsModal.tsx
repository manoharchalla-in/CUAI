"use client";

import { useState } from "react";
import { 
  X, 
  Sparkles, 
  Check, 
  Sun, 
  Moon, 
  Sliders, 
  Droplets, 
  Palette,
  RotateCcw,
  Zap
} from "lucide-react";

export type ChatTheme = "transparent" | "pure_light" | "midnight_dark" | "cool_blue" | "emerald" | "sunset";

export interface ThemeOption {
  id: ChatTheme;
  name: string;
  badge?: string;
  description: string;
  previewBg: string;
  previewBorder: string;
  previewCardBg: string;
  previewAccent: string;
  isDark?: boolean;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "transparent",
    name: "Transparent Glass",
    badge: "Default",
    description: "Ultra-translucent frosted glass cards with soft ambient background reflections",
    previewBg: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    previewBorder: "#d1d5db",
    previewCardBg: "rgba(255, 255, 255, 0.45)",
    previewAccent: "#0a66ff",
  },
  {
    id: "pure_light",
    name: "Studio White",
    description: "Solid crisp white surfaces with hairline gray borders for maximum contrast",
    previewBg: "#f5f5f7",
    previewBorder: "#e5e5ea",
    previewCardBg: "#ffffff",
    previewAccent: "#0a0a0a",
  },
  {
    id: "midnight_dark",
    name: "Obsidian Dark",
    description: "Deep titanium charcoal aesthetic with crisp white typography",
    previewBg: "#0c0d0e",
    previewBorder: "#27272a",
    previewCardBg: "#18191c",
    previewAccent: "#38bdf8",
    isDark: true,
  },
  {
    id: "cool_blue",
    name: "Electric Blue",
    description: "Cool frosted sapphire tones inspired by modern iOS telemetry cards",
    previewBg: "linear-gradient(135deg, #e8f0fe 0%, #dbeafe 100%)",
    previewBorder: "#93c5fd",
    previewCardBg: "rgba(255, 255, 255, 0.65)",
    previewAccent: "#0a66ff",
  },
  {
    id: "emerald",
    name: "Emerald Mint",
    description: "Gentle natural sage and mint glass with soothing ambient tones",
    previewBg: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
    previewBorder: "#a7f3d0",
    previewCardBg: "rgba(255, 255, 255, 0.65)",
    previewAccent: "#059669",
  },
  {
    id: "sunset",
    name: "Sunset Pastel",
    description: "Warm peach and golden hour ambient glow with glossy cards",
    previewBg: "linear-gradient(135deg, #fff7ed 0%, #fef2f2 50%, #fdf4ff 100%)",
    previewBorder: "#fecdd3",
    previewCardBg: "rgba(255, 255, 255, 0.70)",
    previewAccent: "#ea580c",
  },
];

interface ChatSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ChatTheme;
  onSelectTheme: (theme: ChatTheme) => void;
}

export default function ChatSettingsModal({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}: ChatSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_48px_rgba(0,0,0,0.12)] max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#e3e4e8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] text-white flex items-center justify-center shadow-2xs">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0a0a0a] tracking-tight">
                Chatbot Settings
              </h2>
              <p className="text-xs text-[#8a8a8e] mt-0.5">
                Customize workspace colors, card translucency, and themes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-[#f5f5f7] border border-[#e3e4e8] text-[#8a8a8e] hover:text-[#0a0a0a] transition-colors shadow-2xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-[#f5f5f7]">
          {/* Theme Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0a66ff]" />
                <span>Interface Theme &amp; Translucency</span>
              </span>

              {currentTheme !== "transparent" && (
                <button
                  type="button"
                  onClick={() => onSelectTheme("transparent")}
                  className="text-[11px] font-semibold text-[#0a66ff] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Default</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEME_OPTIONS.map((theme) => {
                const isSelected = currentTheme === theme.id;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => onSelectTheme(theme.id)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[118px] cursor-pointer group shadow-2xs ${
                      isSelected
                        ? "bg-white border-[#0a0a0a] ring-2 ring-[#0a0a0a]/10 shadow-[0_4px_16px_rgba(0,0,0,0.08)] scale-[1.01]"
                        : "bg-white hover:bg-[#fafafc] border-[#e3e4e8] hover:border-[#CBD5E1]"
                    }`}
                  >
                    {/* Top row: Swatch + Title */}
                    <div className="space-y-2 w-full">
                      <div className="flex items-center justify-between">
                        {/* Swatch Pill */}
                        <div 
                          className="h-6 w-14 rounded-full border flex items-center justify-center shadow-2xs overflow-hidden"
                          style={{
                            background: theme.previewBg,
                            borderColor: theme.previewBorder,
                          }}
                        >
                          <div 
                            className="w-3.5 h-3.5 rounded-full shadow-xs"
                            style={{ background: theme.previewAccent }}
                          />
                        </div>

                        {/* Active Checkmark or Badge */}
                        <div className="flex items-center gap-1.5">
                          {theme.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-[#0a66ff]/[0.08] text-[#0a66ff] border border-[#0a66ff]/20">
                              {theme.badge}
                            </span>
                          )}
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-[#0a0a0a]">
                          {theme.name}
                        </div>
                        <p className="text-[11px] text-[#8a8a8e] mt-0.5 leading-snug">
                          {theme.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Notice Info */}
          <div className="p-4 rounded-2xl bg-white border border-[#e3e4e8] shadow-2xs flex items-start gap-3">
            <Droplets className="w-4 h-4 text-[#0a66ff] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#8a8a8e] leading-relaxed">
              <span className="font-semibold text-[#0a0a0a] block mb-0.5">Glass Transparency Mode:</span>
              The default <strong>Transparent Glass</strong> theme applies backdrop-filter blurs to conversation cards, letting subtle canvas hues shine through for an Apple-inspired finish.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#e3e4e8] flex items-center justify-between">
          <span className="text-xs text-[#8a8a8e] font-mono">
            Active: <strong className="text-[#0a0a0a] font-sans">{THEME_OPTIONS.find(t => t.id === currentTheme)?.name}</strong>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="h-9 px-5 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white font-semibold rounded-xl text-xs shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
