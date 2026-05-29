"use client";

interface OptionButtonsProps {
  options: string[];
  selected: number | null;
  correctIndex: number;
  showResult: boolean;
  onSelect: (index: number) => void;
}

export function OptionButtons({
  options,
  selected,
  correctIndex,
  showResult,
  onSelect,
}: OptionButtonsProps) {
  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        let className =
          "w-full rounded-xl border px-4 py-3 text-left text-sm transition ";

        if (!showResult) {
          className +=
            selected === index
              ? "border-emerald-500 bg-emerald-500/10 text-zinc-50"
              : "border-zinc-800 bg-zinc-900/50 text-zinc-200 hover:border-zinc-700";
        } else if (index === correctIndex) {
          className += "border-emerald-500 bg-emerald-500/10 text-emerald-300";
        } else if (selected === index) {
          className += "border-red-500/50 bg-red-500/10 text-red-300";
        } else {
          className += "border-zinc-800 bg-zinc-900/30 text-zinc-500";
        }

        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(index)}
            disabled={showResult}
            className={className}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
