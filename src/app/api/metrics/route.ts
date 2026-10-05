import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth()));
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
  const personal = searchParams.get("scope") === "personal";
  const person = searchParams.get("person") || "";

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);

  const [requests, hours] = await Promise.all([
    prisma.request.findMany({
      where: { requestedOn: { gte: start, lte: end } },
    }),
    prisma.hourEntry.findMany({
      where: { date: { gte: start, lte: end } },
    }),
  ]);

  const countedHours = personal ? hours.filter((entry) => entry.effortSpentBy === person) : hours;
  const totalHours = countedHours.reduce((sum, entry) => sum + entry.hours, 0);
  const completed = requests.filter((r) => r.status === "Completed").length;
  const deadlineAdherence =
    requests.length > 0 ? Math.round((completed / requests.length) * 100) : 100;

  const teamCounts: Record<string, number> = {};
  requests.forEach((r) => {
    teamCounts[r.teamName] = (teamCounts[r.teamName] || 0) + 1;
  });
  const topStakeholder =
    Object.entries(teamCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "HR";

  const workingDays = 22;
  const capacity = personal ? workingDays * 8 : workingDays * 8 * 4;
  const utilisation = ((totalHours / capacity) * 100).toFixed(1);

  return NextResponse.json({
    numberOfProjects: requests.length,
    totalEffortHours: totalHours.toFixed(2),
    teamUtilisation: `${utilisation}%`,
    scope: personal ? "personal" : "team",
    deadlineAdherence: `${deadlineAdherence}%`,
    topStakeholder,
    workingDays: String(workingDays),
  });
}
