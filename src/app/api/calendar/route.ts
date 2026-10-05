import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  return NextResponse.json(events);
}
