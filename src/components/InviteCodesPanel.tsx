"use client";

import { useState, useTransition } from "react";
import { createInviteCode } from "@/lib/actions";
import { COHORT_START } from "@/lib/calendar";
import type { InviteCode, Tier } from "@/lib/types";

interface InviteCodesPanelProps {
  codes: InviteCode[];
}

export function InviteCodesPanel({ codes }: InviteCodesPanelProps) {
  const [tier, setTier] = useState<Tier>("1000");
  const [cohortStart, setCohortStart] = useState(COHORT_START);
  const [newCode, setNewCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNewCode(null);

    startTransition(async () => {
      const result = await createInviteCode({ tier, cohortStart });
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.code) {
        setNewCode(result.code);
      }
    });
  }

  return (
    <section className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-50">Invite codes</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Generate a code and send it to a member. Each code works once.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="tier" className="block text-xs text-zinc-500">
            Tier
          </label>
          <select
            id="tier"
            value={tier}
            onChange={(e) => setTier(e.target.value as Tier)}
            className="mt-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          >
            <option value="1000">$1000</option>
            <option value="3500">$3500</option>
          </select>
        </div>
        <div>
          <label htmlFor="cohortStart" className="block text-xs text-zinc-500">
            Cohort start
          </label>
          <input
            id="cohortStart"
            type="date"
            value={cohortStart}
            onChange={(e) => setCohortStart(e.target.value)}
            className="mt-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {isPending ? "Generating…" : "Generate code"}
        </button>
      </form>

      {newCode && (
        <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 font-mono text-lg tracking-widest text-emerald-300">
          {newCode}
        </p>
      )}

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Tier</th>
              <th className="px-4 py-3 font-medium">Cohort</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                  No invite codes yet.
                </td>
              </tr>
            ) : (
              codes.map((code) => (
                <tr key={code.id} className="border-b border-zinc-900">
                  <td className="px-4 py-3 font-mono text-zinc-200">{code.code}</td>
                  <td className="px-4 py-3 text-zinc-300">${code.tier}</td>
                  <td className="px-4 py-3 text-zinc-400">{code.cohort_start}</td>
                  <td className="px-4 py-3">
                    {code.reusable ? (
                      <span className="text-emerald-400">Unlimited</span>
                    ) : code.used_at ? (
                      <span className="text-zinc-500">Used</span>
                    ) : (
                      <span className="text-emerald-400">Available</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
