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

/** Read back the last saved quiz on this device, if any. */
export function loadLastQuiz(): SavedQuiz | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as SavedQuiz) : null;
  } catch {
    return null;
  }
}
