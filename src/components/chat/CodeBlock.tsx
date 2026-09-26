"use client";

import { useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";

interface CodeBlockProps {
  language?: string;
  code: string;
}

export default function CodeBlock({ language = "code", code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="my-3 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden transition-all text-[#0a0a0a] group">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#f0f0f3] border-b border-[#e3e4e8] text-xs">
        <div className="flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-[#8a8a8e]" />
          <span className="font-mono text-[10.5px] font-semibold tracking-wider text-[#8a8a8e] uppercase">
            {language}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 h-6 px-2 rounded-md bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#8a8a8e] hover:text-[#0a0a0a] transition-all text-[10.5px] font-semibold active:scale-95 cursor-pointer shadow-2xs"
          title="Copy"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#0a0a0a]" />
              <span className="text-[#0a0a0a]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Text Area */}
      <pre className="p-3.5 text-xs font-mono leading-relaxed overflow-x-auto text-[#0a0a0a] bg-[#f5f5f7]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
