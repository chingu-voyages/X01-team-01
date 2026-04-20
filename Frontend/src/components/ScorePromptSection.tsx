import { FormValues } from "@/app/(main)/home/page";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";

interface ScorePromptSectionProps {
  formValues: FormValues;
}

export default function ScorePromptSection({
  formValues,
}: ScorePromptSectionProps) {
  //all gemini
  //get score for each category and display it in the progress bar
  //Suggested improuve propmt
  console.log(formValues);
  return (
    <>
      <Button variant={"default"} className="mt-4">
        Score my Prompt
      </Button>
      US-E01 — Score my prompt across three dimensions
      <Card className="flex flex-col gap-2 mt-4 container">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-medium">Clarity</span>
          <Progress value={66} id="progress-upload" className="h-2" />
          <span className="text-sm font-medium">label</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-medium">Specificity</span>
          <Progress value={66} id="progress-upload" className="h-2" />
          <span className="text-sm font-medium">label</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-medium">Format guidance</span>
          <Progress value={66} id="progress-upload" className="h-2" />
          <span className="text-sm font-medium">label</span>
        </div>
      </Card>
      {/* US-E02 — Receive a suggested improved prompt */}
      <Card className="flex flex-col gap-2 mt-4 container">
        <CardContent>
          {" "}
          Some really really good prompt suggestion here US-E02 — Receive a
          suggested improved prompt
        </CardContent>
        <Button variant={"outline"} className="w-full">
          use this prompt
        </Button>
      </Card>
    </>
  );
}
