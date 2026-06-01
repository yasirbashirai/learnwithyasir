import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Hammer, Briefcase, Rocket, Lock, CheckCircle2, PlayCircle, Star, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import Counter from "@/components/Counter";
import SiteShowcase from "@/components/SiteShowcase";
import { courses } from "@/data/courses";
import { paths } from "@/data/paths";
import { courseBySlug } from "@/data/courses";
import { PART_META } from "@/lib/types";
import { useAuth } from "@/lib/auth";

const partIcons = [BookOpen, Hammer, Briefcase, Rocket];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] as const },
};

const GOALS = [
  { id: "freelance", emoji: "💼", label: "Land freelance clients", pathSlug: "ai-automation-pro" },
  { id: "startup", emoji: "🚀", label: "Build my own product", pathSlug: "web-app-builder" },
  { id: "growth", emoji: "📈", label: "Get more leads & sales", pathSlug: "growth-marketer" },
  { id: "agency", emoji: "🎯", label: "Start an agency", pathSlug: "agency-stack" },
];

const TESTIMONIALS = [
  { name: "Areeba", role: "Freelancer", text: "Went from zero to my first $500 automation client in 3 weeks. The client-finding part is gold." },
  { name: "Daniyal", role: "Agency owner", text: "I templated my whole delivery from the GoHighLevel course. Retainers basically sell themselves now." },
  { name: "Sana", role: "Career switcher", text: "The 4-part structure made it click. Learn, build, get paid, level up — exactly in that order." },
  { name: "Bilal", role: "Store owner", text: "Rebuilt my Shopify funnel from the CRO lessons and recovered a ton of abandoned carts." },
];

