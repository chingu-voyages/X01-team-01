"use client"

import { useState } from "react";
import HistoryList from "@/components/HistoryList";
import { mockHistoryData } from "@/app/utils/mockHistoryData";
import AnalyticsSection from "@/components/AnalyticsSection";
import HistoryDashboard from "@/components/HistoryDashboard";
import HistoryTabs from "@/components/HistoryTabs";

export default function HistoryPage() {
  const [allPrompts, setAllPrompts] = useState(mockHistoryData);

  return (
    <div className="container mx-auto py-6">
      <AnalyticsSection />
      <HistoryDashboard />
      <HistoryTabs />
      <HistoryList allData={allPrompts} onDataChange={setAllPrompts} />
    </div>
  );
}
