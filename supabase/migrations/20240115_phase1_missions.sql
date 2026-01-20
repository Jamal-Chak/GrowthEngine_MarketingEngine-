-- Missions Table (Actionable tasks from AI)
create table public.missions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  status text default 'pending', -- 'pending', 'in_progress', 'completed', 'failed', 'snoozed'
  priority text default 'medium', -- 'low', 'medium', 'high'
  impact_score integer, -- 1-10 estimation of value
  effort_level text, -- 'low', 'medium', 'high'
  due_date timestamp with time zone,
  owner_id uuid references auth.users, -- For future team features
  
  -- AI Metadata
  ai_rationale text, -- "Why this matters" (hidden or shown in explainability)
  expected_outcome text,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.missions enable row level security;

-- Policies
create policy "Users can view their own missions"
  on missions for select
  using ( auth.uid() = user_id );

create policy "Users can update their own missions"
  on missions for update
  using ( auth.uid() = user_id );

create policy "Users can insert their own missions"
  on missions for insert
  with check ( auth.uid() = user_id );

-- Optional: Trigger to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_missions_updated_at
before update on public.missions
for each row
execute function update_updated_at_column();
