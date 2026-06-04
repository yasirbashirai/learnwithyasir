/**
 * buildCourse, expands a compact CourseSpec into a complete 4-part course
 * (Learn & Scope · Practice · Career & Clients · Advancement).
 *
 * The generated lessons are written in Yasir's first-person voice, like he's
 * sitting next to you teaching, and each core lesson carries a video slot
 * (placeholder until the real recording is uploaded). Keeping it all in one
 * generator means the 24 courses stay consistent and are editable in one place.
 */
import type { Course, Lesson, Module, ContentBlock, ToolGuide } from "@/lib/types";

export interface CourseSpec {
  slug: string;
  icon: string;
  title: string;
  category: string;
  tagline: string;
  level: Course["level"];
  outcomes: string[];
  tools: ToolGuide[];
  concepts: { title: string; text: string }[];
  projects: { title: string; brief: string; steps: string[] }[];
  clientNiche: string;
  priceAnchor: string;
  advanced: string[];
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
  hasVideo = false,
): Lesson {
  return { id: lid(slug), title, kind, minutes, summary, body, hasVideo };
}

export function buildCourse(spec: CourseSpec): Course {
  const { slug, title } = spec;
  lessonCounter = 0;

  /* ---------- PART 1, Learn & Scope ---------- */
  const part1: Module = {
    id: `${slug}-m1`,
    part: 1,
    title: "Foundations & Scope",
    goal: `Get the real picture of ${title}, what it is, where the money is, and exactly what we're mastering.`,
    lessons: [
      lesson(slug, `Welcome, what ${title} really is`, "lesson", 10,
        `My honest intro to ${title} and how this month will go.`,
        [
          { kind: "yasir", text: `Hey, I'm Yasir. ${spec.tagline} I've used this skill to get real results for real clients, and in this course I'm going to teach it to you exactly the way I wish someone had taught me.` },
          { kind: "p", text: `Before we touch a single tool, I want you to see the whole map. ${title} lives in the "${spec.category}" world, and the reason it pays is simple: it produces an outcome a business can feel.` },
          { kind: "h", text: "What you'll walk away able to do" },
          { kind: "list", items: spec.outcomes.map((o) => o) },
          { kind: "callout", tone: "note", text: "This course is built for 2026. No fluff and no months of confusing theory, you'll be building real things in your first week and learning the way the market actually works now." },
          { kind: "callout", tone: "tip", text: "Treat this like a gym, not a library. Read or watch a bit, then go do it. The people who finish this and land work are the ones who build along, not the ones who only scroll." },
        ], true),
      lesson(slug, `The ${spec.category} landscape in 2026`, "lesson", 13,
        "The tools that actually matter right now, and what's just noise.",
        [
          { kind: "p", text: `There are a hundred tools in this space. You don't need a hundred, you need the right handful. Here's the stack I actually reach for.` },
          { kind: "list", items: spec.tools.map((t) => `${t.name}, ${t.what}`) },
          { kind: "yasir", text: `My rule: learn the workflow, not the tool. Tools change every few months; the thinking doesn't. If you understand why a step exists, you can swap tools any time and never feel lost.` },
          { kind: "callout", tone: "note", text: "Prices and features in this space move fast. I'll always link the official source so you can check the latest, never trust a number in a course (including mine) without verifying." },
        ], true),
      ...spec.concepts.map((c) =>
        lesson(slug, c.title, "lesson", 9, c.text.slice(0, 80) + "…",
          [
            { kind: "p", text: c.text },
            { kind: "h", text: "Why this matters in the real world" },
            { kind: "p", text: `In a real ${spec.category.toLowerCase()} project, this is the difference between work that looks fine and work a client happily pays for. Nail this idea and the rest of ${title} gets noticeably easier.` },
            { kind: "yasir", text: `This one trips people up early, so don't rush it. Read it twice if you need to, it quietly pays off in every project later.` },
            { kind: "callout", tone: "tip", text: `Try this now: say "${c.title}" out loud in one plain sentence, like you're explaining it to a friend who knows nothing about it. If you can, you've truly got it.` },
          ], true),
      ),
      lesson(slug, "Scope check", "quiz", 5,
        "A 60-second gut-check before we start building.",
        [
          { kind: "p", text: "If you can answer these out loud, you've got the foundation. If not, rewatch, no shame, this is the part everyone skips and regrets." },
          { kind: "checklist", items: [
            `In one sentence: what outcome does ${title} deliver for a client?`,
            `Can you name the 2–3 core tools and what each is for?`,
            `What is clearly OUT of scope for this skill?`,
          ] },
        ]),
    ],
  };

  /* ---------- PART 2, Practice ---------- */
  const toolGuides: Lesson[] = spec.tools.map((t) =>
    lesson(slug, `Setup guide: ${t.name}`, "guide", 12,
      `I'll walk you through getting ${t.name} set up the right way.`,
      [
        { kind: "p", text: `${t.name}, ${t.what}` },
        { kind: "h", text: "Follow along, step by step" },
        { kind: "steps", items: t.steps },
        { kind: "resources", items: t.links },
        { kind: "yasir", text: `Bookmark these docs right now. Honestly, 80% of "being good with a tool" is just knowing where its docs and templates live so you're never stuck.` },
      ], true),
  );

  const projects: Lesson[] = spec.projects.map((p) =>
    lesson(slug, `Project: ${p.title}`, "project", 35, p.brief,
      [
        { kind: "p", text: p.brief },
        { kind: "h", text: "Let's build it together" },
        { kind: "steps", items: p.steps },
        { kind: "yasir", text: `Ship a rough version first, then make it nice. A finished imperfect build beats a perfect unfinished one every time, and this becomes a portfolio piece you'll show clients in Part 3.` },
        { kind: "callout", tone: "tip", text: "Stuck for more than 15 minutes? That's normal. Re-read the step, check the docs, then ask in the community. Getting unstuck is a skill too." },
      ], true),
  );

  const part2: Module = {
    id: `${slug}-m2`,
    part: 2,
    title: "Hands-On Practice",
    goal: `Set up every tool and build ${spec.projects.length} real things you can actually show people.`,
    lessons: [
      lesson(slug, "How to practice so it actually sticks", "lesson", 7,
        "The build-along method I use with every student.",
        [
          { kind: "yasir", text: `Quick promise from me: if you only read or watch, you'll forget this in a week. If you build along, you'll own it. So open the tool in a second window and let's go hands-on.` },
          { kind: "list", items: [
            "Read or watch one step, do it yourself, then move on. Every time.",
            "Break something on purpose once, then fix it, that's where real understanding lives.",
            "Save every build. These are your proof when you pitch clients later.",
          ] },
        ], true),
      ...toolGuides,
      ...projects,
      lesson(slug, "Practice checkpoint", "quiz", 5,
        "Prove to yourself you can build without hand-holding.",
        [
          { kind: "p", text: "Here's the gate to Part 3: rebuild one project from scratch with the docs open but no lesson in front of you." },
          { kind: "checklist", items: [
            "I rebuilt a project from a blank canvas.",
            "I fixed at least one thing that broke, on my own.",
            "I saved a screenshot/recording for my portfolio.",
          ] },
          { kind: "yasir", text: `If that felt hard, good. That struggle is the exact moment the skill becomes yours.` },
        ]),
    ],
  };

  /* ---------- PART 3, Career & Clients ---------- */
  const part3: Module = {
    id: `${slug}-m3`,
    part: 3,
    title: "Career, Clients & Real Projects",
    goal: `Turn ${title} into income, package it, find ${spec.clientNiche}, win the work, and deliver like a pro.`,
    lessons: [
      lesson(slug, `Packaging ${title} as a service`, "lesson", 13,
        "Turn the skill into a clear, priced offer people can say yes to.",
        [
          { kind: "p", text: `Nobody buys "${title}". They buy an outcome, a price and a timeline. So let's package it.` },
          { kind: "h", text: "The 3-tier offer I use" },
          { kind: "list", items: [
            `Starter, one quick win (anchor near the low end of ${spec.priceAnchor}).`,
            "Core, the full build. This is your main offer.",
            "Retainer, ongoing management/optimisation. This is where the real money is.",
          ] },
          { kind: "yasir", text: `Always show three options. Most people pick the middle, so design the middle to be the project you actually want.` },
        ], true),
      lesson(slug, `Where to find ${spec.clientNiche} in 2026`, "lesson", 14,
        "The new-era channels that actually work now, content first, cold email last.",
        [
          { kind: "p", text: `Your buyers are ${spec.clientNiche}. Here's the big shift: in 2026 people don't open cold emails, they scroll. They discover you through content, short video and DMs long before they'd ever reply to an inbox.` },
          { kind: "h", text: "The channels I'd actually use, in order" },
          { kind: "list", items: [
            "Short-form video: post your Part-2 builds as Reels, TikToks and Shorts. One good demo can pull in clients for months.",
            "Build in public: share the messy, real process on Instagram and LinkedIn. People buy from creators they've watched get good.",
            "DMs over emails: a warm, personal DM right after someone engages with your content beats a cold email every single time.",
            "Communities: be genuinely useful in the WhatsApp, Discord and Facebook groups your niche already lives in.",
            "Warm circle: the handful of people you already know who run businesses, message them today.",
            "Marketplaces like Fiverr and Upwork to grab your first few reviews, then let your content bring inbound.",
          ] },
          { kind: "yasir", text: `Pick ONE platform and post your work for 30 days straight. Proof that you can do the thing, shown publicly, is the best salesperson you will ever have, and it works while you sleep.` },
          { kind: "resources", items: [
            { label: "Instagram", href: "https://www.instagram.com" },
            { label: "TikTok", href: "https://www.tiktok.com" },
            { label: "LinkedIn", href: "https://www.linkedin.com" },
          ] },
        ], true),
      lesson(slug, "Winning the client: DMs, calls & proposals", "lesson", 15,
        "My word-for-word flow from first message to signed, the modern way.",
        [
          { kind: "p", text: "Winning work is mostly communication, not skill. Here's the flow that's worked for me again and again, and it starts in the DMs, not a formal inbox." },
          { kind: "steps", items: [
            "Open with a specific, genuine observation about their business, a comment or DM, never a copy-paste pitch.",
            "Give a tiny free insight, a quick idea or a mini audit, to earn trust before you ask for anything.",
            "Move to a short call. Your only goal on it is to understand their real problem.",
            "Send a clean one-page proposal: problem, outcome, three options, timeline, price.",
            "Follow up twice, kindly. Most deals are won in the follow-up, I promise you.",
          ] },
          { kind: "callout", tone: "warn", text: "Never quote a price before you understand the outcome they want. Diagnose first, prescribe second, exactly like a good doctor." },
        ], true),
      lesson(slug, "Deliver, get paid & turn it into a retainer", "lesson", 11,
        "How I keep clients happy, paid-up and coming back.",
        [
          { kind: "checklist", items: [
            "Scope + milestones agreed in writing, deposit taken upfront.",
            "I over-communicate progress (clients rate communication over code).",
            "At handoff I record a Loom walkthrough and ask for a testimonial.",
            "I pitch the retainer at the moment of success, not months later.",
          ] },
          { kind: "yasir", text: `One happy client who trusts you is worth more than ten cold leads. Treat delivery as marketing for your next project.` },
        ], true),
    ],
  };

  /* ---------- PART 4, Advancement ---------- */
  const part4: Module = {
    id: `${slug}-m4`,
    part: 4,
    title: "Advancement & Roadmap",
    goal: `Go from "can do it" to "the person people recommend", advanced moves and your roadmap.`,
    lessons: [
      lesson(slug, `Advanced ${title} techniques`, "lesson", 16,
        "The level-up moves that let you charge more and deliver faster.",
        [
          { kind: "p", text: `Once the basics are automatic, these are the moves that separate pros from beginners.` },
          { kind: "list", items: spec.advanced },
          { kind: "yasir", text: `Don't try all of these at once. Pick one, get good, then add the next. Depth beats breadth in the beginning.` },
        ], true),
      lesson(slug, "How to never fall behind", "lesson", 7,
        "The feeds and communities I follow to stay current.",
        [
          { kind: "p", text: "This field moves fast. The fix isn't to read everything, it's to follow a few primary sources and ignore the rest." },
          { kind: "resources", items: spec.stayCurrent },
        ], true),
      lesson(slug, "Your 90-day mastery roadmap", "project", 12,
        "A concrete plan for the three months after this course.",
        [
          { kind: "h", text: "Month 1, Reps" },
          { kind: "p", text: "Rebuild every Part-2 project from scratch and post each one as a short video or a build-in-public post. Volume builds fluency, and the content quietly starts attracting your first leads." },
          { kind: "h", text: "Month 2, First real client" },
          { kind: "p", text: "Land one paid (or free-for-testimonial) project using the Part-3 playbook. Document it as a case study." },
          { kind: "h", text: "Month 3, Productise" },
          { kind: "p", text: "Turn your best build into a repeatable offer with a fixed price and a templated delivery, then pitch a retainer." },
          { kind: "yasir", text: `Come back and mark this complete only when you've shipped something real. That's the true finish line, and the moment you can call yourself a ${title} pro.` },
        ], true),
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
