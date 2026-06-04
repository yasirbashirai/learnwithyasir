/**
 * Skill-Fit Assessment, the engine behind /quiz.
 *
 * This is a serious, mixed-format career evaluation, not a buzzfeed quiz. It is
 * built to work for ANYONE: a doctor, a lawyer, a school student, a homemaker,
 * a shopkeeper, someone who has never even heard the word "website". It does
 * that by asking about everyday human wiring (what you enjoy, what you're good
 * at, what you care about) in plain language with zero tech jargon. The skill
 * names only appear at the END, in the result.
 *
 * It blends four ideas from real career science:
 *   1. INTERESTS, what activities pull you in (RIASEC style).
 *   2. APTITUDES, an honest self-rating of what you're naturally good at.
 *   3. VALUES, a forced ranking of what really matters to you.
 *   4. READINESS, your practical reality (time, money, tech comfort, grit).
 *
 * Question formats are mixed on purpose, because people fool themselves on any
 * single format: choice, "which is more you" pairs, ranking, 1 to 5 rating,
 * and a typed answer. Stated, revealed and self-rated signals triangulate.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * HOW TO CHANGE WHICH ANSWERS SUGGEST WHICH SKILL (read this Yasir):
 *   • Every answer carries `dims`, weights on the 7 work-style dimensions.
 *   • Every course has a trait row in TRAITS below with its own `dims`.
 *   • A person is matched to a course by how close their dimension mix is to
 *     the course's, then adjusted for tech comfort, budget, time and goal.
 *   • So to make an answer point harder at a skill, raise that dimension on
 *     the answer AND on the course. Nothing else needs touching.
 * ──────────────────────────────────────────────────────────────────────────
 */
import { courses } from "./courses";
import { paths, type LearningPath } from "./paths";

/* ================================================================== */
/* Dimensions                                                         */
/* ================================================================== */

export type Dim = "build" | "automate" | "create" | "market" | "people" | "data" | "write";
export const DIMS: Dim[] = ["build", "automate", "create", "market", "people", "data", "write"];

export const DIM_META: Record<Dim, { label: string; emoji: string; blurb: string }> = {
  build:    { label: "Building",    emoji: "🧱", blurb: "You like making things work, fixing and putting things together." },
  automate: { label: "Organising",  emoji: "⚙️", blurb: "You like order, planning, and making boring jobs run themselves." },
  create:   { label: "Creating",    emoji: "🎨", blurb: "You think visually, you care how things look and feel." },
  market:   { label: "Persuading",  emoji: "📣", blurb: "You're drawn to selling, offers, attention and convincing." },
  people:   { label: "People",      emoji: "🤝", blurb: "You're energised by helping, talking and earning trust." },
  data:     { label: "Analysing",   emoji: "📊", blurb: "You like numbers, patterns, logic and proof." },
  write:    { label: "Writing",     emoji: "✍️", blurb: "You turn ideas into clear, convincing words." },
};

export type Vec = Partial<Record<Dim, number>>;

/* ================================================================== */
/* Values                                                             */
/* ================================================================== */

export type ValueKey = "money" | "freedom" | "creativity" | "helping" | "status" | "mastery";
export const VALUE_META: Record<ValueKey, { label: string; emoji: string }> = {
  money:      { label: "Money and security", emoji: "💰" },
  freedom:    { label: "Freedom and flexibility", emoji: "🕊️" },
  creativity: { label: "Creativity and self expression", emoji: "🎨" },
  helping:    { label: "Helping people", emoji: "❤️" },
  status:     { label: "Status and recognition", emoji: "🏆" },
  mastery:    { label: "Learning and mastery", emoji: "🧠" },
};

/* ================================================================== */
/* Course traits                                                      */
/* ================================================================== */

interface Traits {
  dims: Vec;
  techDepth: 1 | 2 | 3 | 4 | 5;
  income: "fast" | "medium" | "slow";
  toolBudget: "low" | "med" | "high";
  values?: ValueKey[];
}

