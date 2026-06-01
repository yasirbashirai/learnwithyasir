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
