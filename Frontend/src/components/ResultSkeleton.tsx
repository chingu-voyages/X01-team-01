export default function ResultSkeleton() {
  return (
    <div className="m-16 space-y-4">
      <div className="h-4 bg-slate-200 rounded-xl animate-pulse w-full"></div>
      <div className="h-4 bg-slate-200 rounded-xl animate-pulse w-11/12"></div>
      <div className="h-4 bg-slate-200 rounded-xl animate-pulse w-8/12"></div>
    </div>
  );
}