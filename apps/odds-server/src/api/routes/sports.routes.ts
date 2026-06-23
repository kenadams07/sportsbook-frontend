import type { FastifyInstance } from "fastify";

import { requireAdminAuth } from "../admin-auth.middleware.js";
import {
  deleteSport,
  getSports,
  patchSport,
  postSport,
} from "../controllers/sports.controller.js";

const stringArraySchema = {
  type: "array",
  minItems: 1,
  items: {
    type: "string",
    minLength: 1,
  },
} as const;

export async function sportsRoutes(server: FastifyInstance) {
  server.get("/sports", getSports);

  await server.register(async (adminOnly) => {
    adminOnly.addHook("preHandler", requireAdminAuth);

    adminOnly.post(
      "/sports",
      {
        schema: {
          body: {
            type: "object",
            required: ["key", "regions", "markets"],
            additionalProperties: false,
            properties: {
              key: { type: "string", minLength: 1 },
              regions: stringArraySchema,
              markets: stringArraySchema,
              pollIntervalMs: { type: ["integer", "null"], minimum: 1000 },
            },
          },
        },
      },
      postSport,
    );

    adminOnly.patch(
      "/sports/:key",
      {
        schema: {
          params: {
            type: "object",
            required: ["key"],
            properties: { key: { type: "string", minLength: 1 } },
          },
          body: {
            type: "object",
            additionalProperties: false,
            minProperties: 1,
            properties: {
              regions: stringArraySchema,
              markets: stringArraySchema,
              enabled: { type: "boolean" },
              pollIntervalMs: { type: ["integer", "null"], minimum: 1000 },
            },
          },
        },
      },
      patchSport,
    );

    adminOnly.delete(
      "/sports/:key",
      {
        schema: {
          params: {
            type: "object",
            required: ["key"],
            properties: { key: { type: "string", minLength: 1 } },
          },
        },
      },
      deleteSport,
    );
  });
}