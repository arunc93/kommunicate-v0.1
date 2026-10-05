import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  const templates = await prisma.template.findMany({
    where: search ? { name: { contains: search } } : undefined,
    orderBy: { name: "asc" },
  });

  return NextResponse.json(templates);
}
