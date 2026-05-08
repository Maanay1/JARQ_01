create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  plan text default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamp,
  created_at timestamp default now()
);
