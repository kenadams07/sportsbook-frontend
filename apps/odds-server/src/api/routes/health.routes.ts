import type { FastifyInstance } from "fastify";

import { getHealth } from "../controllers/health.controller.js";

export async function healthRoutes(server: FastifyInstance) {
  server.get("/health", getHealth);
}
