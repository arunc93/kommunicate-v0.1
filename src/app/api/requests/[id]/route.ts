import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const req = await prisma.request.findFirst({
    where: {
      OR: [{ id }, { projectNumber: parseInt(id) || -1 }],
    },
    include: { hourEntries: { orderBy: { date: "desc" } } },
  });

  if (!req) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(req);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.request.findFirst({
    where: { OR: [{ id }, { projectNumber: parseInt(id) || -1 }] },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, unknown> = { ...body };
  if (body.requestedOn) data.requestedOn = new Date(body.requestedOn);
  if (body.targetReleaseDate) data.targetReleaseDate = new Date(body.targetReleaseDate);
  if (body.deadline) data.deadline = new Date(body.deadline);
  delete data.id;
  delete data.projectNumber;

  const updated = await prisma.request.update({
    where: { id: existing.id },
    data,
  });

  return NextResponse.json(updated);
}
