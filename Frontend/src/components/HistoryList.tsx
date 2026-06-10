import { useHistory } from "@/hooks/useHistory";
import type { Prompt } from "@/types/history";
import PromptCard from "./PromptCard";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setEntireForm } from "@/redux/features/pentagramSlice";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface HistoryListProps {
  allData: Prompt[];
  onDataChange: (newData: Prompt[]) => void;
  currentView: string | null;
  searchQuery: string;
}

export default function HistoryList({
  allData,
  onDataChange,
  currentView,
  searchQuery,
}: HistoryListProps) {
  const { visiblePrompts, setVisiblePrompts, loadMore, hasMore } =
    useHistory(allData);

  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  console.log("allData FROM FIREBASE:", allData);
  console.log("visiblePrompts FROM HOOK:", visiblePrompts);

  const dispatch = useDispatch();
  const router = useRouter();

  // filter favourites (Firestore version)
  /*const displayedPrompts = visiblePrompts.filter((item) => {
    if (currentView === "favourites") {
      return item.favorite;
    }
    return true;
  });*/
  const displayedPrompts = allData
    .filter((item) => {
      // favourites filter
      if (currentView === "favourites") {
        return item.favorite;
      }
      return true;
    })
    .filter((item) => {
      // search filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();

      return (
        item.title?.toLowerCase().includes(q) ||
        item.fields?.persona?.toLowerCase().includes(q) ||
        item.fields?.task?.toLowerCase().includes(q) ||
        item.fields?.context?.toLowerCase().includes(q) ||
        item.fields?.output?.toLowerCase().includes(q) ||
        item.fields?.constraint?.toLowerCase().includes(q) ||
        item.gemini_result?.toLowerCase().includes(q)
      );
    });

  async function handleDelete(uid: string) {
    if (!window.confirm("Are you sure you want to delete this prompt?\nDeleting will affect your statistics in Prompt Analytics.")) return;

    try {
      const deletedPrompt = allData.find((p) => p.uid === uid);

      // 1. Delete from Firestore
      await deleteDoc(doc(db, "prompt_drafts", uid));

      // 2. Update local state
      setVisiblePrompts((prev) => prev.filter((p) => p.uid !== uid));

      const updatedMaster = allData.filter((p) => p.uid !== uid);
      onDataChange(updatedMaster);

      setSelectedPrompt(null);

      // 3. If deleted prompt was active, assign new current_doc
      if (deletedPrompt?.current_doc && updatedMaster.length > 0) {
        const newCurrent = [...updatedMaster].sort((a, b) => {
          const aTime =
            a.updated_at?.seconds ?? new Date(a.updated_at).getTime();
          const bTime =
            b.updated_at?.seconds ?? new Date(b.updated_at).getTime();

          return bTime - aTime; // newest first
        })[0];

        await updateDoc(doc(db, "prompt_drafts", newCurrent.uid), {
          current_doc: true,
          updated_at: serverTimestamp(),
        });

        const finalMaster = updatedMaster.map((p) => ({
          ...p,
          current_doc: p.uid === newCurrent.uid,
        }));

        onDataChange(finalMaster);
        setVisiblePrompts(finalMaster);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  async function handleDuplicate(prompt: Prompt) {
    try {
      if (!prompt.user_id) return;

      // 1. Create the duplicate FIRST
      const newDocRef = await addDoc(collection(db, "prompt_drafts"), {
        user_id: prompt.user_id,

        title: `${prompt.title} (Copy)`,

        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),

        fields: { ...prompt.fields },

        score: {
          clarity: prompt.score?.clarity ?? null,
          specificity: prompt.score?.specificity ?? null,
          format_guidance: prompt.score?.format_guidance ?? null,
          overall: prompt.score?.overall ?? null,
        },

        gemini_result: prompt.gemini_result || "",

        favorite: false,

        words: prompt.words || 0,

        current_doc: true,
      });

      await updateDoc(newDocRef, {
        uid: newDocRef.id,
      });

      // 2. THEN unset all other current docs
      const q = query(
        collection(db, "prompt_drafts"),
        where("user_id", "==", prompt.user_id),
      );

      const snapshot = await getDocs(q);

      await Promise.all(
        snapshot.docs
          .filter((d) => d.id !== newDocRef.id) // IMPORTANT: don't touch the new one
          .map((d) =>
            updateDoc(d.ref, {
              current_doc: false,
              updated_at: serverTimestamp(),
            }),
          ),
      );

      // 3. update UI
      const duplicated: Prompt = {
        ...prompt,
        uid: newDocRef.id,
        title: `${prompt.title} (Copy)`,
        favorite: false,
        current_doc: true,
      };

      setVisiblePrompts((prev) => [duplicated, ...prev]);
      onDataChange([duplicated, ...allData]);
      setSelectedPrompt(null);
    } catch (err) {
      console.error("Duplicate failed:", err);
    }
  }

  async function handleToggleFavourite(uid: string) {
    const newValue = !allData.find((p) => p.uid === uid)?.favorite;

    // 1. update Firestore
    await updateDoc(doc(db, "prompt_drafts", uid), {
      favorite: newValue,
    });

    // 2. update visible state
    setVisiblePrompts((prev) =>
      prev.map((p) => (p.uid === uid ? { ...p, favorite: newValue } : p)),
    );

    // 3. update master state
    const updatedMaster = allData.map((p) =>
      p.uid === uid ? { ...p, favorite: newValue } : p,
    );

    onDataChange(updatedMaster);

    // 4. update modal if open
    if (selectedPrompt?.uid === uid) {
      setSelectedPrompt((prev) =>
        prev ? { ...prev, favorite: newValue } : null,
      );
    }
  }

  if (allData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5">
        <p className="text-gray-500 mb-4">No prompts saved yet</p>
        <Link
          href="/home"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/60 transition-colors duration-200"
        >
          Assemble a Prompt!
        </Link>
      </div>
    );
  }

  if (currentView === "favourites" && displayedPrompts.length === 0) {
    return (
      <div className="relative bg-primary/10 border border-dashed border-primary/20 rounded-xl p-4 min-h-30 flex items-center justify-center select-none">
        {/* Ghost favorite icon indicator */}
        <div className="absolute top-2 right-2 text-xl p-1.5 rounded-lg border border-primary/5 bg-background/30 text-gray-300">
          ☆
        </div>

        {/* Content matching the prompt card alignment */}
        <div className="text-center space-y-1">
          <h3 className="text-base font-semibold tracking-tight text-gray-400">
            No favorites yet
          </h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Star your best prompts to save them here for quick access.
          </p>
        </div>
      </div>
    );
  }

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

      {hasMore && currentView !== "favourites" && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            className="w-full sm:w-2xl h-11 mt-6 text-sm font-semibold tracking-wide border-primary/20 bg-background hover:bg-primary/5 text-primary rounded-xl shadow-xs transition-all duration-200"
          >
            Load More
          </Button>
        </div>
      )}

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
                  {selectedPrompt.title}
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
                    {selectedPrompt?.fields.persona}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100/80">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400 block mb-1">
                    Context
                  </span>
                  <p className="text-gray-800 font-medium">
                    {selectedPrompt?.fields.context}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100/80">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400 block mb-1">
                    Task
                  </span>
                  <p className="text-gray-800 font-medium">
                    {selectedPrompt?.fields.task}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100/80">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400 block mb-1">
                    Output
                  </span>
                  <p className="text-gray-800 font-medium">
                    {selectedPrompt?.fields.output}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100/80">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400 block mb-1">
                    Constraints
                  </span>
                  <p className="text-gray-800 font-medium">
                    {selectedPrompt?.fields.constraint}
                  </p>
                </div>
              </div>

              {/* prompt */}
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-[10px] text-primary block">
                  Generated Prompt
                </span>
                <p className="text-sm text-gray-900 font-mono leading-relaxed whitespace-pre-wrap select-all">
                  {selectedPrompt?.gemini_result}
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
                    selectedPrompt?.favorite
                      ? "bg-amber-50 border-amber-200/60 text-amber-700 hover:bg-amber-100/70"
                      : ""
                  }`}
                >
                  {selectedPrompt?.favorite ? "★ Favourited" : "☆ Favourite"}
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
                  onClick={async () => {
                    const selectedId = selectedPrompt.uid;

                    const updates = allData.map(async (p) => {
                      await updateDoc(doc(db, "prompt_drafts", p.uid), {
                        current_doc: p.uid === selectedId,
                      });
                    });

                    await Promise.all(updates);

                    const updated = allData.map((p) => ({
                      ...p,
                      current_doc: p.uid === selectedId,
                    }));

                    onDataChange(updated);

                    dispatch(
                      setEntireForm({
                        persona: selectedPrompt.fields.persona,
                        context: selectedPrompt.fields.context,
                        task: selectedPrompt.fields.task,
                        output: selectedPrompt.fields.output,
                        constraints: selectedPrompt.fields.constraint,
                      }),
                    );

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
