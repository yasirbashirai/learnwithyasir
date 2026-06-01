/**
 * Admin data layer — read-all queries for the instructor dashboard.
 * Requires the admin-read RLS policies in supabase/schema.sql so Yasir can see
 * every learner's rows (normal users only see their own).
 */
import { supabase } from "./supabase";

export interface LearnerRow {
  id: string;
  name: string;
  email: string;
  vibe?: string;
  createdAt?: string;
  enrollments: number;
  lessonsDone: number;
}

export interface AdminData {
  learners: LearnerRow[];
  totals: { learners: number; enrollments: number; lessonsDone: number };
  vibes: { vibe: string; count: number }[];
}

interface ProfileRow { id: string; name: string | null; email: string | null; vibe: string | null; created_at: string | null }
interface EnrollRow { user_id: string }
interface ProgressRow { user_id: string }

export async function loadAdminData(): Promise<AdminData | { error: string }> {
  if (!supabase) return { error: "Supabase is not configured." };
  try {
    const [pRes, eRes, lRes] = await Promise.all([
      supabase.from("profiles").select("id, name, email, vibe, created_at"),
      supabase.from("enrollments").select("user_id"),
      supabase.from("lesson_progress").select("user_id"),
    ]);
    if (pRes.error) return { error: pRes.error.message };

    const profiles = (pRes.data ?? []) as ProfileRow[];
    const enrolls = (eRes.data ?? []) as EnrollRow[];
    const progress = (lRes.data ?? []) as ProgressRow[];

    const enrollBy = new Map<string, number>();
    enrolls.forEach((r) => enrollBy.set(r.user_id, (enrollBy.get(r.user_id) ?? 0) + 1));
    const doneBy = new Map<string, number>();
    progress.forEach((r) => doneBy.set(r.user_id, (doneBy.get(r.user_id) ?? 0) + 1));

    const learners: LearnerRow[] = profiles
      .map((p) => ({
        id: p.id,
        name: p.name ?? "—",
        email: p.email ?? "—",
        vibe: p.vibe ?? undefined,
        createdAt: p.created_at ?? undefined,
        enrollments: enrollBy.get(p.id) ?? 0,
        lessonsDone: doneBy.get(p.id) ?? 0,
      }))
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

    const vibeMap = new Map<string, number>();
    profiles.forEach((p) => { if (p.vibe) vibeMap.set(p.vibe, (vibeMap.get(p.vibe) ?? 0) + 1); });
    const vibes = Array.from(vibeMap, ([vibe, count]) => ({ vibe, count })).sort((a, b) => b.count - a.count);

    return {
      learners,
      totals: { learners: profiles.length, enrollments: enrolls.length, lessonsDone: progress.length },
      vibes,
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to load admin data." };
  }
}

/** Build + download a CSV of learner emails for the newsletter. */
export function exportLeadsCsv(learners: LearnerRow[]) {
  const header = "name,email,vibe,signed_up,enrollments,lessons_done\n";
  const rows = learners
    .map((l) => [l.name, l.email, l.vibe ?? "", (l.createdAt ?? "").slice(0, 10), l.enrollments, l.lessonsDone]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "learnwithyasir-leads.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}
