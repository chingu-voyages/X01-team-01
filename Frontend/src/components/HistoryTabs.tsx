import { Search, ListFilter } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function HistoryTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const isAllActive = pathname === "/history" || pathname === "/history/";
  const isFavoritesActive = pathname === "/history/favorites";

  return (
    <>
      <div className="flex justify-between">
        <div className="text-lg md:text-2xl tracking-tighter">
          Prompt History
        </div>
        <div className="flex gap-1 md:gap-4 transition-colors duration-200">
          <div
            className={`pr-1 md:pr-4 border-r border-black/20 hover:cursor-pointer
                ${isAllActive ? `text-black` : `text-black/40`}`}
            onClick={() => router.push("/history")}
          >
            All
          </div>
          <div
            className={`hover:cursor-pointer
                ${isFavoritesActive ? `text-black` : `text-black/40`} `}
            onClick={() => router.push("/history/favorites")}
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
