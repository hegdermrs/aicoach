import { chunkTextForSpeech, synthesizeSpeech } from "@/lib/elevenlabs";
import { readingToSpeechText } from "@/lib/reading-text";
import { getSession } from "@/lib/sessions";

export async function generateReadingAudioBuffer(week: number): Promise<Buffer> {
  const session = getSession(week);
  if (!session) {
    throw new Error(`No session for week ${week}`);
  }

  const text = readingToSpeechText(session.reading);
  const chunks = chunkTextForSpeech(text);
  const audioParts: ArrayBuffer[] = [];

  for (const chunk of chunks) {
    audioParts.push(await synthesizeSpeech(chunk));
  }

  return Buffer.concat(audioParts.map((part) => Buffer.from(part)));
}
