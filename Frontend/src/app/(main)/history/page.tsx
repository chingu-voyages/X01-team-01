"use client";

import { useState,useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HistoryList from "@/components/HistoryList";
//import { mockHistoryData } from "@/app/utils/mockHistoryData";
import AnalyticsSection from "@/components/AnalyticsSection";
import HistoryDashboard from "@/components/HistoryDashboard";
import HistoryTabs from "@/components/HistoryTabs";
import GuestEmptyPage from "@/components/GuestEmptyPage";
import { useAppSelector } from "@/redux/hooks";
import ProfileSection from "@/components/ProfileSection";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

import type { Prompt } from "@/types/history";

export default function HistoryPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const id = user?.id;

  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const searchParams = useSearchParams();

  //search
  const [searchQuery, setSearchQuery] = useState("");

  //current user status
  const status = useAppSelector((state) => state.auth.status);
  const isGuest = status === "guest";

  if (isGuest) {
    return <GuestEmptyPage />;
  }

  //real-time favourite count
  const favouritesCount = allPrompts.filter(
    (prompt) => prompt.favorite,
  ).length;

  //current view
  const currentView = searchParams.get("view");

  //fetches-data-from-firebase
  useEffect(() => {
      if (!id) return;

      async function loadPrompts() {
        try {
          const q = query(
            collection(db, "prompt_drafts"),
            where("user_id", "==", id)
          );

          const snapshot = await getDocs(q);

          console.log("RAW FIREBASE SNAPSHOT SIZE:", snapshot.size);
          console.log("RAW FIREBASE DOCS (UNMAPPED):");

          const prompts: Prompt[] = snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
              uid: doc.id,
              user_id: data.user_id,

              created_at: data.created_at,
              updated_at: data.updated_at,

              title: data.title,
              fields: {
                persona: data.fields?.persona ?? "",
                context: data.fields?.context ?? "",
                task: data.fields?.task ?? "",
                output: data.fields?.output ?? "",
                constraint: data.fields?.constraint ?? "",
              },

              score: {
                clarity: data.score?.clarity ?? null,
                specificity: data.score?.specificity ?? null,
                format_guidance: data.score?.format_guidance ?? null,
                overall: data.score?.overall ?? null,
              },

              gemini_result: data.gemini_result ?? "",
              favorite: data.favorite ?? false,
              words: data.words ?? 0,
              current_doc: data.current_doc ?? false,
            };
          });

          setAllPrompts(prompts);
        } catch (error) {
          console.error("Failed to load prompts:", error);
        }
      }

      loadPrompts();
    }, [id]);
  

  return (
    <div className="container mx-auto py-6">
      <ProfileSection />
      <AnalyticsSection />
      <HistoryDashboard prompts={allPrompts} />
      <HistoryTabs favouritesCount={favouritesCount} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <HistoryList
        allData={allPrompts}
        onDataChange={setAllPrompts}
        currentView={currentView}
        searchQuery={searchQuery}
      />
    </div>
  );
}
