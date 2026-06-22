import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@sportbooks/db";
import { successResponse } from "../../utils/response.js";

export async function getHealth(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  await prisma.$queryRaw`SELECT 1`;

  return reply.code(200).send(successResponse("User server is healthy", {
    status: "ok",
    service: "user-server",
    timestamp: new Date().toISOString(),
  }));
}
