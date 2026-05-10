import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const EvaluationSchema = z.object({
  completeness: z.enum([
    "Fully answered",
    "Partially answered",
    "Did not answer",
  ]),

  format_compliance: z.string(),

  missing_elements: z.array(z.string()),

  suggested_follow_up: z.string().nullable(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      persona,
      context,
      task,
      output,
      constraint,
      response,
    } = body;

    // ✅ Validate input early
    if (
      !persona ||
      !context ||
      !task ||
      !output ||
      !constraint ||
      !response
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
You are a deterministic AI response evaluator.

Your task is to determine whether the AI response successfully fulfilled the user's Pentagram prompt requirements.

You MUST follow the rubric and output format EXACTLY.

## COMPLETENESS RUBRIC

"Fully answered"
- The response satisfies all major task requirements
- Includes requested details, structure, and constraints
- No important omissions detected

"Partially answered"
- The response addresses the main task
- BUT misses important details, constraints, formatting, or requested depth

"Did not answer"
- The response misunderstands, ignores, or fails the core task

## FORMAT COMPLIANCE RULES

Return:
- "Format matched"
OR
- "Format not followed — [specific mismatch]"

Examples:
- "Format not followed — response was paragraph-based instead of bullet points"
- "Format not followed — missing requested JSON structure"

## MISSING ELEMENT RULES

- Compare the response against ALL Pentagram fields:
  persona
  context
  task
  output
  constraint

- Only identify REAL missing requirements
- Do NOT invent requirements
- Return an empty array if nothing important is missing

## FOLLOW-UP RULES

- NEVER return an empty string ("") for suggested_follow_up. Use null instead.

- If missing_elements is empty:
  suggested_follow_up MUST be null

- Otherwise:
  suggested_follow_up MUST:
  - be concise
  - be copy-ready
  - directly request the missing information
  - start with an action-oriented instruction

Good example:
"Expand the response with a step-by-step implementation plan for authentication."

Bad example:
"Can you add more detail?"

## PENTAGRAM PROMPT

Persona:
"${persona}"

Context:
"${context}"

Task:
"${task}"

Output:
"${output}"

Constraint:
"${constraint}"

## AI RESPONSE TO EVALUATE

"""
${response}
"""

## OUTPUT (STRICT JSON ONLY)

{
  "completeness": "Fully answered" | "Partially answered" | "Did not answer",

  "format_compliance": string,

  "missing_elements": string[],

  "suggested_follow_up": string | null
}
`;

    const result = await model.generateContent(evaluatorPrompt);

    const geminiResponse = await result.response;

    const text = geminiResponse.text();

    // ✅ Safe parsing
    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    parsed.suggested_follow_up =
    typeof parsed.suggested_follow_up === "string" &&
    parsed.suggested_follow_up.trim().length > 0
        ? parsed.suggested_follow_up
        : null;

    // ✅ Strict validation
    const validated = EvaluationSchema.parse(parsed);

    return NextResponse.json(validated);
  } catch (error) {
    console.error("Evaluation error:", error);

    return NextResponse.json(
      { error: "Unable to evaluate response" },
      { status: 500 }
    );
  }
}