const TRAITS: Record<string, Traits> = {
  "n8n-automation":        { dims: { automate: 5, build: 3, data: 2 }, techDepth: 4, income: "medium", toolBudget: "med", values: ["mastery", "money"] },
  "ai-chatbots":           { dims: { automate: 3, build: 3, people: 2, data: 1 }, techDepth: 3, income: "medium", toolBudget: "med", values: ["mastery", "freedom"] },
  "gohighlevel":           { dims: { automate: 3, market: 3, people: 3 }, techDepth: 2, income: "fast", toolBudget: "high", values: ["money", "freedom"] },
  "ai-video-production":   { dims: { create: 5, market: 2 }, techDepth: 1, income: "fast", toolBudget: "med", values: ["creativity", "freedom"] },
  "wordpress-development": { dims: { build: 4, create: 2 }, techDepth: 2, income: "fast", toolBudget: "low", values: ["money", "freedom"] },
  "ecommerce-solutions":   { dims: { build: 3, market: 3, data: 2 }, techDepth: 3, income: "medium", toolBudget: "med", values: ["money", "mastery"] },
  "social-media-automation": { dims: { market: 3, create: 3, automate: 2 }, techDepth: 1, income: "fast", toolBudget: "low", values: ["creativity", "freedom"] },
  "youtube-automation":    { dims: { create: 4, market: 3, write: 1 }, techDepth: 2, income: "medium", toolBudget: "low", values: ["creativity", "status"] },
  "email-marketing":       { dims: { market: 4, write: 4, data: 2 }, techDepth: 1, income: "fast", toolBudget: "low", values: ["money", "mastery"] },
  "analytics-tracking":    { dims: { data: 5, build: 2 }, techDepth: 3, income: "medium", toolBudget: "low", values: ["mastery", "money"] },
  "zapier-make":           { dims: { automate: 4, build: 2 }, techDepth: 2, income: "fast", toolBudget: "med", values: ["freedom", "money"] },
  "crm-implementation":    { dims: { automate: 3, people: 3, data: 2 }, techDepth: 2, income: "medium", toolBudget: "med", values: ["money", "helping"] },
  "document-automation":   { dims: { automate: 4, build: 2, write: 1 }, techDepth: 2, income: "fast", toolBudget: "low", values: ["freedom", "money"] },
  "ai-identity-design":    { dims: { create: 5 }, techDepth: 1, income: "medium", toolBudget: "low", values: ["creativity", "status"] },
  "lead-generation":       { dims: { market: 4, people: 3, data: 2 }, techDepth: 2, income: "medium", toolBudget: "med", values: ["money", "status"] },
  "automation-strategy":   { dims: { automate: 5, people: 3, data: 3 }, techDepth: 3, income: "slow", toolBudget: "low", values: ["mastery", "status"] },
  "vibe-coding":           { dims: { build: 5, create: 2 }, techDepth: 3, income: "medium", toolBudget: "low", values: ["mastery", "creativity"] },
  "saas-web-app":          { dims: { build: 5, data: 3, automate: 2 }, techDepth: 5, income: "slow", toolBudget: "med", values: ["mastery", "money"] },
  "web-app-deployment":    { dims: { build: 4, automate: 2, data: 1 }, techDepth: 4, income: "medium", toolBudget: "med", values: ["mastery"] },
  "cro-audit":             { dims: { data: 4, market: 3, people: 2 }, techDepth: 3, income: "medium", toolBudget: "low", values: ["mastery", "money"] },
  "funnels-landing-pages": { dims: { market: 4, create: 3, build: 2, write: 2 }, techDepth: 2, income: "fast", toolBudget: "med", values: ["money", "creativity"] },
  "booking-systems":       { dims: { automate: 3, build: 2, people: 2 }, techDepth: 1, income: "fast", toolBudget: "low", values: ["freedom", "helping"] },
  "revops-systems":        { dims: { automate: 4, data: 4, people: 2 }, techDepth: 3, income: "slow", toolBudget: "med", values: ["mastery", "status"] },
  "ai-agents":             { dims: { build: 4, automate: 4, data: 3 }, techDepth: 5, income: "slow", toolBudget: "med", values: ["mastery", "status"] },
  // New 2026 future-facing skills
  "ai-ugc-ads":            { dims: { create: 5, market: 3 }, techDepth: 1, income: "fast", toolBudget: "med", values: ["creativity", "money"] },
  "ai-voice-agents":       { dims: { automate: 4, build: 3, people: 2, data: 1 }, techDepth: 4, income: "medium", toolBudget: "med", values: ["mastery", "money"] },
  "aeo-optimization":      { dims: { market: 4, data: 3, write: 2 }, techDepth: 2, income: "medium", toolBudget: "low", values: ["mastery", "money"] },
  "ai-app-building":       { dims: { build: 5, create: 2, automate: 1 }, techDepth: 3, income: "medium", toolBudget: "low", values: ["mastery", "money"] },
  "3d-virtual-spaces":     { dims: { create: 5, build: 2, data: 1 }, techDepth: 3, income: "medium", toolBudget: "med", values: ["creativity", "mastery"] },
  "ai-game-creation":      { dims: { create: 4, build: 3, data: 1 }, techDepth: 3, income: "slow", toolBudget: "low", values: ["creativity", "mastery"] },
  "genz-brand-marketing":  { dims: { market: 4, create: 3, write: 3 }, techDepth: 1, income: "fast", toolBudget: "low", values: ["creativity", "status"] },
  "ai-personalized-outreach": { dims: { market: 4, write: 3, automate: 2, data: 2 }, techDepth: 2, income: "fast", toolBudget: "med", values: ["money", "mastery"] },
  "ai-influencers":        { dims: { create: 5, market: 3 }, techDepth: 2, income: "medium", toolBudget: "med", values: ["creativity", "status"] },
  "ai-music-voice":        { dims: { create: 5, write: 1 }, techDepth: 1, income: "medium", toolBudget: "low", values: ["creativity", "freedom"] },
};

/* ================================================================== */
/* Question model                                                     */
/* ================================================================== */

