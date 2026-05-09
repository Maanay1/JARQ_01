create table if not exists saved_reels (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  reel_id text,
  saved_at timestamp default now()
);

create index if not exists saved_reels_user_id_idx on saved_reels(user_id);
create index if not exists saved_reels_reel_id_idx on saved_reels(reel_id);
