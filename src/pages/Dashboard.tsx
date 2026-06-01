import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Flame, Zap, Trophy, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import ProgressRing from "@/components/ProgressRing";
import Seo from "@/components/Seo";
import { useAuth } from "@/lib/auth";
import { courses, courseBySlug } from "@/data/courses";
import { courseProgress, enrolledCourses, nextLessonId, userStats, achievements } from "@/lib/progress";
import { useProgressTick } from "@/hooks/useProgressTick";

const VIBES = [
  { id: "freelance", emoji: "💼", label: "Land freelance clients" },
  { id: "automate", emoji: "⚙️", label: "Automate my own business" },
  { id: "startup", emoji: "🚀", label: "Build a startup / SaaS" },
  { id: "career", emoji: "🎯", label: "Switch careers into AI" },
];

export default function Dashboard() {
  const { user, setVibe } = useAuth();
  useProgressTick();
  if (!user) return null;

  const myslugs = enrolledCourses(user.id);
  const myCourses = myslugs.map(courseBySlug).filter(Boolean) as typeof courses;
  const recommended = courses.filter((c) => !myslugs.includes(c.slug)).slice(0, 3);
  const stats = userStats(user.id);
  const coursesDone = myCourses.filter((c) => courseProgress(user.id, c).pct === 100).length;
  const achs = achievements(user.id, coursesDone);
  const unlockedAchs = achs.filter((a) => a.unlocked).length;
  const xpPct = Math.round((stats.into / stats.need) * 100);

  return (
    <div className="min-h-screen">
      <Seo title="Dashboard" description="Your learning dashboard." path="/dashboard" noindex />
      <Navbar />
      <main className="px-4 py-8 max-w-6xl mx-auto">
        <h1 className="font-heading font-extrabold text-3xl text-ink">Hey {user.name.split(" ")[0]} 👋</h1>
        <p className="text-soft mt-1">Pick up where you left off, or start something new.</p>

        {/* Gamification hero */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="glass-card p-5 md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="grid place-items-center w-14 h-14 rounded-2xl text-white shrink-0" style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>
                <Zap className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-ink">Level {stats.level}</span>
                  <span className="text-sm text-soft">{stats.xp} XP</span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-teal/10 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${xpPct}%`, background: "linear-gradient(90deg,#288672,#36c8a9,#e2a93c)" }} />
                </div>
                <p className="text-xs text-soft mt-1.5">{stats.need - stats.into} XP to level {stats.level + 1}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
              <Flame className="w-6 h-6 text-gold" />
              <div className="font-heading font-extrabold text-2xl text-ink mt-1">{stats.streak}</div>
              <div className="text-[11px] text-soft">day streak</div>
            </div>
            <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
              <Trophy className="w-6 h-6 text-teal" />
              <div className="font-heading font-extrabold text-2xl text-ink mt-1">{unlockedAchs}</div>
              <div className="text-[11px] text-soft">achievements</div>
            </div>
          </div>
        </div>

        {user.isAdmin && (
          <div className="mt-4 rounded-2xl border border-gold/40 bg-gold/10 p-4 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <p className="text-sm text-ink/80">
              <b>Instructor mode</b> — you're signed in as admin. Course management &amp; learner analytics will live here once Supabase is connected.
            </p>
          </div>
        )}

        {/* Vibe picker */}
        {!user.vibe && (
          <div className="mt-6 glass-card p-6">
            <div className="flex items-center gap-2 text-teal font-semibold"><Sparkles className="w-5 h-5" /> What's your goal?</div>
            <p className="text-soft text-sm mt-1">Pick a vibe so I can tailor recommendations (and send you the good stuff).</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              {VIBES.map((v) => (
                <button key={v.id} onClick={() => setVibe(v.id)} className="rounded-2xl border border-teal/20 bg-surface/70 p-4 text-left hover:border-teal hover:-translate-y-0.5 transition-all">
                  <div className="text-2xl">{v.emoji}</div>
                  <div className="font-semibold text-ink mt-1 text-sm">{v.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* In progress */}
        <section className="mt-9">
          <h2 className="font-heading font-bold text-2xl text-ink mb-4">Your courses</h2>
          {myCourses.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-soft">You haven't enrolled in a course yet.</p>
              <Link to="/courses" className="btn-primary mt-4 inline-flex">Browse courses <ArrowRight className="w-4 h-4" /></Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCourses.map((c) => {
                const prog = courseProgress(user.id, c);
                const next = nextLessonId(user.id, c);
                const finished = prog.pct === 100;
                return (
                  <div key={c.slug} className="glass-card card-hover p-5 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid place-items-center w-14 h-14 rounded-2xl text-3xl bg-cream shrink-0">{c.icon}</div>
                      <ProgressRing pct={prog.pct} size={46} />
                    </div>
                    <h3 className="font-heading font-bold text-ink mt-3 leading-tight">{c.title}</h3>
                    <p className="text-sm text-soft mt-1">{prog.done} / {prog.total} lessons · {prog.pct}%</p>
                    <div className="mt-3 h-1.5 rounded-full bg-teal/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${prog.pct}%`, background: "linear-gradient(90deg,#288672,#36c8a9)" }} />
                    </div>
                    {finished ? (
                      <Link to={`/courses/${c.slug}/certificate`} className="btn-gold text-sm mt-4 w-full"><Award className="w-4 h-4" /> Get certificate</Link>
                    ) : (
                      <Link to={next ? `/courses/${c.slug}/lesson/${next}` : `/courses/${c.slug}`} className="btn-primary text-sm mt-4 w-full">
                        {prog.pct === 0 ? "Start course" : "Continue"} <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Achievements */}
        <section className="mt-10">
          <h2 className="font-heading font-bold text-2xl text-ink mb-4">Achievements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {achs.map((a) => (
              <div key={a.id} title={a.desc} className={`glass-card p-4 text-center ${a.unlocked ? "" : "opacity-45 grayscale"}`}>
                <div className="text-3xl">{a.icon}</div>
                <div className="text-xs font-semibold text-ink mt-1.5 leading-tight">{a.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended */}
        {recommended.length > 0 && (
          <section className="mt-10">
            <h2 className="font-heading font-bold text-2xl text-ink mb-4">Recommended for you</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommended.map((c) => <CourseCard key={c.slug} course={c} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
