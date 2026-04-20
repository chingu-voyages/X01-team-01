import { Card } from "./ui/card";

export default function EvaluateAiResponse({
  aiResponse,
}: {
  aiResponse: string;
}) {
  console.log("AI Response:", aiResponse);
  return (
    <Card className="container m-4"> US-E03 — Evaluate AI output quality</Card>
  );
}
