import { Prompt } from "@/types/history";

interface PromptCardProps {
  data: Prompt;
}

export default function PromptCard({ data }: PromptCardProps) {
  return (
    <article className="bg-gray-200 rounded-md p-4">
      <div className="text-xs pb-4">{data.date}</div>
      <div className="text-base pb-2">{data.task}</div>
      <div className="text-sm">{data.prompt}</div>
    </article>
  );
}
