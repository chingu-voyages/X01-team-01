import PromptCard from "@/components/PromptCard";
import Link from "next/link";

export default function History() {
  const hasPrompts = true;

  return (
    <>
      {hasPrompts ? (
        <div>
          <div className="grid grid-cols-1 gap-4 mt-8">
            <PromptCard />
            <PromptCard />
            <PromptCard />
          </div>
          <button className="border border-gray-300 px-4 py-2 my-10 rounded whitespace-nowrap block mx-auto text-xs md:text-base">
            Show older prompts
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-black/60 mb-4">No prompts generated yet.</p>
          <Link
            href="/home"
            className="border border-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition-colors"
          >
            Create your first prompt
          </Link>
        </div>
      )}
    </>
  );
}
