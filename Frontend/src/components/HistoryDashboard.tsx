
import ScoreTrendCard from "@/components/ScoreTrendCard";
import { mockScoredHistory } from "@/app/utils/mockData";

export default function HistoryDashboard() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <div className="bg-gray-200 p-4 rounded-lg">
          <div className="uppercase text-xs md:text-sm">Prompts generated</div>
          <div className="text-5xl md:text-6xl mt-5">42</div>
        </div>
        <div className="bg-gray-200 p-4 rounded-lg">
          <div className="uppercase text-xs md:text-sm">Average length</div>
          <div className="flex items-baseline text-5xl md:text-6xl mt-5">
            120
            <p className="text-sm md:text-lg">words</p>
          </div>
        </div>
        <div
          className={`bg-gray-200 p-4 rounded-lg ${
            mockScoredHistory.length === 0 ? "col-span-2" : "col-span-1"
          }`}
        >
          <div className="uppercase text-xs md:text-sm">Rating</div>
          <div className="text-5xl md:text-6xl mt-5">94%</div>
          <div className="w-full h-2 rounded-full bg-gray-600">
            <div
              style={{ width: "94%" }}
              className="h-2 rounded-full bg-blue-500 transition-all duration-500"
            ></div>
          </div>
        </div>
        <ScoreTrendCard sessions={mockScoredHistory} />
      </div>
    </>
  );
}
