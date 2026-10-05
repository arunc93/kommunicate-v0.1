"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { MONTHS, YEARS } from "@/lib/types";
import { useAppPerson, useAppRole } from "@/features/auth/role-context";
import { Clock } from "lucide-react";

interface Metrics {
  numberOfProjects: number;
  totalEffortHours: string;
  teamUtilisation: string;
  deadlineAdherence: string;
  topStakeholder: string;
  workingDays: string;
}

export default function MetricsPage() {
  const role = useAppRole();
  const person = useAppPerson();
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("10");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const personal = role === "comms";

  useEffect(() => {
    const params = new URLSearchParams({
      year,
      month,
      scope: personal ? "personal" : "team",
      person,
    });
    fetch(`/api/metrics?${params.toString()}`)
      .then((response) => response.json())
      .then(setMetrics);
  }, [year, month, personal, person]);

  return (
    <div>
      <PageHeader title="Metrics" />

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-md border border-border bg-white p-4 shadow-elevation-1">
        <Select
          options={YEARS.map((y) => ({ value: y, label: y }))}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <Select
          options={MONTHS.map((m, i) => ({ value: String(i), label: m }))}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <div className="ml-auto">
          <Link href="/hours/personal">
            <Button type="button">
              <Clock className="h-4 w-4" /> Hours view
            </Button>
          </Link>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard title="Number of projects" value={String(metrics.numberOfProjects)} />
          <MetricCard
            title={personal ? "Personal effort hours" : "Total effort hours"}
            value={metrics.totalEffortHours}
          />
          <MetricCard
            title={personal ? "Personal utilisation" : "Team utilisation"}
            value={metrics.teamUtilisation}
            subtext="Approx."
          />
          <MetricCard title="Deadline adherence" value={metrics.deadlineAdherence} />
          <MetricCard title="Top stakeholder" value={metrics.topStakeholder} />
          <MetricCard title="Working days" value={metrics.workingDays} subtext="Approx." />
        </div>
      )}
    </div>
  );
}
