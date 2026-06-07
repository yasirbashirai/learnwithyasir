/**
 * Auth layer, Supabase-backed (with a localStorage fallback when env vars
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
  /** A non-error message to show in success styling (e.g. "check your email"). */
  notice?: string;
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
      // SECURITY: the localStorage mock session is a DEV-ONLY convenience so the
      // app runs without Supabase. In production it must NEVER authenticate anyone
      // (otherwise a missing env var silently disables all auth). Stay logged out.
      if (import.meta.env.PROD) {
        setUser(null);
        setLoading(false);
        return;
      }
      // Offline fallback (dev only): read mock session.
      // Synchronous session bootstrap from localStorage — the setState here is the
      // intended one-time hydration, not a render-driven update.
      /* eslint-disable react-hooks/set-state-in-effect */
      try {
        const raw = localStorage.getItem(MOCK_KEY);
        if (raw) {
          const u = JSON.parse(raw) as User;
          setSuperAdmin(u.isAdmin);
          setUser(u);
        }
      } catch { /* ignore */ }
      setLoading(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    let active = true;
    let resolved = false; // becomes true once we've seen a real signed-in session
    // True right after an OAuth redirect (PKCE ?code= or implicit #access_token=).
    const hasOAuthCallback = /[#?&](code|access_token|error)=/.test(window.location.href);

    const apply = async (session: import("@supabase/supabase-js").Session | null) => {
      if (!session?.user) {
        // During an OAuth redirect the client fires a transient null (INITIAL_SESSION)
        // BEFORE the code exchange finishes. Ignore it so we don't bounce to /login
        // and throw away the ?code. Real sign-outs (after resolved) still pass through.
        if (hasOAuthCallback && !resolved) return;
        if (active) { setUser(null); clearProgressCache(); setSuperAdmin(false); setLoading(false); }
        return;
      }
      resolved = true;
      const su = session.user;
      const name = (su.user_metadata?.name as string) || (su.email ?? "Learner").split("@")[0];

      // Log the user in IMMEDIATELY from the session we already hold, and stop the
      // spinner right away. We never block the UI on the profile/progress network
      // calls — if those are slow or stall (e.g. a token refresh), the app must
      // still load. They enrich the user in the background once they return.
      const base: User = { id: su.id, email: su.email ?? "", name, isAdmin: (su.email ?? "").toLowerCase() === ADMIN_EMAIL };
      if (active) { setSuperAdmin(base.isAdmin); setUser(base); setLoading(false); }

      loadProfile(su.id, su.email ?? "", name)
        .then((profile) => { if (active) { setSuperAdmin(profile.isAdmin); setUser(profile); } })
        .catch(() => { /* keep base user */ });
      void hydrateProgress(su.id);
    };

    // Subscribe first so the SIGNED_IN event (fired after the code exchange) is caught.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => apply(session));

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) apply(data.session);
      else if (!hasOAuthCallback) { if (active) { setUser(null); setLoading(false); } }
      // else: an OAuth redirect is being processed, wait for onAuthStateChange.
    });

    // Safety net so we never hang on the spinner — always clear loading after a
    // few seconds no matter what (a stalled getSession / code exchange must not
    // leave the user stuck behind a ProtectedRoute spinner forever).
    const timeout = setTimeout(() => { if (active) setLoading(false); }, 4000);
    return () => { active = false; clearTimeout(timeout); sub.subscription.unsubscribe(); };
  }, []);

  /* ---- Actions ---- */
  const signInWithGoogle = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) {
      if (import.meta.env.PROD) return { error: "Sign-in is temporarily unavailable. Please try again shortly." };
      mockSignIn(email, email.split("@")[0]);
      return {};
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signUpWithEmail = async (name: string, email: string, password: string): Promise<AuthResult> => {
    if (!supabase) {
      if (import.meta.env.PROD) return { error: "Sign-up is temporarily unavailable. Please try again shortly." };
      mockSignIn(email, name);
      return {};
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) return { error: error.message };
    if (!data.session) return { notice: "Account created! Check your email (including the spam/promotions folder) for a confirmation link, then come back and sign in." };
    return {};
  };

  const mockSignIn = (email: string, name: string) => {
    // SECURITY: a mock (dev-only) session is NEVER admin. Admin is granted solely
    // from a real, verified Supabase session whose JWT email matches ADMIN_EMAIL,
    // and is enforced server-side by RLS regardless of this client flag.
    const u: User = { id: `u_${email}`, email, name, isAdmin: false };
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
