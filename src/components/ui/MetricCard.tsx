interface MetricCardProps {
  title: string;
  value: string;
  subtext?: string;
}

export function MetricCard({ title, value, subtext }: MetricCardProps) {
  return (
    <div className="panel relative overflow-hidden px-[18px] pb-4 pt-[18px]">
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-kpmg-blue via-cobalt to-pacific" />
      <p className="field-label">{title}</p>
      <p className="mt-2.5 break-words text-[30px] font-bold leading-none tracking-[-0.03em] text-text">{value}</p>
      {subtext ? <p className="mt-1.5 text-xs text-text-muted">{subtext}</p> : null}
    </div>
  );
}
