interface MetricCardProps {
  title: string;
  value: string;
  subtext?: string;
}

export function MetricCard({ title, value, subtext }: MetricCardProps) {
  return (
    <div className="flex min-h-[140px] flex-col justify-between rounded-md bg-cobalt p-6 text-white shadow-elevation-1">
      <p className="text-white text-sm font-medium">{title}</p>
      <div>
        <p className="text-white text-4xl font-bold">{value}</p>
        {subtext && <p className="text-white/80 text-xs mt-1">{subtext}</p>}
      </div>
    </div>
  );
}
