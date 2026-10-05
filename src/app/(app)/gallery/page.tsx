"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppRole } from "@/features/auth/role-context";
import { cn } from "@/lib/utils";

interface GalleryProject {
  id: string;
  title: string;
  imageUrl: string;
  hasPdf: boolean;
}

interface GalleryCategory {
  id: string;
  title: string;
  hasPptIcon: boolean;
}

const CATEGORY_STYLE: Record<string, string> = {
  Guidelines: "bg-gradient-to-r from-pacific to-light-blue",
  "Case studies": "bg-gradient-to-r from-navy to-kpmg-blue",
  "Consulting overview Deck": "bg-gradient-to-r from-purple to-cobalt",
};

export default function GalleryPage() {
  const canEdit = useAppRole() === "lead";
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const showEdit = canEdit && editing;

  const load = () => {
    fetch("/api/gallery")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data) return;
        setProjects(data.projects ?? []);
        setCategories(data.categories ?? []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setTitle("");
    setImageFile(null);
    setPdfFile(null);
    setFormKey((current) => current + 1);
  };

  const addTile = async () => {
    const missing: string[] = [];
    if (!title.trim()) missing.push("a name");
    if (!imageFile) missing.push("an image thumbnail");
    if (!pdfFile) missing.push("a PDF");
    if (missing.length > 0) {
      setError(`Add ${missing.join(", ")}.`);
      return;
    }

    const body = new FormData();
    body.set("title", title.trim());
    body.set("image", imageFile as File);
    body.set("pdf", pdfFile as File);

    setBusy(true);
    setError("");
    const response = await fetch("/api/gallery", { method: "POST", body });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setError(typeof data.error === "string" ? data.error : "Could not add that tile.");
      return;
    }
    resetForm();
    load();
  };

  const removeTile = async (id: string) => {
    setError("");
    const response = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Could not remove that tile.");
      return;
    }
    load();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Work"
        title="Gallery"
        description="Recent projects and category shelves."
      >
        {canEdit && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditing((current) => !current);
              setError("");
            }}
          >
            {showEdit ? "Done" : "Edit"}
          </Button>
        )}
      </PageHeader>

      <div className="panel p-4 md:p-6">
        {showEdit && (
          <div key={formKey} className="mb-6 grid grid-cols-1 gap-4 border-b border-border pb-6 md:grid-cols-2 xl:grid-cols-4">
            <Input label="Name" required value={title} onChange={(event) => setTitle(event.target.value)} />
            <div className="flex flex-col gap-1">
              <label htmlFor="gallery-thumbnail" className="field-label">
                Image thumbnail<span className="ml-0.5 text-error">*</span>
              </label>
              <input
                id="gallery-thumbnail"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                className="text-sm text-text file:mr-3 file:rounded-lg file:border-0 file:bg-cobalt file:px-3 file:py-1.5 file:text-[13px] file:font-bold file:text-white"
              />
              {imageFile ? <span className="text-xs text-text-muted">{imageFile.name}</span> : null}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="gallery-pdf" className="field-label">
                PDF attachment<span className="ml-0.5 text-error">*</span>
              </label>
              <input
                id="gallery-pdf"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
                className="text-sm text-text file:mr-3 file:rounded-lg file:border-0 file:bg-cobalt file:px-3 file:py-1.5 file:text-[13px] file:font-bold file:text-white"
              />
              {pdfFile ? <span className="text-xs text-text-muted">{pdfFile.name}</span> : null}
            </div>
            <div className="flex items-end">
              <Button type="button" onClick={addTile} disabled={busy}>
                Add tile
              </Button>
            </div>
            {error ? <p className="text-sm text-error md:col-span-2 xl:col-span-4">{error}</p> : null}
          </div>
        )}

        {!showEdit && error ? <p className="mb-4 text-sm text-error">{error}</p> : null}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold leading-7 text-text">Recent projects</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => {
                const remote = project.imageUrl.startsWith("https://");
                const body = (
                  <>
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      unoptimized={!remote}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-sm font-medium leading-5 text-white">{project.title}</p>
                      <div className="mt-1.5 h-0.5 w-8 bg-pink" />
                    </div>
                    {showEdit && (
                      <button
                        type="button"
                        aria-label={`Remove ${project.title}`}
                        onClick={() => removeTile(project.id)}
                        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-md bg-white text-error shadow-elevation-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </>
                );
                const className = "relative block aspect-square overflow-hidden rounded-[14px]";
                if (!showEdit && project.hasPdf) {
                  return (
                    <a key={project.id} href={`/api/gallery/${project.id}/pdf`} className={className} aria-label={`Download ${project.title}`}>
                      {body}
                    </a>
                  );
                }
                return (
                  <div key={project.id} className={className}>
                    {body}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:h-full lg:min-h-0 lg:grid-rows-[auto_minmax(0,1fr)]">
            <h2 className="mb-4 text-xl font-semibold leading-7 text-text">Categories</h2>
            <div
              className="flex flex-col gap-4 lg:grid lg:min-h-0"
              style={{ gridTemplateRows: `repeat(${Math.max(categories.length, 1)}, minmax(100px, 1fr))` }}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={cn(
                    "relative flex min-h-[120px] items-end rounded-[14px] p-3.5",
                    CATEGORY_STYLE[category.title] ?? "bg-kpmg-blue",
                  )}
                >
                  {category.hasPptIcon && (
                    <span className="absolute left-3 top-3 rounded-sm bg-white/20 px-1.5 py-0.5 text-xs font-semibold text-white">
                      PPT
                    </span>
                  )}
                  <p
                    className={cn(
                      "text-sm font-bold leading-5",
                      category.title === "Guidelines" ? "text-text" : "text-white",
                    )}
                  >
                    {category.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
