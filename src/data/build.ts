/**
 * buildCourse — expands a compact CourseSpec into a complete 4-part course
 * (Learn & Scope · Practice · Career & Clients · Advancement). This keeps the
 * 23 courses consistent and editable from one place. Flagship courses can pass
 * `extraModules` / richer lessons to override the generated baseline.
 */
import type {
  Course,
  Lesson,
  Module,
  ContentBlock,
  ToolGuide,
} from "@/lib/types";

export interface CourseSpec {
  slug: string;
  icon: string;
  title: string;
  category: string;
  tagline: string;
  level: Course["level"];
  /** One-line outcomes a learner can do by the end. */
  outcomes: string[];
  /** Step-by-step setup guides — one per core tool. */
  tools: ToolGuide[];
  /** Core concepts taught in Part 1. */
  concepts: { title: string; text: string }[];
  /** Hands-on builds in Part 2. */
  projects: { title: string; brief: string; steps: string[] }[];
  /** Who buys this skill — drives Part 3. */
  clientNiche: string;
  /** Typical price range to anchor packaging in Part 3. */
  priceAnchor: string;
  /** Advanced techniques for Part 4. */
  advanced: string[];
  /** Communities / feeds to stay current — Part 4. */
  stayCurrent: { label: string; href: string }[];
  flagship?: boolean;
}

let lessonCounter = 0;
const lid = (slug: string) => `${slug}-l${++lessonCounter}`;

function lesson(
  slug: string,
  title: string,
  kind: Lesson["kind"],
  minutes: number,
  summary: string,
  body: ContentBlock[],
): Lesson {
  return { id: lid(slug), title, kind, minutes, summary, body };
}

