import { User } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; 

export default function ProfileSection() {

  const { user } = useSelector((state: RootState) => state.auth);
  
  return (
    <div className="flex flex-col gap-2 items-center md:flex-row md:justify-between sm:mb-4">
      <div className="flex items-center">
          <div className="w-8 h-8 md:w-20 md:h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                alt="profile"
              />
            ) : (
              <User />
            )}
          </div>
          <div className="flex flex-col justify-center px-4">
            <div className="text-sm md:text-3xl font-semibold">{user?.display_name || "Guest"}</div>
            <div className="text-xs md:text-sm">{user?.email || ""}</div>
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
