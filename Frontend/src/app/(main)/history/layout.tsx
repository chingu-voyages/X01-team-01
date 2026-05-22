"use client";
export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      <main className="mt-6">
        {children}
      </main>
    </div>
  );
}
