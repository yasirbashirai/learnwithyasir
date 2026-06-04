/**
 * Learning Paths, curated tracks that group courses into a career journey.
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
    outcome: "Sell automation builds and retainers",
    gradient: "linear-gradient(135deg,#288672,#36c8a9)",
    courseSlugs: ["automation-strategy", "n8n-automation", "zapier-make", "ai-chatbots", "ai-voice-agents", "ai-agents", "document-automation"],
  },
  {
    slug: "web-app-builder",
    icon: "🚀",
    title: "Web & App Builder",
    blurb: "Go from idea to deployed, paid product using AI-first development.",
    outcome: "Ship apps clients pay for",
    gradient: "linear-gradient(135deg,#2f6df0,#36c8a9)",
    courseSlugs: ["vibe-coding", "ai-app-building", "saas-web-app", "web-app-deployment", "wordpress-development", "funnels-landing-pages"],
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
    blurb: "The full client-services stack, CRM, funnels, delivery and ops.",
    outcome: "Run a profitable agency",
    gradient: "linear-gradient(135deg,#165a4c,#288672)",
    courseSlugs: ["gohighlevel", "crm-implementation", "revops-systems", "booking-systems", "ai-video-production", "ai-identity-design"],
  },
  {
    slug: "ai-creator-studio",
    icon: "🎬",
    title: "AI Creator Studio",
    blurb: "Get paid to create with AI, video, audio, brand and virtual characters.",
    outcome: "Earn as an AI-powered creator",
    gradient: "linear-gradient(135deg,#a855f7,#ec4899)",
    courseSlugs: ["ai-ugc-ads", "ai-video-production", "ai-influencers", "ai-music-voice", "ai-identity-design", "social-media-automation"],
  },
  {
    slug: "immersive-builder",
    icon: "🕹️",
    title: "3D & Game Builder",
    blurb: "Build immersive 3D scenes, virtual tours and fun, shareable games.",
    outcome: "Sell 3D, virtual and game work",
    gradient: "linear-gradient(135deg,#0ea5e9,#22d3ee)",
    courseSlugs: ["3d-virtual-spaces", "ai-game-creation", "ai-app-building", "vibe-coding"],
  },
  {
    slug: "ai-era-growth",
    icon: "🔮",
    title: "AI-Era Growth",
    blurb: "Win attention the new way, get cited by AI, reach Gen Z, and personalize at scale.",
    outcome: "Run modern, AI-era marketing",
    gradient: "linear-gradient(135deg,#f59e0b,#10b981)",
    courseSlugs: ["aeo-optimization", "genz-brand-marketing", "ai-personalized-outreach", "lead-generation", "email-marketing"],
  },
];

export function pathBySlug(slug: string) {
  return paths.find((p) => p.slug === slug);
}
