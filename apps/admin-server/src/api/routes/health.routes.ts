import type { FastifyInstance } from "fastify";
import { sendSuccess } from "../response.js";

export async function healthRoutes(server: FastifyInstance) {
  server.get("/health", async (_request, reply) => {
    return sendSuccess(
  reply,
  { service: "admin-server" },
  "Admin server is healthy",
);
  });
}