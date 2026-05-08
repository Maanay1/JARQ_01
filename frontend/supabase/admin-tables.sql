create table if not exists profiles (
  id uuid references auth.users(id) primary key,
  name text,
  username text,
  email text,
  avatar_url text,
  selected_avatar_id text default 'maanay',
  role text default 'user',
  status text default 'active',
  source text default 'direct',
  streak integer default 0,
  total_xp integer default 0,
  lessons_completed integer default 0,
  last_seen timestamp,
  created_at timestamp default now()
);

alter table profiles add column if not exists name text;
alter table profiles add column if not exists username text;
alter table profiles add column if not exists email text;
alter table profiles add column if not exists avatar_url text;
alter table profiles add column if not exists selected_avatar_id text default 'maanay';
alter table profiles add column if not exists role text default 'user';
alter table profiles add column if not exists status text default 'active';
alter table profiles add column if not exists source text default 'direct';
alter table profiles add column if not exists streak integer default 0;
alter table profiles add column if not exists total_xp integer default 0;
alter table profiles add column if not exists lessons_completed integer default 0;
alter table profiles add column if not exists last_seen timestamp;
alter table profiles add column if not exists created_at timestamp default now();

create table if not exists user_activity (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  action text,
  lesson_id text,
  score integer,
  time_spent integer,
  created_at timestamp default now()
);

create index if not exists user_activity_user_id_idx on user_activity(user_id);
create index if not exists user_activity_created_at_idx on user_activity(created_at);
create index if not exists user_activity_lesson_id_idx on user_activity(lesson_id);
