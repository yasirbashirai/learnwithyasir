import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Seo from "@/components/Seo";

/**
 * Landing target for OAuth + email-confirmation redirects. Supabase returns here
 * with a ?code= (PKCE) which the Supabase client auto-exchanges (detectSessionInUrl),
 * after which AuthProvider sets `user` and we forward to the dashboard.
 *
 * If the provider/Supabase returns an error (e.g. a bad Google client secret),
 * it comes back as ?error=/#error= — we surface that instead of silently
 * bouncing to /login, so failures are diagnosable rather than invisible.
 */
export default function AuthCallback() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Pull any OAuth error out of the URL (it can land in the query OR the hash).
  useEffect(() => {
    const url = new URL(window.location.href);
    const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
    const raw =
      url.searchParams.get("error_description") ||
      hash.get("error_description") ||
      url.searchParams.get("error") ||
      hash.get("error");
    if (raw) setError(decodeURIComponent(raw.replace(/\+/g, " ")));
  }, []);

  // Once auth has resolved with no error: signed in → dashboard.
  useEffect(() => {
    if (error || loading) return;
    if (user) navigate("/dashboard", { replace: true });
  }, [user, loading, error, navigate]);

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <Seo title="Sign-in failed" description="Sign-in could not be completed." noindex />
        <div className="glass-card w-full max-w-md p-8 text-center">
          <h1 className="font-heading font-extrabold text-xl text-ink">Sign-in didn't complete</h1>
          <p className="mt-3 text-sm text-soft break-words">{error}</p>
          <Link to="/login" replace className="btn-primary mt-6 inline-flex">Back to sign in</Link>
        </div>
      </div>
    );
  }

  // Auth finished but produced no session and no explicit error — show a gentle
  // retry rather than an instant, confusing bounce back to the login screen.
  if (!loading && !user) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <Seo title="Sign-in failed" description="Sign-in could not be completed." noindex />
        <div className="glass-card w-full max-w-md p-8 text-center">
          <h1 className="font-heading font-extrabold text-xl text-ink">Couldn't complete sign-in</h1>
          <p className="mt-3 text-sm text-soft">Please try signing in again.</p>
          <Link to="/login" replace className="btn-primary mt-6 inline-flex">Back to sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <Seo title="Signing you in…" description="Completing sign-in." noindex />
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-teal/30 border-t-teal animate-spin" />
        <p className="text-soft text-sm">Signing you in…</p>
      </div>
    </div>
  );
}
