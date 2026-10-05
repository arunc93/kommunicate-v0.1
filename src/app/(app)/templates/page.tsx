"use client";

import { useEffect, useState } from "react";
import { Download, Search, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

interface Template {
  id: string;
  name: string;
  fileType: string;
  fileUrl: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState("");

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
      </div>

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
            <Button type="button" variant="outline" size="sm" onClick={() => download(template)}>
              Download <Download className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {templates.length === 0 && (
          <p className="px-6 py-8 text-sm text-text-muted">No templates match that name.</p>
        )}
      </div>
    </div>
  );
}
