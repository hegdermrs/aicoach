export type Tier = "1000" | "3500";

export type ActivityType = "quiz" | "scenario" | "promptFix" | "match" | "reflect";

export interface QuizStep {
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}

export interface ScenarioStep {
  situation: string;
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}

export interface PromptFixStep {
  weakPrompt: string;
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}

export interface MatchPair {
  tool: string;
  useCase: string;
}

export interface MatchStep {
  instruction: string;
  pairs: MatchPair[];
}

export interface ReflectStep {
  question: string;
  placeholder: string;
}

export type ActivityStep =
  | QuizStep
  | ScenarioStep
  | PromptFixStep
  | MatchStep
  | ReflectStep;

export interface ReadingSection {
  heading: string;
  paragraphs: string[];
}

export interface SessionReading {
  readingMinutes: number;
  /** Full spoken narration — source of truth for audio generation */
  script: string;
  sections: ReadingSection[];
}

export interface SessionContent {
  week: number;
  title: string;
  plainEnglishSummary: string;
  durationMinutes: number;
  reading: SessionReading;
  type: ActivityType;
  meetingUrl?: string;
  discussPrompts?: string[];
  steps: ActivityStep[];
  takeaway: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  tier: Tier;
  cohort_start: string;
  is_admin: boolean;
}

export interface PrepCompletion {
  id: string;
  user_id: string;
  week_number: number;
  completed_at: string;
  responses: Record<string, unknown>;
}

export interface InviteCode {
  id: string;
  code: string;
  tier: Tier;
  cohort_start: string;
  reusable: boolean;
  used_at: string | null;
  used_by: string | null;
  created_at: string;
}

export type PrepStatus = "not_started" | "complete";
