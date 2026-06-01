/**
 * Auth layer — Supabase-backed (with a localStorage fallback when env vars
 * aren't set, so the app still runs offline / in previews).
 *
 * Components only ever touch this hook, so the rest of the app is auth-agnostic.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase, supabaseEnabled } from "./supabase";
import { hydrateProgress, clearProgressCache, setSuperAdmin } from "./progress";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isAdmin: boolean;
  vibe?: string;
}

interface AuthResult {
  error?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  setVibe: (vibe: string) => void;
}

/** The single admin (Yasir). Also flagged via profiles.is_admin in the DB. */
const ADMIN_EMAIL = "yasirbashirai@gmail.com";
const MOCK_KEY = "lfy.session.v1";

const AuthContext = createContext<AuthState | undefined>(undefined);

/* ---------------- Supabase profile helpers ---------------- */
async function loadProfile(id: string, email: string, name: string): Promise<User> {
  const base: User = { id, email, name, isAdmin: email.toLowerCase() === ADMIN_EMAIL };
  if (!supabase) return base;
  try {
    const { data } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    if (!data) {
      // First sign-in → create the profile row.
      await supabase.from("profiles").insert({ id, email, name, is_admin: base.isAdmin });
      return base;
    }
    return {
      id,
      email: data.email ?? email,
      name: data.name ?? name,
      isAdmin: Boolean(data.is_admin) || base.isAdmin,
      vibe: data.vibe ?? undefined,
    };
  } catch {
    return base;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---- Supabase session bootstrap ---- */
  useEffect(() => {
    if (!supabaseEnabled || !supabase) {
      // Offline fallback: read mock session.
      try {
        const raw = localStorage.getItem(MOCK_KEY);
        if (raw) {
          const u = JSON.parse(raw) as User;
          setSuperAdmin(u.isAdmin);
          setUser(u);
        }
      } catch { /* ignore */ }
      setLoading(false);
      return;
    }

    let active = true;
    // True right after an OAuth redirect (PKCE ?code= or implicit #access_token=).
    const hasOAuthCallback = /[#?&](code|access_token|error)=/.test(window.location.href);

    const apply = async (session: import("@supabase/supabase-js").Session | null) => {
      if (!session?.user) {
        if (active) { setUser(null); clearProgressCache(); setSuperAdmin(false); setLoading(false); }
        return;
      }
      const su = session.user;
      const name = (su.user_metadata?.name as string) || (su.email ?? "Learner").split("@")[0];
      const profile = await loadProfile(su.id, su.email ?? "", name);
      setSuperAdmin(profile.isAdmin);
      await hydrateProgress(su.id);
      if (active) { setUser(profile); setLoading(false); }
    };

    // Subscribe first so the SIGNED_IN event (fired after the code exchange) is caught.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => apply(session));

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) apply(data.session);
      else if (!hasOAuthCallback) { if (active) { setUser(null); setLoading(false); } }
      // else: an OAuth redirect is being processed — wait for onAuthStateChange.
    });

    // Safety net so we never hang on the spinner if the exchange fails.
    const timeout = setTimeout(() => { if (active) setLoading(false); }, 6000);
    return () => { active = false; clearTimeout(timeout); sub.subscription.unsubscribe(); };
  }, []);

  /* ---- Actions ---- */
  const signInWithGoogle = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) { mockSignIn(email, email.split("@")[0]); return {}; }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signUpWithEmail = async (name: string, email: string, password: string): Promise<AuthResult> => {
    if (!supabase) { mockSignIn(email, name); return {}; }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) return { error: error.message };
    if (!data.session) return { error: "Check your email to confirm your account, then sign in." };
    return {};
  };

  const mockSignIn = (email: string, name: string) => {
    const u: User = { id: `u_${email}`, email, name, isAdmin: email.toLowerCase() === ADMIN_EMAIL };
    localStorage.setItem(MOCK_KEY, JSON.stringify(u));
    setSuperAdmin(u.isAdmin);
    setUser(u);
    hydrateProgress(u.id);
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem(MOCK_KEY);
    setSuperAdmin(false);
    clearProgressCache();
    setUser(null);
  };

  const setVibe = (vibe: string) => {
    if (!user) return;
    setUser({ ...user, vibe });
    if (supabase) supabase.from("profiles").update({ vibe }).eq("id", user.id).then(() => {});
    else localStorage.setItem(MOCK_KEY, JSON.stringify({ ...user, vibe }));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, setVibe }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
