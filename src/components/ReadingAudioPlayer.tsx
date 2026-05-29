"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ReadingAudioPlayerProps {
  audioUrl: string;
  readingMinutes: number;
}

type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function ReadingAudioPlayer({
  audioUrl,
  readingMinutes,
}: ReadingAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setStatus("idle");
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = audioUrl;
    audio.preload = "metadata";
    audio.load();

    return () => {
      audio.pause();
    };
  }, [audioUrl]);

  async function handlePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    setError(null);

    if (status === "paused") {
      try {
        await audio.play();
        setStatus("playing");
      } catch {
        setStatus("error");
        setError("Could not resume playback.");
      }
      return;
    }

    setStatus("loading");

    try {
      await audio.play();
      setStatus("playing");
    } catch {
      setStatus("error");
      setError("Could not start playback. Tap play to try again.");
    }
  }

  function handlePause() {
    audioRef.current?.pause();
    setStatus("paused");
  }

  function handleSeek(event: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const nextTime = (Number(event.target.value) / 100) * duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  const isActive = status === "playing" || status === "paused";

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
      <audio
        ref={audioRef}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onEnded={() => setStatus("idle")}
        onError={() => {
          setStatus("error");
          setError("Audio not found — run npm run generate:audio after updating scripts.");
        }}
        onPlaying={() => setStatus("playing")}
        onWaiting={() => {
          if (status !== "paused") setStatus("loading");
        }}
      />

      <div className="flex flex-wrap items-center gap-4">
        {!isActive ? (
          <button
            type="button"
            onClick={handlePlay}
            disabled={status === "loading"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-50"
            aria-label={status === "loading" ? "Loading audio" : "Play"}
          >
            {status === "loading" ? "…" : "▶"}
          </button>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            {status === "playing" ? (
              <button
                type="button"
                onClick={handlePause}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200"
              >
                Pause
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePlay}
                className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm text-white"
              >
                Resume
              </button>
            )}
            <button
              type="button"
              onClick={stop}
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-300"
            >
              Restart
            </button>
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-medium text-sky-300">Listen while you read</p>
            <p className="shrink-0 text-xs tabular-nums text-zinc-500">
              {formatTime(currentTime)} / {duration ? formatTime(duration) : `~${readingMinutes}:00`}
            </p>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={handleSeek}
            disabled={!duration}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-sky-500 disabled:opacity-40"
            aria-label="Audio progress"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
    </div>
  );
}
