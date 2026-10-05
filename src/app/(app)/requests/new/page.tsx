import { prisma } from "@/lib/prisma";
import { generateProjectNumber } from "@/lib/utils";
import { NewRequestForm } from "./new-request-form";

export default async function NewRequestPage() {
  let projectNumber = generateProjectNumber();
  while (await prisma.request.findUnique({ where: { projectNumber }, select: { id: true } })) {
    projectNumber = generateProjectNumber();
  }

  return <NewRequestForm projectNumber={projectNumber} />;
}
