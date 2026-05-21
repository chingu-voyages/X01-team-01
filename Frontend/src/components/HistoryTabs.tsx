import { Search, ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function HistoryTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  //extract current view from the URL
  const currentView = searchParams.get("view");

  //determine active state
  const isFavoritesActive = currentView === "favorites";
  const isAllActive = !isFavoritesActive;

  return (
    <>
      <div className="flex justify-between mt-10 mb-4 items-center">
        <div className="text-lg sm:text-3xl tracking-tighter font-light">
          Prompt History
        </div>

        {/* tabs */}
        <div className="flex gap-1 sm:gap-4 transition-colors duration-200 font-medium">
          <div
            className={`border-b-2 border-black/20 hover:cursor-pointer transition-all duration-200
                ${isAllActive ? `text-black border-primary` : `text-black/40 border-transparent hover:text-black`}`}
            onClick={() => router.push("/history")}
          >
            All
          </div>
          <div
            className={`border-b-2 hover:cursor-pointer transition-all duration-200
                ${isFavoritesActive ? `text-black border-primary` : `text-black/40 border-transparent hover:text-black`} `}
            onClick={() => router.push("/history?view=favorites")}
          >
            Favorites (0)
          </div>
        </div>
        <div className="flex gap-1 md:gap-4">
          <Search className="w-4 md:w-6 hover:cursor-pointer" />
          <ListFilter className="w-4 md:w-6 hover:cursor-pointer" />
        </div>
      </div>
    </>
  );
}
