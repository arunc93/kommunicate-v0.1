"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Search, RefreshCw, Download } from "lucide-react";

interface Template {
  id: string;
  name: string;
  fileType: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState("");

  const fetchTemplates = async (q?: string) => {
    const params = q ? `?search=${encodeURIComponent(q)}` : "";
    const res = await fetch(`/api/templates${params}`);
    setTemplates(await res.json());
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div>
      <PageHeader title="Templates" />

      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search with name of template"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#4ebce9]"
        />
        <Button onClick={() => fetchTemplates(search)} className="bg-[#4e5d94]">
          <Search className="h-4 w-4" /> Search
        </Button>
        <button
          onClick={() => { setSearch(""); fetchTemplates(); }}
          className="text-gray-400 hover:text-gray-600 p-2"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {templates.map((template, i) => (
          <div
            key={template.id}
            className="flex items-center px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
          >
            {i === 0 && <div className="w-1 h-10 bg-black rounded mr-4 shrink-0" />}
            {i !== 0 && <div className="w-1 h-10 mr-4 shrink-0" />}
            <span className="flex-1 text-[#1a2b4b] font-medium">{template.name}</span>
            <span className="w-20 text-center text-gray-400 text-sm">{template.fileType}</span>
            <Button variant="outline" size="sm" className="ml-4">
              Download <Download className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
