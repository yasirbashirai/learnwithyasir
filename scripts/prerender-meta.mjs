// Post-build: write per-route static HTML with route-specific <title>, description,
// canonical and Open Graph / Twitter tags. Social scrapers (FB/LinkedIn/X) don't run
// JS, so this gives every course its own share card. The SPA still hydrates normally.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://learnwithyasir.vercel.app";
const base = readFileSync(join(dist, "index.html"), "utf8");

// Parse {slug, title, tagline} from each course spec.
const src = readFileSync(join(root, "src/data/courses.ts"), "utf8");
const courses = [...src.matchAll(/slug:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?tagline:\s*"([^"]+)"/g)]
  .map((m) => ({ slug: m[1], title: m[2], tagline: m[3] }));

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function pageHtml({ path, title, description }) {
  const url = `${SITE}${path}`;
  const t = esc(title);
  const d = esc(description);
  return base
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`);
}

function write(path, html) {
  const dir = join(dist, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}

const routes = [
  { path: "/courses", title: "All Courses — AI, Automation & Web · learnwithyasir", description: "Browse 24 project-first courses across AI automation, chatbots, web apps, funnels, CRM and more." },
  { path: "/paths", title: "Learning Paths — Guided Tracks · learnwithyasir", description: "Curated tracks that stack courses in the right order — from foundations to landing real clients." },
  { path: "/privacy", title: "Privacy Policy · learnwithyasir", description: "How learnwithyasir collects, uses and protects your information." },
  { path: "/terms", title: "Terms & Conditions · learnwithyasir", description: "The terms for using learnwithyasir and its course content." },
  { path: "/disclaimer", title: "Disclaimer · learnwithyasir", description: "Educational-use disclaimer for learnwithyasir." },
];

let n = 0;
for (const r of routes) { write(r.path, pageHtml(r)); n++; }
for (const c of courses) {
  write(`/courses/${c.slug}`, pageHtml({ path: `/courses/${c.slug}`, title: `${c.title} — Course · learnwithyasir`, description: c.tagline }));
  n++;
}
console.log(`✅ prerendered meta for ${n} routes (${courses.length} courses)`);
