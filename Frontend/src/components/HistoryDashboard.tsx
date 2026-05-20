import ScoreTrendCard from "@/components/ScoreTrendCard";
import { mockScoredHistory } from "@/app/utils/mockData";
import AnalyticsCard from "./AnalyticsCard";

export default function HistoryDashboard() {
  return (
    <div className="grid grid-cols-2 items-center p-4 rounded-2xl bg-linear-to-bl from-gray-50 to-emerald-200/50 shadow-md">
      <header className="flex justify-center">
        <h1 className="flex justify-center text-center text-7xl tracking-tighter font-light max-w-min">
          Prompt Analytics
        </h1>
      </header>
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
  );
}
