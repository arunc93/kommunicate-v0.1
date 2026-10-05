import { STATUS_COLORS, RequestStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const colorClass =
    STATUS_COLORS[status as RequestStatus] || "bg-gray-400 text-white";
  return (
    <span
      className={cn(
        "inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap",
        colorClass
      )}
    >
      {status}
    </span>
  );
}
