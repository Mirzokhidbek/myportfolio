"use client";

import { useRef, useState, type ReactNode } from "react";

export default function CodeBlock({ children }: { children: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const text = preRef.current?.innerText ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the code is still selectable.
    }
  }

  return (
    <div className="group relative mt-8">
      <button
        type="button"
        onClick={() => onCopy()}
        className="absolute right-3 top-3 rounded-lg border border-slate-300 bg-white/90 px-2 py-1 text-xs text-slate-700 opacity-0 transition group-hover:opacity-100 focus:opacity-100 dark:border-white/15 dark:bg-black/60 dark:text-zinc-200"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre
        ref={preRef}
        className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-900/[0.03] dark:border-white/10 dark:bg-black/40 p-4"
      >
        {children}
      </pre>
    </div>
  );
}
