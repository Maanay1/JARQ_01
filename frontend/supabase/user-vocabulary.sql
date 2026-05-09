create table if not exists user_vocabulary (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  word text,
  translation text,
  example text,
  source_video_id text,
  learned boolean default false,
  created_at timestamp default now()
);

create index if not exists user_vocabulary_user_id_idx on user_vocabulary(user_id);
create index if not exists user_vocabulary_source_video_id_idx on user_vocabulary(source_video_id);
