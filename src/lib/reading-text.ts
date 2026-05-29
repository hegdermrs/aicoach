import type { SessionReading } from "@/lib/types";

export function readingToSpeechText(reading: SessionReading): string {
  if (reading.script?.trim()) {
    return reading.script.trim();
  }

  return reading.sections
    .flatMap((section) => section.paragraphs)
    .join("\n\n");
}
