const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
const DEFAULT_MODEL_ID = "eleven_flash_v2_5";
const MAX_CHARS_PER_REQUEST = 4500;

function env(name: string): string | undefined {
  const value = process.env[name];
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function isElevenLabsConfigured(): boolean {
  return Boolean(env("ELEVENLABS_API_KEY"));
}

export async function synthesizeSpeech(text: string): Promise<ArrayBuffer> {
  const apiKey = env("ELEVENLABS_API_KEY");
  if (!apiKey) {
    throw new Error("ElevenLabs is not configured");
  }

  const voiceId = env("ELEVENLABS_VOICE_ID") ?? DEFAULT_VOICE_ID;
  const modelId = env("ELEVENLABS_MODEL_ID") ?? DEFAULT_MODEL_ID;

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
      }),
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`ElevenLabs error (${res.status}): ${detail}`);
  }

  return res.arrayBuffer();
}

export function chunkTextForSpeech(text: string): string[] {
  if (text.length <= MAX_CHARS_PER_REQUEST) {
    return [text];
  }

  const chunks: string[] = [];
  const blocks = text.split("\n\n");
  let current = "";

  for (const block of blocks) {
    const next = current ? `${current}\n\n${block}` : block;
    if (next.length > MAX_CHARS_PER_REQUEST) {
      if (current) chunks.push(current);
      current = block;
    } else {
      current = next;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}
