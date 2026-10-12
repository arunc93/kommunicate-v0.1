import { rm } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { attachmentsRoot } from "@/lib/attachments";
import { rejectUnlessCommsOrLead } from "@/lib/lead-only";
import { removeStored } from "@/lib/stored-files";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await rejectUnlessCommsOrLead();
  if (denied) return denied;

  const { id } = await params;
  const template = await prisma.template.findUnique({ where: { id } });
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await removeStored(template.storedPath);
  await prisma.template.delete({ where: { id: template.id } });
  if (template.storedPath) {
    await rm(path.join(attachmentsRoot(), "templates", template.id), { recursive: true, force: true });
  }

  return NextResponse.json({ ok: true });
}
