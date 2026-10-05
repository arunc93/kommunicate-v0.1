"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CATEGORIES, TEAMS, GEO_OPTIONS } from "@/lib/types";
import { AddHoursButton } from "@/features/hours/add-hours-button";
import { AttachmentsField } from "@/features/requests/attachments-field";
import { MAX_ATTACHMENT_BYTES } from "@/features/requests/attachment-limits";
import { missingRequestLabels } from "@/features/requests/required-fields";
import { uploadAttachments } from "@/features/requests/upload-attachments";
import { ArrowRight } from "lucide-react";

export function NewRequestForm({ projectNumber }: { projectNumber: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [createdNumber, setCreatedNumber] = useState<number | null>(null);
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

  const addFiles = (picked: File[]) => {
    const tooLarge = picked.find((file) => file.size > MAX_ATTACHMENT_BYTES);
    if (tooLarge) {
      setError(`${tooLarge.name} is larger than 20 MB.`);
      return;
    }
    setError("");
    setFiles((current) => [...current, ...picked]);
  };

  const handleSubmit = async () => {
    const missing = missingRequestLabels(form);
    if (missing.length > 0) {
      setError(`Fill in: ${missing.join(", ")}.`);
      return;
    }

    setLoading(true);
    setError("");
    try {
      let id = createdId;
      let number = createdNumber;
      if (!id || number == null) {
        const res = await fetch("/api/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            projectNumber,
            requestedBy: form.createdOnBehalfOf,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          const fields = Array.isArray(data.fields) ? data.fields.join(", ") : "";
          setError(fields ? `Fill in: ${fields}.` : data.error || "Could not create the request.");
          return;
        }
        id = data.id;
        number = data.projectNumber;
        setCreatedId(id);
        setCreatedNumber(number);
      }
      if (files.length > 0 && id) {
        await uploadAttachments(id, files);
      }
      router.push(`/requests/${number}`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not attach the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Create new request" />

      <div className="space-y-5 rounded-md border border-border bg-white p-4 shadow-elevation-1 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          <AttachmentsField pending={files} onPick={addFiles} />
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <AddHoursButton
          projectNumber={projectNumber}
          projectName={form.projectName}
          effortSpentBy={form.createdOnBehalfOf}
          deliverable={form.category}
        />
        <Button onClick={handleSubmit} disabled={loading} size="lg">
          Submit <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
