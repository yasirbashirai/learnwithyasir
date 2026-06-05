import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, Mail, Video, BarChart3, Download, Check, Search, ShieldCheck, ExternalLink,
  RefreshCw, Calendar, MessageSquare, Trash2, Pin, Plus, ChevronDown, RotateCcw, X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { useAuth } from "@/lib/auth";
import { supabaseEnabled } from "@/lib/supabase";
import {
  loadAdminData, exportLeadsCsv, getStudentDetail, resetStudentProgress, removeStudentEnrollment,
  type AdminData, type LearnerRow, type StudentDetail,
} from "@/lib/admin";
import { loadVideos, getVideos, setVideo } from "@/lib/videos";
import {
  listSessions, createSession, deleteSession, listAllDiscussions, deleteDiscussion, togglePinned,
  type LiveSession, type Discussion,
} from "@/lib/community";
import { courses, courseBySlug } from "@/data/courses";

type Tab = "overview" | "learners" | "leads" | "videos" | "sessions" | "community";

const VIBE_LABEL: Record<string, string> = {
  freelance: "💼 Freelance clients", automate: "⚙️ Automate business",
  startup: "🚀 Build a startup", career: "🎯 Switch careers",
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
  // Intentional fetch-on-mount; the loading flip is the desired effect.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { refresh(); loadVideos(); }, []);
  if (!user) return null;

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "learners", label: "Students", icon: Users },
    { id: "sessions", label: "Live sessions", icon: Calendar },
    { id: "community", label: "Community", icon: MessageSquare },
    { id: "videos", label: "Videos", icon: Video },
    { id: "leads", label: "Leads", icon: Mail },
  ];

  return (
    <div className="min-h-screen">
      <Seo title="Admin" description="Instructor console." path="/admin" noindex />
      <Navbar />
      <main className="px-4 py-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-heading font-extrabold text-3xl text-ink">Super-admin control center</h1>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-gold/20 text-gold px-2 py-1 rounded-md"><ShieldCheck className="w-3.5 h-3.5" /> Full control</span>
          <button onClick={refresh} className="btn-ghost text-sm ml-auto"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>
        </div>

        {!supabaseEnabled && <Banner>Supabase isn't configured, so there's no live data yet.</Banner>}
        {err && <Banner>{err}, did you run <code>supabase/schema.sql</code> (incl. admin policies)?</Banner>}

        <div className="mt-6 flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${tab === t.id ? "bg-teal text-white border-teal" : "bg-surface/60 text-ink/70 border-line hover:border-teal"}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "overview" && <Overview data={data} />}
          {tab === "learners" && <Students data={data} onChange={refresh} />}
          {tab === "leads" && <Leads data={data} />}
          {tab === "videos" && <Videos />}
          {tab === "sessions" && <Sessions />}
          {tab === "community" && <Community />}
        </div>
      </main>
    </div>
  );
}

