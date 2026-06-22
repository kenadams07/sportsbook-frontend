import { prisma } from "../db/client.js";
import { redisClient } from "../redis/client.js";

type HealthStatus = {
  status: "ok" | "error";
  redis: "ok" | "error";
  db: "ok" | "error";
};

export async function getHealthStatus(): Promise<HealthStatus> {
  const checks = await Promise.allSettled([
    redisClient.ping(),
    prisma.$queryRaw`SELECT 1`,
  ]);

  const redisOk = checks[0]?.status === "fulfilled";
  const dbOk = checks[1]?.status === "fulfilled";
  const healthy = redisOk && dbOk;

  return {
    status: healthy ? "ok" : "error",
    redis: redisOk ? "ok" : "error",
    db: dbOk ? "ok" : "error",
  };
}
