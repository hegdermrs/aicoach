import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { PageNav } from "@/components/PageNav";
import { ActivityPlayer } from "@/components/ActivityPlayer";
import { getAuthContext, getPrepCompletions } from "@/lib/data";
import { getReadingAudioSignedUrl } from "@/lib/reading-audio-storage";
import { getSession, isWeekUnlocked } from "@/lib/sessions";
import { isWeekComplete } from "@/lib/progress";

interface PrepPageProps {
  params: Promise<{ week: string }>;
}

export default async function PrepPage({ params }: PrepPageProps) {
  const { week: weekParam } = await params;
  const week = Number(weekParam);

  if (!Number.isInteger(week) || week < 1 || week > 12) {
    redirect("/");
  }

  const { profile, isAdmin } = await getAuthContext();

  if (!isWeekUnlocked(week, { isAdmin })) {
    redirect("/");
  }

  const session = getSession(week);
  if (!session) {
    redirect("/");
  }

  const completions = await getPrepCompletions();
  const alreadyComplete = isWeekComplete(week, completions);
  const readingAudioUrl = await getReadingAudioSignedUrl(week);

  return (
    <div className="min-h-screen">
      <Header name={profile?.name} showAdmin={isAdmin} />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <PageNav
          backHref="/"
          backLabel="Back to dashboard"
          items={[
            { label: "Dashboard", href: "/" },
            { label: `Week ${week} prep` },
          ]}
        />

        {isAdmin && (
          <p className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-xs text-amber-200/80">
            Admin preview mode — testing Week {week}
          </p>
        )}

        <ActivityPlayer
          session={session}
          alreadyComplete={alreadyComplete}
          readingAudioUrl={readingAudioUrl}
          isAdmin={isAdmin}
        />
      </main>
    </div>
  );
}
