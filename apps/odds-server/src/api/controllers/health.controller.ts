import type { FastifyReply, FastifyRequest } from "fastify";

import { getHealthStatus } from "../../services/health.service.js";

export async function getHealth(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const health = await getHealthStatus();

  return reply.code(health.status === "ok" ? 200 : 503).send(health);
}
