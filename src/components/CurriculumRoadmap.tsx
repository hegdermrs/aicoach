import Link from "next/link";
import { formatSessionDate } from "@/lib/calendar";
import { CURRICULUM_MODULES } from "@/lib/curriculum";
import { isWeekUnlocked } from "@/lib/sessions";
import { isWeekComplete } from "@/lib/progress";
import type { SessionContent } from "@/lib/types";
import type { PrepCompletion } from "@/lib/types";

interface CurriculumRoadmapProps {
  sessions: SessionContent[];
  completions: PrepCompletion[];
  currentWeek: number;
  isAdmin: boolean;
}

export function CurriculumRoadmap({
  sessions,
  completions,
  currentWeek,
  isAdmin,
}: CurriculumRoadmapProps) {
  const sessionMap = new Map(sessions.map((s) => [s.week, s]));
  const unlockOptions = { isAdmin };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-50">Your 12-week curriculum</h2>
        <p className="mt-1 text-sm text-zinc-400">
          ~8 minutes prep before each Thursday session. Listen and read along, then a short activity.
          You&apos;re on{" "}
          <span className="text-zinc-200">Week {currentWeek}</span>.
        </p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        <li className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3">
          <p className="text-xs font-medium text-emerald-500">1 · Before Thursday</p>
          <p className="mt-1 text-sm text-zinc-300">Listen to this week&apos;s prep (~8 min)</p>
        </li>
        <li className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3">
          <p className="text-xs font-medium text-emerald-500">2 · Thursday 11AM CST</p>
          <p className="mt-1 text-sm text-zinc-300">Show up to mastermind ready</p>
        </li>
        <li className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3">
          <p className="text-xs font-medium text-emerald-500">3 · After session</p>
          <p className="mt-1 text-sm text-zinc-300">Apply one thing in your business</p>
        </li>
      </ol>

      <div className="space-y-8">
        {CURRICULUM_MODULES.map((module) => (
          <div key={module.id}>
            <div className="mb-3 border-b border-zinc-800 pb-2">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Module {module.id}
              </p>
              <h3 className="text-base font-semibold text-zinc-100">{module.title}</h3>
              <p className="text-sm text-zinc-500">{module.subtitle}</p>
            </div>

            <ul className="space-y-2">
              {module.weeks.map((week) => {
                const session = sessionMap.get(week);
                if (!session) return null;

                const unlocked = isWeekUnlocked(week, unlockOptions);
                const complete = isWeekComplete(week, completions);
                const isCurrent = week === currentWeek;
                const locked = !unlocked;

                const row = (
                  <div
                    className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition ${
                      isCurrent
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : complete
                          ? "border-zinc-800/80 bg-zinc-900/20"
                          : locked
                            ? "border-zinc-900 bg-zinc-950/40 opacity-70"
                            : "border-zinc-800 bg-zinc-900/30"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                        complete
                          ? "bg-emerald-500/15 text-emerald-400"
                          : isCurrent
                            ? "bg-emerald-500 text-zinc-950"
                            : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {complete ? "✓" : week}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-zinc-500">
                        Week {week} · {formatSessionDate(week)}
                        {isCurrent && (
                          <span className="ml-2 text-emerald-400">· This week</span>
                        )}
                      </p>
                      <p className="truncate text-sm font-medium text-zinc-100">
                        {session.title}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      {locked ? (
                        <span className="text-xs text-zinc-600">Soon</span>
                      ) : complete ? (
                        <span className="text-xs text-emerald-400/80">Done</span>
                      ) : isCurrent ? (
                        <span className="text-xs font-medium text-emerald-400">
                          Listen →
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-500">Open</span>
                      )}
                    </div>
                  </div>
                );

                return (
                  <li key={week}>
                    {unlocked ? (
                      <Link href={`/prep/${week}`} className="block">
                        {row}
                      </Link>
                    ) : (
                      row
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
