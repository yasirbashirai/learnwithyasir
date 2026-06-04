-- learnfromyasir — Supabase schema
-- Run this in your Supabase project: SQL Editor → New query → paste → Run.
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE where possible).

-- 1) Profiles (one row per user, mirrors auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  name text,
  vibe text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- 2) Enrollments
create table if not exists public.enrollments (
  user_id uuid references auth.users on delete cascade,
  course_slug text not null,
  created_at timestamptz default now(),
  primary key (user_id, course_slug)
);

-- 3) Lesson progress
create table if not exists public.lesson_progress (
  user_id uuid references auth.users on delete cascade,
  lesson_id text not null,
  completed_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

-- 4) Admin-managed lesson videos (so Yasir can add video URLs without a deploy)
create table if not exists public.lesson_videos (
  lesson_id text primary key,
  video_url text,
  updated_at timestamptz default now()
);

-- ---------- Row Level Security ----------
alter table public.profiles        enable row level security;
alter table public.enrollments     enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.lesson_videos   enable row level security;

-- Each user can only read/write their OWN rows.
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own enrollments" on public.enrollments;
create policy "own enrollments" on public.enrollments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own progress" on public.lesson_progress;
create policy "own progress" on public.lesson_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Admin check uses the JWT email claim (recursion-free — does NOT query profiles).
-- Change the email here if your admin account changes.
-- Admins can READ everyone's rows for the instructor console.
drop policy if exists "admin read profiles" on public.profiles;
create policy "admin read profiles" on public.profiles
  for select using ((auth.jwt() ->> 'email') = 'yasirbashirai@gmail.com');

drop policy if exists "admin read enrollments" on public.enrollments;
create policy "admin read enrollments" on public.enrollments
  for select using ((auth.jwt() ->> 'email') = 'yasirbashirai@gmail.com');

drop policy if exists "admin read progress" on public.lesson_progress;
create policy "admin read progress" on public.lesson_progress
  for select using ((auth.jwt() ->> 'email') = 'yasirbashirai@gmail.com');

-- Videos: anyone signed in can read; only the admin can write.
drop policy if exists "videos readable" on public.lesson_videos;
create policy "videos readable" on public.lesson_videos
  for select using (true);

drop policy if exists "videos admin write" on public.lesson_videos;
create policy "videos admin write" on public.lesson_videos
  for all using ((auth.jwt() ->> 'email') = 'yasirbashirai@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'yasirbashirai@gmail.com');

-- ============================================================
-- Community discussions (one board per course)
-- ============================================================
create table if not exists public.discussions (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  user_id uuid references auth.users on delete cascade,
  user_name text,
  body text not null,
  pinned boolean default false,
  created_at timestamptz default now()
);
alter table public.discussions enable row level security;

drop policy if exists "discussions read" on public.discussions;
create policy "discussions read" on public.discussions
  for select using (true);

drop policy if exists "discussions insert own" on public.discussions;
create policy "discussions insert own" on public.discussions
  for insert with check (auth.uid() = user_id);

drop policy if exists "discussions delete own or admin" on public.discussions;
create policy "discussions delete own or admin" on public.discussions
  for delete using (auth.uid() = user_id or (auth.jwt() ->> 'email') = 'yasirbashirai@gmail.com');

drop policy if exists "discussions admin update" on public.discussions;
create policy "discussions admin update" on public.discussions
  for update using ((auth.jwt() ->> 'email') = 'yasirbashirai@gmail.com');

-- ============================================================
-- Weekly live sessions (per course, or global when course_slug is null)
-- ============================================================
create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  course_slug text,
  title text not null,
  description text,
  starts_at timestamptz not null,
  join_url text,
  created_at timestamptz default now()
);
alter table public.live_sessions enable row level security;

drop policy if exists "sessions read" on public.live_sessions;
create policy "sessions read" on public.live_sessions
  for select using (true);

drop policy if exists "sessions admin write" on public.live_sessions;
create policy "sessions admin write" on public.live_sessions
  for all using ((auth.jwt() ->> 'email') = 'yasirbashirai@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'yasirbashirai@gmail.com');

-- ============================================================
-- Super-admin full control: manage ANY student's enrollment/progress.
-- ============================================================
drop policy if exists "admin manage progress" on public.lesson_progress;
create policy "admin manage progress" on public.lesson_progress
  for delete using ((auth.jwt() ->> 'email') = 'yasirbashirai@gmail.com');

drop policy if exists "admin manage enrollments" on public.enrollments;
create policy "admin manage enrollments" on public.enrollments
  for delete using ((auth.jwt() ->> 'email') = 'yasirbashirai@gmail.com');

-- ============================================================
-- Skill-Fit quiz leads (public funnel — anyone can submit)
-- Captures the lead + their full assessment result.
-- ============================================================
create table if not exists public.quiz_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  goal text,
  archetype text,
  top_skills jsonb,
  path_slug text,
  profile jsonb,
  practical jsonb,
  answers jsonb,
  created_at timestamptz default now()
);
alter table public.quiz_leads enable row level security;

-- Anyone (anon) may submit their own quiz result; nobody can read them back
-- from the client except the admin (leads are private).
drop policy if exists "quiz_leads insert anon" on public.quiz_leads;
create policy "quiz_leads insert anon" on public.quiz_leads
  for insert with check (true);

drop policy if exists "quiz_leads admin read" on public.quiz_leads;
create policy "quiz_leads admin read" on public.quiz_leads
  for select using ((auth.jwt() ->> 'email') = 'yasirbashirai@gmail.com');
