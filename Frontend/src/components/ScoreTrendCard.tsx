//interface for the data point
interface ScoreData {
  score: number;
  date: string;
}

//card props
interface ScoreTrendCardProps {
  sessions: ScoreData[];
}

export default function ScoreTrendCard({ sessions }: ScoreTrendCardProps) {
  //no scores, card is hidden
  if (!sessions || sessions.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-gray-200 p-4 rounded-lg">
        <div className="uppercase text-xs md:text-sm">Score trend</div>
        <div className="text-5xl md:text-6xl mt-5">
          {/* insufficient data */}
          {sessions.length < 3 ? (
            <p className="text-sm md:text-base text-gray-600">
              Score at least 3 prompts to see your trend.
            </p>
          ) : (
            /* succes state */
            <div>Sparkline Placeholder</div>
          )}
        </div>
      </div>
    </>
  );
}
