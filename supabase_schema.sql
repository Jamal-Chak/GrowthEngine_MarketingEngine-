-- Create profiles table that extends auth.users
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(full_name) >= 3)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
-- Organizations
create table public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  plan text default 'free',
  created_at timestamp with time zone default now()
);

alter table public.organizations enable row level security;

create policy "Organizations are viewable by members"
  on organizations for select
  using ( exists (
    select 1 from public.organization_members
    where organization_id = organizations.id
    and user_id = auth.uid()
  ));

-- Organization Members
create table public.organization_members (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations not null,
  user_id uuid references auth.users not null,
  role text default 'member', -- 'owner', 'admin', 'member'
  created_at timestamp with time zone default now(),
  
  unique(organization_id, user_id)
);

alter table public.organization_members enable row level security;

create policy "Members can view their own memberships"
  on organization_members for select
  using ( auth.uid() = user_id );

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Gamification Stats
create table public.gamification_stats (
  id uuid references auth.users not null primary key,
  xp integer default 0,
  level integer default 1,
  points integer default 0,
  streak_days integer default 0,
  last_activity_date timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.gamification_stats enable row level security;

create policy "Users can view their own stats"
  on gamification_stats for select
  using ( auth.uid() = id );

create policy "Users can update their own stats"
  on gamification_stats for update
  using ( auth.uid() = id );

-- Missions
create table public.missions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  xp_reward integer not null default 100,
  category text, -- 'onboarding', 'growth', 'social'
  difficulty text default 'easy',
  total_steps integer default 1,
  steps jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now()
);

alter table public.missions enable row level security;

create policy "Missions are viewable by everyone"
  on missions for select
  using ( true );

-- User Missions (Tracking Progress)
create table public.user_missions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  mission_id uuid references public.missions not null,
  completed_steps integer default 0,
  is_completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  unique(user_id, mission_id)
);

alter table public.user_missions enable row level security;

create policy "Users can view their own mission progress"
  on user_missions for select
  using ( auth.uid() = user_id );

create policy "Users can update their own mission progress"
  on user_missions for update
  using ( auth.uid() = user_id );

create policy "Users can insert their own mission progress"
  on user_missions for insert
  with check ( auth.uid() = user_id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  insert into public.gamification_stats (id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Events (Raw User/System Actions)
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  event_type text not null, -- 'page_view', 'button_click', 'feature_used'
  event_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

alter table public.events enable row level security;

create policy "Users can insert their own events"
  on events for insert
  with check ( auth.uid() = user_id );

create policy "Users can view their own events"
  on events for select
  using ( auth.uid() = user_id );

-- Insights (AI Interpretations)
create table public.insights (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  type text, -- 'opportunity', 'risk', 'trend'
  confidence_score float check (confidence_score >= 0 and confidence_score <= 1),
  created_at timestamp with time zone default now()
);

alter table public.insights enable row level security;

create policy "Users can view their own insights"
  on insights for select
  using ( auth.uid() = user_id );

-- Missions (Updated with status, priority, etc.)
create type mission_status as enum ('pending', 'active', 'completed', 'failed');
create type mission_priority as enum ('low', 'medium', 'high');

-- Note: We are altering the existing missions table concept. 
-- Assuming 'missions' is the template table and 'user_missions' is the instance.
-- If we want custom missions per user tailored by AI, they might live directly in user_missions or a new table.
-- For now, let's enhance the template 'missions' if these are global, OR if 'missions' are unique to users, we need to adjust.
-- specific requirement: "Separate tables: events, insights, missions".
-- specific requirement: "Add mission_status, mission_priority, mission_due_date, mission_owner".

-- Let's update user_missions to include these tracking fields since status/due_date are per-user instance data.
alter table public.user_missions 
  add column status mission_status default 'active',
  add column priority mission_priority default 'medium',
  add column due_date timestamp with time zone,
  add column owner_id uuid references auth.users; -- Optional: if different from user_id (e.g. team member)

-- Seed Data (Optional - run manually if needed)
-- insert into public.missions (title, description, xp_reward, total_steps) values 
-- ('Complete Onboarding', 'Finish your profile setup', 500, 5),
-- ('Invite Team', 'Invite 3 team members to the platform', 300, 3);

-- Mission Feedback
create table public.mission_feedback (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  mission_id uuid references public.missions not null,
  rating boolean not null, -- true = helpful, false = not helpful
  comment text,
  created_at timestamp with time zone default now()
);

alter table public.mission_feedback enable row level security;

create policy "Users can insert their own feedback"
  on mission_feedback for insert
  with check ( auth.uid() = user_id );

create policy "Users can view their own feedback"
  on mission_feedback for select
  using ( auth.uid() = user_id );