export function buildCourse(spec: CourseSpec): Course {
  const { slug } = spec;
  lessonCounter = 0;

  /* ---------- PART 1 — Learn & Scope ---------- */
  const part1: Module = {
    id: `${slug}-m1`,
    part: 1,
    title: "Foundations & Scope",
    goal: `Understand what ${spec.title} really is, where it fits, and the exact scope you'll master.`,
    lessons: [
      lesson(slug, `What is ${spec.title} — and why it pays`, "lesson", 12,
        `The big picture: what ${spec.title} solves and the opportunity around it.`,
        [
          { kind: "p", text: `${spec.tagline} In this opening lesson we frame the skill end-to-end so every later module has a place to land.` },
          { kind: "h", text: "Why this skill is in demand" },
          { kind: "p", text: `Businesses pay for outcomes, not tools. ${spec.title} sits in the "${spec.category}" space where the outcome is measurable — and that is exactly why ${spec.clientNiche} will pay ${spec.priceAnchor} for it.` },
          { kind: "list", items: spec.outcomes.map((o) => `By the end you can: ${o}`) },
          { kind: "callout", tone: "tip", text: "Don't try to learn every tool. Learn the workflow; tools are swappable. This course teaches the workflow first, tools second." },
        ]),
      lesson(slug, `The ${spec.category} landscape in 2026`, "lesson", 14,
        "The current tools, players and where the money is moving.",
        [
          { kind: "p", text: `Here's the honest map of the ${spec.category} space right now — what's hype, what's durable, and the stack we'll actually use.` },
          { kind: "h", text: "The tools we'll master" },
          { kind: "list", items: spec.tools.map((t) => `${t.name} — ${t.what}`) },
          { kind: "callout", tone: "note", text: "Tool pricing and features move fast. Treat versions/prices here as a starting point and verify on the official site (linked in each setup guide)." },
        ]),
      ...spec.concepts.map((c) =>
        lesson(slug, c.title, "lesson", 10, c.text.slice(0, 90) + "…",
          [{ kind: "p", text: c.text }]),
      ),
      lesson(slug, "Scope check", "quiz", 5,
        "Confirm you can define the skill and its boundaries before building.",
        [
          { kind: "p", text: "Quick self-check before you touch a tool. If you can answer these out loud, you're ready for Part 2." },
          { kind: "list", items: [
            `In one sentence, what outcome does ${spec.title} deliver for a client?`,
            `Name the 2–3 core tools and what each is for.`,
            `What is explicitly OUT of scope for this skill?`,
          ] },
        ]),
    ],
  };

  /* ---------- PART 2 — Practice ---------- */
  const toolGuides: Lesson[] = spec.tools.map((t) =>
    lesson(slug, `Setup guide: ${t.name}`, "guide", 12,
      `Step-by-step: get ${t.name} ready to build.`,
      [
        { kind: "p", text: `${t.name} — ${t.what}` },
        { kind: "h", text: "Step-by-step setup" },
        { kind: "steps", items: t.steps },
        { kind: "resources", items: t.links },
        { kind: "callout", tone: "tip", text: `Bookmark the docs. 80% of being "good with a tool" is knowing where its docs and templates live.` },
      ]),
  );

  const projects: Lesson[] = spec.projects.map((p) =>
    lesson(slug, `Project: ${p.title}`, "project", 35,
      p.brief,
      [
        { kind: "p", text: p.brief },
        { kind: "h", text: "Build it" },
        { kind: "steps", items: p.steps },
        { kind: "callout", tone: "note", text: "Ship a rough version first, then improve. A finished imperfect build beats a perfect unfinished one — and becomes a portfolio piece." },
      ]),
  );

  const part2: Module = {
    id: `${slug}-m2`,
    part: 2,
    title: "Hands-On Practice",
    goal: `Set up every tool and build ${spec.projects.length} real projects you can show.`,
    lessons: [
      lesson(slug, "How to practice so it sticks", "lesson", 8,
        "The build-in-public method we'll use across all projects.",
        [
          { kind: "p", text: "You learn this skill by shipping, not watching. Every project below ends with something real you can screenshot for your portfolio." },
          { kind: "list", items: [
            "Build along live — pause the lesson, do the step, then continue.",
            "Break it on purpose once, then fix it. That's where understanding comes from.",
            "Save every build — these become your proof when you pitch clients in Part 3.",
          ] },
        ]),
      ...toolGuides,
      ...projects,
      lesson(slug, "Practice checkpoint", "quiz", 5,
        "Prove you can build unaided before moving to clients.",
        [
          { kind: "p", text: "You should now be able to rebuild at least one project from scratch with the docs open but no lesson playing. If not, repeat the project — this is the gate to Part 3." },
        ]),
    ],
  };

  /* ---------- PART 3 — Career & Clients ---------- */
  const part3: Module = {
    id: `${slug}-m3`,
    part: 3,
    title: "Career, Clients & Real Projects",
    goal: `Package ${spec.title}, find ${spec.clientNiche}, win the work and deliver it.`,
    lessons: [
      lesson(slug, `Packaging ${spec.title} as a service`, "lesson", 14,
        "Turn the skill into a clear, priced offer.",
        [
          { kind: "p", text: `Clients don't buy "${spec.title}" — they buy an outcome with a price and a timeline. Here's how to package it.` },
          { kind: "h", text: "A simple 3-tier offer" },
          { kind: "list", items: [
            `Starter — a single quick win (anchor near the low end of ${spec.priceAnchor}).`,
            "Core — the full build, your main offer.",
            "Retainer — ongoing management/optimisation (the real money).",
          ] },
          { kind: "callout", tone: "tip", text: "Always offer three options. Most clients pick the middle — so design the middle to be your ideal project." },
        ]),
      lesson(slug, `Where to find ${spec.clientNiche}`, "lesson", 14,
        "Concrete channels to get your first and tenth client.",
        [
          { kind: "p", text: `Your buyers are ${spec.clientNiche}. Go where they already are.` },
          { kind: "list", items: [
            "Warm outreach: 10 people you already know who run businesses.",
            "Communities & groups where your niche hangs out (Slack/Discord/FB/LinkedIn).",
            "Content: post your project builds publicly — proof attracts inbound.",
            "Marketplaces (Upwork/Fiverr) to start, then graduate to direct outreach.",
            "Partnerships: agencies/freelancers in adjacent skills who can refer you.",
          ] },
          { kind: "resources", items: [
            { label: "Upwork", href: "https://www.upwork.com" },
            { label: "Fiverr", href: "https://www.fiverr.com" },
            { label: "LinkedIn", href: "https://www.linkedin.com" },
          ] },
        ]),
      lesson(slug, "Winning the client: outreach, proposals & calls", "lesson", 16,
        "Communication scripts that turn leads into signed projects.",
        [
          { kind: "p", text: "Winning work is mostly communication. Here's the flow from first message to signed." },
          { kind: "h", text: "The flow" },
          { kind: "steps", items: [
            "Lead with a specific observation about their business, not a pitch.",
            "Offer a tiny free insight (an audit, a quick idea) to build trust.",
            "Book a short call — goal is to understand their problem, not to sell.",
            "Send a one-page proposal: problem, outcome, 3 options, timeline, price.",
            "Follow up twice. Most deals are won in the follow-up.",
          ] },
          { kind: "callout", tone: "warn", text: "Never quote a price before you understand the outcome they want. Diagnose first, prescribe second." },
        ]),
      lesson(slug, "Deliver, get paid & turn it into a retainer", "lesson", 12,
        "Delivery, testimonials and recurring revenue.",
        [
          { kind: "list", items: [
            "Set scope + milestones in writing. Take a deposit upfront.",
            "Over-communicate progress — clients rate communication over code.",
            "At handoff, record a Loom walkthrough and ask for a testimonial.",
            "Pitch the retainer at the moment of success, not months later.",
          ] },
        ]),
    ],
  };

  /* ---------- PART 4 — Advancement ---------- */
  const part4: Module = {
    id: `${slug}-m4`,
    part: 4,
    title: "Advancement & Roadmap",
    goal: `Go from competent to expert with advanced techniques and a clear roadmap.`,
    lessons: [
      lesson(slug, `Advanced ${spec.title} techniques`, "lesson", 16,
        "Level-up moves that separate pros from beginners.",
        [
          { kind: "p", text: `Once the basics are automatic, these are the techniques that let you charge more and deliver faster.` },
          { kind: "list", items: spec.advanced },
        ]),
      lesson(slug, "Staying current (this field moves fast)", "lesson", 8,
        "Feeds, communities and changelogs to never fall behind.",
        [
          { kind: "p", text: "The half-life of tactics in this space is short. Build a habit of following primary sources." },
          { kind: "resources", items: spec.stayCurrent },
        ]),
      lesson(slug, "Your 90-day mastery roadmap", "project", 12,
        "A concrete plan for the three months after this course.",
        [
          { kind: "h", text: "Month 1 — Reps" },
          { kind: "p", text: "Rebuild every Part-2 project from scratch and publish each one. Volume builds fluency." },
          { kind: "h", text: "Month 2 — Real client" },
          { kind: "p", text: "Land one paid (or free-for-testimonial) project using the Part-3 playbook. Document it as a case study." },
          { kind: "h", text: "Month 3 — Productise" },
          { kind: "p", text: "Turn your best build into a repeatable offer with a fixed price and a templated delivery. Pitch a retainer." },
          { kind: "callout", tone: "tip", text: "Come back and mark this complete only when you've shipped a real project. That's the true finish line of the course." },
        ]),
    ],
  };

  return {
    slug: spec.slug,
    icon: spec.icon,
    title: spec.title,
    category: spec.category,
    tagline: spec.tagline,
    level: spec.level,
    durationWeeks: 4,
    outcomes: spec.outcomes,
    tools: spec.tools,
    modules: [part1, part2, part3, part4],
    flagship: spec.flagship,
  };
}