export type QType = "single" | "multi" | "scale" | "scenario" | "rank" | "rating" | "text";

export interface Choice {
  id: string;
  label: string;
  desc?: string;
  emoji?: string;
  dims?: Vec;
  value?: ValueKey;
  set?: Partial<Practical>;
}

export interface RatingItem {
  id: string;
  text: string;
  dims: Vec;
}

export interface Question {
  id: string;
  band: "interests" | "aptitudes" | "values" | "reality" | "reflect";
  type: QType;
  title: string;
  help?: string;
  maxPick?: number;
  choices?: Choice[];
  items?: RatingItem[];
  tags?: Choice[];
  placeholder?: string;
  optional?: boolean;
}

const SECTION: Record<Question["band"], { label: string; emoji: string }> = {
  interests: { label: "What you enjoy", emoji: "🧲" },
  aptitudes: { label: "What you're good at", emoji: "💪" },
  values:    { label: "What matters to you", emoji: "⭐" },
  reality:   { label: "Your real situation", emoji: "📋" },
  reflect:   { label: "In your own words", emoji: "💬" },
};
export function sectionOf(q: Question) { return SECTION[q.band]; }

const QUESTION_DEFS: Question[] = [
  /* ---------- context ---------- */
  {
    id: "life",
    band: "reality",
    type: "single",
    title: "First, where are you in life right now?",
    help: "There's no wrong answer here, it just helps me give you the right kind of plan.",
    choices: [
      { id: "school", emoji: "🎒", label: "Still in school", set: { timeHours: 8, experience: 0 } },
      { id: "college", emoji: "🎓", label: "College or university student", set: { timeHours: 10 } },
      { id: "job", emoji: "💼", label: "Working a job", desc: "Learning on the side", set: { timeHours: 6 } },
      { id: "professional", emoji: "🩺", label: "An established professional", desc: "Doctor, teacher, lawyer, engineer", dims: { data: 1, people: 1 }, set: { timeHours: 5, techComfort: 3 } },
      { id: "business", emoji: "🏪", label: "I run my own shop or business", dims: { market: 1, people: 1 }, set: { timeHours: 6 } },
      { id: "home", emoji: "🏡", label: "At home, raising a family", desc: "I want flexible income from home", dims: { create: 1 }, set: { timeHours: 7 } },
      { id: "between", emoji: "🧭", label: "Between things, just exploring", set: { timeHours: 14 } },
    ],
  },

  /* ---------- interests (multi) ---------- */
  {
    id: "spark",
    band: "interests",
    type: "multi",
    maxPick: 3,
    title: "Which of these would you happily lose track of time doing?",
    help: "Forget money or skill for a second, just go with what genuinely pulls you in. Pick up to 3.",
    choices: [
      { id: "make", emoji: "🧱", label: "Fixing or making something work", desc: "You love when a broken thing finally works", dims: { build: 3 } },
      { id: "organise", emoji: "⚙️", label: "Sorting out a mess into a clear system", desc: "Planning, organising, tidying chaos", dims: { automate: 3 } },
      { id: "design", emoji: "🎨", label: "Making something look beautiful", desc: "Decorating, drawing, editing photos or videos", dims: { create: 3 } },
      { id: "persuade", emoji: "📣", label: "Convincing people or making a deal", desc: "Selling, pitching, winning people over", dims: { market: 3 } },
      { id: "help", emoji: "🤝", label: "Helping, teaching or listening to people", desc: "Being the person others lean on", dims: { people: 3 } },
      { id: "analyse", emoji: "📊", label: "Cracking a tricky puzzle", desc: "Numbers, logic, strategy, figuring things out", dims: { data: 3 } },
      { id: "express", emoji: "✍️", label: "Putting thoughts into words", desc: "Writing, explaining, telling a story", dims: { write: 3 } },
    ],
  },

  /* ---------- forced-choice "which is more you" pairs ---------- */
  {
    id: "pair_make",
    band: "interests",
    type: "scenario",
    title: "Quick gut check, which is more you?",
    help: "Just pick the one that feels closer, even if it's only slightly.",
    choices: [
      { id: "fixit", emoji: "🔧", label: "I'd rather fix or build the thing", desc: "Get it working", dims: { build: 3 } },
      { id: "prettyit", emoji: "✨", label: "I'd rather make a plain thing beautiful", desc: "Make it look great", dims: { create: 3 } },
    ],
  },
  {
    id: "pair_lead",
    band: "interests",
    type: "scenario",
    title: "And which is more you?",
    choices: [
      { id: "lead", emoji: "🎤", label: "I'd rather lead and convince a room", desc: "Out front with people", dims: { market: 2, people: 2 } },
      { id: "solve", emoji: "🧠", label: "I'd rather quietly solve it on my own", desc: "Head down, figuring it out", dims: { data: 2, build: 1 } },
    ],
  },

  /* ---------- aptitude battery (rating) ---------- */
  {
    id: "aptitude",
    band: "aptitudes",
    type: "rating",
    title: "How true is each of these about you?",
    help: "Be honest, not impressive. 1 means not me at all, 5 means that's totally me.",
    items: [
      { id: "a_finish", text: "I can stick with a boring task until it's done properly.", dims: { automate: 2, build: 1 } },
      { id: "a_tech", text: "I'm curious how everyday things work, and I like taking them apart.", dims: { build: 2, data: 1 } },
      { id: "a_visual", text: "I notice when something looks off, and I have an eye for what looks nice.", dims: { create: 2 } },
      { id: "a_talk", text: "People find me easy to talk to, and they open up to me.", dims: { people: 2 } },
      { id: "a_convince", text: "I can usually talk someone around to my way of thinking.", dims: { market: 2, people: 1 } },
      { id: "a_numbers", text: "Numbers and patterns make sense to me, they don't scare me.", dims: { data: 2 } },
      { id: "a_explain", text: "I can explain a hard idea so almost anyone understands it.", dims: { write: 2, people: 1 } },
      { id: "a_grit", text: "When I'm stuck, I enjoy figuring it out myself instead of giving up.", dims: { build: 1, data: 1 } },
    ],
  },

  /* ---------- scenario instincts (everyday, no jargon) ---------- */
  {
    id: "sc_shop",
    band: "interests",
    type: "scenario",
    title: "A small shop near you is quietly losing customers. Your gut says the fix is to,",
    help: "Go with your first instinct.",
    choices: [
      { id: "look", emoji: "🎨", label: "Make it look and feel nicer", desc: "The whole vibe and presentation", dims: { create: 3, build: 1 } },
      { id: "process", emoji: "⚙️", label: "Sort out their messy way of doing things", desc: "Orders, bookings, follow ups", dims: { automate: 3 } },
      { id: "more", emoji: "📣", label: "Get more people through the door", desc: "Offers, posters, word of mouth", dims: { market: 3 } },
      { id: "why", emoji: "📊", label: "Study where exactly they lose people", desc: "Find the leak in the numbers", dims: { data: 3 } },
    ],
  },
  {
    id: "sc_freeday",
    band: "interests",
    type: "scenario",
    title: "You get a free day and someone offers to teach you anything. You'd most enjoy learning to,",
    choices: [
      { id: "build", emoji: "🛠️", label: "Make or set something up that actually works", dims: { build: 3 } },
      { id: "create", emoji: "🎬", label: "Make videos or designs that look great", dims: { create: 3 } },
      { id: "sell", emoji: "💬", label: "Win customers and close a sale", dims: { market: 2, people: 2 } },
      { id: "system", emoji: "🤖", label: "Set things up so boring jobs do themselves", dims: { automate: 3 } },
    ],
  },
  {
    id: "sc_group",
    band: "aptitudes",
    type: "scenario",
    title: "In a group project or a family event, you naturally become the one who,",
    choices: [
      { id: "does", emoji: "🔧", label: "Actually builds or sets up the thing", dims: { build: 2, automate: 1 } },
      { id: "presents", emoji: "🎤", label: "Talks to everyone and presents it", dims: { people: 2, market: 1 } },
      { id: "pretty", emoji: "✨", label: "Makes it all look polished", dims: { create: 3 } },
      { id: "plans", emoji: "🗂️", label: "Plans it and keeps everyone on track", dims: { automate: 2, data: 1 } },
    ],
  },

  /* ---------- values ranking ---------- */
  {
    id: "values",
    band: "values",
    type: "rank",
    title: "Rank these by what matters most to you, tap them in order, 1 first.",
    help: "There are no wrong answers, just be honest about your real priorities.",
    choices: [
      { id: "money", emoji: "💰", label: "Money and security", value: "money" },
      { id: "freedom", emoji: "🕊️", label: "Freedom and flexibility", value: "freedom" },
      { id: "creativity", emoji: "🎨", label: "Creativity and self expression", value: "creativity" },
      { id: "helping", emoji: "❤️", label: "Helping people", value: "helping" },
      { id: "status", emoji: "🏆", label: "Status and recognition", value: "status" },
      { id: "mastery", emoji: "🧠", label: "Learning and mastery", value: "mastery" },
    ],
  },

  /* ---------- reality / readiness ---------- */
  {
    id: "experience",
    band: "reality",
    type: "single",
    title: "Beyond the basics, how much have you done on a computer or phone?",
    help: "Honestly, this just sets where I'd start you. Beginners are very welcome.",
    choices: [
      { id: "never", emoji: "🌱", label: "Almost nothing yet", desc: "I'm a true beginner", set: { experience: 0 } },
      { id: "dabbled", emoji: "🔧", label: "I've played around a little", set: { experience: 1 } },
      { id: "some", emoji: "🛠️", label: "I've made a few small things", desc: "Edited photos, made a sheet, simple stuff", set: { experience: 2, techComfort: 3 } },
      { id: "lots", emoji: "🚀", label: "I've made real things, maybe even earned online", set: { experience: 2, techComfort: 4 } },
    ],
  },
  {
    id: "computer",
    band: "reality",
    type: "scale",
    title: "How comfortable are you with a computer or laptop?",
    help: "Be honest, there's no judgement here.",
    choices: [
      { id: "c1", emoji: "🐣", label: "Just the basics", desc: "Browsing, typing, WhatsApp", set: { techComfort: 1 } },
      { id: "c2", emoji: "🙂", label: "Fairly comfortable", desc: "Email, documents, downloads", set: { techComfort: 2 } },
      { id: "c3", emoji: "💪", label: "Pretty confident", desc: "I install things and figure stuff out", set: { techComfort: 3 } },
      { id: "c4", emoji: "⚡", label: "Very comfortable", desc: "I love trying new tools", set: { techComfort: 4 } },
      { id: "c5", emoji: "🧠", label: "Super comfortable", desc: "I can even tinker with code a little", set: { techComfort: 5 } },
    ],
  },
  {
    id: "online_money",
    band: "reality",
    type: "single",
    title: "Have you ever earned, or tried to earn, money online?",
    help: "Totally fine if the answer is never, that's exactly why you're here.",
    choices: [
      { id: "never", emoji: "🤷", label: "Never really thought about it", set: {} },
      { id: "curious", emoji: "👀", label: "I'm curious but never tried", set: {} },
      { id: "tried", emoji: "🧪", label: "I've tried a bit", dims: { market: 1 }, set: { experience: 1 } },
      { id: "earned", emoji: "✅", label: "Yes, I've earned something online", dims: { market: 1 }, set: { experience: 2 } },
    ],
  },
  {
    id: "time",
    band: "reality",
    type: "scale",
    title: "Realistically, how many hours a week can you give this?",
    help: "Pick what works on a normal week, not your best week ever.",
    choices: [
      { id: "t1", emoji: "⏳", label: "1 to 3 hours", set: { timeHours: 2 } },
      { id: "t2", emoji: "🕒", label: "4 to 7 hours", set: { timeHours: 6 } },
      { id: "t3", emoji: "🕘", label: "8 to 14 hours", set: { timeHours: 11 } },
      { id: "t4", emoji: "🔥", label: "15 hours or more", set: { timeHours: 18 } },
    ],
  },
  {
    id: "research",
    band: "reality",
    type: "single",
    title: "When you hit something you don't understand, what do you usually do?",
    help: "A big part of any skill is learning to find answers on your own.",
    choices: [
      { id: "i1", emoji: "😬", label: "I get stuck, I'd rather be shown step by step", set: { research: 1 } },
      { id: "i2", emoji: "🔎", label: "I search on Google or YouTube until I get it", set: { research: 2 } },
      { id: "i3", emoji: "🧭", label: "I love the hunt, I'll dig until I crack it", set: { research: 3 } },
    ],
  },
  {
    id: "budget",
    band: "reality",
    type: "single",
    title: "What can you spend on tools while you learn?",
    help: "Many skills start with free tools, so any answer is fine.",
    choices: [
      { id: "b1", emoji: "🪙", label: "Basically nothing for now", desc: "Free tools only", set: { toolBudget: "low" } },
      { id: "b2", emoji: "💵", label: "A small amount each month", desc: "Roughly 10 to 50 dollars", set: { toolBudget: "med" } },
      { id: "b3", emoji: "💳", label: "I can invest if it pays off", desc: "More than 50 a month", set: { toolBudget: "high" } },
    ],
  },
  {
    id: "goal",
    band: "reality",
    type: "single",
    title: "What's the real reason driving you?",
    choices: [
      { id: "income-fast", emoji: "💸", label: "Earn some income as soon as I can", set: { income: "fast" } },
      { id: "freelance", emoji: "🧑‍💻", label: "Build a steady freelance income", desc: "Find my own clients", dims: { people: 1 }, set: { income: "medium" } },
      { id: "agency", emoji: "🏢", label: "Build a real business of my own", dims: { market: 1, people: 1 }, set: { income: "medium" } },
      { id: "product", emoji: "🚀", label: "Create my own product one day", dims: { build: 2 }, set: { income: "slow" } },
      { id: "career", emoji: "📈", label: "Grow my career or get hired", dims: { data: 1 }, set: { income: "slow" } },
      { id: "curious", emoji: "🌟", label: "Honestly, I just want to find what fits me", set: { income: "slow" } },
    ],
  },

  /* ---------- reflection (typed + tags) ---------- */
  {
    id: "comefor",
    band: "reflect",
    type: "text",
    title: "What do friends or family usually come to YOU for help with?",
    help: "Type a sentence in your own words, then tap whatever's closest. This is one of the most honest signals there is.",
    placeholder: "For example, whenever someone's phone or wifi acts up, they call me,",
    tags: [
      { id: "tech", emoji: "🔧", label: "Fixing tech or gadgets", dims: { build: 2, data: 1 } },
      { id: "advice", emoji: "🤝", label: "Advice and listening", dims: { people: 2 } },
      { id: "design", emoji: "🎨", label: "Photos, design or decor", dims: { create: 2 } },
      { id: "organise", emoji: "🗂️", label: "Organising or planning", dims: { automate: 2 } },
      { id: "money", emoji: "💰", label: "Money, deals or selling", dims: { market: 2 } },
      { id: "writing", emoji: "✍️", label: "Writing or explaining", dims: { write: 2 } },
    ],
  },
  {
    id: "dream",
    band: "reflect",
    type: "text",
    optional: true,
    title: "If money was not a worry, how would you love to spend your days?",
    help: "Optional, but it helps me understand the real you. One line is plenty.",
    placeholder: "For example, creating things, teaching, building a business, helping people,",
  },
];

