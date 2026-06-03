import { Prompt } from "@/types/history";

interface PromptCardProps {
  data: Prompt;
  onClick: (data: Prompt) => void;
  onToggleFavourite: (uid: string) => void;
}

export default function PromptCard({
  data,
  onClick,
  onToggleFavourite,
}: PromptCardProps) {
  return (
    <article
      className="relative bg-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-300 transition-colors"
      onClick={() => onClick(data)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); //prevents opening the modal
          onToggleFavourite(data.uid);
        }}
        className="absolute top-4 right-4 text-xl hover:scale-110 transition-transform"
      >
        {data.favorite ? "★" : "☆"}
      </button>
      <div className="text-xs pb-4">
        {new Date(data.created_at.seconds * 1000).toLocaleDateString()}
      </div>
      <div className="text-base pb-2 font-semibold">{data.title}</div>
      <div className="text-sm line-clamp-3">{data.gemini_result}</div>
    </article>
  );
}
