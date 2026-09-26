"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw } from "lucide-react";

interface ResponseActionsProps {
  content: string;
  onRegenerate?: () => void;
  isStreaming?: boolean;
}

export default function ResponseActions({
  content,
  onRegenerate,
  isStreaming = false,
}: ResponseActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex items-center gap-1 text-[#8a8a8e]">
      <button
        type="button"
        onClick={handleCopy}
        className="h-7 px-2 rounded-lg bg-transparent hover:bg-[#f0f0f3] text-[#8a8a8e] hover:text-[#0a0a0a] transition-all flex items-center gap-1.5 text-[11px] font-medium active:scale-95 cursor-pointer"
        title="Copy response"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-600 font-semibold text-[10.5px]">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10.5px]">Copy</span>
          </>
        )}
      </button>

      {onRegenerate && !isStreaming && (
        <button
          type="button"
          onClick={onRegenerate}
          className="w-7 h-7 rounded-lg bg-transparent hover:bg-[#f0f0f3] text-[#8a8a8e] hover:text-[#0a0a0a] transition-all flex items-center justify-center active:scale-95 cursor-pointer"
          title="Regenerate response"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
