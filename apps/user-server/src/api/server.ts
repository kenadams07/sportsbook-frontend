import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import Fastify, { type FastifyBaseLogger } from "fastify";

import { corsOrigins, env } from "../config/env.js";
import { authRoutes } from "../auth/auth.routes.js";
import { betRoutes } from "../bets/bet.routes.js";
import { healthRoutes } from "./routes/health.routes.js";
import { userRoutes } from "../users/user.routes.js";
import { userWebSocketRoutes } from "../users/user-websocket.routes.js";

export async function buildServer(logger?: FastifyBaseLogger) {
  const server = Fastify({
    ...(logger
      ? { loggerInstance: logger }
      : {
          logger: {
            level: "info",
          },
        }),
  });

  await server.register(cors, {
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  });
  await server.register(websocket);

  server.log.info({ port: env.USER_SERVER_PORT }, "building user server");

  await server.register(healthRoutes);
  await server.register(authRoutes);
  await server.register(userRoutes);
  await server.register(betRoutes);
  await server.register(userWebSocketRoutes);

  return server;
}
