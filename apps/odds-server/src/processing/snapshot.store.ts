import { redisClient } from "../redis/client.js";
import { keys } from "../redis/keys.js";
import type { OddsApiEvent } from "../types/odds-api.types.js";

const SNAPSHOT_TTL_SECONDS = 60 * 60;

export async function getSnapshot(
  eventId: string,
): Promise<OddsApiEvent | null> {
  const raw = await redisClient.get(keys.snapshot(eventId));

  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as OddsApiEvent;
}

export async function setSnapshot(event: OddsApiEvent): Promise<void> {
  await redisClient.set(
    keys.snapshot(event.id),
    JSON.stringify(event),
    "EX",
    SNAPSHOT_TTL_SECONDS,
  );
}
