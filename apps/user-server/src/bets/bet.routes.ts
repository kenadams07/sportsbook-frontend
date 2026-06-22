import type { FastifyInstance } from "fastify";

import {
  getAllUserBets,
  getMyBets,
  marketReport,
  placeBet,
  settleMarket,
} from "./bet.controller.js";

export async function betRoutes(server: FastifyInstance) {
  server.post("/bets/place", placeBet);
  server.get("/bets/me", getAllUserBets);
  server.get("/ledger/me", marketReport);

  server.post("/sportBets/place-bet", placeBet);
  server.post("/sportBets/settle-market", settleMarket);
  server.get("/sportBets/my-bets", getMyBets);
  server.get("/sportBets/all-bets", getAllUserBets);
  server.get("/sportBets/market-report", marketReport);
}
