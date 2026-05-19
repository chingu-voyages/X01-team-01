"use client";
import ProfileSection from "@/components/ProfileSection";

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      <main className="mt-6">
        <ProfileSection />
        {children}
      </main>
    </div>
  );
}
