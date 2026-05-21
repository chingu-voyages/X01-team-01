"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import HistoryList from "@/components/HistoryList";
import { mockHistoryData } from "@/app/utils/mockHistoryData";
import AnalyticsSection from "@/components/AnalyticsSection";
import HistoryDashboard from "@/components/HistoryDashboard";
import HistoryTabs from "@/components/HistoryTabs";
import GuestEmptyPage from "@/components/GuestEmptyPage";
import { useAppSelector } from "@/redux/hooks";
import ProfileSection from "@/components/ProfileSection";

export default function HistoryPage() {
  const [allPrompts, setAllPrompts] = useState(mockHistoryData);
  const searchParams = useSearchParams();

  //current user status
  const status = useAppSelector((state) => state.auth.status);
  const isGuest = status === "guest";

  if (isGuest) {
    return <GuestEmptyPage />;
  }

  //real-time favourite count
  const favoritesCount = allPrompts.filter(
    (prompt) => prompt.isFavourite,
  ).length;

  //current view
  const currentView = searchParams.get("view");

  return (
    <div className="container mx-auto py-6">
      <ProfileSection />
      <AnalyticsSection />
      <HistoryDashboard />
      <HistoryTabs favouritesCount={favoritesCount} />
      <HistoryList
        allData={allPrompts}
        onDataChange={setAllPrompts}
        currentView={currentView}
      />
    </div>
  );
}
