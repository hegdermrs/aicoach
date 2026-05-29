"use client";

import { useState } from "react";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  correct?: boolean;
  showResult: boolean;
  onClick: () => void;
}

function OptionButton({
  label,
  selected,
  correct,
  showResult,
  onClick,
}: OptionButtonProps) {
  let className =
    "w-full rounded-xl border px-4 py-3 text-left text-sm transition ";

  if (!showResult) {
    className += selected
      ? "border-emerald-500 bg-emerald-500/10 text-zinc-50"
      : "border-zinc-800 bg-zinc-900/50 text-zinc-200 hover:border-zinc-700";
  } else if (correct) {
    className += "border-emerald-500 bg-emerald-500/10 text-emerald-300";
  } else if (selected) {
    className += "border-red-500/50 bg-red-500/10 text-red-300";
  } else {
    className += "border-zinc-800 bg-zinc-900/30 text-zinc-500";
  }

  return (
    <button type="button" onClick={onClick} disabled={showResult} className={className}>
      {label}
    </button>
  );
}

interface QuizActivityProps {
  steps: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    feedback: string;
  }>;
  onComplete: (responses: Record<string, unknown>) => void;
}

export function QuizActivity({ steps, onComplete }: QuizActivityProps) {
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
        Question {stepIndex + 1} of {steps.length}
      </div>
      <h2 className="text-xl font-semibold text-zinc-50">{step.question}</h2>
      <div className="space-y-3">
        {step.options.map((option, index) => (
          <OptionButton
            key={option}
            label={option}
            selected={selected === index}
            correct={index === step.correctIndex}
            showResult={showResult}
            onClick={() => handleSelect(index)}
          />
        ))}
      </div>
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
