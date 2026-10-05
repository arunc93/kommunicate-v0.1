"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { CATEGORIES, GEO_OPTIONS, REQUEST_STATUSES, TEAMS } from "@/lib/types";
import { useAppRole } from "@/features/auth/role-context";
import { missingRequestLabels } from "@/features/requests/required-fields";
import { AddHoursButton } from "@/features/hours/add-hours-button";
import { AttachmentsField, type SavedAttachment } from "@/features/requests/attachments-field";
import { MAX_ATTACHMENT_BYTES } from "@/features/requests/attachment-limits";
import { uploadAttachments } from "@/features/requests/upload-attachments";
import { ArrowRight } from "lucide-react";

const PEOPLE = ["Chacko, Arun", "Rakshit, Abhirup", "Tanwar, Dheeraj"];

interface Request {
  id: string;
  projectNumber: number;
  projectName: string;
  category: string;
  createdOnBehalfOf: string;
  requestSummary: string;
  message?: string | null;
  creativeSuggestion?: string | null;
  additionalConsideration?: string | null;
  primaryAudience?: string | null;
  teamName: string;
  sender?: string | null;
  targetAudienceGeo?: string | null;
  requestedOn?: string | null;
  deadline?: string | null;
  targetReleaseDate?: string | null;
  iterations: number;
  status: string;
  declineReason?: string | null;
  attachments?: SavedAttachment[];
}

type TextField =
  | "projectName"
  | "category"
  | "createdOnBehalfOf"
  | "requestSummary"
  | "message"
  | "creativeSuggestion"
  | "additionalConsideration"
  | "primaryAudience"
  | "teamName"
  | "sender"
  | "targetAudienceGeo";

function dateInputValue(value?: string | null): string {
  if (!value) return "";
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match?.[1] ?? "";
}

function isThisRequest(data: { id?: string; projectNumber?: number }, requestKey: string): boolean {
  return data.id === requestKey || String(data.projectNumber) === requestKey;
}

function optionsWithCurrent(choices: readonly string[], current: string): { value: string; label: string }[] {
  const options = choices.map((value) => ({ value, label: value }));
  if (current && !choices.includes(current)) options.unshift({ value: current, label: current });
  return options;
}

