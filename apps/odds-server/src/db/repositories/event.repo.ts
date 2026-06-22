import type { EventStatus, EventStatusSource } from "@prisma/client";
import type { OddsApiEvent, OddsApiEventSummary } from "../../types/odds-api.types.js";
import { prisma } from "../client.js";
import { upsertSportFromApiSport } from "./sport.repo.js";

type EventIdentity = {
  eventType: "MATCH" | "OUTRIGHT";
  eventName: string;
  homeTeam: string | null;
  awayTeam: string | null;
};

function getEventIdentity(event: Pick<OddsApiEventSummary, "sport_title" | "home_team" | "away_team">): EventIdentity {
  const homeTeam = event.home_team?.trim() || null;
  const awayTeam = event.away_team?.trim() || null;

  if (homeTeam && awayTeam) {
    return {
      eventType: "MATCH",
      eventName: `${awayTeam} vs ${homeTeam}`,
      homeTeam,
      awayTeam,
    };
  }

  return {
    eventType: "OUTRIGHT",
    eventName: event.sport_title?.trim() || "Outright",
    homeTeam: null,
    awayTeam: null,
  };
}

export async function upsertEvent(event: OddsApiEvent): Promise<boolean> {
  const identity = getEventIdentity(event);

  await prisma.event.upsert({
    where: { id: event.id },
    create: {
      id: event.id,
      leagueKey: event.sport_key,
      homeTeam: identity.homeTeam,
      awayTeam: identity.awayTeam,
      eventName: identity.eventName,
      eventType: identity.eventType,
      commenceTime: new Date(event.commence_time),
      status: new Date(event.commence_time) < new Date() ? "LIVE" : "PRE_MATCH",
      statusSource: "SYSTEM",
    },
    update: {
      homeTeam: identity.homeTeam,
      awayTeam: identity.awayTeam,
      eventName: identity.eventName,
      eventType: identity.eventType,
      commenceTime: new Date(event.commence_time),
      updatedAt: new Date(),
    },
  });

  return true;
}

export async function upsertEventSummary(event: OddsApiEventSummary): Promise<boolean> {
  const identity = getEventIdentity(event);
  const commenceTime = new Date(event.commence_time);
  const status = commenceTime < new Date() ? "LIVE" : "PRE_MATCH";

  const existingLeague = await prisma.league.findUnique({
    where: {
      key: event.sport_key,
    },
    select: {
      key: true,
    },
  });

  if (!existingLeague) {
    await upsertSportFromApiSport({
      key: event.sport_key,
      group: event.sport_title,
      title: event.sport_title,
      description: "",
      active: true,
      has_outrights: identity.eventType === "OUTRIGHT",
    });
  }

  const existing = await prisma.event.findUnique({
    where: {
      id: event.id,
    },
    select: {
      statusSource: true,
    },
  });

  await prisma.event.upsert({
    where: {
      id: event.id,
    },
    create: {
      id: event.id,
      leagueKey: event.sport_key,
      homeTeam: identity.homeTeam,
      awayTeam: identity.awayTeam,
      eventName: identity.eventName,
      eventType: identity.eventType,
      commenceTime,
      status,
      statusSource: "SYSTEM",
    },
    update: {
      leagueKey: event.sport_key,
      homeTeam: identity.homeTeam,
      awayTeam: identity.awayTeam,
      eventName: identity.eventName,
      eventType: identity.eventType,
      commenceTime,
      ...(existing?.statusSource === "ADMIN" ? {} : { status }),
      updatedAt: new Date(),
    },
  });

  return true;
}

export async function findAdminEvents(input: {
  sportKey?: string;
  status?: EventStatus;
  limit: number;
  offset: number;
}) {
  return prisma.event.findMany({
    where: {
      ...(input.sportKey ? { leagueKey: input.sportKey } : {}),
      ...(input.status ? { status: input.status } : {}),
    },
    include: {
      league: true,
      markets: {
        include: {
          outcomes: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      commenceTime: "asc",
    },
    take: input.limit,
    skip: input.offset,
  });
}

export async function findEventBySport(
  sportKey: string,
  input: { status?: EventStatus; limit: number; offset: number },
) {
  return prisma.event.findMany({
    where: {
      leagueKey: sportKey,
      ...(input.status ? { status: input.status } : {}),
    },
    orderBy: {
      commenceTime: "asc",
    },
    take: input.limit,
    skip: input.offset,
  });
}

export async function updateEventStatusIfNotAdmin(
  eventId: string,
  status: EventStatus,
  statusSource: EventStatusSource,
): Promise<number> {
  const result = await prisma.event.updateMany({
    where: {
      id: eventId,
      statusSource: {
        not: "ADMIN",
      },
    },
    data: {
      status,
      statusSource,
    },
  });

  return result.count;
}

export async function updateEventStatusByAdmin(
  eventId: string,
  status: EventStatus,
) {
  return prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      status,
      statusSource: "ADMIN",
    },
  });
}

export async function updateEventStatusSource(
  eventId: string,
  statusSource: EventStatusSource,
) {
  return prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      statusSource,
    },
  });
}

export async function markStartedEventsLive(
  sportKey?: string,
): Promise<number> {
  const result = await prisma.event.updateMany({
    where: {
      ...(sportKey ? { leagueKey: sportKey } : {}),
      status: "PRE_MATCH",
      statusSource: {
        not: "ADMIN",
      },
      commenceTime: {
        lte: new Date(),
      },
    },
    data: {
      status: "LIVE",
      statusSource: "SYSTEM",
    },
  });

  return result.count;
}
