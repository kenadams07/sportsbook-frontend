import type { FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";

import {
  forcePollSport,
  pauseSport,
  resumeSport,
} from "../../services/admin.service.js";
import {
  addSelectedLeaguesFromOddsApi,
  addSelectedSportFromOddsApi,
  listAvailableSportsFromOddsApi,
  listAdminEvents,
  listAdminSportCategories,
  listAdminSports,
  discoverAdminEventMarkets,
  restoreSelectedAdminEvents,
  syncEventsForEnabledSports,
  syncEventsForSport,
  syncSportCategoriesFromOddsApi,
} from "../../services/admin-sync.service.js";
import {
  releaseEventStatusToSystem,
  setEventStatusByAdmin,
} from "../../services/event-status.service.js";
import { prisma } from "../../db/client.js";
import { upsertSportConfig } from "../../db/repositories/sport-config.repo.js";

type AdminParams = {
  sportKey: string;
};

type EventStatusParams = {
  eventId: string;
};

type CategoryParams = {
  categoryKey: string;
};

type MarketParams = {
  marketDbId: string;
};

type OutcomeParams = {
  outcomeId: string;
};

type ActiveBody = {
  active: boolean;
};

type LeagueSettingsBody = {
  active?: boolean;
  regions?: string[];
  markets?: string[];
  enabled?: boolean;
  pollIntervalMs?: number | null;
};

type EventStatusBody = {
  status: "PRE_MATCH" | "LIVE" | "SETTLED" | "POSTPONED" | "CANCELLED";
};

type EventStatusControlBody = {
  statusSource: "SYSTEM";
};

type SportConfigBody = {
  regions?: string[];
  markets?: string[];
  enabled?: boolean;
  pollIntervalMs?: number | null;
};

type AddSportBody = {
  key: string;
  group: string;
  title: string;
  description?: string | null;
  active?: boolean;
  hasOutrights?: boolean;
};

type AddLeaguesBody = {
  leagues: AddSportBody[];
  regions?: string[];
  markets?: string[];
  enabled?: boolean;
  pollIntervalMs?: number | null;
};

type AdminEventsQuery = {
  sportKey?: string;
  status?: "PRE_MATCH" | "LIVE" | "SETTLED" | "POSTPONED" | "CANCELLED";
  limit?: number;
  offset?: number;
};

type RestoreEventsBody = {
  eventIds: string[];
  marketKey: string;
};

type MarketStatusBody = {
  status: "OPEN" | "SUSPENDED" | "CLOSED";
};

type OutcomeStatusBody = {
  status?: "ACTIVE" | "INACTIVE";
  actualStatus?: "ACTIVE" | "INACTIVE";
};

export async function pauseSportPolling(
  request: FastifyRequest<{ Params: AdminParams }>,
  reply: FastifyReply,
) {
  await pauseSport(request.params.sportKey);

  return reply.code(200).send({
    sportKey: request.params.sportKey,
    paused: true,
  });
}

export async function resumeSportPolling(
  request: FastifyRequest<{ Params: AdminParams }>,
  reply: FastifyReply,
) {
  await resumeSport(request.params.sportKey);

  return reply.code(200).send({
    sportKey: request.params.sportKey,
    paused: false,
  });
}

export async function forcePoll(
  request: FastifyRequest<{ Params: AdminParams }>,
  reply: FastifyReply,
) {
  const job = await forcePollSport(request.params.sportKey);

  if (!job) {
    return reply.code(404).send({
      message: "Sport config not found",
      error: "Not Found",
      statusCode: 404,
    });
  }

  return reply.code(202).send({
    sportKey: request.params.sportKey,
    jobId: job.id,
  });
}

export async function syncSports(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const result = await syncSportCategoriesFromOddsApi();
  return reply.code(200).send(result);
}

export async function getAvailableSports(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const sports = await listAvailableSportsFromOddsApi();
  return reply.code(200).send({ sports });
}

export async function addSport(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const result = await syncSportCategoriesFromOddsApi();

  return reply.code(201).send(result);
}

export async function addLeague(
  request: FastifyRequest<{ Body: AddSportBody }>,
  reply: FastifyReply,
) {
  const sport = await addSelectedSportFromOddsApi({
    key: request.body.key,
    group: request.body.group,
    title: request.body.title,
    description: request.body.description ?? "",
    active: request.body.active ?? true,
    has_outrights: request.body.hasOutrights ?? false,
  });

  return reply.code(201).send({ sport });
}

export async function addLeagues(
  request: FastifyRequest<{ Body: AddLeaguesBody }>,
  reply: FastifyReply,
) {
  const result = await addSelectedLeaguesFromOddsApi({
    leagues: request.body.leagues.map((league) => ({
      key: league.key,
      group: league.group,
      title: league.title,
      description: league.description ?? "",
      active: league.active ?? true,
      has_outrights: league.hasOutrights ?? false,
    })),
    regions: request.body.regions?.length ? request.body.regions : ["us"],
    markets: request.body.markets?.length ? request.body.markets : ["h2h"],
    enabled: request.body.enabled ?? true,
    pollIntervalMs: request.body.pollIntervalMs ?? null,
  });

  return reply.code(201).send(result);
}

export async function configureSport(
  request: FastifyRequest<{
    Params: AdminParams;
    Body: SportConfigBody;
  }>,
  reply: FastifyReply,
) {
  const config = await upsertSportConfig({
    sportKey: request.params.sportKey,
    regions: request.body.regions?.length ? request.body.regions : ["us"],
    markets: request.body.markets?.length ? request.body.markets : ["h2h"],
    enabled: request.body.enabled ?? true,
    pollIntervalMs: request.body.pollIntervalMs ?? null,
  });

  return reply.code(200).send(config);
}

export async function updateSportCategorySettings(
  request: FastifyRequest<{
    Params: CategoryParams;
    Body: ActiveBody;
  }>,
  reply: FastifyReply,
) {
  const category = await prisma.sport.update({
    where: {
      key: request.params.categoryKey,
    },
    data: {
      active: request.body.active,
    },
  });

  return reply.code(200).send(category);
}

export async function updateLeagueSettings(
  request: FastifyRequest<{
    Params: AdminParams;
    Body: LeagueSettingsBody;
  }>,
  reply: FastifyReply,
) {
  const league = await prisma.league.update({
    where: {
      key: request.params.sportKey,
    },
    data: {
      ...(typeof request.body.active === "boolean"
        ? { active: request.body.active }
        : {}),
    },
  });

  const config = await upsertSportConfig({
    sportKey: request.params.sportKey,
    regions: request.body.regions?.length ? request.body.regions : ["us"],
    markets: request.body.markets?.length ? request.body.markets : ["h2h"],
    enabled: request.body.enabled ?? true,
    pollIntervalMs: request.body.pollIntervalMs ?? null,
  });

  return reply.code(200).send({
    league,
    config,
  });
}

export async function getAdminSports(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const sports = await listAdminSports();
  return reply.code(200).send({ sports });
}

export async function getAdminSportCategories(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const categories = await listAdminSportCategories();
  return reply.code(200).send({ categories });
}

export async function syncSportEvents(
  request: FastifyRequest<{ Params: AdminParams }>,
  reply: FastifyReply,
) {
  const result = await syncEventsForSport(request.params.sportKey);
  return reply.code(200).send(result);
}

export async function syncConfiguredEvents(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const result = await syncEventsForEnabledSports();
  return reply.code(200).send(result);
}

export async function getAdminEvents(
  request: FastifyRequest<{ Querystring: AdminEventsQuery }>,
  reply: FastifyReply,
) {
  const events = await listAdminEvents({
    ...(request.query.sportKey ? { sportKey: request.query.sportKey } : {}),
    ...(request.query.status ? { status: request.query.status } : {}),
    limit: request.query.limit ?? 100,
    offset: request.query.offset ?? 0,
  });

  return reply.code(200).send({ events });
}

export async function restoreAdminEvents(
  request: FastifyRequest<{ Body: RestoreEventsBody }>,
  reply: FastifyReply,
) {
  const result = await restoreSelectedAdminEvents({
    eventIds: request.body.eventIds,
    marketKey: request.body.marketKey,
  });

  return reply.code(201).send(result);
}

export async function discoverEventMarkets(
  request: FastifyRequest<{ Params: EventStatusParams }>,
  reply: FastifyReply,
) {
  const result = await discoverAdminEventMarkets(request.params.eventId);

  if (!result) {
    return reply.code(404).send({
      message: "Event not found",
      error: "Not Found",
      statusCode: 404,
    });
  }

  return reply.code(200).send(result);
}

export async function updateEventStatus(
  request: FastifyRequest<{
    Params: EventStatusParams;
    Body: EventStatusBody;
  }>,
  reply: FastifyReply,
) {
  try {
    const event = await setEventStatusByAdmin({
      eventId: request.params.eventId,
      status: request.body.status,
    });

    return reply.code(200).send(event);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return reply.code(404).send({
        message: "Event not found",
        error: "Not Found",
        statusCode: 404,
      });
    }

    throw error;
  }
}

