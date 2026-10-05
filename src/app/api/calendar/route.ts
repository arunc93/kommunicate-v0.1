import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { colors } from "@/theme/tokens";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth()));
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
  const type = searchParams.get("type");

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);

  const events = await prisma.calendarEvent.findMany({
    where: {
      date: { gte: start, lte: end },
      ...(type ? { type } : {}),
    },
    orderBy: { date: "asc" },
  });

  if (type !== "release") return NextResponse.json(events);

  const monthStart = new Date(Date.UTC(year, month, 1));
  const monthEnd = new Date(Date.UTC(year, month + 1, 1));
  const requests = await prisma.request.findMany({
    where: { targetReleaseDate: { gte: monthStart, lt: monthEnd } },
    select: { id: true, projectNumber: true, projectName: true, targetReleaseDate: true },
    orderBy: { targetReleaseDate: "asc" },
  });
  const fromRequests = requests.flatMap((request) => {
    if (!request.targetReleaseDate) return [];
    const release = request.targetReleaseDate;
    const shown = new Date(Date.UTC(release.getUTCFullYear(), release.getUTCMonth(), release.getUTCDate(), 12));
    return [
      {
        id: `request-${request.id}`,
        title: request.projectName,
        date: shown.toISOString(),
        color: colors.cobalt,
        type: "release",
        href: `/requests/${request.projectNumber}`,
      },
    ];
  });

  return NextResponse.json(
    [...events, ...fromRequests].sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime()),
  );
}
