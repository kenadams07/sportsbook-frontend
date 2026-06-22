import sensible from "@fastify/sensible";
import websocket from "@fastify/websocket";
import Fastify from "fastify";
import type { Logger } from "pino";

import { healthRoutes } from "./routes/health.routes.js";
import { quotaRoutes } from "./routes/quota.routes.js";
import { sportsRoutes } from "./routes/sports.routes.js";
import { eventsRoutes } from "./routes/events.routes.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { metricsRoutes } from "./routes/metrics.routes.js";
import { debugRoutes } from "./routes/debug.routes.js";
import { oddsWebSocketRoutes } from "./routes/odds-websocket.routes.js";
import { frontendEventsRoutes } from "./routes/frontend-events.routes.js";
import { corsOrigins } from "../config/index.js";

export async function buildServer(logger: Logger) {
  const server = Fastify({ loggerInstance: logger });

  server.addHook("onRequest", async (request, reply) => {
    const origin = request.headers.origin;

    if (origin && !corsOrigins.includes(origin)) {
      return reply.code(403).send({
        statusCode: 403,
        error: "Forbidden",
        message: "Origin is not allowed",
      });
    }

    if (origin) {
      reply.header("Access-Control-Allow-Origin", origin);
      reply.header("Access-Control-Allow-Credentials", "true");
    }
    reply.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Accept",
    );
    reply.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, OPTIONS",
    );

    if (request.method === "OPTIONS") {
      return reply.code(204).send();
    }
  });

  await server.register(sensible);
  await server.register(websocket);
  await server.register(healthRoutes);
  await server.register(quotaRoutes);
  await server.register(sportsRoutes);
  await server.register(eventsRoutes);
  await server.register(adminRoutes);
  await server.register(metricsRoutes);
  await server.register(debugRoutes);
  await server.register(oddsWebSocketRoutes);
  await server.register(frontendEventsRoutes);

  return server;
}
