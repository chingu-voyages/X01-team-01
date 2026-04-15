export const FIELDS = [
  {
    id: "persona",
    label: "Persona",
    placeholder:
      "Who should the AI be? (e.g. Senior Copywriter,Physics Professor...)",
  },
  {
    id: "context",
    label: "Context",
    placeholder:
      "Provide background info, relevant data, or the specific scenario...",
  },
  {
    id: "task",
    label: "Task (The Core Objective)",
    placeholder:
      "What exactly do you want the AI to do? Be explicit and direct.",
  },
  {
    id: "output",
    label: "Output Format",
    placeholder: "Desired structure: Markdown, JSON, List, Narrative, Code...",
  },
  {
    id: "constraint",
    label: "Constraints",
    placeholder: "Avoid jargon, keep under 300 words, no passive voice...",
  },
] as const;

export type FieldId = (typeof FIELDS)[number]["id"];
