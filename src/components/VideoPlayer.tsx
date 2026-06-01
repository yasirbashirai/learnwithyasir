import { Play, Clapperboard } from "lucide-react";

/**
 * Video slot for a lesson. With `url` it embeds the video. Without one it shows
 * a rich, branded thumbnail (course art + lesson title + part + duration) so
 * every placeholder looks like a real, polished video preview.
 */
export default function VideoPlayer({
  title,
  url,
  minutes,
  icon,
  partLabel,
  thumbAccent = "#36c8a9",
}: {
  title: string;
  url?: string;
  minutes?: number;
  icon?: string;
  partLabel?: string;
  thumbAccent?: string;
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
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-white/10 aspect-video group select-none"
      style={{
        background: `radial-gradient(130% 130% at 18% 0%, ${thumbAccent}66, transparent 55%), linear-gradient(135deg, #0f2e27, #06201b 70%)`,
      }}
    >
      {/* thumbnail art */}
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute -right-8 -bottom-10 text-[12rem] leading-none opacity-15 blur-[1px] rotate-[-8deg]">{icon ?? "🎬"}</div>

      {/* top meta */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        {partLabel && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 backdrop-blur px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white/90">
            {icon} {partLabel}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white/80">
          <Clapperboard className="w-3 h-3" /> Coming soon
        </span>
      </div>

      {/* center play + title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <button className="grid place-items-center w-[72px] h-[72px] rounded-full bg-white/95 text-teal shadow-2xl transition-transform group-hover:scale-110" aria-label="Play (coming soon)">
          <Play className="w-7 h-7 translate-x-0.5 fill-current" />
        </button>
        <h3 className="mt-5 text-white font-heading font-bold text-lg md:text-2xl max-w-lg leading-tight drop-shadow">{title}</h3>
        <p className="mt-1.5 text-white/55 text-xs font-medium">learnwithyasir · Yasir is recording this lesson</p>
      </div>

      {/* control bar */}
      <div className="absolute bottom-0 inset-x-0 px-4 py-3 bg-gradient-to-t from-black/55 to-transparent flex items-center gap-3">
        <Play className="w-4 h-4 text-white/85 fill-current" />
        <div className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full w-0 rounded-full" style={{ background: thumbAccent }} />
        </div>
        <span className="text-white/70 text-xs tabular-nums">{minutes ? `${minutes}:00` : "—:—"}</span>
      </div>
    </div>
  );
}
