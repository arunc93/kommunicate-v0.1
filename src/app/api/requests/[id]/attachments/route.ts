import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentPreviewRole } from "@/lib/lead-only";
import { MAX_ATTACHMENT_BYTES } from "@/features/requests/attachment-limits";
import { attachmentsRoot, safeAttachmentName } from "@/lib/attachments";

async function findRequest(id: string) {
  return prisma.request.findFirst({
    where: { OR: [{ id }, { projectNumber: parseInt(id) || -1 }] },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const role = await currentPreviewRole();
  if (!role) return NextResponse.json({ error: "Only a signed-in user can edit this." }, { status: 403 });

  const existing = await findRequest(id);
  if (!existing) return NextResponse.json({ error: "Request not found" }, { status: 404 });
  if (role === "stakeholder" && existing.status !== "Brief submitted") {
    return NextResponse.json({ error: "This request can no longer be edited." }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a file to attach." }, { status: 400 });
  }
  if (file.size > MAX_ATTACHMENT_BYTES) {
    return NextResponse.json({ error: "That file is larger than 20 MB." }, { status: 400 });
  }

  const filename = safeAttachmentName(file.name);
  const storedName = `${Date.now()}-${filename}`;
  const relative = path.join("request-attachments", existing.id, storedName);
  const directory = path.join(attachmentsRoot(), "request-attachments", existing.id);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, storedName), Buffer.from(await file.arrayBuffer()));

  const attachment = await prisma.attachment.create({
    data: {
      requestId: existing.id,
      filename: file.name || filename,
      storedPath: relative,
    },
    select: { id: true, filename: true },
  });

  return NextResponse.json(attachment, { status: 201 });
}
