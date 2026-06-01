/**
 * Domain model for the LMS. Every skill on yasirbashir.com maps to one Course.
 * A course always has FOUR parts (Yasir's framework):
 *   1. Learn & Scope   2. Practice   3. Career & Clients   4. Advancement
 * Each part contains modules; each module contains lessons.
 *
 * Modules unlock progressively: a module is locked until the previous one is
 * complete. Progress is stored via the swappable store in lib/progress.ts
 * (localStorage today, Supabase later — no model changes required).
 */

export type PartId = 1 | 2 | 3 | 4;

export type LessonKind = "lesson" | "guide" | "project" | "quiz";

export interface ResourceLink {
  label: string;
  href: string;
}

/** A block of rich lesson content — rendered by LessonBody. */
export type ContentBlock =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "steps"; items: string[] }
  | { kind: "callout"; tone?: "tip" | "warn" | "note"; text: string }
  | { kind: "yasir"; text: string } // a personal, first-person note from Yasir
  | { kind: "checklist"; items: string[] }
  | { kind: "resources"; items: ResourceLink[] };

export interface Lesson {
  id: string;
  title: string;
  kind: LessonKind;
  minutes: number;
  summary: string;
  /** True when this lesson has a video slot (placeholder until Yasir uploads). */
  hasVideo?: boolean;
  /** Optional video URL — when empty the player shows a "coming soon" placeholder. */
  videoUrl?: string;
  body?: ContentBlock[];
}

export interface Module {
  id: string;
  part: PartId;
  title: string;
  goal: string;
  lessons: Lesson[];
}

export interface ToolGuide {
  name: string;
  what: string;
  steps: string[];
  links: ResourceLink[];
}

export interface Course {
  slug: string;
  icon: string;
  title: string;
  category: string;
  tagline: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  durationWeeks: number;
  outcomes: string[];
  tools: ToolGuide[];
  modules: Module[];
  flagship?: boolean;
}

export const PART_META: Record<PartId, { title: string; blurb: string; icon: string }> = {
  1: { title: "Learn & Scope", blurb: "Understand the skill, the landscape and exactly what you're mastering.", icon: "📚" },
  2: { title: "Practice", blurb: "Hands-on builds with step-by-step tool setup guides.", icon: "🛠️" },
  3: { title: "Career & Clients", blurb: "Find, win and communicate with real clients.", icon: "💼" },
  4: { title: "Advancement", blurb: "Scale, stay current and your roadmap to expert.", icon: "🚀" },
};
