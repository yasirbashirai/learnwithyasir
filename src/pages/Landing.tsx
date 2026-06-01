import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Hammer, Briefcase, Rocket, Lock, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/courses";
import { PART_META } from "@/lib/types";
import { useAuth } from "@/lib/auth";

const partIcons = [BookOpen, Hammer, Briefcase, Rocket];

export default function Landing() {
  const { user } = useAuth();
  const featured = courses.filter((c) => c.flagship).concat(courses.filter((c) => !c.flagship)).slice(0, 6);
  const lessonTotal = courses.reduce((n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0), 0);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="px-4 pt-10 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="glass-pill text-teal">🎓 The Yasir skill academy</span>
            <h1 className="font-heading font-extrabold text-4xl md:text-6xl leading-[1.05] mt-5 text-ink">
              Learn the exact skills <br className="hidden md:block" />
              I use to <span className="gradient-text">build & earn</span>.
            </h1>
            <p className="text-ink/70 text-lg max-w-2xl mx-auto mt-5">
              {courses.length} hands-on courses across AI, automation and web. One month per skill,
              real projects, and a clear path from learning to landing clients.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link to={user ? "/dashboard" : "/login"} className="btn-primary">
                {user ? "Go to dashboard" : "Start learning free"} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/courses" className="btn-ghost border border-teal/20">Browse all courses</Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-ink/60">
              <span>📚 {courses.length} courses</span>
              <span>🎯 {lessonTotal}+ lessons</span>
              <span>🔓 Unlock as you learn</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The 4-part framework */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-9">
            <h2 className="font-heading font-bold text-3xl text-ink">Every course, four parts</h2>
            <p className="text-ink/65 mt-2">A proven path from zero to paid — not just theory.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {([1, 2, 3, 4] as const).map((p, i) => {
              const Icon = partIcons[i];
              return (
                <div key={p} className="glass-card p-6">
                  <div className="grid place-items-center w-12 h-12 rounded-2xl bg-teal/10 text-teal mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-teal uppercase tracking-wide">Part {p}</div>
                  <h3 className="font-heading font-bold text-ink text-lg mt-0.5">{PART_META[p].title}</h3>
                  <p className="text-sm text-ink/65 mt-1.5">{PART_META[p].blurb}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How unlocking works */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto glass-card p-8 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="font-heading font-bold text-2xl text-ink">Learn it properly — modules unlock as you go</h2>
            <p className="text-ink/70 mt-3">
              No skipping ahead. Finish a module to unlock the next, so you actually build the
              foundations before the advanced work. Your progress is saved automatically.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-teal/5 border border-teal/15 px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-teal" /> <span className="text-ink/80">Part 1 — Foundations <b className="text-teal">unlocked</b></span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/60 border border-ink/10 px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-teal" /> <span className="text-ink/80">Part 2 — Practice <b className="text-teal">unlocked</b></span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/40 border border-ink/10 px-4 py-3 opacity-70">
              <Lock className="w-5 h-5 text-ink/40" /> <span className="text-ink/60">Part 3 — Career &amp; Clients <i>locked</i></span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="px-4 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-heading font-bold text-3xl text-ink">Popular courses</h2>
            <Link to="/courses" className="text-teal font-semibold text-sm inline-flex items-center gap-1">
              All {courses.length} courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((c) => <CourseCard key={c.slug} course={c} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
