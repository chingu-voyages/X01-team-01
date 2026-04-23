import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    //throw new Error("Forced test error");
    const body = await req.json();
    const { prompt } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    /*const evaluatorPrompt = `
      You are an expert prompt engineering evaluator.

      Evaluate the following prompt across three dimensions:
      1. Clarity (0–10)
      2. Specificity (0–10)
      3. Format Guidance (0–10)

      Rules:
      - Be strict and consistent
      - Use the full 0–10 range
      - Respond with ONLY raw JSON
      - Do NOT include markdown, code fences, or explanations outside JSON

      Return this exact shape:

      {
        "clarity": number,
        "specificity": number,
        "format_guidance": number,
        "summary": "short explanation"
      }

      Prompt:
      ${prompt}
      `;*/

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
    /*let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      // fallback if Gemini wraps JSON in markdown
      const cleaned = text.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    return NextResponse.json(parsed);*/
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
}