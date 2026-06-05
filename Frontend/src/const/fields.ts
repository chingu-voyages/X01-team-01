export const FIELDS = [
  {
    id: "persona",
    label: "Persona",
    placeholder: "e.g. Senior UX Writer at a fintech startup",
    help: "Assign an expert role and perspective to the AI. Formula: 'You are a [Job Title] specializing in [Niche].'",
  },
  {
    id: "context",
    label: "Context",
    placeholder:
      "e.g. Launching a mobile app for first-time investors who find finance confusing",
    help: "Provide the background, scenario, and target audience. Explain *who* this is for and *why* you are creating it.",
  },
  {
    id: "task",
    label: "Task (The Core Objective)",
    placeholder:
      "e.g. Rewrite the homepage hero section to focus on emotional benefits over features",
    help: "State the exact action the AI must take. Start with a strong action verb (e.g., Rewrite, Draft, Analyze) and stick to one primary goal.",
  },
  {
    id: "output",
    label: "Output Format",
    placeholder:
      "e.g. A Markdown table with 3 columns, followed by a 50-word summary paragraph",
    help: "Define the structure, length, and layout of the response. Specify structural elements like paragraphs, bullet points, code blocks, or tables.",
  },
  {
    id: "constraint",
    label: "Constraints",
    placeholder:
      "e.g., Maximum 150 words, do not use corporate jargon, omit pricing details",
    help: "Establish the boundaries and negative guardrails. Clearly list what the AI *must not* do, stylistic limitations, or strict word caps.",
  },
] as const;

export type FieldId = (typeof FIELDS)[number]["id"];
