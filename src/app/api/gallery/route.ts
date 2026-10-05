import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rejectUnlessLead } from "@/lib/lead-only";
import { removeStored, storeUpload } from "@/lib/stored-files";

function presentProject(row: {
  id: string;
  title: string;
  imageUrl: string;
  imagePath: string | null;
  pdfPath: string | null;
  order: number;
}) {
  return {
    id: row.id,
    title: row.title,
    order: row.order,
    imageUrl: row.imagePath ? `/api/gallery/${row.id}/image` : row.imageUrl,
    hasPdf: Boolean(row.pdfPath),
  };
}

function isImage(file: File): boolean {
  if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp" || file.type === "image/jpg") {
    return true;
  }
  return /\.(jpe?g|png|webp)$/i.test(file.name);
}

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

export async function GET() {
  const [projects, categories] = await Promise.all([
    prisma.galleryProject.findMany({ orderBy: { order: "asc" } }),
    prisma.galleryCategory.findMany({ orderBy: { order: "asc" } }),
  ]);

  return NextResponse.json({
    projects: projects.map(presentProject),
    categories,
  });
}

export async function POST(request: NextRequest) {
  const denied = await rejectUnlessLead();
  if (denied) return denied;

  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const image = form.get("image");
  const pdf = form.get("pdf");

  if (!title || !(image instanceof File) || image.size === 0 || !(pdf instanceof File) || pdf.size === 0) {
    return NextResponse.json({ error: "Add a name, an image thumbnail, and a PDF." }, { status: 400 });
  }
  if (title.length > 200) {
    return NextResponse.json({ error: "Use a shorter name." }, { status: 400 });
  }
  if (!isImage(image)) {
    return NextResponse.json({ error: "The thumbnail must be a JPEG, PNG, or WebP image." }, { status: 400 });
  }
  if (!isPdf(pdf)) {
    return NextResponse.json({ error: "Attach a PDF." }, { status: 400 });
  }

  const max = await prisma.galleryProject.aggregate({ _max: { order: true } });
  const created = await prisma.galleryProject.create({
    data: {
      title,
      imageUrl: "",
      order: (max._max.order ?? 0) + 1,
    },
  });

  const imageSaved = await storeUpload("gallery", created.id, image);
  if ("error" in imageSaved) {
    await prisma.galleryProject.delete({ where: { id: created.id } });
    return NextResponse.json({ error: imageSaved.error }, { status: 400 });
  }

  const pdfSaved = await storeUpload("gallery", created.id, pdf);
  if ("error" in pdfSaved) {
    await removeStored(imageSaved.relative);
    await prisma.galleryProject.delete({ where: { id: created.id } });
    return NextResponse.json({ error: pdfSaved.error }, { status: 400 });
  }

  const updated = await prisma.galleryProject.update({
    where: { id: created.id },
    data: {
      imagePath: imageSaved.relative,
      imageUrl: `/api/gallery/${created.id}/image`,
      pdfPath: pdfSaved.relative,
      pdfName: pdfSaved.filename,
    },
  });

  return NextResponse.json(presentProject(updated), { status: 201 });
}
