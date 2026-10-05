import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get("requestId");
  const projectNumber = searchParams.get("projectNumber");
  const person = searchParams.get("person");

  const where: { requestId?: string; effortSpentBy?: string } = {};
  if (person) where.effortSpentBy = person;

  if (requestId) {
    where.requestId = requestId;
  } else if (projectNumber) {
    const req = await prisma.request.findUnique({
      where: { projectNumber: parseInt(projectNumber) },
    });
    if (!req) return NextResponse.json([]);
    where.requestId = req.id;
  }

  const hours = await prisma.hourEntry.findMany({
    where,
    orderBy: { date: "desc" },
    include: {
      request: { select: { projectNumber: true, projectName: true } },
    },
  });

  return NextResponse.json(hours);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const req = await prisma.request.findFirst({
    where: {
      OR: [
        { id: body.requestId },
        { projectNumber: parseInt(body.projectNumber) || -1 },
      ],
    },
  });

  if (!req) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  const entry = await prisma.hourEntry.create({
    data: {
      requestId: req.id,
      hours: parseFloat(body.hours),
      category: body.category,
      subCategory: body.subCategory,
      date: new Date(body.date),
      remarks: body.remarks,
      effortSpentBy: body.effortSpentBy || "Chacko, Arun",
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
