import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

// On Vercel / Serverless environments, the deployment root directory (/var/task) is read-only.
// Copy the SQLite database to /tmp if running on Vercel so all write operations (adding links, creating pages, saving users) succeed.
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  try {
    const tmpDbPath = "/tmp/dev.db";
    const bundledDbPath = path.join(process.cwd(), "prisma", "dev.db");
    if (!fs.existsSync(/*turbopackIgnore: true*/ tmpDbPath)) {
      if (fs.existsSync(/*turbopackIgnore: true*/ bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, tmpDbPath);
      }
    }
    process.env.DATABASE_URL = `file:${tmpDbPath}`;
  } catch (err) {
    console.warn("Prisma Vercel /tmp db copy notice:", err);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;