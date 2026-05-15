import { useHistory } from "@/hooks/useHistory";
import { Prompt } from "@/types/history";
import PromptCard from "./PromptCard";
import Link from "next/link";

interface HistoryListProps {
  allData: Prompt[];
}

export default function HistoryListProps({ allData }: HistoryListProps) {
  const { visiblePrompts, loadMore, hasMore } = useHistory(allData);

  if (allData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-gray-50">
        <p className="text-gray-500 mb-4">No prompts saved yet</p>
        <Link 
          href="/home"
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-200 transition-colors"
        >
          Assemble a Prompt!
        </Link>
      </div>
    )
  }

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
