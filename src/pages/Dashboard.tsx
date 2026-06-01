import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import ProgressRing from "@/components/ProgressRing";
import { useAuth } from "@/lib/auth";
import { courses, courseBySlug } from "@/data/courses";
import { courseProgress, enrolledCourses, nextLessonId } from "@/lib/progress";
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="px-4 py-8 max-w-6xl mx-auto">
        <h1 className="font-heading font-extrabold text-3xl text-ink">
          Hey {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-ink/65 mt-1">Pick up where you left off, or start something new.</p>

        {user.isAdmin && (
          <div className="mt-5 rounded-2xl border border-gold/40 bg-gold/10 p-4 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-gold-dark" />
            <p className="text-sm text-ink/80">
              <b>Instructor mode</b> — you're signed in as admin. Course management &amp; learner
              analytics will live here once Supabase is connected.
            </p>
          </div>
        )}

        {/* Vibe picker — captures the learner's goal (and their email is already on file) */}
        {!user.vibe && (
          <div className="mt-6 glass-card p-6">
            <div className="flex items-center gap-2 text-teal font-semibold">
              <Sparkles className="w-5 h-5" /> What's your goal?
            </div>
            <p className="text-ink/65 text-sm mt-1">Pick a vibe so I can tailor recommendations (and send you the good stuff).</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              {VIBES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVibe(v.id)}
                  className="rounded-2xl border border-teal/20 bg-white/70 p-4 text-left hover:border-teal hover:-translate-y-0.5 transition-all"
                >
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
              <p className="text-ink/70">You haven't enrolled in a course yet.</p>
              <Link to="/courses" className="btn-primary mt-4 inline-flex">Browse courses <ArrowRight className="w-4 h-4" /></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myCourses.map((c) => {
                const prog = courseProgress(user.id, c);
                const next = nextLessonId(user.id, c);
                return (
                  <div key={c.slug} className="glass-card p-5 flex items-center gap-4">
                    <div className="grid place-items-center w-12 h-12 rounded-2xl text-2xl bg-cream shrink-0">{c.icon}</div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading font-bold text-ink truncate">{c.title}</h3>
                      <p className="text-sm text-ink/60">{prog.done} / {prog.total} lessons · {prog.pct}%</p>
                    </div>
                    <ProgressRing pct={prog.pct} />
                    <Link
                      to={next ? `/courses/${c.slug}/lesson/${next}` : `/courses/${c.slug}`}
                      className="btn-primary text-sm py-2.5 shrink-0"
                    >
                      {prog.pct === 0 ? "Start" : prog.pct === 100 ? "Review" : "Continue"} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
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
