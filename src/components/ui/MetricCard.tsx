interface MetricCardProps {
  title: string;
  value: string;
  subtext?: string;
}

export function MetricCard({ title, value, subtext }: MetricCardProps) {
  return (
    <div className="bg-[#00aeef] rounded-lg p-6 flex flex-col justify-between min-h-[140px]">
      <p className="text-white text-sm font-medium">{title}</p>
      <div>
        <p className="text-white text-4xl font-bold">{value}</p>
        {subtext && <p className="text-white/80 text-xs mt-1">{subtext}</p>}
      </div>
    </div>
  );
}
