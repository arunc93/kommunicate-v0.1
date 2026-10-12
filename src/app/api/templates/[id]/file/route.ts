import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { storedFileResponse } from "@/lib/stored-files";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const template = await prisma.template.findUnique({ where: { id } });
  if (!template?.storedPath) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const storedName = path.basename(template.storedPath).replace(/^\d+-/, "");
  const downloadName = storedName || `${template.name}.${template.fileType.toLowerCase()}`;
  return storedFileResponse(template.storedPath, downloadName, "attachment");
}
