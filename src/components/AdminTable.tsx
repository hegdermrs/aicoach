"use client";

import { useMemo } from "react";
import type { PrepCompletion, Profile } from "@/lib/types";
import { TOTAL_WEEKS } from "@/lib/sessions";

interface AdminTableProps {
  profiles: Profile[];
  completions: PrepCompletion[];
}

export function AdminTable({ profiles, completions }: AdminTableProps) {
  const completionMap = useMemo(() => {
    const map = new Map<string, Set<number>>();
    for (const c of completions) {
      if (!map.has(c.user_id)) map.set(c.user_id, new Set());
      map.get(c.user_id)!.add(c.week_number);
    }
    return map;
  }, [completions]);

  function exportCsv() {
    const headers = [
      "Name",
      "Email",
      "Tier",
      ...Array.from({ length: TOTAL_WEEKS }, (_, i) => `Week ${i + 1}`),
    ];

    const rows = profiles.map((profile) => {
      const done = completionMap.get(profile.id) ?? new Set();
      return [
        profile.name,
        profile.email,
        profile.tier,
        ...Array.from({ length: TOTAL_WEEKS }, (_, i) =>
          done.has(i + 1) ? "Yes" : "No",
        ),
      ];
    });

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "prep-completions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Tier</th>
              {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
                <th key={i} className="px-2 py-3 text-center font-medium">
                  W{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => {
              const done = completionMap.get(profile.id) ?? new Set();
              return (
                <tr key={profile.id} className="border-b border-zinc-900">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-200">{profile.name}</div>
                    <div className="text-xs text-zinc-500">{profile.email}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">${profile.tier}</td>
                  {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
                    <td key={i} className="px-2 py-3 text-center">
                      {done.has(i + 1) ? (
                        <span className="text-emerald-400">✓</span>
                      ) : (
                        <span className="text-zinc-700">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
