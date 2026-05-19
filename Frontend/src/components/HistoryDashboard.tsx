import ScoreTrendCard from "@/components/ScoreTrendCard";
import { mockScoredHistory } from "@/app/utils/mockData";
import AnalyticsCard from "./AnalyticsCard";

export default function HistoryDashboard() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
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
    </>
  );
}
