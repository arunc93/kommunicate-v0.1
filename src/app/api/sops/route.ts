import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rejectUnlessLead } from "@/lib/lead-only";
import { storeUpload } from "@/lib/stored-files";
import { ensureSopResources, presentSop } from "@/features/sops/resources";

export async function GET() {
  await ensureSopResources();
  const rows = await prisma.sopResource.findMany({ orderBy: [{ order: "asc" }, { title: "asc" }] });
  return NextResponse.json(rows.map(presentSop));
}

export async function POST(request: NextRequest) {
  const denied = await rejectUnlessLead();
  if (denied) return denied;

  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const file = form.get("file");

  if (!title || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Add a name and a file." }, { status: 400 });
  }
  if (title.length > 200) {
    return NextResponse.json({ error: "Use a shorter name." }, { status: 400 });
  }

  await ensureSopResources();
  const max = await prisma.sopResource.aggregate({ _max: { order: true } });
  const created = await prisma.sopResource.create({
    data: {
      title,
      order: (max._max.order ?? 0) + 1,
      builtin: false,
    },
  });

  const saved = await storeUpload("sops", created.id, file);
  if ("error" in saved) {
    await prisma.sopResource.delete({ where: { id: created.id } });
    return NextResponse.json({ error: saved.error }, { status: 400 });
  }

  const updated = await prisma.sopResource.update({
    where: { id: created.id },
    data: { storedPath: saved.relative, filename: saved.filename },
  });

  return NextResponse.json(presentSop(updated), { status: 201 });
}
