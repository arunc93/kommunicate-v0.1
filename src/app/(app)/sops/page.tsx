"use client";

import { useEffect, useState } from "react";
import { Calendar, Download, Hand, Search, Settings, ThumbsUp, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppRole } from "@/features/auth/role-context";

const steps = [
  { icon: Hand, label: "Raise request on Kommunicate" },
  { icon: Search, label: "Check 'Track request' for progress" },
  { icon: Settings, label: "Raise request for edits, if any" },
  { icon: ThumbsUp, label: "Confirm completion to close request" },
  { icon: Calendar, label: "Check release calendar to plan release" },
];

interface SopResource {
  id: string;
  title: string;
  builtin: boolean;
  hasFile: boolean;
  filename: string | null;
}

export default function SopsPage() {
  const canEdit = useAppRole() === "lead";
  const [resources, setResources] = useState<SopResource[]>([]);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const showEdit = canEdit && editing;

  const load = () => {
    fetch("/api/sops")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setResources(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const addCard = async () => {
    const missing: string[] = [];
    if (!title.trim()) missing.push("a name");
    if (!file) missing.push("a file");
    if (missing.length > 0) {
      setError(`Add ${missing.join(" and ")}.`);
      return;
    }

    const body = new FormData();
    body.set("title", title.trim());
    body.set("file", file as File);
    setBusy(true);
    setError("");
    setNotice("");
    const response = await fetch("/api/sops", { method: "POST", body });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setError(typeof data.error === "string" ? data.error : "Could not add that card.");
      return;
    }
    setTitle("");
    setFile(null);
    setFormKey((current) => current + 1);
    load();
  };

  const attachFile = async (id: string, chosen: File | null) => {
    if (!chosen) {
      setError("Choose a file to attach.");
      return;
    }
    const body = new FormData();
    body.set("file", chosen);
    setError("");
    setNotice("");
    const response = await fetch(`/api/sops/${id}`, { method: "PATCH", body });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(typeof data.error === "string" ? data.error : "Could not attach that file.");
      return;
    }
    load();
  };

  const removeCard = async (id: string) => {
    setError("");
    setNotice("");
    const response = await fetch(`/api/sops/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Could not remove that card.");
      return;
    }
    load();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Process"
        title="SOPs and TATs"
        description="How a request moves, and the files the desk uses."
      >
        {canEdit && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditing((current) => !current);
              setError("");
              setNotice("");
            }}
          >
            {showEdit ? "Done" : "Edit"}
          </Button>
        )}
      </PageHeader>

      <div className="sop-banner mb-4 rounded-panel p-6 md:p-8">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-md bg-white/20 px-4 py-1 text-sm text-white">Ready to Kommunicate?</span>
        </div>
        <div className="relative mx-auto flex max-w-4xl flex-col items-start gap-6 md:flex-row md:items-start md:justify-between">
          <div className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-white/30 md:block" />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="relative z-10 flex w-full items-center gap-3 text-left md:w-[18%] md:flex-col md:text-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/40 bg-white/10">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <p className="text-xs leading-4 text-white">{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {showEdit && (
        <div key={formKey} className="panel mb-6 grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
          <Input label="Name" required value={title} onChange={(event) => setTitle(event.target.value)} />
          <div className="flex flex-col gap-1">
            <label htmlFor="sop-file" className="field-label">
              Attachment<span className="ml-0.5 text-error">*</span>
            </label>
            <input
              id="sop-file"
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="text-sm text-text file:mr-3 file:rounded-lg file:border-0 file:bg-cobalt file:px-3 file:py-1.5 file:text-[13px] file:font-bold file:text-white"
            />
            {file ? <span className="text-xs text-text-muted">{file.name}</span> : null}
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={addCard} disabled={busy}>
              Add card
            </Button>
          </div>
        </div>
      )}

      {error ? <p className="mb-4 text-sm text-error">{error}</p> : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="panel flex min-h-[140px] flex-col justify-between p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm leading-5 text-text">{resource.title}</p>
              {showEdit && !resource.builtin && (
                <button
                  type="button"
                  aria-label={`Remove ${resource.title}`}
                  onClick={() => removeCard(resource.id)}
                  className="shrink-0 text-text-muted hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div className="min-w-0 flex-1">
                {resource.filename ? <p className="truncate text-xs text-text-muted">{resource.filename}</p> : null}
                {showEdit && (
                  <label className="mt-2 block text-xs text-text-muted">
                    Attach file
                    <input
                      type="file"
                      aria-label={`Attach file for ${resource.title}`}
                      className="mt-1 block w-full text-xs text-text"
                      onChange={(event) => {
                        const chosen = event.target.files?.[0] ?? null;
                        event.target.value = "";
                        void attachFile(resource.id, chosen);
                      }}
                    />
                  </label>
                )}
              </div>
              {resource.hasFile ? (
                <a
                  href={`/api/sops/${resource.id}/file`}
                  aria-label={`Download ${resource.title}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-text-muted hover:bg-surface"
                >
                  <Download className="h-4 w-4" />
                </a>
              ) : (
                <button
                  type="button"
                  aria-label={`Download ${resource.title}`}
                  onClick={() => {
                    setError("");
                    setNotice("No file is available.");
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-text-muted hover:bg-surface"
                >
                  <Download className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {notice ? <p className="mt-4 text-sm text-text-muted">{notice}</p> : null}
    </div>
  );
}
