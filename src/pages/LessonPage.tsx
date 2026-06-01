import { useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Lock, CheckCircle2, Circle, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import LessonBody from "@/components/LessonBody";
import { courseBySlug } from "@/data/courses";
import { PART_META } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import {
  enroll,
  isEnrolled,
  isLessonComplete,
  isModuleUnlocked,
  toggleLesson,
} from "@/lib/progress";
import { useProgressTick } from "@/hooks/useProgressTick";

export default function LessonPage() {
  const { slug = "", lessonId = "" } = useParams();
  const course = courseBySlug(slug);
  const { user } = useAuth();
  const navigate = useNavigate();
  useProgressTick();

  // Auto-enrol when a logged-in learner opens a lesson directly.
  useEffect(() => {
    if (user && course && !isEnrolled(user.id, course.slug)) {
      enroll(user.id, course.slug);
    }
  }, [user, course]);

  // Flatten lessons with their module index for prev/next + lock checks.
  const flat = useMemo(() => {
    if (!course) return [];
    return course.modules.flatMap((m, mi) =>
      m.lessons.map((l) => ({ lesson: l, module: m, moduleIndex: mi })),
    );
  }, [course]);

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

  const pos = flat.findIndex((f) => f.lesson.id === lessonId);
  const current = flat[pos];

  if (!current) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h1 className="font-heading font-bold text-2xl">Lesson not found</h1>
          <Link to={`/courses/${course.slug}`} className="btn-primary mt-4 inline-flex">Back to course</Link>
        </div>
      </div>
    );
  }

  // Guard: if this lesson's module is locked, bounce to the course page.
  const unlocked = user ? isModuleUnlocked(user.id, course, current.moduleIndex) : false;
  if (user && !unlocked) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <Lock className="w-10 h-10 mx-auto text-ink/30" />
          <h1 className="font-heading font-bold text-2xl mt-3">This module is locked</h1>
          <p className="text-ink/65 mt-2">Finish the previous part to unlock it.</p>
          <Link to={`/courses/${course.slug}`} className="btn-primary mt-5 inline-flex">Back to course</Link>
        </div>
      </div>
    );
  }

  const done = user ? isLessonComplete(user.id, current.lesson.id) : false;
  const prev = pos > 0 ? flat[pos - 1] : null;
  const next = pos < flat.length - 1 ? flat[pos + 1] : null;
  const meta = PART_META[current.module.part];

  const markAndAdvance = () => {
    if (!user) return;
    if (!done) toggleLesson(user.id, current.lesson.id, true);
    // Advance — if the next lesson belongs to the next module it will now be unlocked.
    if (next) navigate(`/courses/${course.slug}/lesson/${next.lesson.id}`);
    else navigate(`/courses/${course.slug}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar curriculum */}
        <aside className="hidden lg:block">
          <div className="glass-card p-4 sticky top-24 max-h-[80vh] overflow-y-auto">
            <Link to={`/courses/${course.slug}`} className="flex items-center gap-2 font-heading font-bold text-ink mb-3 hover:text-teal">
              <List className="w-4 h-4" /> {course.title}
            </Link>
            {course.modules.map((m, mi) => {
              const open = user ? isModuleUnlocked(user.id, course, mi) : mi === 0;
              return (
                <div key={m.id} className="mb-3">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-teal flex items-center gap-1.5">
                    {!open && <Lock className="w-3 h-3" />} Part {m.part} · {PART_META[m.part].title}
                  </div>
                  <ul className="mt-1.5 space-y-0.5">
                    {m.lessons.map((l) => {
                      const lDone = user ? isLessonComplete(user.id, l.id) : false;
                      const active = l.id === lessonId;
                      return (
                        <li key={l.id}>
                          <Link
                            to={open ? `/courses/${course.slug}/lesson/${l.id}` : "#"}
                            onClick={(e) => !open && e.preventDefault()}
                            className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                              active ? "bg-teal/10 text-teal font-semibold" : open ? "text-ink/70 hover:bg-teal/5" : "text-ink/35 cursor-not-allowed"
                            }`}
                          >
                            {lDone ? <CheckCircle2 className="w-4 h-4 text-teal shrink-0" /> : <Circle className="w-4 h-4 shrink-0 opacity-40" />}
                            <span className="truncate">{l.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Lesson content */}
        <motion.article
          key={current.lesson.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-card p-7 md:p-10"
        >
          <div className="text-xs font-bold uppercase tracking-wide text-teal">
            {meta.icon} Part {current.module.part} · {current.module.title}
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-ink mt-1.5">{current.lesson.title}</h1>
          <p className="text-ink/60 mt-1 text-sm">{current.lesson.minutes} min · {current.lesson.summary}</p>

          <hr className="my-6 border-teal/10" />

          {current.lesson.body ? <LessonBody blocks={current.lesson.body} /> : <p className="text-ink/70">Content coming soon.</p>}

          {/* Complete + nav */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-teal/10">
            <button
              onClick={() => user && toggleLesson(user.id, current.lesson.id, !done)}
              className={`btn px-5 py-3 border ${done ? "bg-teal/10 border-teal/30 text-teal" : "border-ink/15 text-ink/70 hover:bg-ink/5"}`}
            >
              {done ? <><Check className="w-4 h-4" /> Completed</> : <><Circle className="w-4 h-4" /> Mark complete</>}
            </button>
            <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
              {prev && (
                <Link to={`/courses/${course.slug}/lesson/${prev.lesson.id}`} className="btn-ghost border border-teal/15 flex-1 sm:flex-none">
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Link>
              )}
              <button onClick={markAndAdvance} className="btn-primary flex-1 sm:flex-none">
                {next ? <>Complete &amp; next <ChevronRight className="w-4 h-4" /></> : <>Finish course <Check className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
