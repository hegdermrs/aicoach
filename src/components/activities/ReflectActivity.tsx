"use client";

import { useState } from "react";

interface ReflectActivityProps {
  steps: Array<{
    question: string;
    placeholder: string;
  }>;
  onComplete: (responses: Record<string, unknown>) => void;
}

export function ReflectActivity({ steps, onComplete }: ReflectActivityProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  function handleNext() {
    const updated = [...responses, current.trim()];
    setResponses(updated);
    setCurrent("");

    if (isLast) {
      onComplete({
        reflections: updated,
      });
      return;
    }

    setStepIndex((i) => i + 1);
  }

  return (
    <div className="space-y-6">
      <div className="text-xs text-zinc-500">
        Reflection {stepIndex + 1} of {steps.length}
      </div>
      <h2 className="text-lg font-semibold text-zinc-50">{step.question}</h2>
      <textarea
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        placeholder={step.placeholder}
        rows={3}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
      />
      <p className="text-xs text-zinc-500">
        One sentence is enough — or skip with a blank answer.
      </p>
      <button
        type="button"
        onClick={handleNext}
        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
      >
        {isLast ? "Finish" : "Next"}
      </button>
    </div>
  );
}
