"use client";

import { useState, useTransition } from "react";
import type { SessionContent } from "@/lib/types";
import { completePrep } from "@/lib/actions";
import { QuizActivity } from "./activities/QuizActivity";
import { ScenarioActivity } from "./activities/ScenarioActivity";
import { PromptFixActivity } from "./activities/PromptFixActivity";
import { MatchActivity } from "./activities/MatchActivity";
import { ReflectActivity } from "./activities/ReflectActivity";
import { CompleteScreen } from "./CompleteScreen";
import { ReadingMaterial } from "./ReadingMaterial";

interface ActivityPlayerProps {
  session: SessionContent;
  alreadyComplete: boolean;
  readingAudioUrl: string | null;
  isAdmin?: boolean;
}

export function ActivityPlayer({
  session,
  alreadyComplete,
  readingAudioUrl,
  isAdmin = false,
}: ActivityPlayerProps) {
  const [phase, setPhase] = useState<"reading" | "activity">(
    !isAdmin && alreadyComplete ? "activity" : "reading",
  );
  const [finished, setFinished] = useState(!isAdmin && alreadyComplete);
  const [retakeKey, setRetakeKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleRetake() {
    setFinished(false);
    setPhase("reading");
    setError(null);
    setRetakeKey((key) => key + 1);
  }

  function handleComplete(responses: Record<string, unknown>) {
    startTransition(async () => {
      const result = await completePrep(session.week, responses);
      if (result.error) {
        setError(result.error);
        return;
      }
      setFinished(true);
    });
  }

  if (finished) {
    return (
      <CompleteScreen
        session={session}
        isAdmin={isAdmin}
        onRetake={isAdmin ? handleRetake : undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {phase === "activity" && (
            <button
              type="button"
              onClick={() => setPhase("reading")}
              className="text-zinc-400 hover:text-zinc-200"
            >
              ← Back to listen
            </button>
          )}
          {isAdmin && (
            <button
              type="button"
              onClick={handleRetake}
              className="text-amber-400/80 hover:text-amber-300"
            >
              Restart prep
            </button>
          )}
        </div>
        <span className="text-xs text-zinc-500">
          {phase === "reading" ? "Step 1: Listen & read" : "Step 2: Activity"}
        </span>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-500">
          Week {session.week} · ~{session.durationMinutes} min total
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-50">
          {session.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {session.plainEnglishSummary}
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          ~{session.reading.readingMinutes} min listen + read · ~5 min activity
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {isPending && (
        <p className="text-sm text-zinc-500">Saving your progress…</p>
      )}

      {phase === "reading" ? (
        <ReadingMaterial
          reading={session.reading}
          sessionTitle={session.title}
          readingAudioUrl={readingAudioUrl}
          onContinue={() => setPhase("activity")}
        />
      ) : (
        <>
          {session.type === "quiz" && (
            <QuizActivity
              key={retakeKey}
              steps={session.steps as Parameters<typeof QuizActivity>[0]["steps"]}
              onComplete={handleComplete}
            />
          )}
          {session.type === "scenario" && (
            <ScenarioActivity
              key={retakeKey}
              steps={session.steps as Parameters<typeof ScenarioActivity>[0]["steps"]}
              onComplete={handleComplete}
            />
          )}
          {session.type === "promptFix" && (
            <PromptFixActivity
              key={retakeKey}
              steps={session.steps as Parameters<typeof PromptFixActivity>[0]["steps"]}
              onComplete={handleComplete}
            />
          )}
          {session.type === "match" && (
            <MatchActivity
              key={retakeKey}
              steps={session.steps as Parameters<typeof MatchActivity>[0]["steps"]}
              onComplete={handleComplete}
            />
          )}
          {session.type === "reflect" && (
            <ReflectActivity
              key={retakeKey}
              steps={session.steps as Parameters<typeof ReflectActivity>[0]["steps"]}
              onComplete={handleComplete}
            />
          )}
        </>
      )}
    </div>
  );
}
