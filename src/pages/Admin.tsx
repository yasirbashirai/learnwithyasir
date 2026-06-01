import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Mail, Video, BarChart3, Download, Check, Search, ShieldCheck, ExternalLink, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { supabaseEnabled } from "@/lib/supabase";
import { loadAdminData, exportLeadsCsv, type AdminData } from "@/lib/admin";
import { loadVideos, getVideos, setVideo } from "@/lib/videos";
import { courses } from "@/data/courses";

type Tab = "overview" | "learners" | "leads" | "videos";

const VIBE_LABEL: Record<string, string> = {
  freelance: "💼 Freelance clients",
  automate: "⚙️ Automate business",
  startup: "🚀 Build a startup",
  career: "🎯 Switch careers",
};

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<AdminData | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    loadAdminData().then((res) => {
      if ("error" in res) setErr(res.error);
      else { setData(res); setErr(null); }
      setLoading(false);
    });
  };

  useEffect(() => { refresh(); loadVideos(); }, []);

  if (!user) return null;

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "learners", label: "Learners", icon: Users },
    { id: "leads", label: "Leads", icon: Mail },
    { id: "videos", label: "Videos", icon: Video },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="px-4 py-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-heading font-extrabold text-3xl text-ink">Instructor console</h1>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-gold/20 text-gold px-2 py-1 rounded-md"><ShieldCheck className="w-3.5 h-3.5" /> Admin</span>
          <button onClick={refresh} className="btn-ghost text-sm ml-auto"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>
        </div>

        {!supabaseEnabled && (
          <p className="mt-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-ink/80">
            Supabase isn't configured, so there's no live data yet.
          </p>
        )}
        {err && (
          <p className="mt-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-ink/80">
            {err} — did you run <code>supabase/schema.sql</code> (including the admin-read policies)?
          </p>
        )}

        {/* Tabs */}
        <div className="mt-6 flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                tab === t.id ? "bg-teal text-white border-teal" : "bg-surface/60 text-ink/70 border-line hover:border-teal"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "overview" && <Overview data={data} />}
          {tab === "learners" && <Learners data={data} />}
          {tab === "leads" && <Leads data={data} />}
          {tab === "videos" && <Videos />}
        </div>
      </main>
    </div>
  );
}

