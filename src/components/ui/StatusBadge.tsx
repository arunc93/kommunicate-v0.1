import { STATUS_COLORS, RequestStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const colorClass = STATUS_COLORS[status as RequestStatus] || "bg-surface text-text-muted";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold leading-4",
        colorClass
      )}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  );
}
