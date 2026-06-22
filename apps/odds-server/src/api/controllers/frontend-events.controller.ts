import type { FastifyReply, FastifyRequest } from "fastify";

import {
  listFrontendEventsForSport,
  listFrontendLeaguesForCategory,
} from "../../services/frontend-events.service.js";
import type { EventStatusQuery } from "../../services/event.service.js";

type FrontendLeaguesParams = {
  categoryKey: string;
};

type FrontendEventParams = {
  sportKey: string;
};

type FrontendEventQuery = {
  status?: EventStatusQuery;
  limit?: number;
  offset?: number;
};

export async function getFrontendEvents(
  request: FastifyRequest<{
    Params: FrontendEventParams;
    Querystring: FrontendEventQuery;
  }>,
  reply: FastifyReply,
) {
  const result = await listFrontendEventsForSport({
    sportKey: request.params.sportKey,
    status: request.query.status ?? "all",
    limit: request.query.limit ?? 50,
    offset: request.query.offset ?? 0,
  });

  return reply.code(200).send(result);
}

export async function getFrontendLeaguesForCategory(
  request: FastifyRequest<{
    Params: FrontendLeaguesParams;
  }>,
  reply: FastifyReply,
) {
  const result = await listFrontendLeaguesForCategory(
    request.params.categoryKey,
  );

  return reply.code(200).send(result);
}
