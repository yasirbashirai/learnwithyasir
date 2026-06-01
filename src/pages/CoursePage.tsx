import { useParams, Link, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, Circle, Clock, BookOpen, ArrowRight, Award, Hammer, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressRing from "@/components/ProgressRing";
import VideoPlayer from "@/components/VideoPlayer";
import CourseCommunity from "@/components/CourseCommunity";
import LiveSessionCard from "@/components/LiveSessionCard";
import ShareCourse from "@/components/ShareCourse";
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
  const projectLessons = course.modules.flatMap((m) => m.lessons).filter((l) => l.kind === "project");

  const handleEnroll = () => {
    if (!user) return navigate("/login", { state: { from: `/courses/${course.slug}` } });
    enroll(user.id, course.slug);
    const next = nextLessonId(user.id, course);
    if (next) navigate(`/courses/${course.slug}/lesson/${next}`);
  };

  const faqs = [
    { q: "Do I need experience?", a: `This course is built for ${course.level === "Advanced" ? "people with some grounding who want to go deep" : "beginners — I start from zero and build up"}.` },
    { q: "How long does it take?", a: "It's a focused one month (4 parts), but self-paced — go faster or slower, progress is saved." },
    { q: "Are the videos ready?", a: "The full curriculum and written lessons are here now. Video lessons appear in each lesson's player as they're recorded." },
    { q: "Will I get a certificate?", a: "Yes — finish all four parts and you'll unlock a shareable certificate of completion." },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header (full width) */}
      <section className="px-4 pt-8 pb-6">
        <div className="max-w-6xl mx-auto">
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
              <div className="mt-5 flex items-center gap-4 flex-wrap">
                {enrolled ? (
                  <button onClick={handleEnroll} className="btn-primary">
                    {prog && prog.pct > 0 ? "Continue learning" : "Start course"} <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleEnroll} className="btn-primary">Enroll free <ArrowRight className="w-4 h-4" /></button>
                )}
                {enrolled && prog && prog.pct === 100 && (
                  <Link to={`/courses/${course.slug}/certificate`} className="btn-gold"><Award className="w-4 h-4" /> Get certificate</Link>
                )}
                {enrolled && prog && <ProgressRing pct={prog.pct} size={48} />}
              </div>
            </div>
          </div>

          {/* Course trailer */}
          <div className="mt-4">
            <VideoPlayer title={`${course.title} — course trailer`} icon={course.icon} partLabel="Course trailer" minutes={2} />
          </div>
        </div>
      </section>

      {/* Two-column body: LEFT = curriculum/session/share/community · RIGHT = overview */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-6 items-start">

          {/* LEFT (main) */}
          <div className="space-y-6 min-w-0 order-2 lg:order-1">
            {/* Curriculum */}
            <div className="space-y-4">
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
                              <Link to={user ? `/courses/${course.slug}/lesson/${l.id}` : "/login"} className="flex items-center gap-3 px-5 py-3 hover:bg-teal/[0.04] transition-colors">
                                {done ? <CheckCircle2 className="w-5 h-5 text-teal shrink-0" /> : <Circle className="w-5 h-5 text-ink/25 shrink-0" />}
                                <span className="flex-1 min-w-0"><span className="text-ink/85">{l.title}</span></span>
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

            <LiveSessionCard courseSlug={course.slug} />
            <ShareCourse slug={course.slug} title={course.title} />
            <CourseCommunity courseSlug={course.slug} />
          </div>

          {/* RIGHT (sidebar) */}
          <aside className="space-y-4 order-1 lg:order-2">
            <div className="glass-card p-6">
              <h2 className="font-heading font-bold text-lg text-ink mb-3">What you'll be able to do</h2>
              <ul className="space-y-2">
                {course.outcomes.map((o, i) => (
                  <li key={i} className="flex gap-2.5 text-ink/80 text-sm"><CheckCircle2 className="w-5 h-5 text-teal shrink-0" /> {o}</li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-heading font-bold text-lg text-ink mb-3">Tools you'll master</h2>
              <div className="flex flex-wrap gap-2">
                {course.tools.map((t) => <span key={t.name} className="glass-pill text-sm">{t.name}</span>)}
              </div>
            </div>

            {projectLessons.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="font-heading font-bold text-lg text-ink mb-3 flex items-center gap-2"><Hammer className="w-5 h-5 text-teal" /> What you'll build</h2>
                <div className="space-y-2.5">
                  {projectLessons.map((l) => (
                    <div key={l.id} className="rounded-2xl border border-line bg-surface/50 p-3.5">
                      <div className="text-sm font-semibold text-ink">{l.title.replace(/^Project:\s*/, "")}</div>
                      <p className="text-xs text-soft mt-1 line-clamp-2">{l.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="grid place-items-center w-9 h-9 rounded-xl text-white font-extrabold text-sm shrink-0" style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>YB</span>
                <h2 className="font-heading font-bold text-base text-ink">Yasir Bashir</h2>
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-gold font-semibold mb-1.5"><Star className="w-3.5 h-3.5 fill-current" /> Practitioner, not just a teacher</div>
              <p className="text-sm text-soft">
                I build {course.category.toLowerCase()} systems for real clients and teach exactly how I work — everything here is something I've shipped and been paid for.
              </p>
              <a href="https://yasirbashiraisite.vercel.app" target="_blank" rel="noopener noreferrer" className="text-teal text-sm font-semibold mt-2 inline-flex items-center gap-1">Work with Yasir ↗</a>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-heading font-bold text-lg text-ink mb-3">FAQ</h2>
              <div className="space-y-2">
                {faqs.map((f) => (
                  <details key={f.q} className="rounded-xl border border-line bg-surface/50 p-3.5 group">
                    <summary className="font-semibold text-sm text-ink cursor-pointer list-none flex items-center justify-between gap-2">
                      {f.q} <span className="text-teal group-open:rotate-45 transition-transform shrink-0">+</span>
                    </summary>
                    <p className="text-sm text-soft mt-2">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
