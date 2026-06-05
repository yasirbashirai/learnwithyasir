import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Seo from "@/components/Seo";

/**
 * Public landing target for OAuth redirects. Supabase returns here with the
 * ?code= / #access_token; AuthProvider exchanges it and sets the user. We just
 * wait (no protected-route bounce) and then forward to the dashboard.
 */
export default function AuthCallback() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    navigate(user ? "/dashboard" : "/login", { replace: true });
  }, [user, loading, navigate]);

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
