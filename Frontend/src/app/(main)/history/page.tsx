"use client"

import { useState } from "react";
import HistoryList from "@/components/HistoryList";
import { mockHistoryData } from "@/app/utils/mockHistoryData";

export default function HistoryPage() {
  const [allPrompts, setAllPrompts] = useState(mockHistoryData);

  return (
    <div className="container mx-auto py-6">
      <HistoryList allData={allPrompts} onDataChange={setAllPrompts} />
    </div>
  );
}
