interface AnalyticsCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  hasData: boolean;
  children?: React.ReactNode;
}

export default function AnalyticsCard({
  title,
  value,
  suffix,
  hasData,
  children,
}: AnalyticsCardProps) {
  return (
    <>
      <div className="flex flex-col justify-between bg-gray-200 p-4 rounded-lg">
        <div className="uppercase text-xs md:text-sm">{title}</div>
        {hasData ? (
          <div className="text-4xl md:text-6xl mt-5">
            {value}
            {suffix && <span className="text-sm ml-1">{suffix}</span>}
          </div>
        ) : (
          <div className="text-xl md:text-2xl mt-5">
            <p className="">No data yet.</p>
          </div>
        )}

        {children && <div className="mt-4">{hasData ? children : null}</div>}
      </div>
    </>
  );
}
