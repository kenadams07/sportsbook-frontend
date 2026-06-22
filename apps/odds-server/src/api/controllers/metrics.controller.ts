import type { FastifyReply, FastifyRequest } from "fastify";

import { getMetricsText } from "../../services/metrics.service.js";

export async function getMetrics(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const metrics = await getMetricsText();

  return reply.type("text/plain; version=0.0.4").code(200).send(metrics);
}
