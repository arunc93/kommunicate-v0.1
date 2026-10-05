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
      <PageHeader title="Templates" />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
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
            className="w-full rounded-md border border-border bg-white px-4 py-2 pr-8 text-sm text-text outline-none focus:border-cobalt"
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

      <div className="overflow-hidden rounded-md border border-border bg-white shadow-elevation-1">
        {templates.map((template, index) => (
          <div
            key={template.id}
            className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-4 last:border-0 md:px-6"
          >
            <div className={index === 0 ? "h-10 w-1 shrink-0 rounded-sm bg-navy" : "h-10 w-1 shrink-0"} />
            <span className="min-w-[180px] flex-1 font-medium text-text">{template.name}</span>
            <span className="w-16 text-center text-sm text-text-muted">{template.fileType}</span>
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
