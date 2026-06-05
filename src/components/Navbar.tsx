import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, BookOpen, Route as RouteIcon, Flame, ShieldCheck, Briefcase, Compass, Menu, X } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/lib/auth";
import { userStats } from "@/lib/progress";
import { useProgressTick } from "@/hooks/useProgressTick";
import { SERVICES_SITE } from "@/data/links";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  useProgressTick();
  const stats = user ? userStats(user.id) : null;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 py-3">
      <nav className="glass max-w-6xl mx-auto rounded-2xl px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3 relative">
        <Logo />
        {/* Mobile dropdown — primary nav that's hidden on phones */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 sm:hidden glass rounded-2xl p-2 flex flex-col gap-1 shadow-card z-50">
            <Link to="/courses" onClick={() => setMenuOpen(false)} className="btn-ghost justify-start text-sm">
              <BookOpen className="w-4 h-4" /> Courses
            </Link>
            <Link to="/quiz" onClick={() => setMenuOpen(false)} className="btn-ghost justify-start text-sm text-teal">
              <Compass className="w-4 h-4" /> Find your skill
            </Link>
            <Link to="/paths" onClick={() => setMenuOpen(false)} className="btn-ghost justify-start text-sm">
              <RouteIcon className="w-4 h-4" /> Paths
            </Link>
            <a href={SERVICES_SITE} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="btn-ghost justify-start text-sm text-teal">
              <Briefcase className="w-4 h-4" /> Work with Yasir ↗
            </a>
            {!user && (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary justify-center text-sm mt-1">
                Get started
              </Link>
            )}
          </div>
        )}
        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          <Link to="/courses" className="btn-ghost text-sm hidden sm:inline-flex">
            <BookOpen className="w-4 h-4" /> Courses
          </Link>
          <Link to="/quiz" className="btn-ghost text-sm hidden sm:inline-flex text-teal">
            <Compass className="w-4 h-4" /> Find your skill
          </Link>
          <Link to="/paths" className="btn-ghost text-sm hidden md:inline-flex">
            <RouteIcon className="w-4 h-4" /> Paths
          </Link>
          <a href={SERVICES_SITE} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm hidden lg:inline-flex text-teal">
            <Briefcase className="w-4 h-4" /> Work with Yasir ↗
          </a>
          {user && stats ? (
            <>
              {stats.streak > 0 && (
                <span className="glass-pill text-xs hidden sm:inline-flex" title={`${stats.streak}-day streak`}>
                  <Flame className="w-3.5 h-3.5 text-gold" /> {stats.streak}
                </span>
              )}
              <span className="glass-pill text-xs" title={`${stats.xp} XP`}>
                ⚡ Lv {stats.level}
              </span>
              <Link to="/dashboard" className="btn-ghost text-sm">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="btn-ghost text-sm text-gold" title="Instructor console">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              <ThemeToggle />
              <button
                onClick={() => { signOut(); navigate("/"); }}
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
            <>
              <ThemeToggle />
              <Link to="/login" className="btn-primary text-sm py-2 hidden sm:inline-flex">Get started</Link>
            </>
          )}
          {/* Hamburger — toggles the mobile nav menu (phones only) */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="btn-ghost sm:hidden p-2"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
