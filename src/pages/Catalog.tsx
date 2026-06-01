import { useState } from "react";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { courses, categories } from "@/data/courses";

export default function Catalog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const filtered = courses.filter((c) => {
    const matchCat = cat === "All" || c.category === cat;
    const matchQ =
      !q ||
      c.title.toLowerCase().includes(q.toLowerCase()) ||
      c.tagline.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="px-4 pt-8 pb-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-heading font-extrabold text-4xl text-ink">All courses</h1>
          <p className="text-ink/65 mt-2">Pick a skill. Each is a one-month, project-first course.</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses…"
                className="w-full rounded-full border border-teal/20 bg-surface/80 pl-10 pr-4 py-3 outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["All", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-colors ${
                  cat === c
                    ? "bg-teal text-white border-teal"
                    : "bg-surface/60 text-ink/70 border-teal/15 hover:border-teal"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-10">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-ink/60 py-16">No courses match that search.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((c) => <CourseCard key={c.slug} course={c} />)}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
