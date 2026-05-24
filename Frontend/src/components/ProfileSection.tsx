import { User } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function ProfileSection() {
  return (
    <div className="flex flex-col gap-2 items-center md:flex-row md:justify-between sm:mb-4 pb-6 border-b border-gray-100">
      <div className="flex items-center">
        <div className="w-8 h-8 md:w-20 md:h-20 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-xs">
          <User />
        </div>
        <div className="flex flex-col justify-center px-4">
          <div className="text-lg md:text-3xl font-semibold tracking-tight text-gray-900">
            Jane Doe
          </div>
          <div className="text-xs md:text-sm font-mono text-gray-400 tracking-tight mt-0.5">
            janedoe@email.com
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-center items-center w-full md:w-auto">
        <div>
          <Button
            variant="outline"
            className="w-full md:w-auto h-10 px-4 rounded-xl text-xs font-semibold tracking-wide border-primary/20 hover:bg-primary/5 text-primary"
          >
            Edit profile
          </Button>
        </div>
        <div>
          <Link href="/home" passHref className="w-full md:w-auto">
            <Button
              variant="default"
              className="w-full md:w-auto h-10 px-5 rounded-xl text-xs font-semibold tracking-wide shadow-xs"
            >
              New Prompt
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
