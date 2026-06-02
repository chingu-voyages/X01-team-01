import { useHistory } from "@/hooks/useHistory";
import type { Prompt } from "@/types/history";
import PromptCard from "./PromptCard";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setEntireForm } from "@/redux/features/pentagramSlice";
import { useRouter } from "next/navigation";
import { doc, updateDoc, collection, addDoc, serverTimestamp,query,where,getDocs,deleteDoc} from "firebase/firestore";
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
  const displayedPrompts = visiblePrompts
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
    if (!window.confirm("Are you sure you want to delete this prompt?")) return;

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
        where("user_id", "==", prompt.user_id)
      );

      const snapshot = await getDocs(q);

      await Promise.all(
        snapshot.docs
          .filter((d) => d.id !== newDocRef.id) // IMPORTANT: don't touch the new one
          .map((d) =>
            updateDoc(d.ref, {
              current_doc: false,
              updated_at: serverTimestamp(),
            })
          )
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
      prev.map((p) =>
        p.uid === uid ? { ...p, favorite: newValue } : p
      )
    );

    // 3. update master state
    const updatedMaster = allData.map((p) =>
      p.uid === uid ? { ...p, favorite: newValue } : p
    );

    onDataChange(updatedMaster);

    // 4. update modal if open
    if (selectedPrompt?.uid === uid) {
      setSelectedPrompt((prev) =>
        prev ? { ...prev, favorite: newValue } : null
      );
    }
  }

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
        <button
          onClick={loadMore}
          className="w-full py-2 mt-4 text-sm font-medium border rounded-md hover:bg-gray-100 transition-colors"
        >
          Load More
        </button>
      )}

      {selectedPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] flex flex-col p-6">
            
            {/* header */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">
                {selectedPrompt.title}
              </h2>
              <button
                onClick={() => setSelectedPrompt(null)}
                className="text-gray-500 hover:text-black"
              >
                X
              </button>
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-sm my-4 text-justify">
              <div><strong>Persona:</strong> {selectedPrompt?.fields.persona}</div>
              <div><strong>Context:</strong> {selectedPrompt.fields.context}</div>
              <div><strong>Task:</strong> {selectedPrompt.fields.task}</div>
              <div><strong>Output:</strong> {selectedPrompt.fields.output}</div>
              <div><strong>Constraints:</strong> {selectedPrompt.fields.constraint}</div>

              <div className="p-3 bg-gray-50 rounded border">
                <strong>Gemini Result:</strong>
                <p className="mt-2 whitespace-pre-wrap">
                  {selectedPrompt.gemini_result}
                </p>
              </div>
            </div>

            {/* actions */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 pt-4 border-t">

              <button
                onClick={() => handleToggleFavourite(selectedPrompt.uid)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedPrompt.favorite
                    ? "bg-yellow-400 text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
              >
                {selectedPrompt.favorite ? "★ Favourited" : "☆ Favourite"}
              </button>

              <button
                onClick={async () => {
                  const selectedId = selectedPrompt.uid;

                  // 1. update Firestore for ALL docs
                  const updates = allData.map(async (p) => {
                    await updateDoc(doc(db, "prompt_drafts", p.uid), {
                      current_doc: p.uid === selectedId,
                    });
                  });

                  await Promise.all(updates);

                  // 2. update local state (so UI updates instantly)
                  const updated = allData.map((p) => ({
                    ...p,
                    current_doc: p.uid === selectedId,
                  }));

                  onDataChange(updated);

                  // 3. store selected form for edit page
                  const formDataForStorage = selectedPrompt.fields;

                  localStorage.setItem(
                    "pentagram_form",
                    JSON.stringify(formDataForStorage)
                  );

                  dispatch(
                    setEntireForm({
                      persona: selectedPrompt.fields.persona,
                      context: selectedPrompt.fields.context,
                      task: selectedPrompt.fields.task,
                      output: selectedPrompt.fields.output,
                      constraints: selectedPrompt.fields.constraint,
                    })
                  );

                  router.push("/home");
                }}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
              >
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