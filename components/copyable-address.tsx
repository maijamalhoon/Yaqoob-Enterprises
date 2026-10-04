"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyableAddressProps {
  address: string;
}

export function CopyableAddress({ address }: CopyableAddressProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 transition active:scale-95"
        title="Copy address to clipboard"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copy Address</span>
          </>
        )}
      </button>
    </div>
  );
}
