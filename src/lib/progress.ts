/**
 * Progress + module locking.
 *
 * Persistence: Supabase (enrollments + lesson_progress) with a synchronous
 * in-memory + localStorage cache in front of it. Components keep calling these
 * functions synchronously in render; mutations update the cache instantly
 * (optimistic) and fire async writes to Supabase. On login we `hydrateProgress`
 * to pull the user's rows into the cache. If Supabase is unavailable the app
 * still works fully offline via localStorage.
 *
 * Locking rule: modules unlock in order — module N unlocks once every lesson in
 * module N-1 is complete. The first module is unlocked once enrolled.
 */
import type { Course, Module } from "./types";
import { supabase } from "./supabase";

const lsKey = (userId: string) => `lfy.progress.${userId}.v1`;
const today = () => new Date().toISOString().slice(0, 10);

interface Data {
  enrolled: string[];
  completed: string[];
  activity: string[];
}

/** Synchronous cache for the active user. */
let cache: { userId: string; data: Data } | null = null;

/**
 * Super-admin (Yasir) sees EVERYTHING unlocked — no enrollment or module-lock
 * gates. Set from the auth layer when the admin signs in.
 */
let superAdmin = false;
export function setSuperAdmin(value: boolean) {
  superAdmin = value;
  window.dispatchEvent(new CustomEvent("lfy:progress"));
}
export function isSuperAdmin() {
  return superAdmin;
}

function readLS(userId: string): Data {
  try {
    const raw = localStorage.getItem(lsKey(userId));
    if (raw) {
      const d = JSON.parse(raw) as Partial<Data>;
      return { enrolled: d.enrolled ?? [], completed: d.completed ?? [], activity: d.activity ?? [] };
    }
  } catch {
    /* ignore */
  }
  return { enrolled: [], completed: [], activity: [] };
}

function read(userId: string): Data {
  if (cache && cache.userId === userId) return cache.data;
  const d = readLS(userId);
  cache = { userId, data: d };
  return d;
}

function persist(userId: string, data: Data) {
  cache = { userId, data };
  localStorage.setItem(lsKey(userId), JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("lfy:progress"));
}

/** Pull the user's rows from Supabase into the cache (call after login). */
export async function hydrateProgress(userId: string) {
  // Seed from localStorage first so the UI has data immediately.
  read(userId);
  if (!supabase) return;
  try {
    const [{ data: enr }, { data: prog }] = await Promise.all([
      supabase.from("enrollments").select("course_slug").eq("user_id", userId),
      supabase.from("lesson_progress").select("lesson_id, completed_at").eq("user_id", userId),
    ]);
    const enrolled = (enr ?? []).map((r: { course_slug: string }) => r.course_slug);
    const completed = (prog ?? []).map((r: { lesson_id: string }) => r.lesson_id);
    const activity = Array.from(
      new Set((prog ?? []).map((r: { completed_at: string }) => (r.completed_at ?? "").slice(0, 10)).filter(Boolean)),
    );
    persist(userId, { enrolled, completed, activity });
  } catch {
    /* offline → keep localStorage cache */
  }
}

export function clearProgressCache() {
  cache = null;
}

/* ---------- Enrollment ---------- */
export function isEnrolled(userId: string, slug: string): boolean {
  return read(userId).enrolled.includes(slug);
}

export function enroll(userId: string, slug: string) {
  const d = read(userId);
  if (d.enrolled.includes(slug)) return;
  persist(userId, { ...d, enrolled: [...d.enrolled, slug] });
  supabase?.from("enrollments").upsert({ user_id: userId, course_slug: slug }).then(() => {});
}

/* ---------- Lesson completion ---------- */
export function isLessonComplete(userId: string, lessonId: string): boolean {
  return read(userId).completed.includes(lessonId);
}

export function toggleLesson(userId: string, lessonId: string, done: boolean) {
  const d = read(userId);
  const completed = new Set(d.completed);
  const activity = new Set(d.activity);
  if (done) {
    completed.add(lessonId);
    activity.add(today());
  } else {
    completed.delete(lessonId);
  }
  persist(userId, { enrolled: d.enrolled, completed: Array.from(completed), activity: Array.from(activity) });

  if (done) {
    supabase?.from("lesson_progress").upsert({ user_id: userId, lesson_id: lessonId }).then(() => {});
  } else {
    supabase?.from("lesson_progress").delete().eq("user_id", userId).eq("lesson_id", lessonId).then(() => {});
  }
}

/* ---------- Module / course progress ---------- */
export function moduleProgress(userId: string, module: Module) {
  const d = read(userId);
  const total = module.lessons.length;
  const done = module.lessons.filter((l) => d.completed.includes(l.id)).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function isModuleComplete(userId: string, module: Module): boolean {
  const { done, total } = moduleProgress(userId, module);
  return total > 0 && done === total;
}

export function isModuleUnlocked(userId: string, course: Course, moduleIndex: number): boolean {
  if (superAdmin) return true; // Yasir: everything unlocked
  if (!isEnrolled(userId, course.slug)) return moduleIndex === 0;
  if (moduleIndex === 0) return true;
  return isModuleComplete(userId, course.modules[moduleIndex - 1]);
}

export function courseProgress(userId: string, course: Course) {
  const d = read(userId);
  const lessons = course.modules.flatMap((m) => m.lessons);
  const total = lessons.length;
  const done = lessons.filter((l) => d.completed.includes(l.id)).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function enrolledCourses(userId: string): string[] {
  return read(userId).enrolled;
}

export function nextLessonId(userId: string, course: Course): string | null {
  const d = read(userId);
  for (const m of course.modules) {
    for (const l of m.lessons) {
      if (!d.completed.includes(l.id)) return l.id;
    }
  }
  return null;
}

/* ---------- Gamification ---------- */
export const XP_PER_LESSON = 50;

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
  return [
    { id: "first-step", icon: "🌱", label: "First Step", desc: "Complete your first lesson", unlocked: lessons >= 1 },
    { id: "getting-going", icon: "⚡", label: "Momentum", desc: "Complete 10 lessons", unlocked: lessons >= 10 },
    { id: "scholar", icon: "📚", label: "Scholar", desc: "Complete 40 lessons", unlocked: lessons >= 40 },
    { id: "streak-3", icon: "🔥", label: "On Fire", desc: "3-day learning streak", unlocked: streak >= 3 },
    { id: "streak-7", icon: "🏆", label: "Unstoppable", desc: "7-day learning streak", unlocked: streak >= 7 },
    { id: "graduate", icon: "🎓", label: "Graduate", desc: "Finish a full course", unlocked: coursesDone >= 1 },
    { id: "polymath", icon: "🧠", label: "Polymath", desc: "Finish 3 courses", unlocked: coursesDone >= 3 },
  ];
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
