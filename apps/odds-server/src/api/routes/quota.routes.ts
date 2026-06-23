import { requireAdminAuth } from "../admin-auth.middleware.js";

import type { FastifyInstance } from "fastify";

import { getQuota } from "../controllers/quota.controller.js";

export async function quotaRoutes(server: FastifyInstance) {
  server.addHook("preHandler", requireAdminAuth);
  server.get("/quota", getQuota);
}
