import { rm } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { attachmentsRoot } from "@/lib/attachments";
import { rejectUnlessLead } from "@/lib/lead-only";
import { removeStored, storeUpload } from "@/lib/stored-files";
import { presentSop } from "@/features/sops/resources";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await rejectUnlessLead();
  if (denied) return denied;

  const { id } = await params;
  const row = await prisma.sopResource.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a file to attach." }, { status: 400 });
  }

  const saved = await storeUpload("sops", row.id, file);
  if ("error" in saved) return NextResponse.json({ error: saved.error }, { status: 400 });

  const updated = await prisma.sopResource.update({
    where: { id: row.id },
    data: { storedPath: saved.relative, filename: saved.filename },
  });
  if (row.storedPath && row.storedPath !== saved.relative) await removeStored(row.storedPath);

  return NextResponse.json(presentSop(updated));
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await rejectUnlessLead();
  if (denied) return denied;

  const { id } = await params;
  const row = await prisma.sopResource.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (row.builtin) {
    return NextResponse.json({ error: "The original cards stay on the page." }, { status: 400 });
  }

  await removeStored(row.storedPath);
  await prisma.sopResource.delete({ where: { id: row.id } });
  await rm(path.join(attachmentsRoot(), "sops", row.id), { recursive: true, force: true });

  return NextResponse.json({ ok: true });
}
