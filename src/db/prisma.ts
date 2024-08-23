import { PrismaClient } from "@prisma/client";

const gloabalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  gloabalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") {
  gloabalForPrisma.prisma = prisma;
}
