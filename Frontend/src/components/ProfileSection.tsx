import { User } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ProfileSection() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex flex-col gap-4 items-center md:flex-row md:justify-between mb-6 pb-6 border-b border-gray-100">
      {/* Left Column Group: Avatar & Identity details */}
      <div className="flex items-center">
        {/* Profile Identity Wrapper */}
        <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              alt="profile"
            />
          ) : (
            <User className="w-5 h-5 md:w-8 md:h-8" />
          )}
        </div>

        <div className="flex flex-col justify-center px-4">
          <h2 className="text-lg md:text-3xl font-semibold tracking-tight text-gray-900">
            {user?.display_name || "Guest"}
          </h2>
          <p className="text-xs md:text-sm font-mono text-gray-400 tracking-tight mt-0.5">
            {user?.email || ""}
          </p>
        </div>
      </div>

      {/* Right Column Group: Account Actions */}
{/*       <div className="flex gap-2.5 justify-center items-center w-full md:w-auto">
        <Link href="/home" passHref className="w-full md:w-auto">
          <Button
            variant="default"
            className="w-full md:w-auto h-10 px-5 rounded-xl text-xs font-semibold tracking-wide shadow-xs"
          >
            New Prompt
          </Button>
        </Link>
      </div> */}
    </div>
  );
}
