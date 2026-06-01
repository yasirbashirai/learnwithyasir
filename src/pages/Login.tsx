import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Logo from "@/components/Logo";

/** Google "G" mark. */
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
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const dest = location.state?.from || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await signInWithGoogle({ name: name.trim(), email: email.trim() });
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
        <h1 className="font-heading font-extrabold text-2xl text-center text-ink">Welcome back</h1>
        <p className="text-center text-ink/60 text-sm mt-1">
          Sign in to track progress and unlock modules.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-teal/20 bg-white/80 px-4 py-3 outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-xl border border-teal/20 bg-white/80 px-4 py-3 outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
            required
          />
          <button type="submit" disabled={busy} className="w-full bg-white border border-ink/15 rounded-xl py-3 font-semibold text-ink flex items-center justify-center gap-3 hover:bg-ink/[0.03] transition-colors">
            <GoogleIcon /> Continue with Google
          </button>
        </form>

        <div className="mt-5 flex items-start gap-2 text-xs text-ink/55">
          <ShieldCheck className="w-4 h-4 shrink-0 text-teal mt-0.5" />
          <p>
            Demo mode — your details are stored locally on this device. Real Google
            sign-in &amp; secure accounts arrive when Supabase is connected.
          </p>
        </div>

        <p className="text-center text-xs text-ink/50 mt-5">
          By continuing you agree to learn, build and ship. <Link to="/" className="text-teal">Back home</Link>
        </p>
      </motion.div>
    </div>
  );
}
