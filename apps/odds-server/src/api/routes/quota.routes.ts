import type { FastifyInstance } from "fastify";

import { getQuota } from "../controllers/quota.controller.js";

export async function quotaRoutes(server: FastifyInstance) {
  server.get("/quota", getQuota);
}
