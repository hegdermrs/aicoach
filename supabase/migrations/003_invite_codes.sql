-- Invite codes for self-service signup

create table if not exists public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  tier text not null default '1000' check (tier in ('1000', '3500')),
  cohort_start date not null default current_date,
  used_at timestamptz,
  used_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists invite_codes_code_idx on public.invite_codes (code);

alter table public.invite_codes enable row level security;

create policy "Admins manage invite codes"
  on public.invite_codes for all
  using (public.is_admin())
  with check (public.is_admin());
