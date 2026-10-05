import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { storedFileResponse } from "@/lib/stored-files";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const project = await prisma.galleryProject.findUnique({ where: { id } });
  if (!project?.imagePath) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return storedFileResponse(project.imagePath, path.basename(project.imagePath), "inline");
}
