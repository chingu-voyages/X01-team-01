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
      <div className="flex flex-col justify-between bg-gray-200 py-4 px-2 sm:px-4 rounded-lg">
        <div className="uppercase text-xs md:text-sm">{title}</div>
        {hasData ? (
          <div className="text-2xl md:text-4xl lg:text-6xl mt-5">
            {value}
            {suffix && <span className="text-xs sm:text-base ml-1">{suffix}</span>}
          </div>
        ) : (
          <div className="mt-5">
            <p className="text-base md:text-xl">No data yet.</p>
          </div>
        )}

        {children && <div className="mt-4">{hasData ? children : null}</div>}
      </div>
    </>
  );
}
