import type { FastifyInstance } from "fastify";

import { getUsers } from "./users.controller.js";

export async function userRoutes(server: FastifyInstance) {
  server.get("/users", getUsers);
}