/**
 * Display order, tuned so the start feels relaxed and personal, not like a tech
 * test. We open with easy, human questions about who you are, what matters to
 * you and why you're here, then ease into the playful scenarios and the honest
 * self-rating, and finish with the practical bits and a soft reflection.
 * (Change this array to reorder the quiz, nothing else needs touching.)
 */
const QUESTION_ORDER = [
  "life",          // gentle, one-tap opener
  "values",        // what matters most to you
  "goal",          // the real reason driving you
  "online_money",  // relatable, low pressure
  "experience",    // eases into practical, still light
  "spark",         // what you'd lose track of time doing
  "comefor",       // what friends come to you for
  "pair_make",     // quick gut check
  "pair_lead",     // quick gut check
  "sc_freeday",    // playful scenario
  "sc_shop",       // scenario
  "sc_group",      // scenario
  "aptitude",      // the honest self-rating, mid-late
  "computer",      // practical
  "time",          // practical
  "research",      // practical
  "budget",        // practical
  "dream",         // soft, optional close
];

export const QUESTIONS: Question[] = QUESTION_ORDER
  .map((id) => QUESTION_DEFS.find((q) => q.id === id))
  .filter((q): q is Question => Boolean(q));

/* ================================================================== */
/* Answers                                                            */
/* ================================================================== */

