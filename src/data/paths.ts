/**
 * Learning Paths — curated tracks that group courses into a career journey.
 * Each path references course slugs from courses.ts (kept in sync by slug).
 */
export interface LearningPath {
  slug: string;
  icon: string;
  title: string;
  blurb: string;
  outcome: string;
  gradient: string;
  courseSlugs: string[];
}

export const paths: LearningPath[] = [
  {
    slug: "ai-automation-pro",
    icon: "🤖",
    title: "AI Automation Pro",
    blurb: "Become the person businesses hire to automate everything.",
    outcome: "Sell automation builds & retainers",
    gradient: "linear-gradient(135deg,#288672,#36c8a9)",
    courseSlugs: ["automation-strategy", "n8n-automation", "zapier-make", "ai-chatbots", "ai-agents", "document-automation"],
  },
  {
    slug: "web-app-builder",
    icon: "🚀",
    title: "Web & App Builder",
    blurb: "Go from idea to deployed, paid product using AI-first development.",
    outcome: "Ship apps clients pay for",
    gradient: "linear-gradient(135deg,#2f6df0,#36c8a9)",
    courseSlugs: ["vibe-coding", "saas-web-app", "web-app-deployment", "wordpress-development", "funnels-landing-pages"],
  },
  {
    slug: "growth-marketer",
    icon: "📈",
    title: "Growth & Funnels",
    blurb: "Build the systems that bring leads, sales and predictable revenue.",
    outcome: "Run growth for brands",
    gradient: "linear-gradient(135deg,#e2a93c,#f7d365)",
    courseSlugs: ["lead-generation", "funnels-landing-pages", "email-marketing", "cro-audit", "analytics-tracking", "social-media-automation"],
  },
  {
    slug: "agency-stack",
    icon: "🎯",
    title: "Start an Agency",
    blurb: "The full client-services stack — CRM, funnels, delivery and ops.",
    outcome: "Run a profitable agency",
    gradient: "linear-gradient(135deg,#165a4c,#288672)",
    courseSlugs: ["gohighlevel", "crm-implementation", "revops-systems", "booking-systems", "ai-video-production", "ai-identity-design"],
  },
];

export function pathBySlug(slug: string) {
  return paths.find((p) => p.slug === slug);
}