export function RequestDetail({ requestKey: requestKeyFromServer }: { requestKey: string }) {
  const pathname = usePathname();
  const pathKey = pathname.match(/^\/requests\/([^/]+)/)?.[1];
  const requestKey = pathKey ? decodeURIComponent(pathKey) : requestKeyFromServer;
  const [request, setRequest] = useState<Request | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusChoice, setStatusChoice] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [statusError, setStatusError] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const role = useAppRole();

  const load = () => {
    fetch(`/api/requests/${encodeURIComponent(requestKey)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.error || !isThisRequest(data, requestKey)) return;
        setRequest(data);
      });
  };

  useEffect(() => {
    let cancelled = false;
    setRequest(null);
    setFiles([]);
    setError("");
    setStatusError("");
    setLoadError("");
    fetch(`/api/requests/${encodeURIComponent(requestKey)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        if (!data || data.error || !isThisRequest(data, requestKey)) {
          setLoadError("Could not load this request.");
          return;
        }
        setRequest(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load this request.");
      });
    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  const savedStatus = request?.status;
  const savedReason = request?.declineReason ?? "";

  useEffect(() => {
    if (!savedStatus) return;
    setStatusChoice(savedStatus);
    setDeclineReason(savedReason);
  }, [savedStatus, savedReason]);

  if (!request) {
    return <div className="text-sm text-text-muted">{loadError || "Loading..."}</div>;
  }

  const canSetStatus = role === "comms" || role === "lead";
  const editing = canSetStatus || request.status === "Brief submitted";

  const setText = (field: TextField, value: string) => {
    setRequest((current) => (current ? { ...current, [field]: value } : current));
  };

  const setDate = (field: "requestedOn" | "targetReleaseDate", value: string) => {
    setRequest((current) =>
      current ? { ...current, [field]: value ? `${value}T00:00:00.000Z` : "" } : current,
    );
  };

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
    const missing = missingRequestLabels({
      projectName: request.projectName,
      category: request.category,
      createdOnBehalfOf: request.createdOnBehalfOf,
      requestSummary: request.requestSummary,
      teamName: request.teamName,
      targetAudienceGeo: request.targetAudienceGeo ?? "",
      targetReleaseDate: dateInputValue(request.targetReleaseDate),
    });
    if (!dateInputValue(request.requestedOn)) missing.push("Requested on");
    if (missing.length > 0) {
      setError(`Fill in: ${missing.join(", ")}.`);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        projectName: request.projectName,
        category: request.category,
        createdOnBehalfOf: request.createdOnBehalfOf,
        requestSummary: request.requestSummary,
        message: request.message ?? "",
        creativeSuggestion: request.creativeSuggestion ?? "",
        additionalConsideration: request.additionalConsideration ?? "",
        primaryAudience: request.primaryAudience ?? "",
        teamName: request.teamName,
        sender: request.sender ?? "",
        targetAudienceGeo: request.targetAudienceGeo ?? "",
        requestedOn: dateInputValue(request.requestedOn),
        targetReleaseDate: dateInputValue(request.targetReleaseDate),
      };
      const response = await fetch(`/api/requests/${encodeURIComponent(requestKey)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not save the request.");
        return;
      }
      if (files.length > 0) {
        await uploadAttachments(request.id, files);
        setFiles([]);
      }
      load();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not attach the file.");
    } finally {
      setSaving(false);
    }
  };

  const saveStatus = async (status: string, reason: string) => {
    setSavingStatus(true);
    setStatusError("");
    try {
      const response = await fetch(`/api/requests/${encodeURIComponent(requestKey)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, declineReason: reason }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatusError(typeof data.error === "string" ? data.error : "Could not update the status.");
        setStatusChoice(request.status);
        setDeclineReason(request.declineReason ?? "");
        return;
      }
      setRequest((current) =>
        current
          ? { ...current, status: data.status, declineReason: data.declineReason ?? null }
          : current,
      );
    } catch {
      setStatusError("Could not update the status.");
      setStatusChoice(request.status);
      setDeclineReason(request.declineReason ?? "");
    } finally {
      setSavingStatus(false);
    }
  };

  return (
    <div>
      <PageHeader title={`${request.projectNumber} - ${request.projectName}`} />

      <div className="space-y-5 rounded-md border border-border bg-white p-4 shadow-elevation-1 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Input
            label="Project name"
            required={editing}
            placeholder={editing ? "Your task name" : undefined}
            value={request.projectName}
            readOnly={!editing}
            onChange={editing ? (event) => setText("projectName", event.target.value) : undefined}
          />
          {editing ? (
            <Select
              label="Category"
              required
              placeholder="Find items"
              options={optionsWithCurrent(CATEGORIES, request.category)}
              value={request.category}
              onChange={(event) => setText("category", event.target.value)}
            />
          ) : (
            <Input label="Category" value={request.category} readOnly />
          )}
          <Input label="Project number" value={String(request.projectNumber)} readOnly />
          {editing ? (
            <Select
              label="Created on behalf of"
              required
              placeholder="Email ID"
              options={optionsWithCurrent(PEOPLE, request.createdOnBehalfOf)}
              value={request.createdOnBehalfOf}
              onChange={(event) => setText("createdOnBehalfOf", event.target.value)}
            />
          ) : (
            <Input label="Created on behalf of" value={request.createdOnBehalfOf} readOnly />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Textarea
            label="Request summary"
            required={editing}
            value={request.requestSummary}
            readOnly={!editing}
            onChange={editing ? (event) => setText("requestSummary", event.target.value) : undefined}
          />
          <Textarea
            label="Message"
            value={request.message || ""}
            readOnly={!editing}
            onChange={editing ? (event) => setText("message", event.target.value) : undefined}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Textarea
            label="Creative suggestion"
            value={request.creativeSuggestion || ""}
            readOnly={!editing}
            onChange={editing ? (event) => setText("creativeSuggestion", event.target.value) : undefined}
          />
          <Textarea
            label="Additional consideration"
            value={request.additionalConsideration || ""}
            readOnly={!editing}
            onChange={editing ? (event) => setText("additionalConsideration", event.target.value) : undefined}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Input
            label="Primary audience"
            value={request.primaryAudience || ""}
            readOnly={!editing}
            onChange={editing ? (event) => setText("primaryAudience", event.target.value) : undefined}
          />
          {editing ? (
            <Select
              label="Team name"
              required
              placeholder="Find items"
              options={optionsWithCurrent(TEAMS, request.teamName)}
              value={request.teamName}
              onChange={(event) => setText("teamName", event.target.value)}
            />
          ) : (
            <Input label="Team name" value={request.teamName} readOnly />
          )}
          <Input
            label="Sender"
            value={request.sender || ""}
            readOnly={!editing}
            onChange={editing ? (event) => setText("sender", event.target.value) : undefined}
          />
          {editing ? (
            <Select
              label="Target audience geo"
              required
              placeholder="Find items"
              options={optionsWithCurrent(GEO_OPTIONS, request.targetAudienceGeo || "")}
              value={request.targetAudienceGeo || ""}
              onChange={(event) => setText("targetAudienceGeo", event.target.value)}
            />
          ) : (
            <Input label="Target audience geo" value={request.targetAudienceGeo || ""} readOnly />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Requested on"
            type={editing ? "date" : "text"}
            readOnly={!editing}
            value={editing ? dateInputValue(request.requestedOn) : request.requestedOn ? formatDate(request.requestedOn) : ""}
            onChange={editing ? (event) => setDate("requestedOn", event.target.value) : undefined}
          />
          <Input
            label="Target release date"
            type={editing ? "date" : "text"}
            required={editing}
            readOnly={!editing}
            value={
              editing
                ? dateInputValue(request.targetReleaseDate)
                : request.targetReleaseDate
                  ? formatDate(request.targetReleaseDate)
                  : ""
            }
            onChange={editing ? (event) => setDate("targetReleaseDate", event.target.value) : undefined}
          />
          {editing ? (
            <AttachmentsField pending={files} saved={request.attachments} onPick={addFiles} />
          ) : (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text">Attachments</label>
              <div className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-muted">
                {request.attachments && request.attachments.length > 0 ? (
                  <span className="flex flex-col gap-1">
                    {request.attachments.map((file) => (
                      <a key={file.id} href={`/api/attachments/${file.id}`} className="text-cobalt hover:underline">
                        {file.filename}
                      </a>
                    ))}
                  </span>
                ) : (
                  "There is nothing attached."
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {canSetStatus ? (
            <Select
              label="Status"
              options={REQUEST_STATUSES.map((status) => ({ value: status, label: status }))}
              value={statusChoice}
              disabled={savingStatus}
              onChange={(event) => {
                const next = event.target.value;
                setStatusChoice(next);
                setStatusError("");
                if (next !== "Declined") void saveStatus(next, "");
              }}
            />
          ) : (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text">Status</label>
              <div className="rounded-md border border-border bg-surface px-3 py-2">
                <StatusBadge status={request.status} />
              </div>
            </div>
          )}
          {canSetStatus && statusChoice === "Declined" ? (
            <div className="flex flex-col gap-3">
              <Textarea
                label="Reason for decline"
                required
                value={declineReason}
                onChange={(event) => setDeclineReason(event.target.value)}
              />
              <div>
                <Button
                  type="button"
                  onClick={() => {
                    if (!declineReason.trim()) {
                      setStatusError("Enter a reason for the decline.");
                      return;
                    }
                    void saveStatus("Declined", declineReason.trim());
                  }}
                  disabled={savingStatus}
                >
                  Save decline
                </Button>
              </div>
            </div>
          ) : null}
          {!canSetStatus && request.status === "Declined" && request.declineReason ? (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text">Reason for decline</label>
              <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm leading-5 text-text">
                {request.declineReason}
              </p>
            </div>
          ) : null}
        </div>
        {statusError && <p className="text-sm text-error">{statusError}</p>}
        {error && <p className="text-sm text-error">{error}</p>}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <AddHoursButton
          projectNumber={request.projectNumber}
          projectName={request.projectName}
          effortSpentBy={request.createdOnBehalfOf}
          deliverable={request.category}
        />
        {editing && (
          <Button onClick={handleSubmit} size="lg" disabled={saving}>
            Submit <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
