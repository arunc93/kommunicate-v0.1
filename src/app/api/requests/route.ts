import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateProjectNumber } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const requestedBy = searchParams.get("requestedBy");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const deadline = searchParams.get("deadline");

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { projectName: { contains: search } },
      { projectNumber: { equals: parseInt(search) || -1 } },
    ];
  }
  if (status) where.status = status;
  if (requestedBy) where.requestedBy = requestedBy;
  if (from || to) {
    where.requestedOn = {};
    if (from) (where.requestedOn as Record<string, Date>).gte = new Date(from);
    if (to) (where.requestedOn as Record<string, Date>).lte = new Date(to);
  }
  if (deadline) where.deadline = new Date(deadline);

  const requests = await prisma.request.findMany({
    where,
    orderBy: { requestedOn: "desc" },
  });

  return NextResponse.json(requests);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  let projectNumber = body.projectNumber;
  if (!projectNumber) {
    projectNumber = generateProjectNumber();
    while (await prisma.request.findUnique({ where: { projectNumber } })) {
      projectNumber = generateProjectNumber();
    }
  }

  const req = await prisma.request.create({
    data: {
      projectNumber,
      projectName: body.projectName,
      category: body.category,
      createdOnBehalfOf: body.createdOnBehalfOf || "Chacko, Arun",
      requestSummary: body.requestSummary,
      message: body.message,
      creativeSuggestion: body.creativeSuggestion,
      additionalConsideration: body.additionalConsideration,
      primaryAudience: body.primaryAudience,
      teamName: body.teamName,
      sender: body.sender,
      targetAudienceGeo: body.targetAudienceGeo,
      requestedOn: body.requestedOn ? new Date(body.requestedOn) : new Date(),
      targetReleaseDate: body.targetReleaseDate ? new Date(body.targetReleaseDate) : null,
      deadline: body.deadline ? new Date(body.deadline) : null,
      status: body.status || "Brief submitted",
      requestedBy: body.requestedBy || body.createdOnBehalfOf || "Chacko, Arun",
      description: body.description,
    },
  });

  return NextResponse.json(req, { status: 201 });
}
