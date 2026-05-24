import { useHistory } from "@/hooks/useHistory";
import { Prompt } from "@/types/history";
import PromptCard from "./PromptCard";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setEntireForm } from "@/redux/features/pentagramSlice";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

interface HistoryListProps {
  allData: Prompt[];
  onDataChange: (newData: Prompt[]) => void;
  currentView: string | null;
}

export default function HistoryList({
  allData,
  onDataChange,
  currentView,
}: HistoryListProps) {
  const { visiblePrompts, setVisiblePrompts, loadMore, hasMore } =
    useHistory(allData);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  //filter favourites
  const displayedPrompts = visiblePrompts.filter((item) => {
    if (currentView === "favourites") {
      return item.isFavourite;
    }
    return true;
  });

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

  function handleToggleFavourite(uid: string) {
    //update list state
    setVisiblePrompts((prev) =>
      prev.map((p) =>
        p.uid === uid ? { ...p, isFavourite: !p.isFavourite } : p,
      ),
    );

    //notify parent of changes
    const updatedMaster = allData.map((p) =>
      p.uid === uid ? { ...p, isFavourite: !p.isFavourite } : p,
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
        {displayedPrompts.map((item) => (
          <PromptCard
            key={item.uid}
            data={item}
            onClick={setSelectedPrompt}
            onToggleFavourite={handleToggleFavourite}
          />
        ))}
      </div>

      {/* load 3 more cards */}
      {hasMore && currentView !== "favourites" && (
        <div className="flex justify-center">
          <Button
          variant="outline"
          onClick={loadMore}
          className="w-2xl h-11 mt-6 text-sm font-semibold tracking-wide border-primary/20 bg-background hover:bg-primary/5 text-primary rounded-xl shadow-xs transition-all duration-200"
        >
          Load More
        </Button>
        </div>
        
      )}

      {/* detailed view */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-background border broder-gray-100 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            {/* modal header */}
            <div className="flex justify-between items-start mb-4 border-b border-primary/20">
              <div className="space-y-1">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  Prompt Details
                </span>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900 mt-1">
                  {selectedPrompt.task}
                </h2>
              </div>

              <button
                onClick={() => setSelectedPrompt(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium"
                aria-label="Close modal"
              >
                X
              </button>
            </div>

            {/* modal body */}
            <div className="flex-1 overflow-y-auto pr-1 my-4 space-y-2 text-sm text-gray-700 leading-relaxed">
              {/* metadata grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100/80">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400 block mb-1">
                    Persona
                  </span>
                  <p className="text-gray-800 font-medium">
                    {selectedPrompt.persona}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100/80">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400 block mb-1">
                    Context
                  </span>
                  <p className="text-gray-800 font-medium">
                    {selectedPrompt.context}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100/80">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400 block mb-1">
                    Task
                  </span>
                  <p className="text-gray-800 font-medium">
                    {selectedPrompt.task}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100/80">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400 block mb-1">
                    Output
                  </span>
                  <p className="text-gray-800 font-medium">
                    {selectedPrompt.output}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100/80">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400 block mb-1">
                    Constraints
                  </span>
                  <p className="text-gray-800 font-medium">
                    {selectedPrompt.constraints}
                  </p>
                </div>
              </div>

              {/* prompt */}
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-[10px] text-primary block">
                  Generated Prompt
                </span>
                <p className="text-sm text-gray-900 font-mono leading-relaxed whitespace-pre-wrap select-all">
                  {selectedPrompt.prompt}
                </p>
              </div>
            </div>

            {/* modal footer - actions */}
            <div className="mt-2 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 sm:flex sm:justify-around sm:items-center">
              {/* left side */}
              <div className="grid grid-cols-2 gap-2 col-span-2 sm:flex sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => handleToggleFavourite(selectedPrompt.uid)}
                  className={`flex items-center gap-2 w-full sm:w-auto h-10 px-4 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                    selectedPrompt.isFavourite
                      ? "bg-amber-50 border-amber-200/60 text-amber-700 hover:bg-amber-100/70"
                      : ""
                  }`}
                >
                  {selectedPrompt.isFavourite ? "★ Favourited" : "☆ Favourite"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDuplicate(selectedPrompt)}
                  className="w-full sm:w-auto h-10 px-4 rounded-xl text-xs font-semibold tracking-wide"
                >
                  Duplicate
                </Button>
              </div>

              {/* right side */}
              <div className="grid grid-cols-2 gap-2 col-span-2 mt-1 sm:mt-0 sm:flex sm:w-auto">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedPrompt.uid)}
                  className="w-full sm:w-auto h-10 px-4 rounded-xl text-xs font-semibold tracking-wide"
                >
                  Delete
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    const formDataForStorage = {
                      persona: selectedPrompt.persona,
                      context: selectedPrompt.context,
                      task: selectedPrompt.task,
                      output: selectedPrompt.output,
                      constraint: selectedPrompt.constraints,
                    };

                    localStorage.setItem(
                      "pentagram_form",
                      JSON.stringify(formDataForStorage),
                    );

                    dispatch(setEntireForm(selectedPrompt));
                    router.push("/home");
                  }}
                  className="w-full sm:w-auto bg-primary/70 hover:bg-primary h-10 px-6 rounded-xl text-xs font-semibold tracking-wide shadow-xs"
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
