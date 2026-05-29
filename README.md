# AI Execution Accelerator Coaching Portal

Pre-session prep portal for the AI Execution Accelerator Mastermind. Members complete ~5 minute interactive activities before each Thursday 11AM CST session.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure Supabase**

   - Create a project at [supabase.com](https://supabase.com)
   - Run migrations in order in the Supabase SQL editor:
     - [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql)
     - [`supabase/migrations/002_fix_rls_recursion.sql`](supabase/migrations/002_fix_rls_recursion.sql) (only if you already ran 001 before the RLS fix)
     - [`supabase/migrations/003_invite_codes.sql`](supabase/migrations/003_invite_codes.sql)
   - **Authentication → Providers → Email**: enable Email provider, turn **off** “Confirm email” so members can sign in immediately after signup
   - Copy `.env.local.example` to `.env.local` and fill in your keys (including `SUPABASE_SERVICE_ROLE_KEY`)

3. **Create your coach admin account**

   - Go to `/signup` and use an invite code (generate one manually in SQL first, or sign up then set admin):

   ```sql
   insert into public.invite_codes (code, tier, cohort_start)
   values ('COACH000', '3500', current_date);

   update public.profiles set is_admin = true where email = 'you@example.com';
   ```

   - Or generate codes from `/admin` after you’re an admin

4. **Run locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Member signup codes

Share these fixed codes — everyone at that tier uses the same one:

| Tier | Invite code |
|------|-------------|
| $1000 | **AIEA11X** |
| $3500 | **AIEA26Y** |

Members go to `/signup`, enter the code for their tier, plus name, email, and password.

Run [`supabase/migrations/004_tier_invite_codes.sql`](supabase/migrations/004_tier_invite_codes.sql) in Supabase SQL Editor to create these codes. Update `cohort_start` in that file (or via SQL) to your mastermind start date.

## Member flow

1. Send them the code for their tier (`AIEA11X` or `AIEA26Y`)
2. Member goes to `/signup`, enters code + name + email + password
3. Member signs in at `/login` anytime after

## Editing session content

Prep activities live in [`src/content/sessions/`](src/content/sessions/) as JSON files (`week-01.json` … `week-12.json`). Edit copy there — no code changes needed for text updates.

## Deploy

Deploy to [Vercel](https://vercel.com) and set the same environment variables (including `SUPABASE_SERVICE_ROLE_KEY` as a server-only secret).
