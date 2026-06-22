import { redisClient } from "./client.js";
import { keys } from "./keys.js";

export async function incrementSubscriberCount(
  sportKey: string,
): Promise<number> {
  return redisClient.hincrby(keys.subscribers, sportKey, 1);
}

export async function decrementSubscriberCount(
  sportKey: string,
): Promise<number> {
  const count = await redisClient.hincrby(keys.subscribers, sportKey, -1);

  if (count <= 0) {
    await redisClient.hdel(keys.subscribers, sportKey);
    return 0;
  }

  return count;
}

export async function getSubscriberCount(sportKey: string): Promise<number> {
  const count = await redisClient.hget(keys.subscribers, sportKey);
  return count ? Number(count) : 0;
}

