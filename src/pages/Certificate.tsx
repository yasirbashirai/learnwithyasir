import { useParams, Link, Navigate } from "react-router-dom";
import { Award, Download, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { courseBySlug } from "@/data/courses";
import { useAuth } from "@/lib/auth";
import { courseProgress } from "@/lib/progress";

export default function Certificate() {
  const { slug = "" } = useParams();
  const course = courseBySlug(slug);
  const { user } = useAuth();
  if (!course || !user) return <Navigate to="/dashboard" replace />;

  const prog = courseProgress(user.id, course);
  if (prog.pct < 100) return <Navigate to={`/courses/${slug}`} replace />;

  const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5 print:hidden">
          <Link to={`/courses/${slug}`} className="btn-ghost text-sm"><ArrowLeft className="w-4 h-4" /> Back</Link>
          <button onClick={() => window.print()} className="btn-primary text-sm py-2"><Download className="w-4 h-4" /> Save / Print</button>
        </div>

        {/* Certificate */}
        <div className="relative rounded-3xl border-2 border-teal/30 bg-surface p-10 md:p-14 text-center overflow-hidden shadow-card">
          <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(54,200,169,0.35), transparent 70%)" }} aria-hidden />
          <div className="relative">
            <div className="grid place-items-center w-16 h-16 rounded-2xl mx-auto text-white" style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>
              <Award className="w-8 h-8" />
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-teal font-bold">Certificate of Completion</p>
            <p className="mt-6 text-soft">This certifies that</p>
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-ink mt-1 gradient-text inline-block">{user.name}</h1>
            <p className="mt-5 text-soft">has successfully completed the course</p>
            <h2 className="font-heading font-bold text-2xl text-ink mt-1">{course.icon} {course.title}</h2>
            <p className="mt-2 text-sm text-soft">{course.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons · 4-part mastery framework</p>

            <div className="mt-10 flex items-center justify-between gap-6">
              <div className="text-left">
                <div className="font-serif italic text-2xl text-ink">Yasir Bashir</div>
                <div className="text-xs text-soft border-t border-line pt-1 mt-1">Instructor · learnwithyasir</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-ink">{date}</div>
                <div className="text-xs text-soft border-t border-line pt-1 mt-1">Date issued</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-soft mt-6 print:hidden">
          🎉 Huge congrats! Share this win on LinkedIn and tag Yasir — and start your next course.
        </p>
      </div>
    </div>
  );
}
