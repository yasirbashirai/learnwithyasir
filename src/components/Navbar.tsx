import { Link, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, BookOpen } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "@/lib/auth";

const MAIN_SITE = "https://yasirbashiraisite.vercel.app";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 px-4 py-3">
      <nav className="glass max-w-6xl mx-auto rounded-2xl px-4 py-2.5 flex items-center gap-3">
        <Logo />
        <div className="ml-auto flex items-center gap-1.5">
          <Link to="/courses" className="btn-ghost text-sm hidden sm:inline-flex">
            <BookOpen className="w-4 h-4" /> Courses
          </Link>
          <a
            href={MAIN_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm hidden md:inline-flex"
          >
            🌐 Main site ↗
          </a>
          {user ? (
            <>
              <Link to="/dashboard" className="btn-ghost text-sm">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
                className="btn-ghost text-sm"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <span
                className="grid place-items-center w-9 h-9 rounded-full text-white font-bold text-sm shrink-0"
                style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}
                title={user.email}
              >
                {user.name.charAt(0).toUpperCase()}
              </span>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2">
              Get started
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
