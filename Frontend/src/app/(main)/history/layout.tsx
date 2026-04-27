"use client";

import { User, Search, ListFilter } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isAllActive = pathname === "/history" || pathname === "/history/";
  const isFavoritesActive = pathname === "/history/favorites";

  return (
    <div className="container">
      <header className="mt-6 md:mt-2">
        <div className="flex flex-col gap-2 items-center md:flex-row md:justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-20 md:h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <User />
            </div>
            <div className="flex flex-col justify-center px-4">
              <div className="text-sm md:text-3xl font-semibold">Jane Doe</div>
              <div className="text-xs md:text-sm">janedoe@email.com</div>
            </div>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <div>
              <button
                type="button"
                className="border border-gray-300 px-4 py-2 rounded whitespace-nowrap text-xs md:text-base"
              >
                Edit profile
              </button>
            </div>
            <div>
              <Link
                href="/home"
                className="bg-gray-300 px-4 py-2 rounded inline-block whitespace-nowrap text-xs md:text-base"
              >
                New Prompt
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          <div className="bg-gray-200 p-4 rounded-lg">
            <div className="uppercase text-xs md:text-sm">
              Prompts generated
            </div>
            <div className="text-5xl md:text-6xl mt-5">42</div>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <div className="uppercase text-xs md:text-sm">Average length</div>
            <div className="flex items-baseline text-5xl md:text-6xl mt-5">
              120
              <p className="text-sm md:text-lg">words</p>
            </div>
          </div>
          <div className="col-span-2 bg-gray-200 p-4 rounded-lg">
            <div className="uppercase text-xs md:text-sm">Rating</div>
            <div className="text-5xl md:text-6xl mt-5">94%</div>
            <div className="w-full h-2 rounded-full bg-gray-600">
              <div
                style={{ width: "94%" }}
                className="h-2 rounded-full bg-blue-500 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className="mt-6">
        <div className="flex justify-between">
          <div className="text-lg md:text-2xl tracking-tighter">Prompt History</div>
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
        {children}
      </main>
    </div>
  );
}
