import type { FastifyReply, FastifyRequest } from "fastify";

import { getQuotaStatus } from "../../services/quota.service.js";

export async function getQuota(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const quota = await getQuotaStatus();

  return reply.code(200).send(quota);
}
