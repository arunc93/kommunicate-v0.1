import { STATUS_COLORS, RequestStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const colorClass =
    STATUS_COLORS[status as RequestStatus] || "bg-gray-400 text-white";
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium leading-4",
        colorClass
      )}
    >
      {status}
    </span>
  );
}
