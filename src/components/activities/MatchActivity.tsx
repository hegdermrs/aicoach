"use client";

import { useMemo, useState } from "react";

interface MatchActivityProps {
  steps: Array<{
    instruction: string;
    pairs: Array<{ tool: string; useCase: string }>;
  }>;
  onComplete: (responses: Record<string, unknown>) => void;
}

export function MatchActivity({ steps, onComplete }: MatchActivityProps) {
  const step = steps[0];
  const tools = useMemo(() => step.pairs.map((p) => p.tool), [step.pairs]);
  const useCases = useMemo(
    () => [...step.pairs.map((p) => p.useCase)].reverse(),
    [step.pairs],
  );

  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [wrongUseCase, setWrongUseCase] = useState<string | null>(null);

  const correctMap = useMemo(
    () => Object.fromEntries(step.pairs.map((p) => [p.tool, p.useCase])),
    [step.pairs],
  );

  const allMatched = tools.every((tool) => matches[tool]);

  function handleToolClick(tool: string) {
    if (matches[tool]) return;
    setSelectedTool(tool);
    setWrongUseCase(null);
  }

  function handleUseCaseClick(useCase: string) {
    if (!selectedTool) return;
    if (Object.values(matches).includes(useCase)) return;

    if (correctMap[selectedTool] === useCase) {
      setMatches((prev) => ({ ...prev, [selectedTool]: useCase }));
      setSelectedTool(null);
      setWrongUseCase(null);
    } else {
      setWrongUseCase(useCase);
    }
  }

  function handleFinish() {
    onComplete({ matches });
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">{step.instruction}</p>
      <p className="text-xs text-zinc-500">
        Tap a tool, then tap its matching use case.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Tools</p>
          {tools.map((tool) => {
            const matched = matches[tool];
            const isSelected = selectedTool === tool;
            return (
              <button
                key={tool}
                type="button"
                onClick={() => handleToolClick(tool)}
                disabled={!!matched}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${
                  matched
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : isSelected
                      ? "border-emerald-500 bg-emerald-500/10 text-zinc-50"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-200 hover:border-zinc-700"
                }`}
              >
                {tool}
                {matched && (
                  <span className="mt-1 block text-xs text-emerald-400/80">
                    → {matched}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Use cases</p>
          {useCases.map((useCase) => {
            const isUsed = Object.values(matches).includes(useCase);
            const isWrong = wrongUseCase === useCase;
            return (
              <button
                key={useCase}
                type="button"
                onClick={() => handleUseCaseClick(useCase)}
                disabled={isUsed || !selectedTool}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${
                  isUsed
                    ? "border-zinc-900 bg-zinc-950 text-zinc-600"
                    : isWrong
                      ? "border-red-500/50 bg-red-500/10 text-red-300"
                      : selectedTool
                        ? "border-zinc-800 bg-zinc-900/50 text-zinc-200 hover:border-zinc-700"
                        : "border-zinc-900 bg-zinc-950/50 text-zinc-500"
                }`}
              >
                {useCase}
              </button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <button
          type="button"
          onClick={handleFinish}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Finish
        </button>
      )}
    </div>
  );
}
