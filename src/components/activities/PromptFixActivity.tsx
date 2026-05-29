"use client";

import { useState } from "react";
import { OptionButtons } from "./OptionButtons";

interface PromptFixActivityProps {
  steps: Array<{
    weakPrompt: string;
    question: string;
    options: string[];
    correctIndex: number;
    feedback: string;
  }>;
  onComplete: (responses: Record<string, unknown>) => void;
}

export function PromptFixActivity({ steps, onComplete }: PromptFixActivityProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  function handleSelect(index: number) {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    setAnswers((prev) => [...prev, index]);
  }

  function handleNext() {
    if (isLast) {
      onComplete({ answers });
      return;
    }
    setStepIndex((i) => i + 1);
    setSelected(null);
    setShowResult(false);
  }

  return (
    <div className="space-y-6">
      <div className="text-xs text-zinc-500">
        Prompt {stepIndex + 1} of {steps.length}
      </div>
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-4">
        <p className="text-xs uppercase tracking-wide text-amber-500/80">Prompt</p>
        <p className="mt-2 font-mono text-sm text-zinc-200">{step.weakPrompt}</p>
      </div>
      <h2 className="text-lg font-semibold text-zinc-50">{step.question}</h2>
      <OptionButtons
        options={step.options}
        selected={selected}
        correctIndex={step.correctIndex}
        showResult={showResult}
        onSelect={handleSelect}
      />
      {showResult && (
        <div className="space-y-4">
          <p className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-300">
            {step.feedback}
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
          >
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
