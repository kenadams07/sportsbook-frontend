import type { FastifyInstance } from "fastify";

import { verifyUserToken } from "../auth/jwt.js";
import { registerUserWebSocketClient } from "./user-websocket.hub.js";

type UserSocketQuery = {
  token?: string;
};

export async function userWebSocketRoutes(server: FastifyInstance) {
  server.get<{ Querystring: UserSocketQuery }>(
    "/ws/user",
    { websocket: true },
    (socket, request) => {
      const token = request.query.token;

      if (!token) {
        socket.close(1008, "token is required");
        return;
      }

      try {
        const payload = verifyUserToken(token);
        registerUserWebSocketClient(payload.id, socket);
      } catch {
        socket.close(1008, "invalid token");
      }
    },
  );
}
