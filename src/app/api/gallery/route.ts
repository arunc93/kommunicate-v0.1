import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [projects, categories] = await Promise.all([
    prisma.galleryProject.findMany({ orderBy: { order: "asc" } }),
    prisma.galleryCategory.findMany({ orderBy: { order: "asc" } }),
  ]);

  return NextResponse.json({ projects, categories });
}
