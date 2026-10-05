"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Eye } from "lucide-react";
import { useAppPerson } from "@/features/auth/role-context";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { HOUR_CATEGORIES, HOUR_SUB_CATEGORIES } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface HourEntry {
  id: string;
  date: string;
  category: string;
  subCategory: string;
  hours: number;
  remarks?: string | null;
}

function AddHoursContent() {
  const router = useRouter();
  const person = useAppPerson();
  const searchParams = useSearchParams();
  const projectNumber = searchParams.get("project") ?? "";
  const nameFromForm = searchParams.get("name") ?? "";
  const effortFromForm = searchParams.get("effort") ?? "";
  const deliverableFromForm = searchParams.get("deliverable") ?? "";

  const [record, setRecord] = useState({ name: "", effort: "", deliverable: "" });
  const [entries, setEntries] = useState<HourEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    hours: "",
    category: "",
    subCategory: "",
    date: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  useEffect(() => {
    if (!projectNumber) return;
    fetch(`/api/requests/${projectNumber}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data || data.error) return;
        setRecord({
          name: data.projectName ?? "",
          effort: data.createdOnBehalfOf ?? "",
          deliverable: data.category ?? "",
        });
        setEntries(Array.isArray(data.hourEntries) ? data.hourEntries : []);
      })
      .catch(() => undefined);
  }, [projectNumber]);

  const projectName = nameFromForm || record.name;
  const effortSpentBy = person || effortFromForm || record.effort;
  const deliverable = deliverableFromForm || record.deliverable;
  const subCategories = form.category ? HOUR_SUB_CATEGORIES[form.category] ?? [] : [];
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  const handleSave = async () => {
    if (!projectNumber) {
      setError("Open Add hours from a request form.");
      return;
    }
    const hours = Number(form.hours);
    if (!form.hours || Number.isNaN(hours) || hours <= 0 || !form.category || !form.subCategory || !form.date) {
      setError("Enter hours, category, sub category, and date.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectNumber,
          hours: form.hours,
          category: form.category,
          subCategory: form.subCategory,
          date: form.date,
          remarks: form.remarks,
          effortSpentBy,
        }),
      });
      if (response.status === 404) {
        setError("Submit this request before saving hours.");
        return;
      }
      if (!response.ok) {
        setError("Could not save hours.");
        return;
      }
      const entry = (await response.json()) as HourEntry;
      setEntries((current) => [entry, ...current]);
      setForm((current) => ({
        hours: "",
        category: "",
        subCategory: "",
        date: current.date,
        remarks: "",
      }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Add hours">
        {projectNumber ? (
          <Link href={`/hours/project?project=${encodeURIComponent(projectNumber)}`}>
            <Button type="button" variant="outline" size="sm">
              <Eye className="h-4 w-4" /> View hours
            </Button>
          </Link>
        ) : (
          <Button type="button" variant="outline" size="sm" disabled>
            <Eye className="h-4 w-4" /> View hours
          </Button>
        )}
        <Link
          href="/hours/personal"
          aria-label="My hours"
          title="My hours"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted"
        >
          <Clock className="h-4 w-4" />
        </Link>
      </PageHeader>

      {!projectNumber ? (
        <p className="text-sm text-text-muted">Open Add hours from a request form.</p>
      ) : (
        <>
          <div className="mb-6 space-y-4 rounded-md border border-border bg-white p-4 shadow-elevation-1 md:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Input label="Project number" value={projectNumber} readOnly />
              <Input label="Project name" value={projectName} readOnly />
              <Input label="Effort spent by" value={effortSpentBy} readOnly />
              <Input label="Deliverable" value={deliverable} readOnly />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Input
                label="Hours spent"
                required
                type="number"
                step="0.25"
                min="0.25"
                value={form.hours}
                onChange={(event) => setForm((current) => ({ ...current, hours: event.target.value }))}
              />
              <Select
                label="Category"
                required
                placeholder="Find items"
                options={HOUR_CATEGORIES.map((category) => ({ value: category, label: category }))}
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                    subCategory: "",
                  }))
                }
              />
              <Select
                label="Sub category"
                required
                placeholder="Find items"
                options={subCategories.map((item) => ({ value: item, label: item }))}
                value={form.subCategory}
                onChange={(event) =>
                  setForm((current) => ({ ...current, subCategory: event.target.value }))
                }
              />
              <Input
                label="Date"
                required
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              />
            </div>

            <Textarea
              label="Remarks"
              value={form.remarks}
              onChange={(event) => setForm((current) => ({ ...current, remarks: event.target.value }))}
            />

            {error && <p className="text-sm text-error">{error}</p>}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button type="button" onClick={handleSave} disabled={saving}>
                Save <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div id="hour-log" className="overflow-hidden rounded-md border border-border bg-white shadow-elevation-1">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-3 text-left font-semibold text-text">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-text">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-text">Sub-category</th>
                    <th className="px-4 py-3 text-left font-semibold text-text">Hours</th>
                    <th className="px-4 py-3 text-left font-semibold text-text">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3 text-text">{formatDate(entry.date)}</td>
                      <td className="px-4 py-3 text-text">{entry.category}</td>
                      <td className="px-4 py-3 text-text">{entry.subCategory}</td>
                      <td className="px-4 py-3 text-text">{entry.hours}</td>
                      <td className="px-4 py-3 text-text-muted">{entry.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border px-4 py-3 text-sm font-medium text-text">
              Total hours: {totalHours.toFixed(2)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function AddHoursPage() {
  return (
    <Suspense fallback={<p className="text-sm text-text-muted">Loading...</p>}>
      <AddHoursContent />
    </Suspense>
  );
}
