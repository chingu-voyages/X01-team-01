import { useHistory } from "@/hooks/useHistory";
import { Prompt } from "@/types/history";
import PromptCard from "./PromptCard";

interface HistoryListProps {
  allData: Prompt[];
}

export default function HistoryListProps({ allData }: HistoryListProps) {
  const { visiblePrompts, loadMore, hasMore } = useHistory(allData);

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {visiblePrompts.map((item) => (
          <PromptCard key={item.uid} data={item} />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full py-2 mt-4 text-sm font-medium border rounded-md hover:bg-gray-100 transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
}
