import { User } from "lucide-react";
import Link from "next/link";

export default function ProfileSection() {
  return (
    <div className="flex flex-col gap-2 items-center md:flex-row md:justify-between sm:mb-4">
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
  );
}
