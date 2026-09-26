"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import type { ChatTheme } from "./ChatSettingsModal";

interface ComposerProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onStop?: () => void;
  theme?: ChatTheme;
}

export default function Composer({
  onSendMessage,
  isLoading,
  onStop,
  theme = "transparent",
}: ComposerProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const composerStyles = {
    transparent: "bg-white/65 backdrop-blur-2xl border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.7)] text-[#0a0a0a]",
    pure_light: "bg-white border-[#e5e5ea] shadow-[0_4px_24px_rgba(0,0,0,0.06)] text-[#0a0a0a]",
    midnight_dark: "bg-[#18191c]/90 backdrop-blur-2xl border-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
    cool_blue: "bg-white/75 backdrop-blur-2xl border-blue-200/60 shadow-[0_8px_32px_rgba(10,102,255,0.08)] text-[#0a0a0a]",
    emerald: "bg-white/75 backdrop-blur-2xl border-emerald-200/60 shadow-[0_8px_32px_rgba(16,185,129,0.08)] text-[#0a0a0a]",
    sunset: "bg-white/75 backdrop-blur-2xl border-orange-200/60 shadow-[0_8px_32px_rgba(249,115,22,0.08)] text-[#0a0a0a]",
  }[theme] || "bg-white/65 backdrop-blur-2xl border-white/80 text-[#0a0a0a]";

  const isDark = theme === "midnight_dark";

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const hasText = input.trim().length > 0;

  return (
    <div className="w-full max-w-[820px] mx-auto px-3 sm:px-6 pb-[max(env(safe-area-inset-bottom),10px)] sm:pb-4 box-border">
      <div className={`relative flex items-center border focus-within:border-[#0a0a0a] focus-within:ring-2 focus-within:ring-[#0a0a0a]/10 rounded-[20px] sm:rounded-[26px] p-1.5 sm:p-2 transition-all ${composerStyles}`}>
        {/* Center Textarea Input */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about student roster, intake records, or campus data..."
          className={`flex-1 bg-transparent placeholder-[#8a8a8e] text-xs sm:text-sm py-2 px-3 sm:px-4 focus:outline-none resize-none max-h-36 overflow-y-auto leading-relaxed font-sans ${
            isDark ? "text-white" : "text-[#0a0a0a]"
          }`}
        />

        {/* Right Controls: Send Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 pr-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasText || isLoading}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all ${
              hasText && !isLoading
                ? theme === "transparent"
                  ? "bg-white/85 hover:bg-white backdrop-blur-xl border border-white/90 text-[#0a0a0a] shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:scale-95 cursor-pointer"
                  : "bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white shadow-[0_2px_6px_rgba(0,0,0,0.14)] active:scale-95 cursor-pointer"
                : "bg-black/[0.04] text-[#a1a1a6] cursor-not-allowed"
            }`}
            title="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0a0a0a]" />
            ) : (
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
