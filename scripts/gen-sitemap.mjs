// Generates public/sitemap.xml from the course slugs + static routes.
// Runs in `prebuild` so the sitemap stays in sync on every deploy.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://learnwith.yasirbashir.com";

// Pull course slugs out of the course specs.
const coursesSrc = readFileSync(join(root, "src/data/courses.ts"), "utf8");
const slugs = [...coursesSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

const staticRoutes = ["", "courses", "paths", "privacy", "terms", "disclaimer"];
const today = new Date().toISOString().slice(0, 10);

const urls = [
  ...staticRoutes.map((r) => ({ loc: `${SITE}/${r}`, priority: r === "" ? "1.0" : "0.7" })),
  ...slugs.map((s) => ({ loc: `${SITE}/courses/${s}`, priority: "0.8" })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
  .join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`✅ sitemap.xml written — ${urls.length} URLs (${slugs.length} courses)`);
