/**
 * Auth layer — intentionally thin and swappable.
 *
 * TODAY: a mock "Continue with Google" that stores a local session. This lets
 * the whole LMS (protected routes, progress, admin) work end-to-end now.
 *
 * LATER (Supabase): replace the body of `signInWithGoogle`, `signOut` and the
 * session bootstrap with Supabase Auth calls. Nothing else in the app needs to
 * change — components only touch this hook. See README → "Swapping to Supabase".
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  /** Yasir (admin) sees instructor-only controls. */
  isAdmin: boolean;
  /** The "vibe" a learner picks at onboarding — captured for newsletter/segmenting. */
  vibe?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signInWithGoogle: (opts?: { name?: string; email?: string }) => Promise<void>;
  signOut: () => void;
  setVibe: (vibe: string) => void;
}

const STORAGE_KEY = "lfy.session.v1";
/** The single admin email (Yasir). Mirrors chatwithyasir's admin model. */
const ADMIN_EMAIL = "yasirbashirai@gmail.com";

const AuthContext = createContext<AuthState | undefined>(undefined);

function readSession(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readSession());
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const signInWithGoogle: AuthState["signInWithGoogle"] = async (opts) => {
    // MOCK: stand-in for Supabase `signInWithOAuth({ provider: 'google' })`.
    const email = (opts?.email || "you@example.com").toLowerCase();
    const name = opts?.name || email.split("@")[0];
    const existing = readSession();
    persist({
      id: existing?.id ?? `u_${email}`,
      name,
      email,
      isAdmin: email === ADMIN_EMAIL,
      vibe: existing?.vibe,
    });
  };

  const signOut = () => persist(null);

  const setVibe = (vibe: string) => {
    if (!user) return;
    persist({ ...user, vibe });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, setVibe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
