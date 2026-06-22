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
  if (error instanceof ZodError) {
    return 400;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }

  return 500;
}

function getMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues
      .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
      .join("; ");
  }

  return error instanceof Error ? error.message : "Something went wrong";
}

export async function placeBet(request: FastifyRequest, reply: FastifyReply) {
  try {
    const input = placeBetSchema.parse(request.body);
    const result = await placeBetService(input);
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
  const { userId, eventId } = request.query;

  if (!userId) {
    return reply.code(400).send(errorResponse("User ID is required", 400));
  }

  if (eventId) {
    const bets = await getUserBets(userId, eventId);
    // console.log('bets',bets)
    return reply.code(200).send(successResponse("Bets retrieved successfully", bets));
  }

  const groups = await getUserBetGroups(userId);
  return reply.code(200).send(successResponse("Bet groups retrieved successfully", groups));
}

export async function getAllUserBets(
  request: FastifyRequest<{ Querystring: MyBetsQuery }>,
  reply: FastifyReply,
) {
  const { userId } = request.query;

  if (!userId) {
    return reply.code(400).send(errorResponse("User ID is required", 400));
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
      return reply
        .code(400)
        .send(
          errorResponse("marketId and winningSelection are required", 400),
        );
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
    const userId = request.query.userId ?? request.query.user_id;
    const marketId = request.query.marketId ?? request.query.market_id;
    const eventId = request.query.eventId ?? request.query.event_id;

    if (!userId) {
      return reply.code(400).send(errorResponse("user_id is required", 400));
    }

    const result = await getMarketReport(userId, marketId, eventId);
    return reply.code(200).send(successResponse("Market report retrieved successfully", result));
  } catch (error) {
    const statusCode = getStatusCode(error);
    return reply.code(statusCode).send(errorResponse(getMessage(error), statusCode));
  }
}
