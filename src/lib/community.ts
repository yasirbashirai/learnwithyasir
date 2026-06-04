/**
 * Community discussions + weekly live sessions (Supabase-backed).
 * Reads work for everyone; posting requires a signed-in user; deletes are
 * limited to the author or the super-admin (enforced by RLS in schema.sql).
 */
import { supabase } from "./supabase";

export interface Discussion {
  id: string;
  course_slug: string;
  user_id: string;
  user_name: string;
  body: string;
  pinned: boolean;
  created_at: string;
}

export interface LiveSession {
  id: string;
  course_slug: string | null;
  title: string;
  description: string | null;
  starts_at: string;
  join_url: string | null;
}

/* ---------------- Discussions ---------------- */
export async function listDiscussions(courseSlug: string): Promise<Discussion[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("discussions")
    .select("*")
    .eq("course_slug", courseSlug)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  return (data ?? []) as Discussion[];
}

export async function postDiscussion(courseSlug: string, userId: string, userName: string, body: string) {
  if (!supabase) return;
  await supabase.from("discussions").insert({ course_slug: courseSlug, user_id: userId, user_name: userName, body });
}

/** Admin moderation, recent posts across every course. */
export async function listAllDiscussions(limit = 100): Promise<Discussion[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("discussions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Discussion[];
}

export async function deleteDiscussion(id: string) {
  if (!supabase) return;
  await supabase.from("discussions").delete().eq("id", id);
}

export async function togglePinned(id: string, pinned: boolean) {
  if (!supabase) return;
  await supabase.from("discussions").update({ pinned }).eq("id", id);
}

/* ---------------- Live sessions ---------------- */
export async function listSessions(courseSlug?: string): Promise<LiveSession[]> {
  if (!supabase) return [];
  let q = supabase.from("live_sessions").select("*").order("starts_at", { ascending: true });
  if (courseSlug) q = q.or(`course_slug.eq.${courseSlug},course_slug.is.null`);
  const { data } = await q;
  return (data ?? []) as LiveSession[];
}

/** Next upcoming session for a course (or global). */
export async function nextSession(courseSlug: string): Promise<LiveSession | null> {
  const all = await listSessions(courseSlug);
  const now = Date.now();
  return all.find((s) => new Date(s.starts_at).getTime() >= now) ?? null;
}

export async function createSession(s: Omit<LiveSession, "id">) {
  if (!supabase) return;
  await supabase.from("live_sessions").insert(s);
}

export async function deleteSession(id: string) {
  if (!supabase) return;
  await supabase.from("live_sessions").delete().eq("id", id);
}
