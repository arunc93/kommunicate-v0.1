import { rm } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { attachmentsRoot } from "@/lib/attachments";
import { rejectUnlessLead } from "@/lib/lead-only";
import { removeStored } from "@/lib/stored-files";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await rejectUnlessLead();
  if (denied) return denied;

  const { id } = await params;
  const project = await prisma.galleryProject.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await removeStored(project.imagePath);
  await removeStored(project.pdfPath);
  await prisma.galleryProject.delete({ where: { id: project.id } });
  await rm(path.join(attachmentsRoot(), "gallery", project.id), { recursive: true, force: true });

  return NextResponse.json({ ok: true });
}
