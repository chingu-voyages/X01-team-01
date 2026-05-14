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

 missing_elements: z.array(
    z.object({
      requirement: z.string(),
      issue: z.string(),
    })
  ),

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

Each missing element MUST include:

- requirement:
  the exact requirement that was expected

- issue:
  a concise explanation of how the response failed to satisfy it

Good example:
{
  "requirement": "Four-verse rap structure",
  "issue": "The response used prose paragraphs instead of four verses."
}

Bad example:
{
  "requirement": "Needs work",
  "issue": "Could be better"
}

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
  - directly request ONLY the missing element, without restating the original prompt structure
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

## REQUIRED PRE-CHECK STEP

Before evaluating the response, you MUST internally extract and verify all required obligations from the Pentagram prompt.

You MUST identify:

- required subject matter
- required formatting
- required structure
- required tone/persona behavior
- required constraints
- prohibited behavior
- required depth/detail

You MUST compare the response against this extracted checklist.

If any requirement is missing, weakened, partially satisfied, or ignored,
it MUST be reported in missing_elements.

Do NOT assume the response is correct simply because it addresses the general topic.

You are acting as a strict QA reviewer, not a supportive assistant.

## STRICT EVALUATION RULES

A response is NOT "Fully answered" if:
- any explicit constraint was ignored
- any requested format was violated
- persona behavior was absent
- required structure was incomplete
- requested detail/depth was missing

Even if the general topic was addressed correctly,
missing prompt requirements MUST reduce the score.

## STRICT FAILURE DETECTION

When uncertain between:
- "Fully answered"
and
- "Partially answered"

You MUST choose "Partially answered".

Do NOT give credit for implied compliance.

Only mark a requirement as satisfied if it is explicitly present in the response.

## AI RESPONSE TO EVALUATE

"""
${response}
"""

## NEGATIVE CONSTRAINT (CRITICAL)

STRICT PROHIBITIONS:
- Do NOT repeat or restate Persona
- Do NOT repeat Context
- Do NOT repeat Output format requirements
- Do NOT re-describe the full task
- Do NOT reconstruct the original Pentagram prompt
- Do NOT bundle multiple missing fields into one instruction

The follow-up must ONLY address the specific missing element.

If multiple elements are missing, choose the MOST IMPORTANT one only.

## STYLE RULE

Bad:
"Rewrite the response as a four-verse rap with a humorous tone and add stronger reasoning"

Good:
"Add clearer justification for the ethical trade-off in the decision"

## OUTPUT (STRICT JSON ONLY)

{
  "completeness": "Fully answered" | "Partially answered" | "Did not answer",

  "format_compliance": string,

  "missing_elements": [
  {
    "requirement": string,
    "issue": string
  }
],

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
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
          throw new Error("No valid JSON found in Gemini response");
        }

        parsed = JSON.parse(jsonMatch[0]);
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