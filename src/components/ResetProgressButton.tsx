"use client";

import { useState, useTransition } from "react";
import { resetAdminPrepProgress } from "@/lib/actions";

export function ResetProgressButton() {
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleReset() {
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await resetAdminPrepProgress();
      if (result.error) {
        setError(result.error);
        return;
      }

      setConfirming(false);
      setMessage(
        result.deleted === 0
          ? "No prep progress on your account to reset."
          : `Cleared ${result.deleted} week${result.deleted === 1 ? "" : "s"} from your account. You can retake any prep.`,
      );
    });
  }

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
      <h2 className="text-sm font-medium text-zinc-100">Reset your prep (admin testing)</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Clears only <span className="text-zinc-300">your</span> completed preps so you can
        test weeks again. Member progress is not affected.
      </p>

      {!confirming ? (
        <button
          type="button"
          onClick={() => {
            setConfirming(true);
            setMessage(null);
            setError(null);
          }}
          className="mt-4 rounded-lg border border-amber-500/30 px-4 py-2 text-sm font-medium text-amber-200 hover:bg-amber-500/10"
        >
          Reset my progress
        </button>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-sm text-amber-100/90">Clear your prep completions?</p>
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
          >
            {isPending ? "Resetting…" : "Yes, reset mine"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200"
          >
            Cancel
          </button>
        </div>
      )}

      {message && <p className="mt-3 text-sm text-emerald-400">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </div>
  );
}
