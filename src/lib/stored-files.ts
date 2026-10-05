import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { MAX_ATTACHMENT_BYTES } from "@/features/requests/attachment-limits";
import { attachmentsRoot, resolveStoredFile, safeAttachmentName } from "@/lib/attachments";

const FOLDERS = new Set(["gallery", "sops"]);

export async function storeUpload(
  folder: string,
  id: string,
  file: File,
): Promise<{ relative: string; filename: string } | { error: string }> {
  if (!FOLDERS.has(folder) || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return { error: "Could not store that file." };
  }
  if (file.size === 0) return { error: "Choose a file." };
  if (file.size > MAX_ATTACHMENT_BYTES) return { error: "That file is larger than 20 MB." };

  const filename = safeAttachmentName(file.name);
  const storedName = `${Date.now()}-${filename}`;
  const relative = path.join(folder, id, storedName);
  const directory = path.join(attachmentsRoot(), folder, id);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, storedName), Buffer.from(await file.arrayBuffer()));
  return { relative, filename: file.name || filename };
}

export async function removeStored(storedPath: string | null | undefined): Promise<void> {
  if (!storedPath) return;
  const full = resolveStoredFile(storedPath);
  if (!full) return;
  try {
    await unlink(full);
  } catch {
    // The record can be removed even if the file is already gone.
  }
}

function contentTypeFor(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".pdf")) return "application/pdf";
  return "application/octet-stream";
}

export async function storedFileResponse(
  storedPath: string,
  downloadName: string,
  disposition: "inline" | "attachment",
): Promise<NextResponse> {
  const full = resolveStoredFile(storedPath);
  if (!full) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const bytes = await readFile(full);
    const safeName = downloadName.replace(/[\r\n"]/g, "") || "download";
    const headers: Record<string, string> = {
      "Content-Type": contentTypeFor(safeName),
      "Cache-Control": "private, no-store",
    };
    if (disposition === "attachment") {
      headers["Content-Disposition"] = `attachment; filename="${safeName}"`;
    }
    return new NextResponse(bytes, { headers });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
