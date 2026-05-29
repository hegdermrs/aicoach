export interface CurriculumModule {
  id: number;
  title: string;
  subtitle: string;
  weeks: number[];
}

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 1,
    title: "Demystifying AI",
    subtitle: "Buzzwords, players, and your glossary",
    weeks: [1, 2],
  },
  {
    id: 2,
    title: "How AI Models Work",
    subtitle: "What AI can do, prompts, and limits",
    weeks: [3, 4],
  },
  {
    id: 3,
    title: "AI Strategy for Business",
    subtitle: "ROI, first project, and where AI fits",
    weeks: [5, 6],
  },
  {
    id: 4,
    title: "Tools You'll Actually Use",
    subtitle: "Prompting, email, voice, automation, agents",
    weeks: [7, 8],
  },
  {
    id: 5,
    title: "Cost, Privacy & Security",
    subtitle: "Pricing, API traps, and safe usage",
    weeks: [9],
  },
  {
    id: 6,
    title: "Team Adoption",
    subtitle: "Roll out AI without chaos",
    weeks: [10],
  },
  {
    id: 7,
    title: "Myth-Busting & FAQ",
    subtitle: "Honest answers before you scale",
    weeks: [11],
  },
  {
    id: 8,
    title: "Your AI Stack",
    subtitle: "90-day plan + mastermind prep",
    weeks: [12],
  },
];

export function getModuleForWeek(week: number): CurriculumModule | undefined {
  return CURRICULUM_MODULES.find((m) => m.weeks.includes(week));
}
