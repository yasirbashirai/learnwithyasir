import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { CHAT_SITE } from "@/data/links";

/**
 * Floating "Chat with Yasir" launcher, a glass pill that gently floats and
 * morphs into a card on click, opening the standalone chatwithyasir site.
 * Mirrors the widget on the main services website.
 */
const EASE = [0.32, 0.72, 0, 1] as const;

const CHIPS = [
  { label: "Which course for me?", q: "courses" },
  { label: "Talk to Yasir", q: "contact" },
  { label: "Work with Yasir", q: "services" },
];

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);

  const go = (q?: string) => {
    const url = q ? `${CHAT_SITE}/?q=${encodeURIComponent(q)}` : CHAT_SITE;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden">
      <div className={open ? "" : "animate-float"}>
        <motion.div
          initial={false}
          animate={{ width: open ? 320 : 226, height: open ? 360 : 58, borderRadius: open ? 24 : 999 }}
          transition={{ duration: 0.5, ease: EASE }}
          onClick={() => !open && setOpen(true)}
          role={!open ? "button" : undefined}
          tabIndex={!open ? 0 : undefined}
          aria-label={!open ? "Chat with Yasir" : undefined}
          onKeyDown={(e) => { if (!open && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setOpen(true); } }}
          className="relative overflow-hidden glass shadow-card"
          style={{ cursor: open ? "default" : "pointer" }}
        >
          {/* Collapsed pill */}
          <AnimatePresence>
            {!open && (
              <motion.div key="pill" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}
                className="absolute inset-0 flex items-center gap-2.5 pl-2 pr-4">
                <span className="grid place-items-center w-10 h-10 rounded-full text-white font-extrabold shrink-0" style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>Y</span>
                <span className="flex flex-col leading-tight min-w-0">
                  <span className="text-sm font-bold text-ink truncate">Chat with Yasir</span>
                  <span className="text-[12px] text-teal font-medium flex items-center gap-1">● Online now</span>
                </span>
                <Sparkles className="ml-auto w-4 h-4 text-gold shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded card */}
          <AnimatePresence>
            {open && (
              <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.12 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="absolute inset-0 flex flex-col">
                <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                  <span className="grid place-items-center w-9 h-9 rounded-full text-white font-extrabold" style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>Y</span>
                  <div className="leading-tight">
                    <div className="text-sm font-bold text-ink">Yasir Bashir</div>
                    <div className="text-[12px] text-teal font-medium">● Replies instantly</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setOpen(false); }} className="ml-auto w-8 h-8 grid place-items-center rounded-full text-soft hover:bg-ink/10" aria-label="Close">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-px mx-4 bg-line" />
                <div className="flex-1 px-4 py-3.5 overflow-y-auto">
                  <div className="flex gap-2 items-end">
                    <span className="grid place-items-center w-6 h-6 rounded-full text-white text-[11px] font-bold shrink-0" style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>Y</span>
                    <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-surface-2 border border-line px-3.5 py-2.5 text-[13px] text-ink">
                      Hey 👋 Not sure where to start, or want it built for you? Ask me anything.
                    </div>
                  </div>
                  <p className="mt-4 mb-2 text-[11px] uppercase tracking-wide text-soft font-semibold">Quick start</p>
                  <div className="flex flex-wrap gap-2">
                    {CHIPS.map((c) => (
                      <button key={c.q} onClick={(e) => { e.stopPropagation(); go(c.q); }}
                        className="rounded-full border border-line bg-surface/70 px-3 py-1.5 text-[12.5px] font-medium text-ink hover:border-teal hover:text-teal transition-colors">
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="px-4 pb-4 pt-1">
                  <button onClick={(e) => { e.stopPropagation(); go(); }} className="btn-primary w-full text-sm">
                    Open the full chat <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="mt-2 text-center text-[11px] text-soft">Opens chatwithyasir, instant, no forms.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
