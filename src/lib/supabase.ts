import { createClient } from "@supabase/supabase-js";

/**
 * Single Supabase client for the app. Reads the public anon key from env — this
 * key is safe to ship in the browser (RLS protects the data). The service_role
 * key must NEVER appear in frontend code.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True only when both env vars are present — lets the app degrade gracefully. */
export const supabaseEnabled = Boolean(url && anon);

export const supabase = supabaseEnabled
  ? createClient(url!, anon!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
