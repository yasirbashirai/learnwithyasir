/**
 * Lesson video URLs, admin-managed via the `lesson_videos` table.
 * Loaded once into a cache and read synchronously by the lesson player.
 * When empty for a lesson, the player shows the "coming soon" placeholder.
 */
import { supabase } from "./supabase";

let cache: Record<string, string> | null = null;
let inflight: Promise<void> | null = null;

export async function loadVideos(): Promise<void> {
  if (cache || !supabase) return;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const { data } = await supabase!.from("lesson_videos").select("lesson_id, video_url");
      const map: Record<string, string> = {};
      for (const r of (data ?? []) as { lesson_id: string; video_url: string | null }[]) {
        if (r.video_url) map[r.lesson_id] = r.video_url;
      }
      cache = map;
    } catch {
      cache = {};
    }
  })();
  return inflight;
}

export function getVideos(): Record<string, string> {
  return cache ?? {};
}

export function videoFor(lessonId: string): string | undefined {
  return cache?.[lessonId];
}

/** Admin: set or clear a lesson's video URL. */
export async function setVideo(lessonId: string, url: string): Promise<void> {
  if (!supabase) return;
  const clean = url.trim();
  if (clean) {
    await supabase.from("lesson_videos").upsert({ lesson_id: lessonId, video_url: clean, updated_at: new Date().toISOString() });
    cache = { ...(cache ?? {}), [lessonId]: clean };
  } else {
    await supabase.from("lesson_videos").delete().eq("lesson_id", lessonId);
    if (cache) { const c = { ...cache }; delete c[lessonId]; cache = c; }
  }
}
