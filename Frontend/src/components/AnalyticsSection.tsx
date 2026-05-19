import AnalyticsCard from "./AnalyticsCard";

export default function AnalyticsSection() {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <AnalyticsCard
        title="Gemini success rate"
        value={96}
        suffix="%"
        hasData
      />
      <AnalyticsCard
        title="Average response time"
        value={9.7}
        suffix="seconds"
        hasData
      />
      <AnalyticsCard title="Prompts built" value={381} hasData={false} />
    </div>
  );
}
