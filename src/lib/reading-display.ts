import type { SessionReading } from "@/lib/types";

export function readingDisplayParagraphs(reading: SessionReading): string[] {
  if (reading.script?.trim()) {
    return reading.script
      .trim()
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  return reading.sections.flatMap((section) => section.paragraphs);
}
