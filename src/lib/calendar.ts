export const TIMEZONE = "America/Chicago";
export const SESSION_HOUR = 11;
export const SESSION_MINUTE = 0;

/** Mastermind sessions — every Thursday at 11:00 AM CST, starting May 28, 2026 */
export const SESSION_CALENDAR: { week: number; date: string }[] = [
  { week: 1, date: "2026-05-28" },
  { week: 2, date: "2026-06-04" },
  { week: 3, date: "2026-06-11" },
  { week: 4, date: "2026-06-18" },
  { week: 5, date: "2026-06-25" },
  { week: 6, date: "2026-07-02" },
  { week: 7, date: "2026-07-09" },
  { week: 8, date: "2026-07-16" },
  { week: 9, date: "2026-07-23" },
  { week: 10, date: "2026-07-30" },
  { week: 11, date: "2026-08-06" },
  { week: 12, date: "2026-08-13" },
];

export const COHORT_START = SESSION_CALENDAR[0].date;

interface ChicagoParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

function getChicagoParts(date: Date): ChicagoParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((p) => [p.type, p.value]),
  );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

function chicagoToDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour + 6, minute, 0));

  for (let offset = -30; offset <= 30; offset++) {
    const test = new Date(guess.getTime() + offset * 3600000);
    const parts = getChicagoParts(test);
    if (
      parts.year === year &&
      parts.month === month &&
      parts.day === day &&
      parts.hour === hour &&
      parts.minute === minute
    ) {
      return test;
    }
  }

  return guess;
}

function parseCalendarDate(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

export function getSessionDateTime(week: number): Date {
  const entry = SESSION_CALENDAR.find((s) => s.week === week);
  if (!entry) {
    throw new Error(`Invalid week: ${week}`);
  }
  const { year, month, day } = parseCalendarDate(entry.date);
  return chicagoToDate(year, month, day, SESSION_HOUR, SESSION_MINUTE);
}

export function getCurrentWeek(now: Date = new Date()): number {
  let sessionsPassed = 0;

  for (const session of SESSION_CALENDAR) {
    if (now.getTime() >= getSessionDateTime(session.week).getTime()) {
      sessionsPassed++;
    }
  }

  return Math.min(Math.max(sessionsPassed + 1, 1), SESSION_CALENDAR.length);
}

export function getNextSessionDate(now: Date = new Date()): Date {
  for (const session of SESSION_CALENDAR) {
    const sessionAt = getSessionDateTime(session.week);
    if (sessionAt.getTime() > now.getTime()) {
      return sessionAt;
    }
  }

  return getSessionDateTime(SESSION_CALENDAR.length);
}

export function formatSessionCountdown(
  target: Date,
  now: Date = new Date(),
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
} {
  const totalMs = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(totalMs / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMs,
  };
}

export function formatSessionLabel(date: Date): string {
  const datePart = date.toLocaleString("en-US", {
    timeZone: TIMEZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return `${datePart} · ${SESSION_HOUR}:${String(SESSION_MINUTE).padStart(2, "0")} AM CST`;
}

export function formatSessionDate(week: number): string {
  const entry = SESSION_CALENDAR.find((s) => s.week === week);
  if (!entry) return "";

  const { year, month, day } = parseCalendarDate(entry.date);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  return date.toLocaleDateString("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function getSessionCalendarDate(week: number): string | undefined {
  return SESSION_CALENDAR.find((s) => s.week === week)?.date;
}
