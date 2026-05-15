import { Prompt } from "@/types/history";

interface PromptCardProps {
  data: Prompt;
  onClick: (data: Prompt) => void;
}

export default function PromptCard({ data, onClick }: PromptCardProps) {
  return (
    <article
      className="bg-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-300 transition-colors"
      onClick={() => onClick(data)}
    >
      <div className="text-xs pb-4">{data.date}</div>
      <div className="text-base pb-2 font-semibold">{data.task}</div>
      <div className="text-sm line-clamp-3">{data.prompt}</div>
    </article>
  );
}