/* ---------- Overview ---------- */
function Overview({ data }: { data: AdminData | null }) {
  const cards = [
    { label: "Learners", value: data?.totals.learners ?? 0, icon: "👥" },
    { label: "Enrollments", value: data?.totals.enrollments ?? 0, icon: "📚" },
    { label: "Lessons completed", value: data?.totals.lessonsDone ?? 0, icon: "✅" },
    { label: "Courses live", value: courses.length, icon: "🎓" },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass-card p-5">
            <div className="text-2xl">{c.icon}</div>
            <div className="font-heading font-extrabold text-3xl text-ink mt-2">{c.value}</div>
            <div className="text-sm text-soft">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="glass-card p-6">
        <h2 className="font-heading font-bold text-lg text-ink mb-4">Goals learners picked ("vibe")</h2>
        {data && data.vibes.length > 0 ? (
          <div className="space-y-3">
            {data.vibes.map((v) => {
              const max = data.vibes[0].count || 1;
              return (
                <div key={v.vibe}>
                  <div className="flex justify-between text-sm text-ink/80 mb-1"><span>{VIBE_LABEL[v.vibe] ?? v.vibe}</span><span>{v.count}</span></div>
                  <div className="h-2.5 rounded-full bg-teal/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(v.count / max) * 100}%`, background: "linear-gradient(90deg,#288672,#36c8a9)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-soft text-sm">No data yet — learners' goals will appear here as they sign up.</p>
        )}
      </div>
    </div>
  );
}

/* ---------- Learners ---------- */
function Learners({ data }: { data: AdminData | null }) {
  const [q, setQ] = useState("");
  const rows = (data?.learners ?? []).filter((l) => !q || l.name.toLowerCase().includes(q.toLowerCase()) || l.email.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="glass-card p-5">
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search learners…" className="w-full rounded-full border border-line bg-surface/80 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-teal" />
      </div>
      {rows.length === 0 ? (
        <p className="text-soft text-sm py-8 text-center">No learners yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-soft border-b border-line">
                <th className="py-2 pr-4 font-semibold">Name</th>
                <th className="py-2 pr-4 font-semibold">Email</th>
                <th className="py-2 pr-4 font-semibold">Goal</th>
                <th className="py-2 pr-4 font-semibold text-right">Courses</th>
                <th className="py-2 pr-4 font-semibold text-right">Lessons</th>
                <th className="py-2 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-b border-line/60">
                  <td className="py-2.5 pr-4 font-medium text-ink">{l.name}</td>
                  <td className="py-2.5 pr-4 text-ink/70">{l.email}</td>
                  <td className="py-2.5 pr-4 text-ink/70">{l.vibe ? (VIBE_LABEL[l.vibe] ?? l.vibe) : "—"}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{l.enrollments}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{l.lessonsDone}</td>
                  <td className="py-2.5 text-ink/60">{(l.createdAt ?? "").slice(0, 10) || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- Leads ---------- */
function Leads({ data }: { data: AdminData | null }) {
  const learners = data?.learners ?? [];
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-soft text-sm">{learners.length} contacts — your newsletter list.</p>
        <button onClick={() => exportLeadsCsv(learners)} disabled={!learners.length} className="btn-primary text-sm py-2"><Download className="w-4 h-4" /> Export CSV</button>
      </div>
      {learners.length === 0 ? (
        <p className="text-soft text-sm py-8 text-center">No contacts yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {learners.map((l) => (
            <a key={l.id} href={`mailto:${l.email}`} className="glass-pill text-sm hover:border-teal">
              <Mail className="w-3.5 h-3.5 text-teal" /> {l.email}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Video manager ---------- */
function Videos() {
  const [open, setOpen] = useState<string | null>(courses[0]?.slug ?? null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const [, force] = useState(0);

  useEffect(() => { loadVideos().then(() => force((n) => n + 1)); }, []);
  const videos = getVideos();

  const save = async (lessonId: string) => {
    await setVideo(lessonId, drafts[lessonId] ?? videos[lessonId] ?? "");
    setSaved(lessonId);
    force((n) => n + 1);
    setTimeout(() => setSaved((s) => (s === lessonId ? null : s)), 1500);
  };

  return (
    <div className="space-y-3">
      <p className="text-soft text-sm">
        Paste a video URL (YouTube/Vimeo/Loom embed link) into any lesson. It instantly replaces the
        "coming soon" placeholder in the lesson player. Leave blank + save to clear.
      </p>
      {courses.map((c) => {
        const videoLessons = c.modules.flatMap((m) => m.lessons).filter((l) => l.hasVideo);
        const filled = videoLessons.filter((l) => videos[l.id]).length;
        const isOpen = open === c.slug;
        return (
          <div key={c.slug} className="glass-card overflow-hidden">
            <button onClick={() => setOpen(isOpen ? null : c.slug)} className="w-full flex items-center gap-3 p-4 text-left">
              <span className="text-2xl">{c.icon}</span>
              <span className="flex-1 font-heading font-bold text-ink">{c.title}</span>
              <span className="text-xs text-soft">{filled}/{videoLessons.length} videos</span>
              <span className={`text-teal transition-transform ${isOpen ? "rotate-90" : ""}`}>›</span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 space-y-2 border-t border-line">
                {videoLessons.map((l) => {
                  const current = drafts[l.id] ?? videos[l.id] ?? "";
                  return (
                    <div key={l.id} className="flex flex-col sm:flex-row sm:items-center gap-2 pt-3">
                      <div className="sm:w-64 shrink-0">
                        <div className="text-sm font-medium text-ink truncate">{l.title}</div>
                        {videos[l.id] && <span className="text-[11px] text-teal inline-flex items-center gap-1"><Check className="w-3 h-3" /> has video</span>}
                      </div>
                      <input
                        value={current}
                        onChange={(e) => setDrafts((d) => ({ ...d, [l.id]: e.target.value }))}
                        placeholder="https://…  (embed URL)"
                        className="flex-1 rounded-lg border border-line bg-surface/80 px-3 py-2 text-sm outline-none focus:border-teal"
                      />
                      <button onClick={() => save(l.id)} className="btn-primary text-sm py-2 shrink-0">
                        {saved === l.id ? <><Check className="w-4 h-4" /> Saved</> : "Save"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      <p className="text-xs text-soft pt-2">
        <Link to="/courses" className="text-teal inline-flex items-center gap-1">Preview a course <ExternalLink className="w-3 h-3" /></Link>
      </p>
    </div>
  );
}
