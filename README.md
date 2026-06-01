# learnwithyasir 🎓

A practical, project-first **Learning Management System (LMS)** that teaches the
exact skills Yasir Bashir uses to build AI automation, web apps and growth
systems for clients. Each skill on [yasirbashir.com](https://yasirbashiraisite.vercel.app)
maps to a **one-month course** with locked/unlocking modules.

It's the third site in the family:

| Site | Purpose |
| --- | --- |
| `yasirbashiraisite` | Main services website |
| `chatwithyasir` | Conversational onboarding / communication |
| **`learnwithyasir`** | **This — the skill academy / LMS** |

## The course framework

Every course has **four parts**, and modules unlock in order:

1. **Learn & Scope** — understand the skill and exactly what you're mastering
2. **Practice** — hands-on builds with step-by-step tool setup guides
3. **Career & Clients** — find, win and communicate with real clients
4. **Advancement** — scale, stay current and a 90-day roadmap to expert

Each course also ships per-tool setup guides and verified resource links.

## Features

- 🔐 **Easy login** (Google-style; mock now, Supabase-ready — see below)
- 📚 **24 courses** generated from one editable spec per skill
- 🔓 **Progressive module unlocking** — finish a module to unlock the next
- 📊 **Progress tracking** with per-course completion rings
- 🎯 **Learning-vibe onboarding** that captures the learner's goal + email
- 🛠️ **Instructor (admin) mode** for Yasir
- 🎨 Brand-matched teal/cream/gold liquid-glass UI

## Tech stack

- **React 18 + Vite + TypeScript**
- **Tailwind CSS 3** (brand tokens in `tailwind.config.ts`)
- **React Router** + **framer-motion** + **lucide-react**
- **Auth & data**: swappable layer (localStorage today → **Supabase** later)

## Develop

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # production bundle in dist/
```

## Project structure

```
learnwithyasir/
├── public/                 # favicon
├── src/
│   ├── components/         # Navbar, CourseCard, LessonBody, ProgressRing…
│   ├── pages/              # Landing, Login, Catalog, Course, Lesson, Dashboard
│   ├── data/               # build.ts (course generator) + courses.ts (the 24 specs)
│   ├── lib/                # auth.tsx · progress.ts · types.ts · utils.ts
│   ├── hooks/              # useProgressTick
│   └── index.css           # Tailwind + liquid-glass utilities
└── README.md
```

## Editing courses

All course content lives in **`src/data/courses.ts`** as compact `CourseSpec`
objects. `buildCourse()` (`src/data/build.ts`) expands each spec into the full
4-part curriculum. To add a skill, push one more spec — no component changes.

## Swapping to Supabase (later)

The app only touches auth/data through two files, so the migration is contained:

1. **`src/lib/auth.tsx`** — replace the mock `signInWithGoogle`/`signOut` with
   `supabase.auth.signInWithOAuth({ provider: 'google' })` and an
   `onAuthStateChange` listener. The `User` shape stays the same.
2. **`src/lib/progress.ts`** — replace the localStorage read/write with a
   `user_progress` table (rows of `user_id`, `lesson_id`, `completed`) and an
   `enrollments` table. Keep the exported function signatures identical.
3. Add **row-level security** so a user can only read/write their own progress.

No page or component imports Supabase directly — they all go through these two
modules, so nothing else needs to change.

> Content note: course material is practical and real, but time-sensitive
> details (tool pricing, exact UI steps) should be refreshed periodically with
> deep research.

---

© Yasir Bashir
