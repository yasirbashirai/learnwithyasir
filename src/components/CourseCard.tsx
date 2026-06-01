import { Link } from "react-router-dom";
import { Clock, Layers } from "lucide-react";
import type { Course } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { courseProgress, isEnrolled } from "@/lib/progress";
import { useProgressTick } from "@/hooks/useProgressTick";
import ProgressRing from "./ProgressRing";

export default function CourseCard({ course }: { course: Course }) {
  const { user } = useAuth();
  useProgressTick();
  const enrolled = user ? isEnrolled(user.id, course.slug) : false;
  const prog = user ? courseProgress(user.id, course) : null;
  const lessonCount = course.modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="glass-card p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-card transition-all duration-300 group"
    >
      <div className="flex items-start gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-2xl text-2xl bg-cream shrink-0">
          {course.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-teal">{course.category}</span>
            {course.flagship && (
              <span className="text-[10px] font-bold uppercase tracking-wide bg-gold/20 text-gold-dark px-1.5 py-0.5 rounded">★ Flagship</span>
            )}
          </div>
          <h3 className="font-heading font-bold text-ink leading-tight mt-0.5 group-hover:text-teal transition-colors">
            {course.title}
          </h3>
        </div>
        {enrolled && prog && <ProgressRing pct={prog.pct} size={40} />}
      </div>

      <p className="text-sm text-ink/70 leading-snug line-clamp-2">{course.tagline}</p>

      <div className="mt-auto flex items-center gap-4 text-xs text-ink/60 pt-1">
        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.durationWeeks} weeks</span>
        <span className="inline-flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {lessonCount} lessons</span>
        <span className="ml-auto font-semibold text-ink/70">{course.level}</span>
      </div>
    </Link>
  );
}
