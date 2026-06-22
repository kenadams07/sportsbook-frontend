import type { FastifyInstance } from "fastify";

import {
  getFrontendEvents,
  getFrontendLeaguesForCategory,
} from "../controllers/frontend-events.controller.js";

export async function frontendEventsRoutes(server: FastifyInstance) {
  server.get(
    "/frontend/sports/:categoryKey/leagues",
    {
      schema: {
        params: {
          type: "object",
          required: ["categoryKey"],
          properties: {
            categoryKey: {
              type: "string",
              minLength: 1,
            },
          },
        },
      },
    },
    getFrontendLeaguesForCategory,
  );

  server.get(
    "/frontend/events/:sportKey",
    {
      schema: {
        params: {
          type: "object",
          required: ["sportKey"],
          properties: {
            sportKey: {
              type: "string",
              minLength: 1,
            },
          },
        },
        querystring: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["live", "pre_match", "all"],
              default: "all",
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 200,
              default: 50,
            },
            offset: {
              type: "integer",
              minimum: 0,
              default: 0,
            },
          },
        },
      },
    },
    getFrontendEvents,
  );
}
