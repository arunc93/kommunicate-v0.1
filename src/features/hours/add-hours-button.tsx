"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppRole } from "@/features/auth/role-context";

export function AddHoursButton({
  projectNumber,
  projectName,
  effortSpentBy,
  deliverable,
}: {
  projectNumber: string | number;
  projectName: string;
  effortSpentBy: string;
  deliverable: string;
}) {
  const role = useAppRole();
  if (role !== "lead" && role !== "comms") return null;

  const params = new URLSearchParams({
    project: String(projectNumber),
    name: projectName,
    effort: effortSpentBy,
    deliverable,
  });

  return (
    <Link href={`/add-hours?${params.toString()}`}>
      <Button type="button" variant="outline" size="lg">
        <Clock className="h-4 w-4" /> Add hours
      </Button>
    </Link>
  );
}
