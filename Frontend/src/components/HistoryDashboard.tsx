import ScoreTrendCard from "@/components/ScoreTrendCard";
//import { mockScoredHistory } from "@/app/utils/mockData";
import AnalyticsCard from "./AnalyticsCard";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

import type { Prompt } from "@/types/history";

interface HistoryDashboardProps {
  prompts: Prompt[];
}

export default function HistoryDashboard({ prompts }: HistoryDashboardProps) {
  console.log("DASHBOARD PROMPTS:", prompts);

  const user = useSelector((state: RootState) => state.auth.user);

  const totalPrompts = prompts?.length ?? 0;

  const averageWords =
  prompts.length > 0
    ? Math.round(
        prompts.reduce((sum, p) => sum + (p.words ?? 0), 0) /
          prompts.length
      )
    : 0;

    const sessions = prompts
    .filter((p) => p.score?.overall != null)
    .map((p) => ({
      score: p.score.overall ?? 0,
      date: p.updated_at,
    }));

    const averageScore =
      prompts.filter((p) => p.score?.overall != null).length > 0
        ? Math.round(
            prompts
              .filter((p) => p.score?.overall != null)
              .reduce((sum, p) => sum + (p.score?.overall ?? 0), 0) /
              prompts.filter((p) => p.score?.overall != null).length
          )
        : 0;

  return (
    <div className="grid sm:grid-cols-2 items-center p-4 rounded-2xl bg-linear-to-bl from-gray-50 to-primary/50 shadow-md">
      <header className="flex justify-center">
        <h1 className="flex justify-center text-center text-4xl sm:text-7xl tracking-tighter font-light max-w-min">
          Prompt Analytics
        </h1>
      </header>
      <div className="grid grid-cols-2 gap-4 my-6">
        <AnalyticsCard title="Prompts generated" value={totalPrompts} hasData />
        <AnalyticsCard
          title="Average length"
          value={averageWords}
          suffix="words"
          hasData
        />
        <AnalyticsCard
          title="Average score"
          value={averageScore}
          suffix="/10"
          hasData
        />
        <ScoreTrendCard sessions={sessions} />
      </div>
    </div>
  );
}
