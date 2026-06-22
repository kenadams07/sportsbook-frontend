import type { EventStatus } from "@prisma/client";
import { findEventBySport } from "../db/repositories/event.repo.js";

export type EventStatusQuery = "pre_match" | "live" | "all";

function toEventStatus(status?: EventStatusQuery): EventStatus | undefined {
  if (status === "live") {
    return "LIVE";
  }
  if (status === "pre_match") {
    return "PRE_MATCH";
  }
  return undefined;
}

export async function listEventsForSport(input: {
  sportKey: string;
  status?: EventStatusQuery;
  limit: number;
  offset: number;
}) {
    const status = toEventStatus(input.status);

   return findEventBySport(input.sportKey, {
    ...(status ? { status } : {}),
    limit: input.limit,
    offset: input.offset,
  });
}
