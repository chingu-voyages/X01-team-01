import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// Local ai endpoint for testing if gemini api is not working or to test with local ai
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();

//     const res = await fetch("http://localhost:11434/api/generate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         model: "qwen2.5:1.5b",
//         prompt,
//         stream: false,
//       }),
//     });

//     if (!res.ok) throw new Error("Local ai error");

//     const data = await res.json();
//     return NextResponse.json({ text: data.response });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 },
//     );
//   }
//}