export async function updateEventStatusControl(
  request: FastifyRequest<{
    Params: EventStatusParams;
    Body: EventStatusControlBody;
  }>,
  reply: FastifyReply,
) {
  try {
    const event = await releaseEventStatusToSystem(request.params.eventId);

    return reply.code(200).send(event);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return reply.code(404).send({
        message: "Event not found",
        error: "Not Found",
        statusCode: 404,
      });
    }

    throw error;
  }
}

export async function updateMarketStatus(
  request: FastifyRequest<{
    Params: MarketParams;
    Body: MarketStatusBody;
  }>,
  reply: FastifyReply,
) {
  const market = await prisma.market.update({
    where: {
      id: request.params.marketDbId,
    },
    data: {
      status: request.body.status,
    },
  });

  return reply.code(200).send(market);
}

export async function updateOutcomeStatus(
  request: FastifyRequest<{
    Params: OutcomeParams;
    Body: OutcomeStatusBody;
  }>,
  reply: FastifyReply,
) {
  const outcome = await prisma.outcome.update({
    where: {
      id: request.params.outcomeId,
    },
    data: {
      ...(request.body.status ? { status: request.body.status } : {}),
      ...(request.body.actualStatus
        ? { actualStatus: request.body.actualStatus }
        : {}),
    },
  });

  return reply.code(200).send(outcome);
}
