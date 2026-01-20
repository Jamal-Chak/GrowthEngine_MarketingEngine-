-- AI Recommendations
create table public.recommendations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  type text not null, -- 'SEO', 'Ads', 'Content', etc.
  reason text not null,
  impact_score integer check (impact_score >= 1 and impact_score <= 10),
  status text default 'pending', -- 'pending', 'applied', 'dismissed'
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

alter table public.recommendations enable row level security;

create policy "Users can view their own recommendations"
  on recommendations for select
  using ( auth.uid() = user_id );

create policy "Users can update their own recommendations"
  on recommendations for update
  using ( auth.uid() = user_id );

-- User Events (Tracking everything)
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  event_type text not null, -- 'page_view', 'button_click', 'mission_start', etc.
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

alter table public.events enable row level security;

create policy "Users can view their own events"
  on events for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own events"
  on events for insert
  with check ( auth.uid() = user_id );

-- XP History (Audit trail for gamification)
create table public.xp_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  amount integer not null,
  reason text not null, -- 'mission_complete', 'daily_login', etc.
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

alter table public.xp_history enable row level security;

create policy "Users can view their own xp history"
  on xp_history for select
  using ( auth.uid() = user_id );

-- Helper function to award XP safely
create or replace function public.award_xp(target_user_id uuid, xp_amount integer, reward_reason text)
returns void as $$
begin
  -- 1. Log the history
  insert into public.xp_history (user_id, amount, reason)
  values (target_user_id, xp_amount, reward_reason);

  -- 2. Update the main stats
  update public.gamification_stats
  set 
    xp = xp + xp_amount,
    level = floor((xp + xp_amount) / 1000) + 1, -- Simple leveling: 1000xp per level
    updated_at = now()
  where id = target_user_id;
end;
$$ language plpgsql security definer;