export type AnswerValue =
  | { type: "choices"; ids: string[] }
  | { type: "rank"; order: string[] }
  | { type: "rating"; values: Record<string, number> }
  | { type: "text"; text: string; tags: string[] };

export type Answers = Record<string, AnswerValue>;

export function chosenId(answers: Answers, qid: string): string | undefined {
  const a = answers[qid];
  return a && a.type === "choices" ? a.ids[0] : undefined;
}

export function isAnswered(q: Question, a: AnswerValue | undefined): boolean {
  if (!a) return Boolean(q.optional);
  switch (a.type) {
    case "choices": return a.ids.length > 0;
    case "rank":    return a.order.length === (q.choices?.length ?? 0);
    case "rating":  return Object.keys(a.values).length === (q.items?.length ?? 0);
    case "text":    return q.optional ? true : (a.text.trim().length > 0 || a.tags.length > 0);
  }
}

/* ================================================================== */
/* Result types                                                       */
/* ================================================================== */

export interface Practical {
  techComfort: number;
  timeHours: number;
  income: "fast" | "medium" | "slow";
  toolBudget: "low" | "med" | "high";
  research: number;
  experience: number;
}

export interface Archetype {
  key: string; title: string; emoji: string; blurb: string;
  strengths: string[]; watchOuts: string[];
}

