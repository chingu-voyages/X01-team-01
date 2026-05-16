import { useHistory } from "@/hooks/useHistory";
import { Prompt } from "@/types/history";
import PromptCard from "./PromptCard";
import Link from "next/link";
import { useState } from "react";

interface HistoryListProps {
  allData: Prompt[];
  onDataChange: (newData: Prompt[]) => void;
}

export default function HistoryList({
  allData,
  onDataChange,
}: HistoryListProps) {
  const { visiblePrompts, setVisiblePrompts, loadMore, hasMore } =
    useHistory(allData);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  function handleDelete(uid: string) {
    if (window.confirm("Are you sure you want to delete this prompt?")) {
      //filter local state to remove the item
      setVisiblePrompts((prev) => prev.filter((p) => p.uid !== uid));

      //notify parent of changes
      const updatedMaster = allData.filter((p) => p.uid !== uid);
      onDataChange(updatedMaster);

      //close modal
      setSelectedPrompt(null);
    }
  }

  function handleDuplicate(prompt: Prompt) {
    const duplicatedPrompt: Prompt = {
      ...prompt,
      uid: `copy-${Date.now()}`, //unique ID for the copy
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }), //the date is "today"
    };

    //duplicate item is added to the top of the list
    setVisiblePrompts((prev) => [duplicatedPrompt, ...prev]);

    //notify parent of change
    const updatedMaster = [duplicatedPrompt, ...allData];
    onDataChange(updatedMaster);

    //close the modal so the user sees the list
    setSelectedPrompt(null);
  }

  function handleToggleFavorite(uid: string) {
    //update list state
    setVisiblePrompts((prev) =>
      prev.map((p) =>
        p.uid === uid ? { ...p, isFavourite: !p.isFavourite } : p
      ),
    );

    //notify parent of changes
    const updatedMaster = allData.map((p) =>
      p.uid === uid ? { ...p, isFavorite: !p.isFavourite } : p
    );
    onDataChange(updatedMaster);

    if (selectedPrompt?.uid === uid) {
      setSelectedPrompt((prev) =>
        prev ? { ...prev, isFavourite: !prev.isFavourite } : null,
      );
    }
  }

  //empty state
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
    );
  }

  //render 3 cards
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {visiblePrompts.map((item) => (
          <PromptCard
            key={item.uid}
            data={item}
            onClick={setSelectedPrompt}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>

      {/* load 3 more cards */}
      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full py-2 mt-4 text-sm font-medium border rounded-md hover:bg-gray-100 transition-colors"
        >
          Load More
        </button>
      )}

      {/* detailed view */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] flex flex-col p-6">
            {/* modal header */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedPrompt.task}</h2>
              <button
                onClick={() => setSelectedPrompt(null)}
                className="text-gray-500 hover:text-black"
              >
                X
              </button>
            </div>

            {/* modal body */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-sm my-4 text-justify">
              <div>
                <strong>Persona: </strong>
                {selectedPrompt.persona}
              </div>
              <div>
                <strong>Context: </strong>
                {selectedPrompt.context}
              </div>
              <div>
                <strong>Task: </strong>
                {selectedPrompt.task}
              </div>
              <div>
                <strong>Output: </strong>
                {selectedPrompt.output}
              </div>
              <div>
                <strong>Constraints: </strong>
                {selectedPrompt.constraints}
              </div>
              <div className="p-3 bg-gray-50 rounded border text-justify">
                <strong>Prompt: </strong>
                <p className="mt-2 whitespace-pre-wrap">
                  {selectedPrompt.prompt}
                </p>
              </div>
            </div>

            {/* modal footer - actions */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 pt-4 border-t">
              <button
                onClick={() => handleToggleFavorite(selectedPrompt.uid)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPrompt.isFavourite
                    ? "bg-yellow-400 text-white hover:bg-yellow-500"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {selectedPrompt.isFavourite ? "★ Favourited" : "☆ Favourite"}
              </button>
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
                Edit
              </button>
              <button
                onClick={() => handleDuplicate(selectedPrompt)}
                className="px-3 py-1 bg-green-100 text-green-700 rounded"
              >
                Duplicate
              </button>
              <button
                onClick={() => handleDelete(selectedPrompt.uid)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
