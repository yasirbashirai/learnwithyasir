import type { ReactNode } from "react";

/** A realistic browser-window chrome wrapper used for site mockups/screenshots. */
export default function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-line shadow-card bg-surface">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-2 border-b border-line">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <div className="ml-2 flex-1 truncate rounded-md bg-bg/70 border border-line px-3 py-1 text-[11px] text-soft">{url}</div>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">{children}</div>
    </div>
  );
}
