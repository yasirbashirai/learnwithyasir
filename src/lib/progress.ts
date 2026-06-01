/**
 * Progress + module locking — swappable store.
 *
 * TODAY: per-user progress in localStorage.
 * LATER (Supabase): replace read/write with a `user_progress` table keyed by
 * (user_id, lesson_id). The exported functions keep the same signatures, so
 * components don't change.
 *
 * Locking rule: modules unlock in order. Module N is unlocked once every lesson
 * in module N-1 is complete. The first module of a course is always unlocked
 * once the learner has enrolled.
 */
import type { Course, Module } from "./types";

const key = (userId: string) => `lfy.progress.${userId}.v1`;

interface ProgressData {
  enrolled: string[]; // course slugs
  completed: string[]; // lesson ids
  activity: string[]; // yyyy-mm-dd days with any completion (for streaks)
}

function read(userId: string): ProgressData {
  try {
    const raw = localStorage.getItem(key(userId));
    if (raw) {
      const d = JSON.parse(raw) as Partial<ProgressData>;
      return { enrolled: d.enrolled ?? [], completed: d.completed ?? [], activity: d.activity ?? [] };
    }
  } catch {
    /* ignore */
  }
  return { enrolled: [], completed: [], activity: [] };
}

const today = () => new Date().toISOString().slice(0, 10);

function write(userId: string, data: ProgressData) {
  localStorage.setItem(key(userId), JSON.stringify(data));
  // Let any listening component refresh.
  window.dispatchEvent(new CustomEvent("lfy:progress"));
}

export function isEnrolled(userId: string, slug: string): boolean {
  return read(userId).enrolled.includes(slug);
}

export function enroll(userId: string, slug: string) {
  const d = read(userId);
  if (!d.enrolled.includes(slug)) {
    d.enrolled.push(slug);
    write(userId, d);
  }
}

export function isLessonComplete(userId: string, lessonId: string): boolean {
  return read(userId).completed.includes(lessonId);
}

export function toggleLesson(userId: string, lessonId: string, done: boolean) {
  const d = read(userId);
  const set = new Set(d.completed);
  if (done) {
    set.add(lessonId);
    const t = today();
    if (!d.activity.includes(t)) d.activity.push(t);
  } else {
    set.delete(lessonId);
  }
  d.completed = Array.from(set);
  write(userId, d);
}

/* ---------- Gamification ---------- */
export const XP_PER_LESSON = 50;
/** Level curve: 0,300,700,1200,1800… (each level needs +100 more than the last). */
export function levelForXp(xp: number): { level: number; into: number; need: number } {
  let level = 1;
  let need = 300;
  let acc = 0;
  while (xp >= acc + need) {
    acc += need;
    level += 1;
    need += 100;
  }
  return { level, into: xp - acc, need };
}

function computeStreak(activity: string[]): number {
  if (activity.length === 0) return 0;
  const set = new Set(activity);
  const d = new Date();
  // Streak counts back from today; allow it to still be "alive" if last active yesterday.
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (set.has(d.toISOString().slice(0, 10))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export interface Achievement {
  id: string;
  icon: string;
  label: string;
  desc: string;
  unlocked: boolean;
}

export function achievements(userId: string, coursesDone: number): Achievement[] {
  const d = read(userId);
  const lessons = d.completed.length;
  const streak = computeStreak(d.activity);
  const defs: Achievement[] = [
    { id: "first-step", icon: "🌱", label: "First Step", desc: "Complete your first lesson", unlocked: lessons >= 1 },
    { id: "getting-going", icon: "⚡", label: "Momentum", desc: "Complete 10 lessons", unlocked: lessons >= 10 },
    { id: "scholar", icon: "📚", label: "Scholar", desc: "Complete 40 lessons", unlocked: lessons >= 40 },
    { id: "streak-3", icon: "🔥", label: "On Fire", desc: "3-day learning streak", unlocked: streak >= 3 },
    { id: "streak-7", icon: "🏆", label: "Unstoppable", desc: "7-day learning streak", unlocked: streak >= 7 },
    { id: "graduate", icon: "🎓", label: "Graduate", desc: "Finish a full course", unlocked: coursesDone >= 1 },
    { id: "polymath", icon: "🧠", label: "Polymath", desc: "Finish 3 courses", unlocked: coursesDone >= 3 },
  ];
  return defs;
}

export interface Stats {
  xp: number;
  level: number;
  into: number;
  need: number;
  streak: number;
  lessonsDone: number;
}

export function userStats(userId: string): Stats {
  const d = read(userId);
  const xp = d.completed.length * XP_PER_LESSON;
  const { level, into, need } = levelForXp(xp);
  return { xp, level, into, need, streak: computeStreak(d.activity), lessonsDone: d.completed.length };
}

export function moduleProgress(userId: string, module: Module): { done: number; total: number; pct: number } {
  const d = read(userId);
  const total = module.lessons.length;
  const done = module.lessons.filter((l) => d.completed.includes(l.id)).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function isModuleComplete(userId: string, module: Module): boolean {
  const { done, total } = moduleProgress(userId, module);
  return total > 0 && done === total;
}

/** A module is unlocked if it's the first, or the previous module is complete. */
export function isModuleUnlocked(userId: string, course: Course, moduleIndex: number): boolean {
  if (!isEnrolled(userId, course.slug)) return moduleIndex === 0; // preview part 1
  if (moduleIndex === 0) return true;
  return isModuleComplete(userId, course.modules[moduleIndex - 1]);
}

export function courseProgress(userId: string, course: Course): { done: number; total: number; pct: number } {
  const d = read(userId);
  const lessons = course.modules.flatMap((m) => m.lessons);
  const total = lessons.length;
  const done = lessons.filter((l) => d.completed.includes(l.id)).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function enrolledCourses(userId: string): string[] {
  return read(userId).enrolled;
}

/** Next incomplete lesson id in a course (for "Continue") — null if finished. */
export function nextLessonId(userId: string, course: Course): string | null {
  const d = read(userId);
  for (const m of course.modules) {
    for (const l of m.lessons) {
      if (!d.completed.includes(l.id)) return l.id;
    }
  }
  return null;
}