function Banner({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-ink/80">{children}</p>;
}

/* ---------- Overview ---------- */
function Overview({ data }: { data: AdminData | null }) {
  const cards = [
    { label: "Students", value: data?.totals.learners ?? 0, icon: "👥" },
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
        <h2 className="font-heading font-bold text-lg text-ink mb-4">Goals students picked ("vibe")</h2>
        {data && data.vibes.length > 0 ? (
          <div className="space-y-3">
            {data.vibes.map((v) => {
              const max = data.vibes[0].count || 1;
              return (
                <div key={v.vibe}>
                  <div className="flex justify-between text-sm text-ink/80 mb-1"><span>{VIBE_LABEL[v.vibe] ?? v.vibe}</span><span>{v.count}</span></div>
                  <div className="h-2.5 rounded-full bg-teal/10 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(v.count / max) * 100}%`, background: "linear-gradient(90deg,#288672,#36c8a9)" }} /></div>
                </div>
              );
            })}
          </div>
        ) : <p className="text-soft text-sm">No data yet, goals appear as students sign up.</p>}
      </div>
    </div>
  );
}

/* ---------- Students (drilldown + management) ---------- */
function Students({ data, onChange }: { data: AdminData | null; onChange: () => void }) {
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const rows = (data?.learners ?? []).filter((l) => !q || l.name.toLowerCase().includes(q.toLowerCase()) || l.email.toLowerCase().includes(q.toLowerCase()));

  const open = (l: LearnerRow) => {
    if (openId === l.id) { setOpenId(null); return; }
    setOpenId(l.id); setDetail(null);
    getStudentDetail(l.id).then(setDetail);
  };

  return (
    <div className="glass-card p-5">
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search students…" className="w-full rounded-full border border-line bg-surface/80 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-teal" />
      </div>
      {rows.length === 0 ? <p className="text-soft text-sm py-8 text-center">No students yet.</p> : (
        <div className="space-y-2">
          {rows.map((l) => (
            <div key={l.id} className="rounded-xl border border-line bg-surface/40">
              <button onClick={() => open(l)} className="w-full flex items-center gap-3 p-3 text-left">
                <span className="grid place-items-center w-9 h-9 rounded-full text-white text-sm font-bold shrink-0" style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>{l.name.charAt(0).toUpperCase()}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-ink truncate">{l.name} <span className="text-soft font-normal">· {l.email}</span></div>
                  <div className="text-xs text-soft">{l.enrollments} courses · {l.lessonsDone} lessons · {l.vibe ? (VIBE_LABEL[l.vibe] ?? l.vibe) : "no goal set"}</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-soft transition-transform ${openId === l.id ? "rotate-180" : ""}`} />
              </button>
              {openId === l.id && (
                <div className="px-3 pb-3 border-t border-line pt-3">
                  {!detail ? <p className="text-sm text-soft">Loading…</p> : (
                    <>
                      <div className="space-y-2">
                        {detail.enrolledSlugs.length === 0 && <p className="text-sm text-soft">Not enrolled in any course yet.</p>}
                        {detail.enrolledSlugs.map((slug) => {
                          const c = courseBySlug(slug); if (!c) return null;
                          const all = c.modules.flatMap((m) => m.lessons);
                          const done = all.filter((ls) => detail.completedLessonIds.includes(ls.id)).length;
                          const pct = all.length ? Math.round((done / all.length) * 100) : 0;
                          return (
                            <div key={slug} className="flex items-center gap-3">
                              <span className="text-lg">{c.icon}</span>
                              <span className="text-sm text-ink/80 w-40 truncate">{c.title}</span>
                              <div className="flex-1 h-2 rounded-full bg-teal/10 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#288672,#36c8a9)" }} /></div>
                              <span className="text-xs text-soft tabular-nums w-20 text-right">{done}/{all.length} · {pct}%</span>
                              <button onClick={() => removeStudentEnrollment(detail.id, slug).then(() => { getStudentDetail(detail.id).then(setDetail); onChange(); })} className="text-xs text-soft hover:text-red-500 inline-flex items-center gap-1"><X className="w-3 h-3" /> Unenroll</button>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => { if (confirm("Reset ALL progress for this student?")) resetStudentProgress(detail.id).then(() => { getStudentDetail(detail.id).then(setDetail); onChange(); }); }} className="btn-ghost text-sm border border-line text-red-500"><RotateCcw className="w-4 h-4" /> Reset progress</button>
                        <a href={`mailto:${l.email}`} className="btn-ghost text-sm border border-line"><Mail className="w-4 h-4" /> Email</a>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
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
        <p className="text-soft text-sm">{learners.length} contacts, your newsletter list.</p>
        <button onClick={() => exportLeadsCsv(learners)} disabled={!learners.length} className="btn-primary text-sm py-2"><Download className="w-4 h-4" /> Export CSV</button>
      </div>
      {learners.length === 0 ? <p className="text-soft text-sm py-8 text-center">No contacts yet.</p> : (
        <div className="flex flex-wrap gap-2">
          {learners.map((l) => <a key={l.id} href={`mailto:${l.email}`} className="glass-pill text-sm hover:border-teal"><Mail className="w-3.5 h-3.5 text-teal" /> {l.email}</a>)}
        </div>
      )}
    </div>
  );
}

/* ---------- Sessions manager ---------- */
function Sessions() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [when, setWhen] = useState("");
  const [url, setUrl] = useState("");

  const refresh = () => listSessions().then(setSessions);
  useEffect(() => { refresh(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !when) return;
    await createSession({ course_slug: slug || null, title, description: desc || null, starts_at: new Date(when).toISOString(), join_url: url || null });
    setTitle(""); setDesc(""); setWhen(""); setUrl(""); setSlug("");
    refresh();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="glass-card p-5 grid sm:grid-cols-2 gap-3">
        <h2 className="font-heading font-bold text-lg text-ink sm:col-span-2 flex items-center gap-2"><Plus className="w-5 h-5 text-teal" /> Schedule a live session</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. Weekly Q&A)" className="rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-sm outline-none focus:border-teal" />
        <select value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-sm outline-none focus:border-teal">
          <option value="">All courses (global)</option>
          {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
        </select>
        <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-sm outline-none focus:border-teal" />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Join URL (Zoom/Meet)" className="rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-sm outline-none focus:border-teal" />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short description (optional)" className="rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-sm outline-none focus:border-teal sm:col-span-2" />
        <button className="btn-primary text-sm sm:col-span-2 justify-self-start">Add session</button>
      </form>

      <div className="glass-card p-5">
        <h2 className="font-heading font-bold text-lg text-ink mb-3">Scheduled sessions</h2>
        {sessions.length === 0 ? <p className="text-soft text-sm">No sessions scheduled.</p> : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li key={s.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface/40 p-3">
                <Calendar className="w-4 h-4 text-teal shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-ink">{s.title}</div>
                  <div className="text-xs text-soft">{new Date(s.starts_at).toLocaleString()} · {s.course_slug ? courseBySlug(s.course_slug)?.title ?? s.course_slug : "All courses"}</div>
                </div>
                <button onClick={() => deleteSession(s.id).then(refresh)} className="text-soft hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- Community moderation ---------- */
function Community() {
  const [posts, setPosts] = useState<Discussion[]>([]);
  const refresh = () => listAllDiscussions().then(setPosts);
  useEffect(() => { refresh(); }, []);
  return (
    <div className="glass-card p-5">
      <h2 className="font-heading font-bold text-lg text-ink mb-3">Recent community posts (all courses)</h2>
      {posts.length === 0 ? <p className="text-soft text-sm py-6 text-center">No posts yet.</p> : (
        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.id} className={`rounded-xl border p-3 ${p.pinned ? "border-gold/40 bg-gold/[0.06]" : "border-line bg-surface/40"}`}>
              <div className="flex items-center gap-2 text-xs text-soft">
                <span className="font-semibold text-ink">{p.user_name}</span>
                <span>· {courseBySlug(p.course_slug)?.title ?? p.course_slug}</span>
                <span className="ml-auto">{new Date(p.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-ink/85 mt-1.5">{p.body}</p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => togglePinned(p.id, !p.pinned).then(refresh)} className="text-xs text-soft hover:text-gold inline-flex items-center gap-1"><Pin className="w-3 h-3" /> {p.pinned ? "Unpin" : "Pin"}</button>
                <button onClick={() => deleteDiscussion(p.id).then(refresh)} className="text-xs text-soft hover:text-red-500 inline-flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
              </div>
            </li>
          ))}
        </ul>
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
    setSaved(lessonId); force((n) => n + 1);
    setTimeout(() => setSaved((s) => (s === lessonId ? null : s)), 1500);
  };

  return (
    <div className="space-y-3">
      <p className="text-soft text-sm">Paste a video embed URL (YouTube/Vimeo/Loom) into any lesson, it replaces the thumbnail placeholder live. Blank + save to clear.</p>
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
              <ChevronDown className={`w-4 h-4 text-teal transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
                      <input value={current} onChange={(e) => setDrafts((d) => ({ ...d, [l.id]: e.target.value }))} placeholder="https://…  (embed URL)" className="flex-1 rounded-lg border border-line bg-surface/80 px-3 py-2 text-sm outline-none focus:border-teal" />
                      <button onClick={() => save(l.id)} className="btn-primary text-sm py-2 shrink-0">{saved === l.id ? <><Check className="w-4 h-4" /> Saved</> : "Save"}</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      <p className="text-xs text-soft pt-2"><Link to="/courses" className="text-teal inline-flex items-center gap-1">Preview a course <ExternalLink className="w-3 h-3" /></Link></p>
    </div>
  );
}
