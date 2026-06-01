import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Send, Trash2, Pin, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabaseEnabled } from "@/lib/supabase";
import { isSuperAdmin } from "@/lib/progress";
import {
  listDiscussions, postDiscussion, deleteDiscussion, togglePinned, type Discussion,
} from "@/lib/community";

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function CourseCommunity({ courseSlug }: { courseSlug: string }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Discussion[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const admin = isSuperAdmin();

  const refresh = () => { setLoading(true); listDiscussions(courseSlug).then((d) => { setPosts(d); setLoading(false); }); };
  useEffect(refresh, [courseSlug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !body.trim()) return;
    setBusy(true);
    await postDiscussion(courseSlug, user.id, user.name, body.trim());
    setBody("");
    setBusy(false);
    refresh();
  };

  if (!supabaseEnabled) {
    return <div className="glass-card p-6 text-soft text-sm">Community is available once Supabase is connected.</div>;
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <MessageSquare className="w-5 h-5 text-teal" />
        <h2 className="font-heading font-bold text-lg text-ink">Course community</h2>
        <span className="text-xs text-soft ml-auto">{posts.length} posts</span>
      </div>
      <p className="text-sm text-soft mb-4">Ask questions, share your builds, and help each other. Yasir reads these.</p>

      {user ? (
        <form onSubmit={submit} className="flex gap-2 mb-5">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share a win or ask a question…"
            className="flex-1 rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-sm outline-none focus:border-teal"
          />
          <button disabled={busy || !body.trim()} className="btn-primary text-sm py-2.5">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      ) : (
        <p className="text-sm text-soft mb-5">
          <Link to="/login" className="text-teal font-semibold">Sign in</Link> to join the discussion.
        </p>
      )}

      {loading ? (
        <div className="py-8 grid place-items-center"><Loader2 className="w-5 h-5 animate-spin text-teal" /></div>
      ) : posts.length === 0 ? (
        <p className="text-sm text-soft py-6 text-center">Be the first to post in this community 👋</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className={`rounded-2xl border p-4 ${p.pinned ? "border-gold/40 bg-gold/[0.06]" : "border-line bg-surface/50"}`}>
              <div className="flex items-center gap-2">
                <span className="grid place-items-center w-7 h-7 rounded-full text-white text-xs font-bold" style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>
                  {(p.user_name || "?").charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-ink">{p.user_name || "Learner"}</span>
                {p.pinned && <span className="inline-flex items-center gap-1 text-[11px] text-gold font-semibold"><Pin className="w-3 h-3" /> Pinned</span>}
                <span className="text-xs text-soft ml-auto">{timeAgo(p.created_at)}</span>
              </div>
              <p className="text-sm text-ink/85 mt-2 whitespace-pre-wrap">{p.body}</p>
              {(admin || user?.id === p.user_id) && (
                <div className="flex gap-3 mt-2">
                  {admin && (
                    <button onClick={() => togglePinned(p.id, !p.pinned).then(refresh)} className="text-xs text-soft hover:text-gold inline-flex items-center gap-1">
                      <Pin className="w-3 h-3" /> {p.pinned ? "Unpin" : "Pin"}
                    </button>
                  )}
                  <button onClick={() => deleteDiscussion(p.id).then(refresh)} className="text-xs text-soft hover:text-red-500 inline-flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
