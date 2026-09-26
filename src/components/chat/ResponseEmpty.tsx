"use client";

interface ResponseEmptyProps {
  onSelectPrompt?: (promptText: string) => void;
  logoUrl?: string;
  chatbotTitle?: string;
}

export default function ResponseEmpty({ onSelectPrompt, logoUrl = "/logo.png", chatbotTitle = "Campus AI" }: ResponseEmptyProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full h-full max-w-[820px] mx-auto p-4 select-none animate-fade-in">
      {/* Dynamic Mascot / AI Emblem */}
      <img
        src={logoUrl || "/logo.png"}
        alt={chatbotTitle || "Campus AI"}
        className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm transition-all"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/logo.png";
        }}
      />
    </div>
  );
}
