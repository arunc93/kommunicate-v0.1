import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// The dev server keeps this client on globalThis. After a schema change the
// cached instance can predate a new model, so replace it before the next query.
const cached = globalForPrisma.prisma;
if (cached && !("sopResource" in (cached as object))) {
  void cached.$disconnect();
  globalForPrisma.prisma = undefined;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