function GoalExplorer() {
  const [goal, setGoal] = useState(GOALS[0]);
  const path = paths.find((p) => p.slug === goal.pathSlug);
  const pathCourses = path ? path.courseSlugs.map(courseBySlug).filter(Boolean) : [];
  return (
    <div className="glass-card p-6 md:p-8 grid md:grid-cols-[1fr_1.3fr] gap-7 items-center">
      <div>
        <h3 className="font-heading font-bold text-xl text-ink mb-3">I want to…</h3>
        <div className="space-y-2">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGoal(g)}
              className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                goal.id === g.id ? "border-teal bg-teal/10 -translate-y-0.5 shadow-soft" : "border-line bg-surface/50 hover:border-teal/50"
              }`}
            >
              <span className="text-2xl">{g.emoji}</span>
              <span className="font-semibold text-ink">{g.label}</span>
              {goal.id === g.id && <ArrowRight className="w-4 h-4 text-teal ml-auto" />}
            </button>
          ))}
        </div>
      </div>
      {path && (
        <motion.div key={path.slug} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
          className="rounded-2xl border border-teal/20 p-6" style={{ background: "linear-gradient(135deg, hsl(var(--teal)/0.08), transparent)" }}>
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-12 h-12 rounded-2xl text-2xl text-white" style={{ background: path.gradient }}>{path.icon}</div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-teal">Recommended path</div>
              <div className="font-heading font-bold text-ink text-lg">{path.title}</div>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            {pathCourses.slice(0, 5).map((c, i) => c && (
              <div key={c.slug} className="flex items-center gap-2.5 text-sm text-ink/80">
                <span className="grid place-items-center w-5 h-5 rounded-full bg-teal/10 text-teal text-[11px] font-bold">{i + 1}</span>
                <span>{c.icon}</span> {c.title}
              </div>
            ))}
          </div>
          <Link to="/paths" className="btn-primary mt-5 text-sm inline-flex">Start this path <ArrowRight className="w-4 h-4" /></Link>
        </motion.div>
      )}
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const featured = courses.filter((c) => c.flagship).concat(courses.filter((c) => !c.flagship)).slice(0, 6);
  const lessonTotal = courses.reduce((n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0), 0);
  const marqueeItems = [...courses, ...courses];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="px-4 pt-12 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="glass-pill text-teal">🎓 The Yasir skill academy · {courses.length} courses</span>
            <h1 className="font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[1.04] mt-6 text-ink">
              Learn the exact skills <br className="hidden md:block" />
              I use to <span className="gradient-text">build &amp; earn</span>.
            </h1>
            <p className="text-soft text-lg md:text-xl max-w-2xl mx-auto mt-6">
              Hands-on, video-first courses across AI, automation and web. One month per skill —
              real projects, and a clear path from <i>learning</i> to <i>landing clients</i>.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-9">
              <Link to={user ? "/dashboard" : "/login"} className="btn-primary text-base">
                {user ? "Go to dashboard" : "Start learning free"} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/courses" className="btn-outline text-base"><PlayCircle className="w-4 h-4" /> Browse courses</Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 mt-9 text-sm text-soft">
              <span>📚 {courses.length} courses</span>
              <span>🎯 {lessonTotal}+ lessons</span>
              <span>🛤️ {paths.length} guided paths</span>
              <span>🔓 Unlock as you learn</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Animated stats band */}
      <section className="px-4 pb-16">
        <motion.div {...fadeUp} className="max-w-5xl mx-auto glass-card p-7 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: courses.length, s: "", label: "Courses" },
            { n: lessonTotal, s: "+", label: "Lessons" },
            { n: paths.length, s: "", label: "Career paths" },
            { n: 100, s: "%", label: "Project-based" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-heading font-extrabold text-4xl md:text-5xl gradient-text"><Counter to={stat.n} suffix={stat.s} /></div>
              <div className="text-sm text-soft mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Course marquee */}
      <section className="pb-20 overflow-hidden">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-soft mb-5">Skills you can master here</p>
        <div className="marquee-wrap relative">
          <div className="marquee">
            {marqueeItems.map((c, i) => (
              <Link key={i} to={`/courses/${c.slug}`} className="glass-pill whitespace-nowrap hover:border-teal hover:-translate-y-0.5 transition-all">
                <span className="text-lg">{c.icon}</span> {c.title}
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24" style={{ background: "linear-gradient(90deg, hsl(var(--bg)), transparent)" }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24" style={{ background: "linear-gradient(270deg, hsl(var(--bg)), transparent)" }} />
        </div>
      </section>

      {/* 4-part framework */}
      <section className="px-4 pb-20">
        <motion.div {...fadeUp} className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink">Every course, four parts</h2>
            <p className="text-soft mt-2">A proven path from zero to paid — not just theory.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {([1, 2, 3, 4] as const).map((p, i) => {
              const Icon = partIcons[i];
              return (
                <div key={p} className="glass-card card-hover p-6">
                  <div className="grid place-items-center w-12 h-12 rounded-2xl bg-teal/10 text-teal mb-3"><Icon className="w-6 h-6" /></div>
                  <div className="text-xs font-bold text-teal uppercase tracking-wide">Part {p}</div>
                  <h3 className="font-heading font-bold text-ink text-lg mt-0.5">{PART_META[p].title}</h3>
                  <p className="text-sm text-soft mt-1.5">{PART_META[p].blurb}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Learning paths */}
      <section className="px-4 pb-20">
        <motion.div {...fadeUp} className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-7">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink">Guided learning paths</h2>
              <p className="text-soft mt-2">Stack the right courses in the right order toward one outcome.</p>
            </div>
            <Link to="/paths" className="text-teal font-semibold text-sm hidden sm:inline-flex items-center gap-1">All paths <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paths.map((p) => (
              <Link key={p.slug} to="/paths" className="glass-card card-hover p-5">
                <div className="grid place-items-center w-12 h-12 rounded-2xl text-2xl text-white" style={{ background: p.gradient }}>{p.icon}</div>
                <h3 className="font-heading font-bold text-ink mt-3">{p.title}</h3>
                <p className="text-sm text-soft mt-1">{p.blurb}</p>
                <p className="text-xs text-teal font-semibold mt-3">{p.courseSlugs.length} courses →</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Interactive goal explorer */}
      <section className="px-4 pb-20">
        <motion.div {...fadeUp} className="max-w-5xl mx-auto">
          <div className="text-center mb-7">
            <span className="glass-pill text-teal">✨ Find your starting point</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-4">What do you want to achieve?</h2>
            <p className="text-soft mt-2">Pick a goal — I'll show you the exact path to get there.</p>
          </div>
          <GoalExplorer />
        </motion.div>
      </section>

      {/* How unlocking works */}
      <section className="px-4 pb-20">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto glass-card p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-ink">Learn it properly — modules unlock as you go</h2>
            <p className="text-soft mt-3">
              No skipping ahead. Finish a module to unlock the next, so you actually build the foundations
              before the advanced work. Earn XP, keep a streak, and collect a certificate at the end.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-teal/5 border border-teal/15 px-4 py-3"><CheckCircle2 className="w-5 h-5 text-teal" /> <span className="text-ink/80">Part 1 — Foundations <b className="text-teal">unlocked</b></span></div>
            <div className="flex items-center gap-3 rounded-xl bg-surface/60 border border-line px-4 py-3"><CheckCircle2 className="w-5 h-5 text-teal" /> <span className="text-ink/80">Part 2 — Practice <b className="text-teal">unlocked</b></span></div>
            <div className="flex items-center gap-3 rounded-xl bg-surface/40 border border-line px-4 py-3 opacity-70"><Lock className="w-5 h-5 text-ink/40" /> <span className="text-soft">Part 3 — Career &amp; Clients <i>locked</i></span></div>
          </div>
        </motion.div>
      </section>

      {/* Featured courses */}
      <section className="px-4 pb-20">
        <motion.div {...fadeUp} className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-7">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink">Popular courses</h2>
            <Link to="/courses" className="text-teal font-semibold text-sm inline-flex items-center gap-1">All {courses.length} courses <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((c) => <CourseCard key={c.slug} course={c} />)}
          </div>
        </motion.div>
      </section>

      {/* Testimonials marquee */}
      <section className="pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 mb-7 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink">Students are shipping</h2>
          <p className="text-soft mt-2">Early results from learners following the path.</p>
        </div>
        <div className="marquee-wrap relative">
          <div className="marquee">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="glass-card p-5 w-[320px] shrink-0">
                <Quote className="w-5 h-5 text-teal" />
                <p className="text-sm text-ink/85 mt-2">"{t.text}"</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="grid place-items-center w-8 h-8 rounded-full text-white text-xs font-bold" style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>{t.name.charAt(0)}</span>
                  <div className="text-xs"><b className="text-ink">{t.name}</b><span className="text-soft"> · {t.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work with Yasir — ecosystem showcase */}
      <SiteShowcase />

      {/* Instructor / final CTA */}
      <section className="px-4 pb-16">
        <motion.div {...fadeUp} className="max-w-5xl mx-auto glass-card p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(54,200,169,0.3), transparent 70%)" }} aria-hidden />
          <div className="relative">
            <div className="grid place-items-center w-16 h-16 rounded-2xl mx-auto text-white text-2xl font-extrabold" style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>Y</div>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-gold font-semibold"><Star className="w-4 h-4 fill-current" /> Taught by a practitioner who ships</div>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-ink mt-3">Stop watching. Start building.</h2>
            <p className="text-soft mt-3 max-w-xl mx-auto">
              I'll teach you the exact systems I use for clients — and how to get paid for them.
              Your first lesson is one click away.
            </p>
            <Link to={user ? "/courses" : "/login"} className="btn-primary text-base mt-7 inline-flex">
              {user ? "Explore courses" : "Create your free account"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
