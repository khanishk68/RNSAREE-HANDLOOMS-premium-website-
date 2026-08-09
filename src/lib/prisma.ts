/**
 * PrismaClient singleton — safe when the client has not been generated yet
 * or the database is not migrated. Call `npx prisma generate` before using.
 */

type PrismaLike = {
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaLike | null | undefined;
};

function createPrismaClient(): PrismaLike | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@prisma/client") as {
      PrismaClient: new (args?: { log?: string[] }) => PrismaLike;
    };
    if (!PrismaClient || typeof PrismaClient !== "function") return null;
    return new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["error", "warn"]
          : ["error"],
    });
  } catch {
    return null;
  }
}

export const prisma: PrismaLike | null =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
