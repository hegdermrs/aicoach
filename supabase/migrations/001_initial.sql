-- AI Execution Accelerator Coaching Portal schema

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  tier text not null default '1000' check (tier in ('1000', '3500')),
  cohort_start date not null default current_date,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.prep_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_number int not null check (week_number between 1 and 12),
  completed_at timestamptz not null default now(),
  responses jsonb not null default '{}'::jsonb,
  unique (user_id, week_number)
);

alter table public.profiles enable row level security;
alter table public.prep_completions enable row level security;

-- Bypasses RLS to check admin status (avoids infinite recursion in policies)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

grant execute on function public.is_admin() to authenticated;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Users can update own profile name"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can read own completions"
  on public.prep_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert own completions"
  on public.prep_completions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own completions"
  on public.prep_completions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins can read all completions"
  on public.prep_completions for select
  using (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, tier, cohort_start, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'tier', '1000'),
    coalesce((new.raw_user_meta_data->>'cohort_start')::date, current_date),
    coalesce((new.raw_user_meta_data->>'is_admin')::boolean, false)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
