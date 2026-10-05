"use client";

import { useRef } from "react";
import { Paperclip } from "lucide-react";

export interface SavedAttachment {
  id: string;
  filename: string;
}

export function AttachmentsField({
  pending,
  saved = [],
  onPick,
}: {
  pending: File[];
  saved?: SavedAttachment[];
  onPick: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFiles = saved.length > 0 || pending.length > 0;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-text">Attachments</label>
      <div className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-muted">
        {hasFiles ? (
          <span className="mb-1 flex flex-col gap-1 text-text">
            {saved.map((file) => (
              <a key={file.id} href={`/api/attachments/${file.id}`} className="text-cobalt hover:underline">
                {file.filename}
              </a>
            ))}
            {pending.map((file) => (
              <span key={`${file.name}-${file.size}-${file.lastModified}`}>{file.name}</span>
            ))}
          </span>
        ) : (
          <span>There is nothing attached. </span>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1 text-cobalt hover:underline"
        >
          <Paperclip className="h-3 w-3" /> Attach file
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          onChange={(event) => {
            const picked = Array.from(event.target.files ?? []);
            if (picked.length > 0) onPick(picked);
            event.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
