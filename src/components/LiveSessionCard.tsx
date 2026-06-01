import { useEffect, useState } from "react";
import { Calendar, Video, Clock } from "lucide-react";
import { nextSession, type LiveSession } from "@/lib/community";
import { supabaseEnabled } from "@/lib/supabase";

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
function countdown(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "Live now";
  const days = Math.floor(ms / 86400000);
  const hrs = Math.floor((ms % 86400000) / 3600000);
  if (days > 0) return `in ${days}d ${hrs}h`;
  const mins = Math.floor((ms % 3600000) / 60000);
  return `in ${hrs}h ${mins}m`;
}

export default function LiveSessionCard({ courseSlug }: { courseSlug: string }) {
  const [session, setSession] = useState<LiveSession | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { nextSession(courseSlug).then((s) => { setSession(s); setLoaded(true); }); }, [courseSlug]);

  if (!supabaseEnabled || (loaded && !session)) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-teal" /><h2 className="font-heading font-bold text-lg text-ink">Weekly live session</h2></div>
        <p className="text-sm text-soft mt-2">
          Live Q&amp;A and build-alongs run weekly with the community. No session scheduled right now — check back soon.
        </p>
      </div>
    );
  }
  if (!session) return null;

  const live = new Date(session.starts_at).getTime() - Date.now() <= 0;
  return (
    <div className="glass-card p-6 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(54,200,169,0.3), transparent 70%)" }} />
      <div className="relative">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal" />
          <h2 className="font-heading font-bold text-lg text-ink">Weekly live session</h2>
          <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${live ? "bg-red-500/15 text-red-500" : "bg-teal/10 text-teal"}`}>
            {countdown(session.starts_at)}
          </span>
        </div>
        <h3 className="font-heading font-bold text-ink mt-3">{session.title}</h3>
        {session.description && <p className="text-sm text-soft mt-1">{session.description}</p>}
        <div className="flex items-center gap-2 text-sm text-soft mt-2"><Clock className="w-4 h-4" /> {fmt(session.starts_at)}</div>
        {session.join_url && (
          <a href={session.join_url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 inline-flex">
            <Video className="w-4 h-4" /> {live ? "Join now" : "Save the link"}
          </a>
        )}
      </div>
    </div>
  );
}
