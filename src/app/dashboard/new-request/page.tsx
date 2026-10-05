"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CATEGORIES, TEAMS, GEO_OPTIONS } from "@/lib/types";
import { generateProjectNumber } from "@/lib/utils";
import { ArrowRight, Paperclip } from "lucide-react";

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projectNumber] = useState(generateProjectNumber());
  const [form, setForm] = useState({
    projectName: "",
    category: "",
    createdOnBehalfOf: "",
    requestSummary: "",
    message: "",
    creativeSuggestion: "",
    additionalConsideration: "",
    primaryAudience: "",
    teamName: "",
    sender: "",
    targetAudienceGeo: "",
    requestedOn: new Date().toISOString().split("T")[0],
    targetReleaseDate: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          projectNumber,
          requestedBy: form.createdOnBehalfOf || "Chacko, Arun",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/requests/${data.projectNumber}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Create new request" />

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-4 gap-4">
          <Input
            label="Project name"
            required
            placeholder="Your task name"
            value={form.projectName}
            onChange={(e) => update("projectName", e.target.value)}
          />
          <Select
            label="Category"
            required
            placeholder="Find items"
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          />
          <Input label="Project number" value={String(projectNumber)} readOnly />
          <Select
            label="Created on behalf of"
            required
            placeholder="Email ID"
            options={[
              { value: "Chacko, Arun", label: "Chacko, Arun" },
              { value: "Rakshit, Abhirup", label: "Rakshit, Abhirup" },
              { value: "Tanwar, Dheeraj", label: "Tanwar, Dheeraj" },
            ]}
            value={form.createdOnBehalfOf}
            onChange={(e) => update("createdOnBehalfOf", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Textarea
            label="Request summary"
            required
            placeholder="Please enter a brief description of the requirement"
            value={form.requestSummary}
            onChange={(e) => update("requestSummary", e.target.value)}
          />
          <Textarea
            label="Message"
            placeholder="Information that you want to communicate"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Textarea
            label="Creative suggestion"
            placeholder="Creative suggestions, if any"
            value={form.creativeSuggestion}
            onChange={(e) => update("creativeSuggestion", e.target.value)}
          />
          <Textarea
            label="Additional consideration"
            placeholder="What other information, if any, would be helpful to consider in design and structure?"
            value={form.additionalConsideration}
            onChange={(e) => update("additionalConsideration", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Input
            label="Primary audience"
            placeholder="Distribution list(s)"
            value={form.primaryAudience}
            onChange={(e) => update("primaryAudience", e.target.value)}
          />
          <Select
            label="Team name"
            required
            placeholder="Find items"
            options={TEAMS.map((t) => ({ value: t, label: t }))}
            value={form.teamName}
            onChange={(e) => update("teamName", e.target.value)}
          />
          <Input
            label="Sender"
            value={form.sender}
            onChange={(e) => update("sender", e.target.value)}
          />
          <Select
            label="Target audience geo"
            required
            placeholder="Find items"
            options={GEO_OPTIONS.map((g) => ({ value: g, label: g }))}
            value={form.targetAudienceGeo}
            onChange={(e) => update("targetAudienceGeo", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Requested on"
            type="date"
            value={form.requestedOn}
            onChange={(e) => update("requestedOn", e.target.value)}
          />
          <Input
            label="Target release date"
            required
            type="date"
            value={form.targetReleaseDate}
            onChange={(e) => update("targetReleaseDate", e.target.value)}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1a2b4b]">Attachments</label>
            <div className="rounded border border-gray-200 bg-[#f5f5f5] px-3 py-2 text-sm text-gray-500">
              There is nothing attached.{" "}
              <button className="text-[#4e5d94] inline-flex items-center gap-1 hover:underline">
                <Paperclip className="h-3 w-3" /> Attach file
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit} disabled={loading} size="lg">
          Submit <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
