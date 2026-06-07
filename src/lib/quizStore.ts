/**
 * Persistence for the Skill-Fit quiz.
 *
 * Saves the lead (name, email, optional phone) plus the full result to Supabase
 * (`quiz_leads` table) when configured, and ALWAYS keeps a localStorage copy so
 * the report still works offline and the user never loses their result.
 * Mirrors the graceful-degradation pattern used across the app (supabase may be
 * null, see lib/supabase.ts).
 */
import { supabase } from "./supabase";
import type { Answers, QuizResult } from "@/data/quiz";

export interface QuizLead {
  name: string;
  email: string;
  phone?: string;
  goal?: string;
}

export interface SavedQuiz extends QuizLead {
  answers: Answers;
  archetype: string;
  topSkills: string[]; // recommended course slugs
  pathSlug: string | null;
  createdAt: string;
}

const LS_KEY = "lfy.quiz.v1";

/** Persist locally (always) and to Supabase (when enabled). Never throws. */
export async function saveQuiz(lead: QuizLead, answers: Answers, result: QuizResult): Promise<void> {
  const record: SavedQuiz = {
    ...lead,
    answers,
    archetype: result.archetype.title,
    topSkills: result.matches.map((m) => m.slug),
    pathSlug: result.path?.slug ?? null,
    createdAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(LS_KEY, JSON.stringify(record));
  } catch {
    /* storage full / blocked, ignore */
  }

  if (!supabase) return;
  try {
    await supabase.from("quiz_leads").insert({
      name: lead.name,
      email: lead.email,
      phone: lead.phone ?? null,
      goal: lead.goal ?? null,
      archetype: record.archetype,
      top_skills: record.topSkills,
      path_slug: record.pathSlug,
      profile: result.profile,
      practical: result.practical,
      answers,
    });
  } catch {
    /* offline or RLS, local copy already saved */
  }
}

/** A few human-readable lines describing a result, for the email to Yasir. */
export function summarizeResult(result: QuizResult): string[] {
  const lines = [
    `Profile: ${result.archetype.title}`,
    `Top match: ${result.matches[0]?.title ?? "—"} (${result.matches[0]?.score ?? 0}% fit)`,
  ];
  const others = result.matches.slice(1, 4).map((m) => `${m.title} ${m.score}%`).join(", ");
  if (others) lines.push(`Other fits: ${others}`);
  if (result.path) lines.push(`Recommended path: ${result.path.title}`);
  lines.push(`Readiness: ${result.scorecard.readiness}/100 (${result.scorecard.readinessBand.label})`);
  return lines;
}

/**
 * Email the lead to Yasir in realtime via the /api/notify serverless function.
 * Never throws — in local dev (no serverless runtime) it simply no-ops.
 */
export async function notifyYasir(payload: {
  type: "quiz" | "message";
  name: string;
  email: string;
  phone?: string;
  message?: string;
  summary?: string[];
}): Promise<boolean> {
  try {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return Boolean(data?.ok);
  } catch {
    return false;
  }
}

/** Read back the last saved quiz on this device, if any. */
export function loadLastQuiz(): SavedQuiz | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as SavedQuiz) : null;
  } catch {
    return null;
  }
}
