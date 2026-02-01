-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- *** WARNING: This resets the gamification/mission tables to ensure correct schema ***
-- We use CASCADE to automatically remove any old dependent tables (like user_missions)
DROP TABLE IF EXISTS public.gamification_profiles CASCADE;
DROP TABLE IF EXISTS public.missions CASCADE;
DROP TABLE IF EXISTS public.insights CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.user_missions CASCADE; -- Explicitly drop legacy table

-- 1. GAMIFICATION PROFILES
create table public.gamification_profiles (
  user_id uuid not null primary key,
  xp integer default 0,
  level integer default 1,
  points integer default 0,
  badges jsonb default '[]'::jsonb,
  achievements jsonb default '{
    "missionsCompleted": 0,
    "currentStreak": 0,
    "longestStreak": 0,
    "lastActivityDate": null, 
    "totalXPEarned": 0
  }'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.gamification_profiles enable row level security;

-- Policies
create policy "Users can view own gamification profile"
  on gamification_profiles for select
  using ( auth.uid() = user_id );

create policy "Users can update own gamification profile"
  on gamification_profiles for update
  using ( auth.uid() = user_id );

create policy "Service role can manage all gamification profiles"
  on gamification_profiles for all
  using ( true );

create policy "Users can insert own gamification profile"
  on gamification_profiles for insert
  with check ( auth.uid() = user_id );


-- 2. MISSIONS
create table public.missions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null,
  org_id uuid,
  title text not null,
  description text,
  category text default 'custom',
  xp_reward integer default 100,
  estimated_time text default '30 minutes',
  impact_level text default 'medium',
  steps jsonb default '[]'::jsonb,
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.missions enable row level security;

create policy "Users can view own missions"
  on missions for select
  using ( auth.uid() = user_id );

create policy "Users can update own missions"
  on missions for update
  using ( auth.uid() = user_id );

create policy "Users can insert own missions"
  on missions for insert
  with check ( auth.uid() = user_id );


-- 3. INSIGHTS / RECOMMENDATIONS
create table public.insights (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null,
  title text not null,
  description text,
  type text not null,
  confidence_score integer default 5,
  action_url text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

alter table public.insights enable row level security;

create policy "Users can view own insights"
  on insights for select
  using ( auth.uid() = user_id );

create policy "Users can insert own insights"
  on insights for insert
  with check ( auth.uid() = user_id );


-- 4. EVENTS (Analytics)
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid,
  event_type text not null,
  event_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

alter table public.events enable row level security;

create policy "Users can insert own events"
  on events for insert
  with check ( auth.uid() = user_id );

create policy "Users can view own events"
  on events for select
  using ( auth.uid() = user_id );

