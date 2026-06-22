import { redisClient } from "./client.js";
import { keys } from "./keys.js";

export async function pauseSportKey(sportKey: string): Promise<void> {
  await redisClient.sadd(keys.paused, sportKey);
}

export async function resumeSportKey(sportKey: string): Promise<void> {
  await redisClient.srem(keys.paused, sportKey);
}

export async function isSportKeyPaused(sportKey: string): Promise<boolean> {
  const result = await redisClient.sismember(keys.paused, sportKey);

  return result === 1;
}
