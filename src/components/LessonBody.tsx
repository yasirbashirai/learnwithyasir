import { Lightbulb, AlertTriangle, Info, ExternalLink, CheckSquare } from "lucide-react";
import type { ContentBlock } from "@/lib/types";

const calloutStyle = {
  tip: { icon: Lightbulb, cls: "border-teal/30 bg-teal/5", iconCls: "text-teal" },
  warn: { icon: AlertTriangle, cls: "border-gold/40 bg-gold/10", iconCls: "text-gold-dark" },
  note: { icon: Info, cls: "border-ink/15 bg-ink/[0.03]", iconCls: "text-ink/60" },
} as const;

export default function LessonBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "h":
            return <h3 key={i} className="font-heading font-bold text-xl text-ink mt-2">{b.text}</h3>;
          case "p":
            return <p key={i} className="text-ink/80 leading-relaxed">{b.text}</p>;
          case "list":
            return (
              <ul key={i} className="space-y-2">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-2.5 text-ink/80">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol key={i} className="space-y-3">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="grid place-items-center w-6 h-6 rounded-full bg-teal text-white text-xs font-bold shrink-0">{j + 1}</span>
                    <span className="text-ink/80 pt-0.5">{it}</span>
                  </li>
                ))}
              </ol>
            );
          case "callout": {
            const s = calloutStyle[b.tone ?? "note"];
            const Icon = s.icon;
            return (
              <div key={i} className={`rounded-2xl border p-4 flex gap-3 ${s.cls}`}>
                <Icon className={`w-5 h-5 shrink-0 ${s.iconCls}`} />
                <p className="text-sm text-ink/80">{b.text}</p>
              </div>
            );
          }
          case "yasir":
            return (
              <div key={i} className="rounded-2xl border border-teal/25 bg-teal/[0.06] p-4 flex gap-3.5">
                <span
                  className="grid place-items-center w-10 h-10 rounded-full text-white font-extrabold shrink-0 shadow-soft"
                  style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}
                >
                  Y
                </span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-teal mb-0.5">Yasir's take</div>
                  <p className="text-ink/85 leading-relaxed italic">{b.text}</p>
                </div>
              </div>
            );
          case "checklist":
            return (
              <ul key={i} className="space-y-2">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-2.5 items-start rounded-xl border border-line bg-surface/50 px-3.5 py-2.5">
                    <CheckSquare className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <span className="text-ink/80">{it}</span>
                  </li>
                ))}
              </ul>
            );
          case "resources":
            return (
              <div key={i} className="rounded-2xl border border-teal/15 bg-surface/60 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-teal mb-2">Resources</p>
                <div className="flex flex-wrap gap-2">
                  {b.items.map((r, j) => (
                    <a
                      key={j}
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-teal/20 bg-white px-3 py-1.5 text-sm font-medium text-ink hover:border-teal hover:text-teal transition-colors"
                    >
                      {r.label} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}
