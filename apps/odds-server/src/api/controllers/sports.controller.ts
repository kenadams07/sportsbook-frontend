import type { FastifyReply, FastifyRequest } from "fastify";

import {
  createSportConfig,
  listSportConfigs,
  patchSportConfig,
  removeSportConfig,
  type CreateSportConfigInput,
  type UpdateSportConfigInput,
} from "../../services/sports.service.js";

type SportParams = {
  key: string;
};

export async function getSports(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const configs = await listSportConfigs();

  return reply.code(200).send(configs);
}

export async function postSport(
  request: FastifyRequest<{ Body: CreateSportConfigInput }>,
  reply: FastifyReply,
) {
  const config = await createSportConfig(request.body);

  return reply.code(201).send(config);
}

export async function patchSport(
  request: FastifyRequest<{
    Params: SportParams;
    Body: UpdateSportConfigInput;
  }>,
  reply: FastifyReply,
) {
  const config = await patchSportConfig(request.params.key, request.body);

  if (!config) {
    return reply.code(404).send({
      message: "Sport config not found",
      error: "Not Found",
      statusCode: 404,
    });
  }

  return reply.code(200).send(config);
}

export async function deleteSport(
  request: FastifyRequest<{ Params: SportParams }>,
  reply: FastifyReply,
) {
  const removed = await removeSportConfig(request.params.key);

  if (!removed) {
    return reply.code(404).send({
      message: "Sport config not found",
      error: "Not Found",
      statusCode: 404,
    });
  }

  return reply.code(204).send();
}
