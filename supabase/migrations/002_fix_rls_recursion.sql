-- Fix infinite recursion: admin policies must not SELECT from profiles inside profiles RLS.
-- Run this in Supabase SQL Editor if you already applied 001_initial.sql.

-- Drop recursive policies
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Admins can read all completions" on public.prep_completions;

-- Helper bypasses RLS (security definer) to check admin status
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

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can read all completions"
  on public.prep_completions for select
  using (public.is_admin());
