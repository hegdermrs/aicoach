import Link from "next/link";
import { PrepStatusBadge } from "./PrepStatusBadge";
import { formatSessionDate } from "@/lib/calendar";
import type { SessionContent } from "@/lib/types";

interface SessionCardProps {
  session: SessionContent;
  unlocked: boolean;
  complete: boolean;
}

export function SessionCard({ session, unlocked, complete }: SessionCardProps) {
  const href = unlocked ? `/prep/${session.week}` : "#";
  const sessionDate = formatSessionDate(session.week);

  const card = (
    <div
      className={`rounded-2xl border p-5 transition ${
        unlocked
          ? "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70"
          : "border-zinc-900 bg-zinc-950/50 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-500">
            Week {session.week} · {sessionDate}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-zinc-50">
            {session.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {session.plainEnglishSummary}
          </p>
        </div>
        {!unlocked && (
          <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-500">
            Locked
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          ~{session.durationMinutes} min prep · Thu 11AM CST
        </span>
        {unlocked && <PrepStatusBadge complete={complete} />}
      </div>
    </div>
  );

  if (!unlocked) {
    return card;
  }

  return (
    <Link href={href} className="block">
      {card}
    </Link>
  );
}
