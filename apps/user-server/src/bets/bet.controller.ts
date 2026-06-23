import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import {
  getMarketReport,
  getUserBetGroups,
  getUserBets,
  placeBet as placeBetService,
  settleMarketResults,
} from "./bet.service.js";
import { placeBetSchema } from "./bet.schemas.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { emitUserAccountUpdate } from "../users/user-websocket.hub.js";

type MyBetsQuery = {
  userId?: string;
  eventId?: string;
  market_id?: string;
  marketId?: string;
  user_id?: string;
  event_id?: string;
};

type SettleMarketBody = {
  marketId?: string;
  winningSelection?: string;
};

function getStatusCode(error: unknown) {
  if (error instanceof ZodError) return 400;
  if (typeof error === "object" && error !== null && "statusCode" in error && typeof error.statusCode === "number") {
    return error.statusCode;
  }
  return 500;
}

function getMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues.map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`).join("; ");
  }
  return error instanceof Error ? error.message : "Something went wrong";
}

function requireAuthenticatedUserId(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.authUser?.id;
  if (userId) return userId;
  reply.code(401).send(errorResponse("Authorization token is required", 401));
  return null;
}

export async function placeBet(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = requireAuthenticatedUserId(request, reply);
    if (!userId) return;

    const input = placeBetSchema.parse(request.body);
    const result = await placeBetService({ ...input, userId });
    emitUserAccountUpdate(result.account);

    return reply.code(201).send(successResponse("Bet placed successfully", result, 201));
  } catch (error) {
    const statusCode = getStatusCode(error);
    return reply.code(statusCode).send(errorResponse(getMessage(error), statusCode));
  }
}

export async function getMyBets(
  request: FastifyRequest<{ Querystring: MyBetsQuery }>,
  reply: FastifyReply,
) {
  const userId = requireAuthenticatedUserId(request, reply);
  if (!userId) return;

  const { eventId } = request.query;
  if (eventId) {
    const bets = await getUserBets(userId, eventId);
    return reply.code(200).send(successResponse("Bets retrieved successfully", bets));
  }

  const groups = await getUserBetGroups(userId);
  return reply.code(200).send(successResponse("Bets retrieved successfully", groups));
}

export async function getAllUserBets(
  request: FastifyRequest<{ Querystring: MyBetsQuery }>,
  reply: FastifyReply,
) {
  const isAdmin = request.authUser?.role === 1;
  const userId = isAdmin ? request.query.userId ?? request.query.user_id : request.authUser?.id;

  if (!userId) {
    return reply.code(400).send(errorResponse("userId is required", 400));
  }

  const bets = await getUserBets(userId);
  return reply.code(200).send(successResponse("Bets retrieved successfully", bets));
}

export async function settleMarket(
  request: FastifyRequest<{ Body: SettleMarketBody }>,
  reply: FastifyReply,
) {
  try {
    const { marketId, winningSelection } = request.body;
    if (!marketId || !winningSelection) {
      return reply.code(400).send(errorResponse("marketId and winningSelection are required", 400));
    }

    const result = await settleMarketResults(marketId, winningSelection);
    return reply.code(200).send(successResponse("Market settled successfully", result));
  } catch (error) {
    const statusCode = getStatusCode(error);
    return reply.code(statusCode).send(errorResponse(getMessage(error), statusCode));
  }
}

export async function marketReport(
  request: FastifyRequest<{ Querystring: MyBetsQuery }>,
  reply: FastifyReply,
) {
  try {
    const userId = requireAuthenticatedUserId(request, reply);
    if (!userId) return;

    const marketId = request.query.marketId ?? request.query.market_id;
    const eventId = request.query.eventId ?? request.query.event_id;
    const result = await getMarketReport(userId, marketId, eventId);
    return reply.code(200).send(successResponse("Market report retrieved successfully", result));
  } catch (error) {
    const statusCode = getStatusCode(error);
    return reply.code(statusCode).send(errorResponse(getMessage(error), statusCode));
  }
}