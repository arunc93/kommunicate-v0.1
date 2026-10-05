import path from "path";

export function attachmentsRoot(): string {
  return path.resolve(process.cwd(), "uploads");
}

export function safeAttachmentName(filename: string): string {
  const base = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.replace(/^\.+/, "") || "attachment";
}

export function resolveStoredFile(storedPath: string): string | null {
  const root = attachmentsRoot();
  const full = path.resolve(root, storedPath);
  if (full !== root && !full.startsWith(root + path.sep)) return null;
  return full;
}
