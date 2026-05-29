"use client";

import Link from "next/link";
import type { SessionContent } from "@/lib/types";

interface CompleteScreenProps {
  session: SessionContent;
  isAdmin?: boolean;
  onRetake?: () => void;
}

export function CompleteScreen({ session, isAdmin, onRetake }: CompleteScreenProps) {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
          <span className="text-2xl text-emerald-400">✓</span>
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-zinc-50">Prep complete</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {session.takeaway}
        </p>
        <p className="mt-4 text-sm font-medium text-emerald-400">
          You&apos;re ready for Thursday.
        </p>
      </div>

      {session.discussPrompts && session.discussPrompts.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-4 text-left">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Come prepared to discuss
          </p>
          <ul className="mt-3 space-y-2">
            {session.discussPrompts.map((prompt) => (
              <li key={prompt} className="text-sm text-zinc-300">
                • {prompt}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href="/dashboard"
        className="block w-full rounded-xl bg-emerald-600 py-3 text-center text-sm font-medium text-white hover:bg-emerald-500"
      >
        Back to dashboard
      </Link>

      {isAdmin && onRetake && (
        <button
          type="button"
          onClick={onRetake}
          className="block w-full rounded-xl border border-amber-500/30 bg-amber-500/10 py-3 text-center text-sm font-medium text-amber-200 hover:bg-amber-500/15"
        >
          Retake prep (admin test)
        </button>
      )}
    </div>
  );
}
