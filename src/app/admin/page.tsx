import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { AdminTable } from "@/components/AdminTable";
import { InviteCodesPanel } from "@/components/InviteCodesPanel";
import { ResetProgressButton } from "@/components/ResetProgressButton";
import { PageNav } from "@/components/PageNav";
import { isCoachAdmin } from "@/lib/admin";
import {
  getInviteCodes,
  getMemberCompletions,
  getMemberProfiles,
  getProfile,
} from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile();

  if (!isCoachAdmin(profile, user.email)) {
    return (
      <div className="min-h-screen">
        <Header name={profile?.name} showAdmin={false} />

        <main className="mx-auto max-w-lg px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <h1 className="text-xl font-semibold text-zinc-50">Admin access required</h1>
            <p className="text-sm text-zinc-400">
              Your account isn&apos;t an admin yet. Signed in as{" "}
              <span className="text-zinc-200">{user.email}</span>.
            </p>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Option 1 — add to .env.local (easiest)
              </p>
              <pre className="mt-2 overflow-x-auto text-xs text-emerald-300">
{`ADMIN_EMAILS=${user.email},other@yourdomain.com`}
              </pre>
              <p className="mt-2 text-xs text-zinc-500">
                Restart <code className="text-zinc-400">npm run dev</code>, then refresh this page.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Option 2 — Supabase SQL Editor
              </p>
              <pre className="mt-2 overflow-x-auto text-xs text-emerald-300">
{`update public.profiles
set is_admin = true
where email = '${user.email}';`}
              </pre>
            </div>

            <Link href="/dashboard" className="inline-block text-sm text-emerald-400 hover:text-emerald-300">
              ← Back to dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const profiles = await getMemberProfiles();
  const completions = await getMemberCompletions();
  const inviteCodes = await getInviteCodes();

  return (
    <div className="min-h-screen">
      <Header name={profile?.name} showAdmin />

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6">
        <PageNav
          backHref="/dashboard"
          backLabel="Back to dashboard"
          items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Admin" }]}
        />

        <InviteCodesPanel codes={inviteCodes} />

        <ResetProgressButton />

        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-zinc-50">Prep completion</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Members only — admins excluded. Export CSV to follow up before Thursday.
            </p>
          </div>

          <AdminTable profiles={profiles} completions={completions} />
        </div>
      </main>
    </div>
  );
}
