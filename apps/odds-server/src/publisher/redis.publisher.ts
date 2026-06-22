import { logger } from "../logger.js";
import { redisClient } from "../redis/client.js";
import { keys } from "../redis/keys.js";
import type { OddsDelta } from "../types/internal.types.js";

const publisherLogger = logger.child({ module: "redis-publisher" });

export async function publishOddsDeltas(
  sportKey: string,
  deltas: OddsDelta[],
): Promise<number> {
  if (deltas.length === 0) {
    return 0;
  }

  const startedAt = Date.now();
  const subscriberCount = await redisClient.publish(
    keys.channel(sportKey),
    JSON.stringify(deltas),
  );

  publisherLogger.info(
    {
      phase: "publish",
      sportKey,
      deltaCount: deltas.length,
      subscriberCount,
      durationMs: Date.now() - startedAt,
    },
    "published odds deltas",
  );

  return subscriberCount;
}
