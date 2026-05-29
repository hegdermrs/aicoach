"use client";

import { readingDisplayParagraphs } from "@/lib/reading-display";
import type { SessionReading } from "@/lib/types";
import { ReadingAudioPlayer } from "./ReadingAudioPlayer";

interface ReadingMaterialProps {
  reading: SessionReading;
  sessionTitle: string;
  readingAudioUrl: string | null;
  onContinue: () => void;
}

export function ReadingMaterial({
  reading,
  sessionTitle,
  readingAudioUrl,
  onContinue,
}: ReadingMaterialProps) {
  const paragraphs = readingDisplayParagraphs(reading);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
          Prep · ~{reading.readingMinutes} min listen + read
        </p>
        <h2 className="mt-2 text-xl font-semibold text-zinc-50">{sessionTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          The text below matches the audio word for word. Listen and read along, then
          continue to the short activity.
        </p>
      </div>

      {readingAudioUrl ? (
        <ReadingAudioPlayer
          audioUrl={readingAudioUrl}
          readingMinutes={reading.readingMinutes}
        />
      ) : (
        <p className="rounded-xl border border-zinc-800 bg-zinc-900/20 px-4 py-3 text-sm text-zinc-500">
          Audio not uploaded yet. Read below, then run{" "}
          <code className="text-zinc-400">npm run generate:audio</code> after editing
          scripts.
        </p>
      )}

      <article className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
        <div className="space-y-4">
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-sm leading-relaxed text-zinc-300"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      <button
        type="button"
        onClick={onContinue}
        className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-500 sm:w-auto sm:px-8"
      >
        Done — start activity
      </button>
    </div>
  );
}
