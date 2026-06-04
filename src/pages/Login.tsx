import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabaseEnabled } from "@/lib/supabase";
import Logo from "@/components/Logo";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.5-8 19.5-20 0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 16.3 3 9.7 7.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43c5.2 0 9.9-2 13.5-5.3l-6.2-5.3C29.2 34 26.7 35 24 35c-5.3 0-9.7-2.6-11.3-7l-6.5 5C9.5 38.6 16.2 43 24 43z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.4l6.2 5.3C39.9 36.3 43.5 30.8 43.5 23c0-.9-.1-1.7-.4-2.5z" />
    </svg>
  );
}

export default function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const dest = location.state?.from || "/dashboard";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res =
      mode === "signup"
        ? await signUpWithEmail(name.trim(), email.trim(), password)
        : await signInWithEmail(email.trim(), password);
    setBusy(false);
    if (res.error) { setMsg(res.error); return; }
    navigate(dest, { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 grid-bg">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="glass-card w-full max-w-md p-8"
      >
        <div className="flex justify-center mb-6"><Logo /></div>
        <h1 className="font-heading font-extrabold text-2xl text-center text-ink">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-center text-soft text-sm mt-1">Track progress, unlock modules, earn certificates.</p>

        {supabaseEnabled && (
          <button
            onClick={signInWithGoogle}
            className="mt-6 w-full bg-white border border-ink/15 rounded-xl py-3 font-semibold text-[#1f1f1f] flex items-center justify-center gap-3 hover:shadow-soft transition-shadow"
          >
            <GoogleIcon /> Continue with Google
          </button>
        )}

        {supabaseEnabled && (
          <div className="flex items-center gap-3 my-5 text-xs text-soft">
            <div className="h-px flex-1 bg-line" /> or {mode === "signup" ? "sign up" : "sign in"} with email <div className="h-px flex-1 bg-line" />
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input
              value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required
              className="w-full rounded-xl border border-teal/20 bg-surface/80 px-4 py-3 outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
            />
          )}
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required
            className="w-full rounded-xl border border-teal/20 bg-surface/80 px-4 py-3 outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required minLength={6}
            className="w-full rounded-xl border border-teal/20 bg-surface/80 px-4 py-3 outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
          />
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        {msg && <p className="mt-3 text-sm text-center text-gold-dark bg-gold/10 border border-gold/30 rounded-xl px-3 py-2">{msg}</p>}

        <p className="text-center text-sm text-soft mt-5">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <button onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setMsg(null); }} className="text-teal font-semibold">
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>

        <div className="mt-5 flex items-start gap-2 text-xs text-soft">
          <ShieldCheck className="w-4 h-4 shrink-0 text-teal mt-0.5" />
          <p>
            {supabaseEnabled
              ? "Secured by Supabase. Your progress syncs across devices."
              : "Demo mode, set Supabase env vars to enable real accounts."}
          </p>
        </div>

        <p className="text-center text-xs text-soft mt-4"><Link to="/" className="text-teal">← Back home</Link></p>
      </motion.div>
    </div>
  );
}
