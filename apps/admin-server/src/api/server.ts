import cors from "@fastify/cors";
import Fastify from "fastify";

import { corsOrigins, env } from "../config/env.js";
import { healthRoutes } from "./routes/health.routes.js";
import { registerAdminAuthRoutes } from "../auth/admin-auth.route.js";

export async function buildServer() {
  const server = Fastify({
    logger: {
      level: env.NODE_ENV === "development" ? "debug" : "info",
    },
  });

  await server.register(cors, {
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  await server.register(healthRoutes);
  await registerAdminAuthRoutes(server)

  return server;
}