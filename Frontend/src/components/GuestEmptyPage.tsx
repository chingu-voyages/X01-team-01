import { User } from "lucide-react";
import Link from "next/link";
import AnalyticsCard from "./AnalyticsCard";
import ScoreTrendCard from "./ScoreTrendCard";
import { mockScoredHistory } from "@/app/utils/mockData";

export default function GuestEmptyPage() {
  const mockPrompts = [
    {
      uid: "mock-1",
      isFavourite: true,
      date: "May 18, 2026",
      task: "E-commerce Product Launch",
      prompt:
        "Act as an expert conversion copywriter. Write a 3-part email sequence for a premium ergonomic office chair launch. Focus the first email on pain points like lower back stiffness, the second on our patented lumbar alignment technology, and the third on a scarcity-driven 24-hour launch discount. Keep the tone professional yet conversational.",
    },
    {
      uid: "mock-2",
      isFavourite: false,
      date: "May 15, 2026",
      task: "Python API Refactoring",
      prompt:
        "Review this asynchronous FastAPI endpoint for potential database bottlenecks. Optimize the redundant PostgreSQL queries by implementing a clean Redis caching layer for the user session verification step. Ensure proper exception handling and return standard JSON error responses if the cache lookup fails.",
    },
    {
      uid: "mock-3",
      isFavourite: true,
      date: "May 12, 2026",
      task: "B2B SaaS Content Outline",
      prompt:
        "Generate a comprehensive, SEO-optimized blog post outline targeting the keyword 'AI workflow automation for small businesses'. Include an engaging H1, four distinct H2 sections covering practical tool integrations, sub-bullet points for key takeaways under each section, and a compelling call-to-action conclusion.",
    },
  ];

  return (
    <div className="relative">
      {/* Blurred background */}
      <div className="blur-xs p-2">
        {/* Profile Section */}
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
              <button className="bg-gray-300 px-4 py-2 rounded inline-block whitespace-nowrap text-xs md:text-base">
                New Prompt
              </button>
            </div>
          </div>
        </div>

        {/* Prompt Analytics Section */}
        <div className="blur-sm mb-4 grid sm:grid-cols-2 items-center p-4 rounded-2xl bg-linear-to-bl from-gray-50 to-emerald-200/50 shadow-md">
          <div className="flex justify-center">
            <h1 className="flex justify-center text-center text-4xl sm:text-7xl tracking-tighter font-light max-w-min">
              Prompt Analytics
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-4 my-6">
            <AnalyticsCard title="Prompts generated" value={42} hasData />
            <AnalyticsCard
              title="Average length"
              value={362}
              suffix="words"
              hasData
            />
            <AnalyticsCard
              title="Rating"
              value={94}
              suffix="%"
              children={
                <div className="w-full h-2 rounded-full bg-gray-600">
                  <div
                    style={{ width: "94%" }}
                    className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                  />
                </div>
              }
              hasData
            />
            <ScoreTrendCard sessions={mockScoredHistory} />
          </div>
        </div>

        {/* Prompt History */}
        {mockPrompts.map((item) => (
          <article
            key={item.uid}
            className="relative bg-gray-200 rounded-md p-4 mb-4"
          >
            <div className="text-xs pb-4">{item.date}</div>
            <div className="text-base pb-2 font-semibold">{item.task}</div>
            <div className="text-sm line-clamp-3">{item.prompt}</div>
          </article>
        ))}
      </div>

      {/* Foreground */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center bg-white/55 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/50 max-w-md text-center">
          <h2 className="font-light tracking-tighter text-5xl mb-2">
            The prompt history lives here.
          </h2>
          <p className="font-light tracking-tight text-xl mb-8">
            Sign in to save, rate, and revisit your best prompts across any
            device.
          </p>
          <Link
            href="/login"
            className="bg-emerald-200/50 shadow-sm px-6 py-2 mb-2 rounded-lg font-medium hover:bg-emerald-200 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/home"
            className="text-gray-600 hover:text-gray-900 underline underline-offset-2 text-sm"
          >
            Continue as a guest
          </Link>
        </div>
      </div>
    </div>
  );
}
