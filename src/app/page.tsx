import Link from "next/link";
import { Header } from "@/components/Header";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ProgressRing } from "@/components/ProgressRing";
import { PrepStatusBadge } from "@/components/PrepStatusBadge";
import { CurriculumRoadmap } from "@/components/CurriculumRoadmap";
import { getAuthContext, getPrepCompletions } from "@/lib/data";
import { getAllSessions, getCurrentWeek, TOTAL_WEEKS } from "@/lib/sessions";
import { getModuleForWeek } from "@/lib/curriculum";
import {
  calculateStreak,
  getCompletionCount,
  isWeekComplete,
} from "@/lib/progress";
import {
  formatSessionDate,
  formatSessionLabel,
  getNextSessionDate,
} from "@/lib/calendar";

export default async function DashboardPage() {
  const { profile, isAdmin } = await getAuthContext();
  const completions = await getPrepCompletions();
  const currentWeek = getCurrentWeek();
  const sessions = getAllSessions();
  const currentSession = sessions.find((s) => s.week === currentWeek);
  const currentModule = getModuleForWeek(currentWeek);
  const nextSession = getNextSessionDate();
  const completedCount = getCompletionCount(completions);
  const streak = calculateStreak(completions);
  const weekComplete = currentSession
    ? isWeekComplete(currentSession.week, completions)
    : false;

  return (
    <div className="min-h-screen">
      <Header name={profile?.name} showAdmin={isAdmin} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {isAdmin && (
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
            <p className="text-sm text-amber-100/90">
              Admin preview — all weeks unlocked.{" "}
              <Link href="/" className="font-medium text-amber-300 hover:text-amber-200">
                Back to dashboard →
              </Link>
            </p>
          </div>
        )}

        {/* Primary action — busy owners see this first */}
        {currentSession && (
          <section className="mb-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-zinc-900/40 p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
              Do this before Thursday · Week {currentWeek}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-50 sm:text-3xl">
              {currentSession.title}
            </h1>
            {currentModule && (
              <p className="mt-1 text-sm text-zinc-500">
                Module {currentModule.id}: {currentModule.title}
              </p>
            )}
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300">
              {currentSession.plainEnglishSummary}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href={`/prep/${currentWeek}`}
                className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                {weekComplete ? "Review this week's prep" : "Listen & prep (~8 min)"}
              </Link>
              <PrepStatusBadge complete={weekComplete} />
              <span className="text-xs text-zinc-500">
                {formatSessionDate(currentWeek)} · listen + activity
              </span>
            </div>

            {!weekComplete && (
              <p className="mt-4 text-xs text-zinc-500">
                Tip: Block 8 minutes to listen before{" "}
                {formatSessionDate(currentWeek)} 11AM CST.
              </p>
            )}
          </section>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
          <CurriculumRoadmap
            sessions={sessions}
            completions={completions}
            currentWeek={currentWeek}
            isAdmin={isAdmin}
          />

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Next live session
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-100">
                {formatSessionLabel(nextSession)}
              </p>
              <div className="mt-4">
                <CountdownTimer targetAt={nextSession.toISOString()} />
              </div>
              {currentSession?.meetingUrl ? (
                <a
                  href={currentSession.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full justify-center rounded-xl bg-zinc-100 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white"
                >
                  Join session
                </a>
              ) : (
                <p className="mt-4 text-xs text-zinc-500">
                  Meeting link posted before Thursday.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 text-center">
              <ProgressRing completed={completedCount} total={TOTAL_WEEKS} />
              <p className="mt-3 text-sm text-zinc-400">
                {streak > 0
                  ? `${streak}-week streak — keep it going`
                  : `${completedCount} of ${TOTAL_WEEKS} preps done`}
              </p>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 text-sm">
              <h3 className="font-medium text-zinc-300">Quick facts</h3>
              <dl className="mt-3 space-y-2 text-zinc-500">
                <div className="flex justify-between gap-2">
                  <dt>Schedule</dt>
                  <dd className="text-zinc-300">Thu 11AM CST</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Prep time</dt>
                  <dd className="text-zinc-300">~8 min / week</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Your tier</dt>
                  <dd className="text-zinc-300">${profile?.tier ?? "1000"}</dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
