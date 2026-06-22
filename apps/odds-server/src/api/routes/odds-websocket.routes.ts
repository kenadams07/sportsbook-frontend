import type { FastifyInstance } from "fastify";

import { registerOddsWebSocketClient } from "../websocket/odds-websocket.hub.js";

export async function oddsWebSocketRoutes(server: FastifyInstance) {
  server.get("/ws/odds", { websocket: true }, (socket) => {
    registerOddsWebSocketClient(socket);
  });
}
