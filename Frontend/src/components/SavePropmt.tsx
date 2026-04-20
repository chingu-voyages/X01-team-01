import Link from "next/link";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export default function SavePrompt({ prompt }: { prompt: string }) {
  console.log("Prompt to save:", prompt);
  return (
    <Card className="container m-4">
      Rate and save prompts and results
      <Link href="/history">
        <Button variant={"secondary"}>Save Prompt</Button>
      </Link>
    </Card>
  );
}
