-- Sync invite code cohort start with mastermind calendar (May 28, 2026)

update public.invite_codes
set cohort_start = '2026-05-28'
where code in ('AIEA11X', 'AIEA26Y');

update public.profiles
set cohort_start = '2026-05-28';
