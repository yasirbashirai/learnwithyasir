import { Play, Clapperboard } from "lucide-react";

/**
 * Video slot for a lesson. When `url` is provided it embeds the video; otherwise
 * it shows a polished "coming soon" placeholder so the layout is final and Yasir
 * can drop real recordings in later (just set lesson.videoUrl in the data).
 */
export default function VideoPlayer({
  title,
  url,
  minutes,
}: {
  title: string;
  url?: string;
  minutes?: number;
}) {
  if (url) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden border border-line bg-black aspect-video">
        <iframe
          src={url}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerated-encoding; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-teal/20 aspect-video group"
      style={{ background: "radial-gradient(120% 120% at 30% 10%, rgba(54,200,169,0.22), transparent 55%), linear-gradient(135deg, hsl(168 45% 12%), hsl(174 50% 8%))" }}
    >
      {/* faux grid */}
      <div className="absolute inset-0 opacity-30 grid-bg" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <button
          className="grid place-items-center w-20 h-20 rounded-full bg-white/95 text-teal shadow-2xl transition-transform group-hover:scale-110"
          aria-label="Play (coming soon)"
        >
          <Play className="w-8 h-8 translate-x-0.5 fill-current" />
        </button>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-black/30 backdrop-blur px-3 py-1.5 text-white/90 text-xs font-semibold">
          <Clapperboard className="w-3.5 h-3.5" /> Video coming soon — Yasir is recording this lesson
        </div>
        <p className="mt-3 text-white/70 text-sm max-w-md line-clamp-2 font-medium">{title}</p>
      </div>

      {/* faux control bar */}
      <div className="absolute bottom-0 inset-x-0 px-4 py-3 bg-gradient-to-t from-black/50 to-transparent flex items-center gap-3">
        <Play className="w-4 h-4 text-white/80 fill-current" />
        <div className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden">
          <div className="h-full w-0 bg-teal-light" />
        </div>
        <span className="text-white/70 text-xs tabular-nums">{minutes ? `${minutes}:00` : "—:—"}</span>
      </div>
    </div>
  );
}
