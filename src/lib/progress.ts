import type { PrepCompletion } from "./types";
import { getCurrentWeek, TOTAL_WEEKS } from "./sessions";

export function getCompletedWeeks(completions: PrepCompletion[]): Set<number> {
  return new Set(completions.map((c) => c.week_number));
}

export function getCompletionCount(completions: PrepCompletion[]): number {
  return getCompletedWeeks(completions).size;
}

export function getCompletionPercent(completions: PrepCompletion[]): number {
  return Math.round((getCompletionCount(completions) / TOTAL_WEEKS) * 100);
}

export function isWeekComplete(
  week: number,
  completions: PrepCompletion[],
): boolean {
  return getCompletedWeeks(completions).has(week);
}

export function calculateStreak(completions: PrepCompletion[]): number {
  const completed = getCompletedWeeks(completions);
  const currentWeek = getCurrentWeek();
  let streak = 0;

  for (let week = currentWeek; week >= 1; week--) {
    if (completed.has(week)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
