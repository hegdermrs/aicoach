"use client";

import { useEffect, useState } from "react";
import { formatSessionCountdown } from "@/lib/calendar";

interface CountdownTimerProps {
  targetAt: string;
}

export function CountdownTimer({ targetAt }: CountdownTimerProps) {
  const target = new Date(targetAt);

  const [countdown, setCountdown] = useState(() =>
    formatSessionCountdown(target),
  );

  useEffect(() => {
    const sessionAt = new Date(targetAt);
    const tick = () => setCountdown(formatSessionCountdown(sessionAt));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetAt]);

  const units = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Min", value: countdown.minutes },
    { label: "Sec", value: countdown.seconds },
  ];

  const { totalMs } = countdown;

  if (totalMs <= 0) {
    return (
      <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-emerald-300">
        Live session window — see you in the room
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-2 py-3 text-center"
          >
            <div className="text-xl font-semibold tabular-nums text-zinc-50 sm:text-2xl">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500 sm:text-xs">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-zinc-500">
        {countdown.days > 0
          ? `${countdown.days} day${countdown.days === 1 ? "" : "s"}, ${countdown.hours} hr until session`
          : countdown.hours > 0
            ? `${countdown.hours} hr, ${countdown.minutes} min until session`
            : `${countdown.minutes} min, ${countdown.seconds} sec until session`}
      </p>
    </div>
  );
}
