import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";

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

  const latestScore = sessions[sessions.length - 1].score;

  const scoreValues = sessions.map((s) => s.score);

  //line colors depending on the latestScore
  let lineColor = "#ef4444"; //Default Red

  if (latestScore >= 8) {
    lineColor = "#22c55e"; //Green
  } else if (latestScore >= 5) {
    lineColor = "#f59e0b"; //Amber
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
            <div>
              <Sparklines data={scoreValues} margin={5} height={60}>
                <SparklinesLine
                  style={{ stroke: lineColor, strokeWidth: 3, fill: "none" }}
                />
                <SparklinesSpots size={3} style={{ fill: lineColor }} />
              </Sparklines>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
