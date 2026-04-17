import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

type ResponseCardProps = {
  text?: string;
};

export default function ResponseCard({ text }: ResponseCardProps) {
  return (
    <>
      <Card className="mt-2 min-h-60">
        <CardHeader>
          <CardTitle className="text-xl">Your AI Response</CardTitle>
        </CardHeader>
        <CardContent className="font-mono">
          {text ? text : "Your response will appear here."}
        </CardContent>
      </Card>
    </>
  );
}
