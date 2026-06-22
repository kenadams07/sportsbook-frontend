import type { EventStatus } from "@prisma/client";
import type { OddsApiScore } from "../types/odds-api.types.js";

export function resolveEventStatusFromScore(score: OddsApiScore): EventStatus {
  if (score.completed) {
    return "SETTLED";
  }

  if (score.scores && score.scores.length > 0) {
    return "LIVE";
  }

  return resolveEventStatusFromCommenceTime(score.commence_time);
}

export function resolveEventStatusFromCommenceTime(
  commenceTime: string | Date,
  now = new Date(),
): EventStatus {
  const startsAt =
    commenceTime instanceof Date ? commenceTime : new Date(commenceTime);

  if (startsAt <= now) {
    return "LIVE";
  }

  return "PRE_MATCH";
}
