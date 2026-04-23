export const FIELDS = [
  {
    id: "persona",
    label: "Persona",
    placeholder: "e.g. Senior Copywriter at a tech startup",
    help: "Give the AI a role with real expertise. The more specific the better. Example: You are a senior UX writer at a tech startup.",
  },
  {
    id: "context",
    label: "Context",
    placeholder:
      "e.g. I am writing for first-time homebuyers who do not understand mortgage terms",
    help: "Give the AI the background it needs. What is the situation and who is the audience? Example: I have a 500-word onboarding email that users find confusing. The audience is non-technical",
  },
  {
    id: "task",
    label: "Task (The Core Objective)",
    placeholder:
      "e.g. Rewrite the hero section to focus on saving time not features",
    help: "Tell the AI exactly what to do. Start with a verb and keep it to one clear action. Example: Rewrite the onboarding email so it feels friendly and easy to scan.",
  },
  {
    id: "output",
    label: "Output Format",
    placeholder: "e.g. Two short paragraphs, punchy tone, no bullet points",
    help: "Tell the AI how you want the response to look. Be as specific as you can. Example: One short paragraph followed by 3 bullet points. Plain text, no markdown.",
  },
  {
    id: "constraint",
    label: "Constraints",
    placeholder: "e.g. Avoid jargon, keep under 100 words, no passive voice",
    help: "Set the rules. Word limits, tone, things to avoid. Example: Keep it under 120 words. No jargon. Do not mention pricing.",
  },
] as const;

export type FieldId = (typeof FIELDS)[number]["id"];
