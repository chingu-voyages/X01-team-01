import { Prompt } from "@/types/history";

interface PromptCardProps {
  data: Prompt;
  onClick: (data: Prompt) => void;
  onToggleFavorite: (uid: string) => void;
}

export default function PromptCard({
  data,
  onClick,
  onToggleFavorite,
}: PromptCardProps) {
  return (
    <article
      className="relative bg-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-300 transition-colors"
      onClick={() => onClick(data)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); //prevents opening the modal
          onToggleFavorite(data.uid);
        }}
        className="absolute top-4 right-4 text-xl hover:scale-110 transition-transform"
      >
        {data.isFavourite ? "★" : "☆"}
      </button>
      <div className="text-xs pb-4">{data.date}</div>
      <div className="text-base pb-2 font-semibold">{data.task}</div>
      <div className="text-sm line-clamp-3">{data.prompt}</div>
    </article>
  );
}
