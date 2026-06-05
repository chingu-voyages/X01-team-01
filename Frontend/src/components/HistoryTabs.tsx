import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface HistoryTabsProps {
  favouritesCount: number;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function HistoryTabs({
  favouritesCount,
  searchQuery,
  setSearchQuery,
}: HistoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  //extract current view from the URL
  const currentView = searchParams.get("view");

  //determine active state
  const isFavouritesActive = currentView === "favourites";
  const isAllActive = !isFavouritesActive;

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 justify-between mt-10 mb-4 items-center">
        <div className="text-2xl sm:text-3xl tracking-tighter font-light">
          Prompt History
        </div>

        {/* tabs */}
        <div className="flex gap-2 sm:gap-4 transition-colors duration-200 font-medium">
          <div
            className={`border-b-2 text-sm sm:text-base hover:cursor-pointer transition-all duration-200
                ${isAllActive ? `text-black border-primary` : `text-black/40 border-transparent hover:text-black`}`}
            onClick={() => router.push("/history", { scroll: false })}
          >
            All
          </div>
          <div
            className={`border-b-2 text-sm sm:text-base hover:cursor-pointer transition-all duration-200
                ${isFavouritesActive ? `text-black border-primary` : `text-black/40 border-transparent hover:text-black`} `}
            onClick={() =>
              router.push("/history?view=favourites", { scroll: false })
            }
          >
            Favourites ({favouritesCount})
          </div>
        </div>
        <div className="flex items-center mt-2 sm:mt-0">
          <div className="relative flex items-center">
            <Search className="absolute left-1.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border pl-8 py-1 rounded-lg text-sm w-40 md:w-64 focus:outline-hidden focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>
      </div>
    </>
  );
}
