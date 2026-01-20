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
  total_steps integer default 1,
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

-- Seed Data (Optional - run manually if needed)
-- insert into public.missions (title, description, xp_reward, total_steps) values 
-- ('Complete Onboarding', 'Finish your profile setup', 500, 5),
-- ('Invite Team', 'Invite 3 team members to the platform', 300, 3);
