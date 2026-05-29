import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const READING_AUDIO_BUCKET = "reading-audio";

export function readingAudioObjectPath(week: number): string {
  return `week-${String(week).padStart(2, "0")}.mp3`;
}

export async function getReadingAudioSignedUrl(
  week: number,
  expiresIn = 60 * 60 * 4,
): Promise<string | null> {
  const supabase = await createClient();
  const path = readingAudioObjectPath(week);

  const { data, error } = await supabase.storage
    .from(READING_AUDIO_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) return null;
  return data.signedUrl;
}

export async function uploadReadingAudio(
  week: number,
  buffer: Buffer,
): Promise<void> {
  const admin = createAdminClient();
  const path = readingAudioObjectPath(week);

  const { error } = await admin.storage
    .from(READING_AUDIO_BUCKET)
    .upload(path, buffer, {
      contentType: "audio/mpeg",
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }
}
