-- JARQ Supabase schema
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  level integer not null default 1,
  xp integer not null default 0,
  streak integer not null default 0,
  preferred_persona text not null default 'jarq_classic',
  current_course text,
  studying_topics text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists preferred_persona text not null default 'jarq_classic';

alter table public.profiles
  add column if not exists current_course text;

alter table public.profiles
  add column if not exists studying_topics text[] not null default '{}';

create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  persona_id text,
  user_message text not null,
  ai_response text not null,
  emotion text,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_personas (
  id text primary key,
  name text not null,
  description text,
  system_prompt text not null,
  voice_style text,
  avatar_style text,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id text primary key,
  title text not null,
  description text,
  subject text,
  level text,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id text primary key,
  course_id text references public.courses(id) on delete cascade,
  title text not null,
  content text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id text primary key,
  lesson_id text references public.lessons(id) on delete cascade,
  type text,
  question text not null,
  correct_answer text,
  explanation text,
  difficulty text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  course_id text references public.courses(id) on delete cascade,
  lesson_id text references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  score integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, course_id, lesson_id)
);

create table if not exists public.user_mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  subject text,
  mistake text not null,
  correction text,
  explanation text,
  created_at timestamptz not null default now()
);

create table if not exists public.voice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  transcript text,
  ai_response text,
  audio_url text,
  created_at timestamptz not null default now()
);

-- Existing memory table used by the current backend memory repository.
create table if not exists public.learner_memories (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  content text not null,
  importance integer not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists chat_history_user_created_idx
  on public.chat_history (user_id, created_at desc);

create index if not exists lessons_course_order_idx
  on public.lessons (course_id, order_index);

create index if not exists tasks_lesson_idx
  on public.tasks (lesson_id);

create index if not exists user_progress_user_idx
  on public.user_progress (user_id);

create index if not exists user_mistakes_user_created_idx
  on public.user_mistakes (user_id, created_at desc);

create index if not exists voice_sessions_user_created_idx
  on public.voice_sessions (user_id, created_at desc);

create index if not exists learner_memories_user_created_idx
  on public.learner_memories (user_id, created_at desc);

-- Keep updated_at fresh for user_progress.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_progress_updated_at on public.user_progress;
create trigger set_user_progress_updated_at
before update on public.user_progress
for each row
execute function public.set_updated_at();

-- RLS for Supabase Auth.
alter table public.profiles enable row level security;
alter table public.chat_history enable row level security;
alter table public.ai_personas enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.tasks enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_mistakes enable row level security;
alter table public.voice_sessions enable row level security;
alter table public.learner_memories enable row level security;

-- Public read tables. Content can be managed by backend service role.
drop policy if exists "Anyone can read AI personas" on public.ai_personas;
create policy "Anyone can read AI personas"
on public.ai_personas for select
using (true);

drop policy if exists "Anyone can read courses" on public.courses;
create policy "Anyone can read courses"
on public.courses for select
using (true);

drop policy if exists "Anyone can read lessons" on public.lessons;
create policy "Anyone can read lessons"
on public.lessons for select
using (true);

drop policy if exists "Anyone can read tasks" on public.tasks;
create policy "Anyone can read tasks"
on public.tasks for select
using (true);

-- User-owned tables. auth.uid() must match user_id/id.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can read own chat history" on public.chat_history;
create policy "Users can read own chat history"
on public.chat_history for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own chat history" on public.chat_history;
create policy "Users can insert own chat history"
on public.chat_history for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can read own progress" on public.user_progress;
create policy "Users can read own progress"
on public.user_progress for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own progress" on public.user_progress;
create policy "Users can insert own progress"
on public.user_progress for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own progress" on public.user_progress;
create policy "Users can update own progress"
on public.user_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read own mistakes" on public.user_mistakes;
create policy "Users can read own mistakes"
on public.user_mistakes for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own mistakes" on public.user_mistakes;
create policy "Users can insert own mistakes"
on public.user_mistakes for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can read own voice sessions" on public.voice_sessions;
create policy "Users can read own voice sessions"
on public.voice_sessions for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own voice sessions" on public.voice_sessions;
create policy "Users can insert own voice sessions"
on public.voice_sessions for insert
with check (auth.uid() = user_id);

-- learner_memories currently stores user_id as text for compatibility with the backend prototype.
drop policy if exists "Users can read own learner memories" on public.learner_memories;
create policy "Users can read own learner memories"
on public.learner_memories for select
using (auth.uid()::text = user_id);

drop policy if exists "Users can insert own learner memories" on public.learner_memories;
create policy "Users can insert own learner memories"
on public.learner_memories for insert
with check (auth.uid()::text = user_id);

-- Backend requests with SUPABASE_SERVICE_ROLE_KEY bypass RLS automatically.
