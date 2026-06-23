import type { FastifyInstance } from "fastify";

import {
  getAllUserBets,
  getMyBets,
  marketReport,
  placeBet,
  settleMarket,
} from "./bet.controller.js";
import { requireAdminAuth, requireUserAuth } from "../auth/auth.middleware.js";

export async function betRoutes(server: FastifyInstance) {
  await server.register(async (userOnly) => {
    userOnly.addHook("preHandler", requireUserAuth);
    userOnly.post("/bets/place", placeBet);
    userOnly.get("/bets/me", getAllUserBets);
    userOnly.get("/ledger/me", marketReport);
    userOnly.post("/sportBets/place-bet", placeBet);
    userOnly.get("/sportBets/my-bets", getMyBets);
    userOnly.get("/sportBets/market-report", marketReport);
  });

  await server.register(async (adminOnly) => {
    adminOnly.addHook("preHandler", requireAdminAuth);
    adminOnly.post("/sportBets/settle-market", settleMarket);
    adminOnly.get("/sportBets/all-bets", getAllUserBets);
  });
}