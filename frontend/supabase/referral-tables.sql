create table if not exists referrals (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references auth.users(id),
  referred_id uuid references auth.users(id),
  referral_code text,
  reward_given boolean default false,
  created_at timestamp default now()
);

create table if not exists referral_codes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  code text unique,
  total_referrals integer default 0,
  created_at timestamp default now()
);

create index if not exists referrals_referrer_id_idx on referrals(referrer_id);
create index if not exists referrals_referred_id_idx on referrals(referred_id);
create index if not exists referrals_referral_code_idx on referrals(referral_code);
create index if not exists referral_codes_user_id_idx on referral_codes(user_id);
create index if not exists referral_codes_code_idx on referral_codes(code);
