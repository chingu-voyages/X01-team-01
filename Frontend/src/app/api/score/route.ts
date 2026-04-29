import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const ScoreSchema = z.object({
  global_scores: z.object({
    clarity: z.number().min(0).max(10),
    specificity: z.number().min(0).max(10),
    format_guidance: z.number().min(0).max(10),
  }),
  overall: z.number().min(0).max(10),
  field_grades: z.object({
    persona: z.number().min(0).max(10),
    context: z.number().min(0).max(10),
    task: z.number().min(0).max(10),
    output: z.number().min(0).max(10),
    constraint: z.number().min(0).max(10),
  }),
  weakest_field: z.enum([
    "persona",
    "context",
    "task",
    "output",
    "constraint",
  ]),
  suggestion: z
    .object({
      field: z.enum([
        "persona",
        "context",
        "task",
        "output",
        "constraint",
      ]),
      original: z.string(),
      improved: z.string(),
      explanation: z.string(),
    })
    .nullable(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { persona, context, task, output, constraint } = body;

    // ✅ Validate input early
    if (
      !persona ||
      !context ||
      !task ||
      !output ||
      !constraint
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const evaluatorPrompt = `
You are a deterministic prompt evaluator. Follow instructions EXACTLY.

## SCORING RUBRIC (0–10)

Clarity:
0–2: unclear, confusing
3–5: partially clear
6–8: mostly clear
9–10: perfectly clear

Specificity:
0–2: vague
3–5: somewhat detailed
6–8: detailed
9–10: highly specific

Format Guidance:
0–2: no format
3–5: vague format
6–8: clear format
9–10: strict structured format

## TASK

1. Score EACH field individually (persona, context, task, output, constraint)
2. Compute:
   - clarity = overall clarity across all fields
   - specificity = overall specificity
   - format_guidance = quality of output instructions

3. Compute:
   overall = rounded average of (clarity + specificity + format_guidance) / 3

4. Determine weakest_field:
   - lowest field_grades value
   - if tie → choose the one that most impacts output quality

5. Suggest improvement for weakest_field:
   - improved must be more specific, clearer, and actionable
   - explanation must explain WHY it's better

6. Suggestion rules:
   - suggestion MUST be null ONLY IF:
     all global_scores >= 8 AND all field_grades > 4
   - otherwise ALWAYS return suggestion

## INPUT

persona: "${persona}"
context: "${context}"
task: "${task}"
output: "${output}"
constraint: "${constraint}"

## OUTPUT (STRICT JSON ONLY)

{
  "global_scores": {
    "clarity": number,
    "specificity": number,
    "format_guidance": number
  },
  "overall": number,
  "field_grades": {
    "persona": number,
    "context": number,
    "task": number,
    "output": number,
    "constraint": number
  },
  "weakest_field": "persona" | "context" | "task" | "output" | "constraint",
  "suggestion": {
    "field": "persona" | "context" | "task" | "output" | "constraint",
    "original": string,
    "improved": string,
    "explanation": string
  } | null
}
`;

    const result = await model.generateContent(evaluatorPrompt);
    const response = await result.response;
    const text = response.text();

    // ✅ Safe parsing
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    // ✅ Strict validation
    const validated = ScoreSchema.parse(parsed);

    return NextResponse.json(validated);
  } catch (error) {
    console.error("Scoring error:", error);
    return NextResponse.json(
      { error: "Unable to score prompt" },
      { status: 500 }
    );
  }
}


//old logic

/*export async function POST(req: Request) {
  try {
    //throw new Error("Forced test error");
    const body = await req.json();
    const { prompt } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

      const evaluatorPrompt = `
        You are an expert prompt engineering evaluator.

        Evaluate the following prompt across three dimensions:
        1. Clarity (0–10)
        2. Specificity (0–10)
        3. Format Guidance (0–10)

        Then:
        - If the prompt can be improved, provide an improved version
        - Explain the improvements as bullet points
        - If the prompt is already strong, return null for improved_prompt

        Rules:
        - Be strict and useful
        - Respond with ONLY raw JSON (no markdown)

        Return this exact format:

        {
          "clarity": number,
          "specificity": number,
          "format_guidance": number,
          "summary": "short explanation",
          "improved_prompt": "string or null",
          "changes": ["string"]
        }

        Prompt:
        ${prompt}
        `;

    const result = await model.generateContent(evaluatorPrompt);
    const response = await result.response;
    const text = response.text();
    

    // ⚠️ Critical: Safe JSON parsing
    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      try {
        const cleaned = text.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.error("Failed to parse Gemini response:", text);
        throw new Error("Invalid JSON from model");
      }
    }

    // ✅ Validate structure BEFORE returning
    if (
      typeof parsed.clarity !== "number" ||
      typeof parsed.specificity !== "number" ||
      typeof parsed.format_guidance !== "number" ||
      typeof parsed.summary !== "string"
    ) {
      console.error("Invalid response shape:", parsed);
      throw new Error("Invalid response shape");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to score prompt" },
      { status: 500 }
    );
  }
}*/