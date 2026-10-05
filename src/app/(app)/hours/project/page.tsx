"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { HoursTable, type HourRow } from "@/features/hours/hours-table";

function ProjectHoursContent() {
  const searchParams = useSearchParams();
  const project = searchParams.get("project") ?? "";
  const [rows, setRows] = useState<HourRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!project) return;
    fetch(`/api/hours?projectNumber=${encodeURIComponent(project)}`)
      .then((response) => response.json())
      .then((data) => {
        setRows(Array.isArray(data) ? data : []);
        setLoaded(true);
      });
  }, [project]);

  return (
    <div>
      <PageHeader title={project ? `Hours for ${project}` : "Project hours"} />
      {!project ? (
        <p className="text-sm text-text-muted">Open View hours from Add hours.</p>
      ) : loaded ? (
        <HoursTable rows={rows} showPerson showProject />
      ) : (
        <p className="text-sm text-text-muted">Loading...</p>
      )}
    </div>
  );
}

export default function ProjectHoursPage() {
  return (
    <Suspense fallback={<p className="text-sm text-text-muted">Loading...</p>}>
      <ProjectHoursContent />
    </Suspense>
  );
}
