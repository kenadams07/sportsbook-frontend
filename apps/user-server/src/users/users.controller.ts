import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@sportbooks/db";

import { toUserResponse } from "./user.presenter.js";

export async function getUsers(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const users = await prisma.user.findMany({
    include: { currency: true },
    orderBy: { createdAt: "desc" },
  });

  return reply.code(200).send(users.map(toUserResponse));
}
