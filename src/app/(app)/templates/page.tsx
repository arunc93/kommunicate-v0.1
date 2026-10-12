"use client";

import { useEffect, useState } from "react";
import { Download, Search, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppRole } from "@/features/auth/role-context";

interface Template {
  id: string;
  name: string;
  fileType: string;
  fileUrl: string;
}

export default function TemplatesPage() {
  const role = useAppRole();
  const canEdit = role === "lead" || role === "comms";
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchTemplates = async (query = "") => {
    const params = query ? `?search=${encodeURIComponent(query)}` : "";
    const response = await fetch(`/api/templates${params}`);
    setTemplates(await response.json());
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const clearSearch = () => {
    setSearch("");
    fetchTemplates("");
  };

  const download = (template: Template) => {
    if (!template.fileUrl || template.fileUrl === "#") return;
    window.open(template.fileUrl, "_blank", "noopener,noreferrer");
  };

  const addTemplate = async () => {
    if (!name.trim() || !file) {
      setError("Add a name and a file.");
      return;
    }

    const body = new FormData();
    body.set("name", name.trim());
    body.set("file", file);
    setBusy(true);
    setError("");
    const response = await fetch("/api/templates", { method: "POST", body });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setError(typeof data.error === "string" ? data.error : "Could not add that template.");
      return;
    }

    setName("");
    setFile(null);
    setFormKey((current) => current + 1);
    setAdding(false);
    fetchTemplates(search);
  };

  const removeTemplate = async (template: Template) => {
    setError("");
    const response = await fetch(`/api/templates/${template.id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Could not delete that template.");
      return;
    }
    fetchTemplates(search);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Library"
        title="Templates"
        description="Email and presentation starters. Search, then download."
      />

      <div className="panel mb-4 flex flex-col gap-2.5 p-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:min-w-[220px] sm:flex-1">
          <input
            type="text"
            placeholder="Search with name of template"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                fetchTemplates(search);
              }
            }}
            className="field pr-8"
          />
          {search ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <Button type="button" onClick={() => fetchTemplates(search)}>
          <Search className="h-4 w-4" /> Search
        </Button>
        {canEdit ? (
          <Button
            type="button"
            variant="outline"
            aria-pressed={adding}
            onClick={() => {
              setAdding((current) => !current);
              setError("");
            }}
          >
            Add template
          </Button>
        ) : null}
      </div>

      {adding ? (
        <div key={formKey} className="panel mb-4 grid grid-cols-1 gap-4 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <Input label="Name" required value={name} onChange={(event) => setName(event.target.value)} />
          <div className="flex flex-col gap-1">
            <label htmlFor="template-file" className="field-label">
              File<span className="ml-0.5 text-error">*</span>
            </label>
            <input
              id="template-file"
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="text-sm text-text file:mr-3 file:rounded-lg file:border-0 file:bg-cobalt file:px-3 file:py-1.5 file:text-[13px] file:font-bold file:text-white"
            />
            {file ? <span className="text-xs text-text-muted">{file.name}</span> : null}
          </div>
          <Button type="button" onClick={addTemplate} disabled={busy}>
            {busy ? "Adding" : "Add"}
          </Button>
          {error ? <p className="text-sm text-error md:col-span-3">{error}</p> : null}
        </div>
      ) : null}

      {!adding && error ? <p className="mb-4 text-sm text-error">{error}</p> : null}

      <div className="panel overflow-hidden">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex flex-wrap items-center justify-between gap-3 border-t border-row-line px-4 py-4 first:border-t-0 md:px-5"
          >
            <div className="min-w-[180px] flex-1">
              <b className="block text-text">{template.name}</b>
              <span className="text-xs text-text-muted">{template.fileType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => download(template)}>
                Download <Download className="h-3 w-3" />
              </Button>
              {canEdit ? (
                <button
                  type="button"
                  aria-label={`Delete ${template.name}`}
                  onClick={() => removeTemplate(template)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-error hover:bg-surface"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <p className="px-6 py-8 text-sm text-text-muted">No templates match that name.</p>
        )}
      </div>
    </div>
  );
}
