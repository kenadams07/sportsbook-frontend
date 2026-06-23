import { requireAdminAuth } from "../admin-auth.middleware.js";

import type { FastifyInstance } from "fastify";

import { getMetrics } from "../controllers/metrics.controller.js";

export async function metricsRoutes(server: FastifyInstance) {
  server.addHook("preHandler", requireAdminAuth);
  server.get("/metrics", getMetrics);
}
