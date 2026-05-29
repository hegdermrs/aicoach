import week01 from "@/content/sessions/week-01.json";
import week02 from "@/content/sessions/week-02.json";
import week03 from "@/content/sessions/week-03.json";
import week04 from "@/content/sessions/week-04.json";
import week05 from "@/content/sessions/week-05.json";
import week06 from "@/content/sessions/week-06.json";
import week07 from "@/content/sessions/week-07.json";
import week08 from "@/content/sessions/week-08.json";
import week09 from "@/content/sessions/week-09.json";
import week10 from "@/content/sessions/week-10.json";
import week11 from "@/content/sessions/week-11.json";
import week12 from "@/content/sessions/week-12.json";
import { getCurrentWeek as getCalendarWeek } from "./calendar";
import type { SessionContent } from "./types";

const SESSIONS: SessionContent[] = [
  week01,
  week02,
  week03,
  week04,
  week05,
  week06,
  week07,
  week08,
  week09,
  week10,
  week11,
  week12,
] as SessionContent[];

export const TOTAL_WEEKS = 12;

export function getAllSessions(): SessionContent[] {
  return SESSIONS;
}

export function getSession(week: number): SessionContent | undefined {
  return SESSIONS.find((s) => s.week === week);
}

export function getCurrentWeek(now?: Date): number {
  return getCalendarWeek(now);
}

export function isWeekUnlocked(
  week: number,
  options?: { isAdmin?: boolean; now?: Date },
): boolean {
  if (options?.isAdmin) return true;
  return week <= getCurrentWeek(options?.now);
}

export function getUnlockedWeeks(now?: Date): number {
  return getCurrentWeek(now);
}
