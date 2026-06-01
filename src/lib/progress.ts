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
}

function read(userId: string): ProgressData {
  try {
    const raw = localStorage.getItem(key(userId));
    if (raw) return JSON.parse(raw) as ProgressData;
  } catch {
    /* ignore */
  }
  return { enrolled: [], completed: [] };
}

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
  if (done) set.add(lessonId);
  else set.delete(lessonId);
  d.completed = Array.from(set);
  write(userId, d);
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
