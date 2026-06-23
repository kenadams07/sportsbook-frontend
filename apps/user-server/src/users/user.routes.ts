import type { FastifyInstance } from "fastify";

import { getUsers } from "./users.controller.js";
import { requireAdminAuth } from "../auth/auth.middleware.js";

export async function userRoutes(server: FastifyInstance) {
  server.get("/users", { preHandler: requireAdminAuth }, getUsers);
}
