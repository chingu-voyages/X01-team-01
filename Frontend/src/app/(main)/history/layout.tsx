"use client";
import HistoryTabs from "@/components/HistoryTabs";
import HistoryDashboard from "@/components/HistoryDashboard";

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      <header className="mt-6 md:mt-2">
        <HistoryDashboard />
      </header>

      <main className="mt-6">
        <HistoryTabs />
        {children}
      </main>
    </div>
  );
}
