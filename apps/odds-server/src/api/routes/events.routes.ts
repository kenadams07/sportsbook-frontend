import type { FastifyInstance } from "fastify";
import { getEvents, getLiveEvents } from "../controllers/event.controller.js";


export async function eventsRoutes(server: FastifyInstance) {
  server.get(
    "/events/:sportKey",
    {
      schema: {
        params: {
          type: "object",
          required: ["sportKey"],
          properties: {
            sportKey: { type: "string", minLength: 1 },
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
    getEvents,
  );

  server.get(
    "/events/:sportKey/live",
    {
      schema: {
        params: {
          type: "object",
          required: ["sportKey"],
          properties: {
            sportKey: { type: "string", minLength: 1 },
          },
        },
      },
    },
    getLiveEvents,
  );
}