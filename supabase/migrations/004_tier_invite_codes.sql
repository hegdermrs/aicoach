-- Reusable tier codes + seed AIEA11X ($1000) and AIEA26Y ($3500)

alter table public.invite_codes
  add column if not exists reusable boolean not null default false;

insert into public.invite_codes (code, tier, cohort_start, reusable)
values
  ('AIEA11X', '1000', '2026-05-28', true),
  ('AIEA26Y', '3500', '2026-05-28', true)
on conflict (code) do update set
  tier = excluded.tier,
  reusable = excluded.reusable,
  cohort_start = excluded.cohort_start;

-- Set your mastermind start date (Week 1 unlocks from this date):
-- update public.invite_codes set cohort_start = '2026-06-05' where code in ('AIEA11X', 'AIEA26Y');