export interface SkillMatch {
  slug: string; title: string; icon: string; category: string; level: string;
  score: number; reasons: string[];
}

export interface Scorecard {
  interests: Record<Dim, number>;
  aptitudes: Record<Dim, number>;
  values: { key: ValueKey; label: string; emoji: string; weight: number }[];
  readiness: number;
  readinessBand: { label: string; blurb: string };
}

export interface QuizResult {
  profile: Record<Dim, number>;
  topDims: Dim[];
  practical: Practical;
  archetype: Archetype;
  matches: SkillMatch[];
  path: LearningPath | null;
  pathReason: string;
  scorecard: Scorecard;
}

/* ================================================================== */
/* Archetypes                                                         */
/* ================================================================== */

const ARCHETYPES: Record<Dim, Archetype> = {
  build: { key: "builder", title: "The Builder", emoji: "🧱",
    blurb: "You'd rather make the thing than just talk about it. An idea only feels real to you once it actually works.",
    strengths: ["Patience to make things truly work", "Logical, step by step thinking", "Skills that are valuable and hard to replace"],
    watchOuts: ["Don't hide in tutorials, ship small real projects", "Learn to sell what you build, not just build it"] },
  automate: { key: "organiser", title: "The Organiser", emoji: "⚙️",
    blurb: "You see a mess and instantly want to make it run itself. Bringing order to chaos is your superpower.",
    strengths: ["Spotting boring work worth automating", "Reliability and an eye for detail", "Skills businesses happily pay monthly for"],
    watchOuts: ["Perfectionism can slow you down, done beats perfect", "Practise explaining the value in plain words"] },
  create: { key: "creator", title: "The Creator", emoji: "🎨",
    blurb: "You feel how things should look and flow. Your taste is your real edge.",
    strengths: ["A strong natural eye for design", "You make work people want to share", "Fun, fast skills to get started with"],
    watchOuts: ["Pair your taste with one money skill like selling", "Charge for the result, not just the pixels"] },
  market: { key: "persuader", title: "The Persuader", emoji: "📣",
    blurb: "You're wired for attention, offers and convincing. You like making the phone ring.",
    strengths: ["You understand what makes people act", "Comfortable with selling and offers", "Skills tied straight to income, so well paid"],
    watchOuts: ["Back your instinct with numbers to prove results", "Get genuinely good at one channel before spreading out"] },
  people: { key: "connector", title: "The Connector", emoji: "🤝",
    blurb: "People trust you quickly. Caring and communicating come naturally to you.",
    strengths: ["You win people over that others can't", "You sense what people really need", "Communication is the top freelance skill"],
    watchOuts: ["Add one delivery skill so you can fulfil what you sell", "Protect your time, you tend to over commit"] },
  data: { key: "analyst", title: "The Analyst", emoji: "📊",
    blurb: "You trust evidence. You like finding what's broken and proving the fix.",
    strengths: ["Decisions backed by real proof", "Clients love measurable results", "Rare skills that command higher pay"],
    watchOuts: ["Don't over analyse, ship the recommendation", "Practise telling the story behind the numbers"] },
  write: { key: "wordsmith", title: "The Wordsmith", emoji: "✍️",
    blurb: "You turn fuzzy ideas into clear, convincing words, the skill behind almost every sale.",
    strengths: ["Clarity that makes people take action", "Words power emails, ads and content", "Low cost and fast to get started"],
    watchOuts: ["Tie your writing to results like clicks and sales", "Learn one channel to put your words to work"] },
};

