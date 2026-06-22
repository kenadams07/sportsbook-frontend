import { Redis } from "ioredis";

import { env } from "../config/index.js";

const redisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  lazyConnect: true,
  maxRetriesPerRequest: null,
};

export const redisClient = new Redis(redisOptions);
export const redisSubscriber = new Redis(redisOptions);

export async function connectRedis() {
  await Promise.all([redisClient.connect(), redisSubscriber.connect()]);
  await redisClient.ping();
}

export async function disconnectRedis() {
  await Promise.all([redisClient.quit(), redisSubscriber.quit()]);
}
