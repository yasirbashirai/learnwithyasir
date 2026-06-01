import { useParams, Link, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, Circle, Clock, BookOpen, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressRing from "@/components/ProgressRing";
import { courseBySlug } from "@/data/courses";
import { PART_META, type Lesson } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import {
  courseProgress,
  enroll,
  isEnrolled,
  isLessonComplete,
  isModuleUnlocked,
  moduleProgress,
  nextLessonId,
} from "@/lib/progress";
import { useProgressTick } from "@/hooks/useProgressTick";

const lessonKindLabel: Record<Lesson["kind"], string> = {
  lesson: "Lesson",
  guide: "Setup guide",
  project: "Project",
  quiz: "Checkpoint",
};

export default function CoursePage() {
  const { slug = "" } = useParams();
  const course = courseBySlug(slug);
  const { user } = useAuth();
  const navigate = useNavigate();
  useProgressTick();

  if (!course) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h1 className="font-heading font-bold text-2xl">Course not found</h1>
          <Link to="/courses" className="btn-primary mt-4 inline-flex">Browse courses</Link>
        </div>
      </div>
    );
  }

  const enrolled = user ? isEnrolled(user.id, course.slug) : false;
  const prog = user ? courseProgress(user.id, course) : null;

  const handleEnroll = () => {
    if (!user) return navigate("/login", { state: { from: `/courses/${course.slug}` } });
    enroll(user.id, course.slug);
    const next = nextLessonId(user.id, course);
    if (next) navigate(`/courses/${course.slug}/lesson/${next}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="px-4 pt-8 pb-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/courses" className="text-sm text-ink/60 hover:text-teal">← All courses</Link>
          <div className="glass-card p-7 mt-3 flex flex-col md:flex-row gap-6">
            <div className="grid place-items-center w-20 h-20 rounded-3xl text-5xl bg-cream shrink-0">{course.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wide text-teal">{course.category}</span>
                <span className="text-xs text-ink/50">· {course.level}</span>
                {course.flagship && <span className="text-[10px] font-bold uppercase tracking-wide bg-gold/20 text-gold-dark px-1.5 py-0.5 rounded">★ Flagship</span>}
              </div>
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-ink mt-1">{course.title}</h1>
              <p className="text-ink/70 mt-2 max-w-2xl">{course.tagline}</p>
              <div className="flex items-center gap-5 mt-4 text-sm text-ink/60">
                <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.durationWeeks} weeks</span>
                <span className="inline-flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {course.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons</span>
              </div>
              <div className="mt-5 flex items-center gap-4">
                {enrolled ? (
                  <button onClick={handleEnroll} className="btn-primary">
                    {prog && prog.pct > 0 ? "Continue learning" : "Start course"} <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleEnroll} className="btn-primary">Enroll free <ArrowRight className="w-4 h-4" /></button>
                )}
                {enrolled && prog && <ProgressRing pct={prog.pct} size={48} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes + tools */}
      <section className="px-4 pb-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
          <div className="glass-card p-6">
            <h2 className="font-heading font-bold text-lg text-ink mb-3">What you'll be able to do</h2>
            <ul className="space-y-2">
              {course.outcomes.map((o, i) => (
                <li key={i} className="flex gap-2.5 text-ink/80 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-teal shrink-0" /> {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-6">
            <h2 className="font-heading font-bold text-lg text-ink mb-3">Tools you'll master</h2>
            <div className="flex flex-wrap gap-2">
              {course.tools.map((t) => (
                <span key={t.name} className="glass-pill text-sm">{t.name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum — 4 parts */}
      <section className="px-4 pb-10">
        <div className="max-w-5xl mx-auto space-y-4">
          <h2 className="font-heading font-bold text-2xl text-ink">Curriculum</h2>
          {course.modules.map((module, idx) => {
            const unlocked = user ? isModuleUnlocked(user.id, course, idx) : idx === 0;
            const mp = user ? moduleProgress(user.id, module) : { done: 0, total: module.lessons.length, pct: 0 };
            const meta = PART_META[module.part];
            return (
              <div key={module.id} className={`glass-card overflow-hidden ${!unlocked ? "opacity-80" : ""}`}>
                <div className="p-5 flex items-center gap-4 border-b border-teal/10">
                  <div className="grid place-items-center w-11 h-11 rounded-2xl bg-teal/10 text-xl shrink-0">{meta.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wide text-teal">Part {module.part} · {meta.title}</div>
                    <h3 className="font-heading font-bold text-ink">{module.title}</h3>
                    <p className="text-sm text-ink/60 mt-0.5">{module.goal}</p>
                  </div>
                  {unlocked ? (
                    <span className="text-sm font-semibold text-ink/60 shrink-0">{mp.done}/{mp.total}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm text-ink/50 shrink-0"><Lock className="w-4 h-4" /> Locked</span>
                  )}
                </div>

                {unlocked ? (
                  <ul className="divide-y divide-teal/5">
                    {module.lessons.map((l) => {
                      const done = user ? isLessonComplete(user.id, l.id) : false;
                      return (
                        <li key={l.id}>
                          <Link
                            to={user ? `/courses/${course.slug}/lesson/${l.id}` : "/login"}
                            className="flex items-center gap-3 px-5 py-3 hover:bg-teal/[0.04] transition-colors"
                          >
                            {done ? <CheckCircle2 className="w-5 h-5 text-teal shrink-0" /> : <Circle className="w-5 h-5 text-ink/25 shrink-0" />}
                            <span className="flex-1 min-w-0">
                              <span className="text-ink/85">{l.title}</span>
                            </span>
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink/45 shrink-0 hidden sm:inline">{lessonKindLabel[l.kind]}</span>
                            <span className="text-xs text-ink/45 shrink-0 inline-flex items-center gap-1"><Clock className="w-3 h-3" />{l.minutes}m</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="px-5 py-6 text-center text-sm text-ink/55">
                    <Lock className="w-5 h-5 mx-auto mb-1.5 text-ink/30" />
                    Complete <b>Part {module.part - 1}</b> to unlock this module.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
