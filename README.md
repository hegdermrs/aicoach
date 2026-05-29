# AI Execution Accelerator Coaching Portal

Pre-session prep portal for the AI Execution Accelerator Mastermind. Members listen to weekly prep, read along, and complete a short activity before each Thursday 11AM CST session.

## Local setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   - Copy `.env.local.example` to `.env.local`
   - Fill in Supabase and other values from your project dashboard (never commit `.env.local`)

3. **Configure Supabase**

   - Create a project at [supabase.com](https://supabase.com)
   - Run migrations in order in the SQL editor (`supabase/migrations/001` through `006`)
   - **Authentication → Providers → Email**: enable Email, turn **off** “Confirm email” so members can sign in right after signup
   - Set **Site URL** and **Redirect URLs** to match your app URL (see Deploy below)

4. **Coach admin access**

   - Set `ADMIN_EMAILS` in `.env.local`, or set `is_admin = true` on your profile in Supabase
   - Sign up via `/signup` using an invite code created in `/admin` or via SQL

5. **Run locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Reading audio (optional)

Generate MP3s once and upload to Supabase Storage:

```bash
npm run generate:audio
```

Requires `ELEVENLABS_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. See `.env.local.example`.

## Member flow

1. Open the site → **Sign up** with invite code (coach provides)
2. **Log in** each week → **Dashboard** → **Listen & prep**
3. Show up Thursday 11AM CST for the live session

Invite codes are managed in **Admin** (`/admin`) — do not publish codes in this repo.

## Editing content

- Prep copy and audio scripts: `src/content/sessions/week-*.json`
- After script changes, re-run `npm run generate:audio` for affected weeks

## Deploy

Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Set environment variables from `.env.local.example` in the host dashboard (keep service role and API keys server-side only).

After deploy, update Supabase **Authentication → URL Configuration** with your production URL.

## Keep Supabase awake (Free tier)

GitHub Action `.github/workflows/keep-supabase-active.yml` pings the project twice weekly. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` as repository secrets.
