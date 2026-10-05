import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentPreviewRole } from "@/lib/lead-only";
import { missingRequestLabels } from "@/features/requests/required-fields";
import { REQUEST_STATUSES, type RequestStatus } from "@/lib/types";

const OPTIONAL_TEXT = [
  "message",
  "creativeSuggestion",
  "additionalConsideration",
  "primaryAudience",
  "sender",
] as const;

const CONTENT_KEYS = [
  "projectName",
  "category",
  "createdOnBehalfOf",
  "requestSummary",
  "teamName",
  "targetAudienceGeo",
  ...OPTIONAL_TEXT,
  "deadline",
  "targetReleaseDate",
  "requestedOn",
  "iterations",
] as const;

function trimmed(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseDate(value: unknown): Date | null | "invalid" {
  if (value === null || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "invalid";
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? "invalid" : parsed;
}

function isRequestStatus(value: unknown): value is RequestStatus {
  return typeof value === "string" && (REQUEST_STATUSES as readonly string[]).includes(value);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const req = await prisma.request.findFirst({
    where: {
      OR: [{ id }, { projectNumber: parseInt(id) || -1 }],
    },
    include: {
      hourEntries: { orderBy: { date: "desc" } },
      attachments: { select: { id: true, filename: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!req) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(req);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const role = await currentPreviewRole();
  if (!role) return NextResponse.json({ error: "Only a signed-in user can edit this." }, { status: 403 });

  const body = await request.json();
  const existing = await prisma.request.findFirst({
    where: { OR: [{ id }, { projectNumber: parseInt(id) || -1 }] },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if ("projectNumber" in body && Number(body.projectNumber) !== existing.projectNumber) {
    return NextResponse.json({ error: "Each request keeps its own project number." }, { status: 400 });
  }

  const contentKeys = CONTENT_KEYS.filter((key) => key in body);
  if (role === "stakeholder" && ("status" in body || "declineReason" in body)) {
    return NextResponse.json({ error: "Only comms or a lead can change status." }, { status: 403 });
  }
  if (role === "stakeholder" && contentKeys.length > 0 && existing.status !== "Brief submitted") {
    return NextResponse.json({ error: "This request can no longer be edited." }, { status: 403 });
  }

  const data: {
    projectName?: string;
    category?: string;
    createdOnBehalfOf?: string;
    requestSummary?: string;
    teamName?: string;
    targetAudienceGeo?: string;
    message?: string | null;
    creativeSuggestion?: string | null;
    additionalConsideration?: string | null;
    primaryAudience?: string | null;
    sender?: string | null;
    deadline?: Date | null;
    targetReleaseDate?: Date | null;
    requestedOn?: Date;
    iterations?: number;
    requestedBy?: string;
    status?: string;
    declineReason?: string | null;
  } = {};

  for (const key of ["projectName", "category", "createdOnBehalfOf", "requestSummary", "teamName", "targetAudienceGeo"] as const) {
    if (key in body) data[key] = trimmed(body[key]);
  }
  for (const key of OPTIONAL_TEXT) {
    if (!(key in body)) continue;
    const value = trimmed(body[key]);
    data[key] = value || null;
  }
  if ("deadline" in body || "targetReleaseDate" in body || "requestedOn" in body) {
    const deadline = "deadline" in body ? parseDate(body.deadline) : undefined;
    const release = "targetReleaseDate" in body ? parseDate(body.targetReleaseDate) : undefined;
    const requested = "requestedOn" in body ? parseDate(body.requestedOn) : undefined;
    if (deadline === "invalid" || release === "invalid" || requested === "invalid") {
      return NextResponse.json({ error: "Enter a valid date." }, { status: 400 });
    }
    if (requested === null) {
      return NextResponse.json({ error: "Enter the requested on date." }, { status: 400 });
    }
    if (deadline !== undefined) data.deadline = deadline;
    if (release !== undefined) data.targetReleaseDate = release;
    if (requested) data.requestedOn = requested;
  }
  if ("iterations" in body) {
    const iterations = typeof body.iterations === "number" ? body.iterations : Number(body.iterations);
    if (!Number.isInteger(iterations) || iterations < 0) {
      return NextResponse.json({ error: "Iterations must be a whole number from 0 up." }, { status: 400 });
    }
    data.iterations = iterations;
  }
  if ("projectName" in body) {
    const release = "targetReleaseDate" in body ? data.targetReleaseDate : existing.targetReleaseDate;
    const missing = missingRequestLabels({
      projectName: data.projectName ?? existing.projectName,
      category: data.category ?? existing.category,
      createdOnBehalfOf: data.createdOnBehalfOf ?? existing.createdOnBehalfOf,
      requestSummary: data.requestSummary ?? existing.requestSummary,
      teamName: data.teamName ?? existing.teamName,
      targetAudienceGeo: data.targetAudienceGeo ?? existing.targetAudienceGeo ?? "",
      targetReleaseDate: release ? release.toISOString() : "",
    });
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Fill in: ${missing.join(", ")}.`, fields: missing },
        { status: 400 },
      );
    }
  }
  if (data.createdOnBehalfOf) data.requestedBy = data.createdOnBehalfOf;

  if ("status" in body) {
    if (!isRequestStatus(body.status)) {
      return NextResponse.json({ error: "Choose a status from the list." }, { status: 400 });
    }
    if (body.status === "Declined") {
      const reason = typeof body.declineReason === "string" ? body.declineReason.trim() : "";
      if (!reason) {
        return NextResponse.json({ error: "Enter a reason for the decline." }, { status: 400 });
      }
      data.status = body.status;
      data.declineReason = reason;
    } else {
      data.status = body.status;
      data.declineReason = null;
    }
  }

  const updated = await prisma.request.update({
    where: { id: existing.id },
    data,
  });

  return NextResponse.json(updated);
}
