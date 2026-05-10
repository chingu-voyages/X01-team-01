export default function EvaluationSkeleton() {
  return (
    <div className="mt-6 p-4 border rounded bg-white space-y-5 animate-pulse">
 
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-2/5"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}