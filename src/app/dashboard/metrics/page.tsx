"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { MONTHS, YEARS } from "@/lib/types";
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
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("10");
  const [hoursView, setHoursView] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch(`/api/metrics?year=${year}&month=${month}`)
      .then((r) => r.json())
      .then(setMetrics);
  }, [year, month]);

  return (
    <div>
      <PageHeader title="Metrics" />

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex items-center gap-4">
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
          <Button
            className="bg-[#4e5d94]"
            onClick={() => setHoursView(!hoursView)}
          >
            <Clock className="h-4 w-4" /> Hours view
          </Button>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-3 gap-4">
          <MetricCard title="Number of projects" value={String(metrics.numberOfProjects)} />
          <MetricCard title="Total effort hours" value={metrics.totalEffortHours} />
          <MetricCard
            title="Team utilisation"
            value={metrics.teamUtilisation}
            subtext="Approx."
          />
          <MetricCard title="Deadline adherence" value={metrics.deadlineAdherence} />
          <MetricCard title="Top stakeholder" value={metrics.topStakeholder} />
          <MetricCard
            title="Working days"
            value={metrics.workingDays}
            subtext="Approx."
          />
        </div>
      )}
    </div>
  );
}
