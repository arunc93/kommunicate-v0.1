"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { HOUR_CATEGORIES, HOUR_SUB_CATEGORIES } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Eye, Clock } from "lucide-react";
import Link from "next/link";

interface Request {
  projectNumber: number;
  projectName: string;
  category: string;
  createdOnBehalfOf: string;
}

interface HourEntry {
  id: string;
  date: string;
  category: string;
  subCategory: string;
  hours: number;
  remarks?: string;
}

function AddHoursContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectParam = searchParams.get("project");

  const [request, setRequest] = useState<Request | null>(null);
  const [entries, setEntries] = useState<HourEntry[]>([]);
  const [form, setForm] = useState({
    hours: "",
    category: "",
    subCategory: "",
    date: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  useEffect(() => {
    if (!projectParam) return;
    fetch(`/api/requests/${projectParam}`)
      .then((r) => r.json())
      .then((data) => {
        setRequest(data);
        setEntries(data.hourEntries || []);
      });
  }, [projectParam]);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const subCategories = form.category
    ? HOUR_SUB_CATEGORIES[form.category] || []
    : [];

  const handleSave = async () => {
    if (!projectParam || !form.hours || !form.category || !form.subCategory) return;

    const res = await fetch("/api/hours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectNumber: projectParam,
        ...form,
        effortSpentBy: request?.createdOnBehalfOf || "Chacko, Arun",
      }),
    });

    if (res.ok) {
      const entry = await res.json();
      setEntries((prev) => [entry, ...prev]);
      setForm({ hours: "", category: "", subCategory: "", date: form.date, remarks: "" });
    }
  };

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  if (!request && projectParam) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <PageHeader title="Add hours">
        <Link href={`/dashboard/add-hours?project=${projectParam}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" /> View hours
          </Button>
        </Link>
        <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500">
          <Clock className="h-4 w-4" />
        </button>
      </PageHeader>

      {request && (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 mb-6">
            <div className="grid grid-cols-4 gap-4">
              <Input label="Project number" value={String(request.projectNumber)} readOnly />
              <Input label="Project name" value={request.projectName} readOnly />
              <Input label="Effort spent by" value={request.createdOnBehalfOf} readOnly />
              <Input label="Deliverable" value={request.category} readOnly />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Input
                label="Hours spent"
                required
                type="number"
                step="0.25"
                min="0"
                value={form.hours}
                onChange={(e) => update("hours", e.target.value)}
              />
              <Select
                label="Category"
                required
                placeholder="Find items"
                options={HOUR_CATEGORIES.map((c) => ({ value: c, label: c }))}
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              />
              <Select
                label="Sub category"
                required
                placeholder="Find items"
                options={subCategories.map((s) => ({ value: s, label: s }))}
                value={form.subCategory}
                onChange={(e) => update("subCategory", e.target.value)}
              />
              <Input
                label="Date"
                required
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </div>

            <Textarea
              label="Remarks"
              value={form.remarks}
              onChange={(e) => update("remarks", e.target.value)}
            />

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={handleSave}>
                Save <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold">Date</th>
                  <th className="text-left px-4 py-3 font-semibold">Category</th>
                  <th className="text-left px-4 py-3 font-semibold">Sub-category</th>
                  <th className="text-left px-4 py-3 font-semibold">Hours</th>
                  <th className="text-left px-4 py-3 font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100">
                    <td className="px-4 py-3">{formatDate(entry.date)}</td>
                    <td className="px-4 py-3">{entry.category}</td>
                    <td className="px-4 py-3">{entry.subCategory}</td>
                    <td className="px-4 py-3">{entry.hours}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 text-sm font-medium text-[#1a2b4b] border-t border-gray-200">
              Total hours: {totalHours.toFixed(2)}
            </div>
          </div>
        </>
      )}

      {!projectParam && (
        <p className="text-gray-500">
          Select a project from Track request to add hours.
        </p>
      )}
    </div>
  );
}

export default function AddHoursPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddHoursContent />
    </Suspense>
  );
}
