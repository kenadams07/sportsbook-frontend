import type { FastifyInstance } from "fastify";

import { getMetrics } from "../controllers/metrics.controller.js";

export async function metricsRoutes(server: FastifyInstance) {
  server.get("/metrics", getMetrics);
}
