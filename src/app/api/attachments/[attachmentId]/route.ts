import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveStoredFile } from "@/lib/attachments";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ attachmentId: string }> },
) {
  const { attachmentId } = await params;
  const attachment = await prisma.attachment.findUnique({ where: { id: attachmentId } });
  if (!attachment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const fullPath = resolveStoredFile(attachment.storedPath);
  if (!fullPath) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const bytes = await readFile(fullPath);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${attachment.filename.replace(/"/g, "")}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
