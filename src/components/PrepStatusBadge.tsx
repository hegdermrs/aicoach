interface PrepStatusBadgeProps {
  complete: boolean;
}

export function PrepStatusBadge({ complete }: PrepStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        complete
          ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
          : "bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700"
      }`}
    >
      {complete ? "Complete" : "Not started"}
    </span>
  );
}
