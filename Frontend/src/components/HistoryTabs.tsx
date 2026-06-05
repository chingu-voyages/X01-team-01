import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface HistoryTabsProps {
  favouritesCount: number;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function HistoryTabs({ favouritesCount, searchQuery, setSearchQuery,}: HistoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();


  //extract current view from the URL
  const currentView = searchParams.get("view");

  //determine active state
  const isFavouritesActive = currentView === "favourites";
  const isAllActive = !isFavouritesActive;

  return (
    <>
      <div className="flex justify-between mt-10 mb-4 items-center">
        <div className="text-lg sm:text-3xl tracking-tighter font-light">
          Prompt History
        </div>

        {/* tabs */}
        <div className="flex gap-1 sm:gap-4 transition-colors duration-200 font-medium">
          <div
            className={`border-b-2 hover:cursor-pointer transition-all duration-200
                ${isAllActive ? `text-black border-primary` : `text-black/40 border-transparent hover:text-black`}`}
            onClick={() => router.push("/history", { scroll: false })}
          >
            All
          </div>
          <div
            className={`border-b-2 hover:cursor-pointer transition-all duration-200
                ${isFavouritesActive ? `text-black border-primary` : `text-black/40 border-transparent hover:text-black`} `}
            onClick={() => router.push("/history?view=favourites", { scroll: false })}
          >
            Favourites ({favouritesCount})
          </div>
        </div>
        <div className="flex gap-1 md:gap-4 items-center">
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-2 py-1 rounded text-sm w-40 md:w-64"
          />

          <Search className="w-4 md:w-6 hover:cursor-pointer" />
        </div>
      </div>
    </>
  );
}
