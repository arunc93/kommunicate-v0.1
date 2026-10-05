"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Paperclip } from "lucide-react";

interface Request {
  projectNumber: number;
  projectName: string;
  category: string;
  createdOnBehalfOf: string;
  requestSummary: string;
  message?: string;
  creativeSuggestion?: string;
  additionalConsideration?: string;
  primaryAudience?: string;
  teamName: string;
  sender?: string;
  targetAudienceGeo?: string;
  deadline?: string;
  targetReleaseDate?: string;
  iterations: number;
  status: string;
}

export default function RequestDetailPage() {
  const params = useParams();
  const [request, setRequest] = useState<Request | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetch(`/api/requests/${params.id}`)
      .then((r) => r.json())
      .then(setRequest);
  }, [params.id]);

  if (!request) return <div className="text-gray-500">Loading...</div>;

  const handleSubmit = async () => {
    await fetch(`/api/requests/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        additionalConsideration: request.additionalConsideration,
        status: "Brief submitted",
      }),
    });
    setEditMode(false);
  };

  return (
    <div>
      <PageHeader title={`${request.projectNumber} - Communication request`} />

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-4 gap-4">
          <Input label="Project name" value={request.projectName} readOnly />
          <Input label="Category" value={request.category} readOnly />
          <Input label="Project number" value={String(request.projectNumber)} readOnly />
          <Input label="Created on behalf of" value={request.createdOnBehalfOf} readOnly />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Textarea label="Request summary" value={request.requestSummary} readOnly />
          <Textarea label="Message" value={request.message || ""} readOnly />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Textarea label="Creative suggestion" value={request.creativeSuggestion || ""} readOnly />
          <Textarea
            label="Additional consideration"
            value={request.additionalConsideration || ""}
            readOnly={!editMode}
            className={editMode ? "bg-blue-50" : ""}
            onChange={
              editMode
                ? (e) => setRequest({ ...request, additionalConsideration: e.target.value })
                : undefined
            }
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Input label="Primary audience" value={request.primaryAudience || ""} readOnly />
          <Input label="Team name" value={request.teamName} readOnly />
          <Input label="Sender" value={request.sender || ""} readOnly />
          <Input label="Target audience geo" value={request.targetAudienceGeo || ""} readOnly />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Input
            label="Deadline"
            value={request.deadline ? formatDate(request.deadline) : ""}
            readOnly
          />
          <Input
            label="Target release date"
            value={request.targetReleaseDate ? formatDate(request.targetReleaseDate) : ""}
            readOnly
          />
          <Input label="Iterations" value={String(request.iterations)} readOnly />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1a2b4b]">Attachments</label>
            <div className="rounded border border-gray-200 bg-[#f5f5f5] px-3 py-2 text-sm text-gray-500">
              There is nothing attached.
              {editMode && (
                <button className="text-[#4e5d94] inline-flex items-center gap-1 hover:underline ml-1">
                  <Paperclip className="h-3 w-3" /> Attach file
                </button>
              )}
            </div>
          </div>
        </div>

        {!editMode && (
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#1a2b4b]">Status</label>
              <div className="rounded border border-gray-200 bg-[#f5f5f5] px-3 py-2">
                <StatusBadge status={request.status} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6 gap-3">
        {editMode ? (
          <Button onClick={handleSubmit} size="lg">
            Submit <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Link href={`/dashboard/requests/${request.projectNumber}/edit`}>
            <Button size="lg" onClick={() => setEditMode(true)}>
              Edit request
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
