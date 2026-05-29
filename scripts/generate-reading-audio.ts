import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { generateReadingAudioBuffer } from "../src/lib/reading-audio-generate";
import { uploadReadingAudio } from "../src/lib/reading-audio-storage";
import { TOTAL_WEEKS } from "../src/lib/sessions";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1).trim();
    } else {
      const commentIndex = value.indexOf(" #");
      if (commentIndex !== -1) {
        value = value.slice(0, commentIndex).trim();
      }
    }

    if (!process.env[key]) {
      process.env[key] = value.trim();
    }
  }
}

function parseWeekArg(): number | null {
  const weekArg = process.argv.find((arg) => arg.startsWith("--week="));
  if (!weekArg) return null;

  const week = Number(weekArg.split("=")[1]);
  if (!Number.isInteger(week) || week < 1 || week > TOTAL_WEEKS) {
    throw new Error(`Invalid --week value. Use --week=1 through --week=${TOTAL_WEEKS}.`);
  }

  return week;
}

async function generateWeek(week: number) {
  console.log(`Generating Week ${week}…`);
  const buffer = await generateReadingAudioBuffer(week);
  await uploadReadingAudio(week, buffer);
  console.log(`Uploaded week-${String(week).padStart(2, "0")}.mp3 (${buffer.length} bytes)`);
}

async function main() {
  loadEnvLocal();

  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("Missing ELEVENLABS_API_KEY in .env.local");
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }

  const singleWeek = parseWeekArg();
  const weeks = singleWeek ? [singleWeek] : Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);

  for (const week of weeks) {
    await generateWeek(week);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
