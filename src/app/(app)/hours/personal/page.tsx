"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { HoursTable, type HourRow } from "@/features/hours/hours-table";
import { useAppPerson } from "@/features/auth/role-context";

export default function PersonalHoursPage() {
  const person = useAppPerson();
  const [rows, setRows] = useState<HourRow[] | null>(null);

  useEffect(() => {
    fetch(`/api/hours?person=${encodeURIComponent(person)}`)
      .then((response) => response.json())
      .then((data) => setRows(Array.isArray(data) ? data : []));
  }, [person]);

  return (
    <div>
      <PageHeader title={`Hours for ${person}`} />
      {rows ? (
        <HoursTable rows={rows} showProject />
      ) : (
        <p className="text-sm text-text-muted">Loading...</p>
      )}
    </div>
  );
}
