import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(currentDir, "../../../.env"), quiet: true });

export { Prisma } from "@prisma/client";

export const prisma = new PrismaClient();

export async function connectDb() {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;
}
 
export async function disconnectDb() {
  await prisma.$disconnect();
}
