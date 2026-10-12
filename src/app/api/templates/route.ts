import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rejectUnlessCommsOrLead } from "@/lib/lead-only";
import { storeUpload } from "@/lib/stored-files";

function fileTypeFor(filename: string): string {
  const extension = path.extname(filename).replace(".", "").trim();
  return (extension || "file").toUpperCase();
}

function present(template: {
  id: string;
  name: string;
  fileType: string;
  fileUrl: string;
  storedPath: string | null;
}) {
  return {
    id: template.id,
    name: template.name,
    fileType: template.fileType,
    fileUrl: template.storedPath ? `/api/templates/${template.id}/file` : template.fileUrl,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  const templates = await prisma.template.findMany({
    where: search ? { name: { contains: search } } : undefined,
    orderBy: { name: "asc" },
  });

  return NextResponse.json(templates.map(present));
}

export async function POST(request: NextRequest) {
  const denied = await rejectUnlessCommsOrLead();
  if (denied) return denied;

  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  const file = form.get("file");

  if (!name || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Add a name and a file." }, { status: 400 });
  }
  if (name.length > 200) {
    return NextResponse.json({ error: "Use a shorter name." }, { status: 400 });
  }

  const created = await prisma.template.create({
    data: { name, fileType: fileTypeFor(file.name) },
  });

  const saved = await storeUpload("templates", created.id, file);
  if ("error" in saved) {
    await prisma.template.delete({ where: { id: created.id } });
    return NextResponse.json({ error: saved.error }, { status: 400 });
  }

  const updated = await prisma.template.update({
    where: { id: created.id },
    data: { storedPath: saved.relative },
  });

  return NextResponse.json(present(updated), { status: 201 });
}