/* ================================================================== */
/* Scoring engine                                                     */
/* ================================================================== */

const incomeRank = { fast: 0, medium: 1, slow: 2 } as const;
const budgetRank = { low: 0, med: 1, high: 2 } as const;

function emptyProfile(): Record<Dim, number> {
  return { build: 0, automate: 0, create: 0, market: 0, people: 0, data: 0, write: 0 };
}
function addVec(target: Record<Dim, number>, v: Vec, mult = 1) {
  for (const d of DIMS) target[d] += (v[d] ?? 0) * mult;
}
function normalise(raw: Record<Dim, number>): Record<Dim, number> {
  const max = Math.max(1, ...DIMS.map((d) => raw[d]));
  const out = emptyProfile();
  for (const d of DIMS) out[d] = Math.round((Math.max(0, raw[d]) / max) * 100);
  return out;
}
function cosine(a: Record<Dim, number>, b: Vec): number {
  let dot = 0, ma = 0, mb = 0;
  for (const d of DIMS) { const av = a[d] ?? 0, bv = b[d] ?? 0; dot += av * bv; ma += av * av; mb += bv * bv; }
  return ma === 0 || mb === 0 ? 0 : dot / (Math.sqrt(ma) * Math.sqrt(mb));
}

export function scoreQuiz(answers: Answers): QuizResult {
  const interestRaw = emptyProfile();
  const aptitudeRaw = emptyProfile();
  const valueWeights: Record<ValueKey, number> = { money: 0, freedom: 0, creativity: 0, helping: 0, status: 0, mastery: 0 };

  const practical: Practical = { techComfort: 2, timeHours: 6, income: "medium", toolBudget: "low", research: 2, experience: 0 };

  for (const q of QUESTIONS) {
    const a = answers[q.id];
    if (!a) continue;

    if (a.type === "choices") {
      for (const id of a.ids) {
        const c = q.choices?.find((x) => x.id === id);
        if (!c) continue;
        if (c.dims) addVec(interestRaw, c.dims);
        if (c.set) for (const [k, v] of Object.entries(c.set)) (practical as unknown as Record<string, unknown>)[k] = v;
      }
    } else if (a.type === "rank") {
      const n = a.order.length;
      a.order.forEach((id, idx) => {
        const c = q.choices?.find((x) => x.id === id);
        if (c?.value) valueWeights[c.value] += n - idx;
      });
    } else if (a.type === "rating") {
      for (const item of q.items ?? []) {
        const v = a.values[item.id];
        if (v == null) continue;
        addVec(aptitudeRaw, item.dims, (v - 3) / 2);
      }
    } else if (a.type === "text") {
      for (const id of a.tags) {
        const c = q.tags?.find((x) => x.id === id);
        if (c?.dims) addVec(interestRaw, c.dims);
      }
    }
  }

  const masterRaw = emptyProfile();
  addVec(masterRaw, interestRaw, 1.0);
  addVec(masterRaw, aptitudeRaw, 0.9);

  const profile = normalise(masterRaw);
  const interests = normalise(interestRaw);
  const aptitudes = normalise(aptitudeRaw);

  const topDims = [...DIMS].sort((x, y) => masterRaw[y] - masterRaw[x]);
  const primary = topDims[0];

  const expPts = (practical.experience / 2) * 25;
  const techPts = ((practical.techComfort - 1) / 4) * 25;
  const timePts = Math.min(1, practical.timeHours / 14) * 25;
  const resPts = ((practical.research - 1) / 2) * 15;
  const budPts = budgetRank[practical.toolBudget] * 5;
  const readiness = Math.round(expPts + techPts + timePts + resPts + budPts);
  const readinessBand =
    readiness < 40 ? { label: "Explorer", blurb: "Start gentle and beginner friendly, build a little momentum first." }
    : readiness < 70 ? { label: "Ready to start", blurb: "You have enough to begin a real skill today." }
    : { label: "All in", blurb: "You can take on something ambitious and move quickly." };

  const rankedValues = (Object.keys(valueWeights) as ValueKey[])
    .sort((x, y) => valueWeights[y] - valueWeights[x])
    .map((key) => ({ key, label: VALUE_META[key].label, emoji: VALUE_META[key].emoji, weight: valueWeights[key] }));
  const topValueKeys = rankedValues.slice(0, 2).map((v) => v.key);

  const matches: SkillMatch[] = courses.map((course) => {
    const t = TRAITS[course.slug] ?? { dims: {}, techDepth: 3, income: "medium", toolBudget: "med" } as Traits;
    let score = cosine(masterRaw, t.dims) * 100;
    const reasons: string[] = [];

    const shared = [...DIMS]
      .filter((d) => (t.dims[d] ?? 0) > 0 && masterRaw[d] > 0)
      .sort((x, y) => (t.dims[y] ?? 0) * masterRaw[y] - (t.dims[x] ?? 0) * masterRaw[x]);
    if (shared[0]) reasons.push(`Plays to your ${DIM_META[shared[0]].label.toLowerCase()} strength`);

    const valHit = (t.values ?? []).find((v) => topValueKeys.includes(v));
    if (valHit) reasons.push(`Fits what you value, ${VALUE_META[valHit].label.toLowerCase()}`);

    const gap = t.techDepth - practical.techComfort;
    if (gap >= 2) { score -= gap * 9; reasons.push("A bit of a stretch, but learnable"); }
    else if (gap <= -1 && t.techDepth <= 2) { score += 5; reasons.push("Beginner friendly for you"); }

    if (course.level === "Advanced" && practical.experience === 0) score -= 14;
    if (course.level === "Beginner" && practical.experience <= 1) score += 6;

    const incGap = incomeRank[t.income] - incomeRank[practical.income];
    if (practical.income === "fast" && t.income === "fast") { score += 9; reasons.push("You can earn from this quickly"); }
    else if (incGap > 0 && practical.income === "fast") score -= incGap * 7;

    const budGap = budgetRank[t.toolBudget] - budgetRank[practical.toolBudget];
    if (budGap >= 1) score -= budGap * 6;
    else if (t.toolBudget === "low") reasons.push("Cheap to start, mostly free tools");

    if (practical.timeHours <= 3 && t.techDepth >= 4) score -= 8;
    if (practical.timeHours >= 12 && t.techDepth >= 4) score += 4;
    if (readiness < 40 && t.techDepth >= 4) score -= 8;

    if (course.flagship) score += 2;

    score = Math.max(0, Math.min(100, Math.round(score)));
    return { slug: course.slug, title: course.title, icon: course.icon, category: course.category, level: course.level, score, reasons: dedupe(reasons).slice(0, 3) };
  });

  matches.sort((a, b) => b.score - a.score);

  const scoreBySlug = new Map(matches.map((m) => [m.slug, m.score]));
  let path: LearningPath | null = null, bestPathScore = -1;
  for (const p of paths) {
    const slugs = p.courseSlugs.filter((s) => scoreBySlug.has(s));
    if (!slugs.length) continue;
    const avg = slugs.reduce((s, x) => s + (scoreBySlug.get(x) ?? 0), 0) / slugs.length;
    if (avg > bestPathScore) { bestPathScore = avg; path = p; }
  }

  return {
    profile, topDims: topDims.slice(0, 3), practical,
    archetype: ARCHETYPES[primary],
    matches: matches.slice(0, 4),
    path,
    pathReason: path ? `Your strengths point at ${DIM_META[primary].label.toLowerCase()}, and this track stacks the right skills in the right order.` : "",
    scorecard: { interests, aptitudes, values: rankedValues, readiness, readinessBand },
  };
}

function dedupe(arr: string[]): string[] { return [...new Set(arr)]; }

export function profileHeadline(result: QuizResult): string {
  const [a, b] = result.topDims;
  const t = result.practical.timeHours;
  const pace = t <= 3 ? "in small, steady sessions" : t >= 12 ? "with serious focus" : "a few hours a week";
  const val = result.scorecard.values[0];
  return `A ${result.archetype.title}, strongest at ${DIM_META[a].label.toLowerCase()} and ${DIM_META[b].label.toLowerCase()}, driven by ${val.label.toLowerCase()}, learning best ${pace}.`;
}
