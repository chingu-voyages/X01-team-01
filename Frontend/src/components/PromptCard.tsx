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
      className="relative bg-primary/10 border border-primary/30 rounded-xl p-4 cursor-pointer hover:bg-primary/20 hover:shadow-md transition-all duration-200 group"
      onClick={() => onClick(data)}
    >
      {/* favourite toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation(); //prevents opening the modal
          onToggleFavourite(data.uid);
        }}
        className="absolute top-2 right-2 text-xl p-1.5 rounded-lg bg-background/50 backdrop-blur-xs border border-primary/10 hover:scale-110 active:scale-95 transition-all text-yellow-500"
        aria-label={
          data.isFavourite ? "Remove from favorites" : "Add to favorites"
        }
      >
        {data.isFavourite ? "★" : "☆"}
      </button>

      {/* content */}
      <div className="space-y-2 pr-8">
        {/* date */}
        <div className="text-xs font-mono text-gray-400 tracking-tight">
          {data.date}
        </div>

        {/* task title */}
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-gray-900 group-hover:text-primary transition-colors">
          {data.task}
        </h3>

        {/* prompt snippet */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {data.prompt}
        </p>
      </div>
    </article>
  );
}
