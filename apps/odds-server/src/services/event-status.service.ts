import type { EventStatus } from "@prisma/client";

import {
  updateEventStatusByAdmin,
  updateEventStatusIfNotAdmin,
  updateEventStatusSource,
} from "../db/repositories/event.repo.js";
import { getScores } from "../ingestion/odds-api.client.js";
import { resolveEventStatusFromScore } from "../processing/event-status.resolver.js";

export async function syncEventStatusesFromScores(
  sportKey: string,
): Promise<{ sportKey: string; checked: number; updated: number }> {
  const scores = await getScores(sportKey);

  let updated = 0;

  for (const score of scores) {
    const status = resolveEventStatusFromScore(score);

    updated += await updateEventStatusIfNotAdmin(score.id, status, "SCORES_API");
  }

  return {
    sportKey,
    checked: scores.length,
    updated,
  };
}

export async function setEventStatusByAdmin(input: {
  eventId: string;
  status: EventStatus;
}) {
  return updateEventStatusByAdmin(input.eventId, input.status);
}

export async function releaseEventStatusToSystem(eventId: string) {
  return updateEventStatusSource(eventId, "SYSTEM");
}
