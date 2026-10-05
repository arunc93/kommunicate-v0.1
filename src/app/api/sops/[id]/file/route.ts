import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { storedFileResponse } from "@/lib/stored-files";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const row = await prisma.sopResource.findUnique({ where: { id } });
  if (!row?.storedPath) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return storedFileResponse(row.storedPath, row.filename || "download", "attachment");
}
