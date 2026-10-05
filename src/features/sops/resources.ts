import { prisma } from "@/lib/prisma";

export const SOP_ORIGINALS = [
  {
    id: "sop-procedures",
    title: "Standard operating procedures for consulting communication team",
    order: 1,
  },
  {
    id: "sop-turnaround",
    title: "Standard turnaround time for communication delivery",
    order: 2,
  },
  {
    id: "sop-guide",
    title: "User guide for Kommunicate",
    order: 3,
  },
] as const;

export async function ensureSopResources() {
  for (const item of SOP_ORIGINALS) {
    await prisma.sopResource.upsert({
      where: { id: item.id },
      update: {},
      create: { id: item.id, title: item.title, order: item.order, builtin: true },
    });
  }
}

export function presentSop(row: {
  id: string;
  title: string;
  order: number;
  builtin: boolean;
  storedPath: string | null;
  filename: string | null;
}) {
  return {
    id: row.id,
    title: row.title,
    order: row.order,
    builtin: row.builtin,
    hasFile: Boolean(row.storedPath),
    filename: row.filename,
  };
}
