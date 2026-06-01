import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { paths } from "@/data/paths";
import { courseBySlug } from "@/data/courses";
import { useAuth } from "@/lib/auth";
import { courseProgress } from "@/lib/progress";
import { useProgressTick } from "@/hooks/useProgressTick";

export default function Paths() {
  const { user } = useAuth();
  useProgressTick();

  return (
    <div className="min-h-screen">
      <Seo
        title="Learning Paths — Guided Tracks"
        description="Curated learning paths that stack courses in the right order — from foundations to landing real clients. Become an AI automation pro, web/app builder, growth marketer or agency owner."
        path="/paths"
      />
      <Navbar />
      <section className="px-4 pt-10 pb-6 max-w-6xl mx-auto">
        <span className="glass-pill text-teal">🗺️ Guided journeys</span>
        <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-ink mt-4">Learning Paths</h1>
        <p className="text-soft mt-2 max-w-2xl text-lg">
          Not sure where to start? Follow a curated track that stacks courses in the right order —
          from foundations to landing real clients.
        </p>
      </section>

      <section className="px-4 pb-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-5">
        {paths.map((path, idx) => {
          const courses = path.courseSlugs.map(courseBySlug).filter(Boolean);
          const totalPct = user
            ? Math.round(
                courses.reduce((sum, c) => sum + (c ? courseProgress(user.id, c).pct : 0), 0) / courses.length,
              )
            : 0;
          return (
            <motion.div
              key={path.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="glass-card card-hover p-6 flex flex-col"
            >
              <div className="flex items-start gap-4">
                <div className="grid place-items-center w-14 h-14 rounded-2xl text-3xl text-white shrink-0" style={{ background: path.gradient }}>
                  {path.icon}
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-ink">{path.title}</h2>
                  <p className="text-sm text-soft mt-0.5">{path.blurb}</p>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-teal font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Outcome: {path.outcome}
              </div>

              <ol className="mt-4 space-y-1.5 flex-1">
                {courses.map((c, i) => c && (
                  <li key={c.slug}>
                    <Link to={`/courses/${c.slug}`} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-teal/5 transition-colors">
                      <span className="grid place-items-center w-5 h-5 rounded-full bg-teal/10 text-teal text-[11px] font-bold shrink-0">{i + 1}</span>
                      <span className="text-lg">{c.icon}</span>
                      <span className="text-sm text-ink/80">{c.title}</span>
                    </Link>
                  </li>
                ))}
              </ol>

              {user && (
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] text-soft mb-1"><span>Path progress</span><span>{totalPct}%</span></div>
                  <div className="h-1.5 rounded-full bg-teal/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${totalPct}%`, background: path.gradient }} />
                  </div>
                </div>
              )}

              <Link to={`/courses/${path.courseSlugs[0]}`} className="btn-primary mt-5 self-start">
                Start this path <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          );
        })}
      </section>
      <Footer />
    </div>
  );
}
